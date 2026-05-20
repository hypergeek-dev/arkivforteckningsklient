package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.domain.visualarkiv.*;
import se.migrationsverket.ihpservice.repository.ihp.db.ImportBatchRepository;

import java.time.Instant;
import java.util.*;

/**
 * REST API for the Visual Arkiv ETL pipeline.
 *
 * Workflow:
 *   1. POST /inspect         — inspect source schema (returns table/column metadata)
 *   2. POST /prepare         — extract + transform; returns dry-run report + confirmationToken
 *   3. POST /execute?token=  — validate token atomically, extract + transform + load; returns final report
 *   4. GET  /report/{id}     — fetch report for any past batch
 *
 * Only active when visual.arkiv.datasource.enabled=true.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/app/import/visual-arkiv")
@ConditionalOnProperty(name = "visual.arkiv.datasource.enabled", havingValue = "true")
public class VisualArkivImportController {

    private final VisualArkivSchemaInspector inspector;
    private final VisualArkivExtractService extractor;
    private final VisualArkivTransformService transformer;
    private final VisualArkivLoadService loader;
    private final ImportBatchRepository batchRepository;
    private final VisualArkivProperties properties;

    @Value("${defaultUser:devuser}")
    private String defaultUser;

    /** Step 1 — inspect the Visual Arkiv source schema. */
    @PostMapping("/inspect")
    public ResponseEntity<?> inspect() {
        try {
            SchemaMetadata schema = inspector.inspectSchema();
            return ResponseEntity.ok(schema);
        } catch (Exception e) {
            log.error("Schema inspection failed", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Schema inspection misslyckades: " + e.getMessage()));
        }
    }

    /**
     * Step 2 — dry run: extract and transform without writing any node rows.
     * Saves the batch first to get a DB-generated UUID, then transforms with that id.
     * Returns an ImportReport whose confirmationToken must be passed to /execute.
     */
    @PostMapping("/prepare")
    public ResponseEntity<?> prepare(@RequestBody PrepareRequest request) {
        Instant now = Instant.now();
        String operator = resolveOperator();

        try {
            int maxRows = request.maxRows() > 0 ? request.maxRows() : Integer.MAX_VALUE;

            List<Map<String, Object>> sourceRows = extractor.extractTable(
                request.mapping().getSourceSchema(),
                request.mapping().getSourceTable(),
                maxRows
            );

            // Save a stub batch first to get the DB-generated UUID; avoids pre-assigning IDs.
            ImportBatch batch = batchRepository.save(ImportBatch.builder()
                .sourceType("visual_arkiv")
                .sourceDatabase(properties.getDatabase())
                .sourceHost(properties.getHost())
                .startedAt(now)
                .status(ImportBatch.Status.DRY_RUN_COMPLETE)
                .dryRun(true)
                .operator(operator)
                .recordsRead(sourceRows.size())
                .build());

            List<VisualArkivTransformService.TransformedRow> transformed =
                transformer.transform(sourceRows, request.mapping(), batch.getId());

            List<String> warnings = collectWarnings(transformed);
            List<String> unmapped = collectUnmapped(transformed);
            int mappedCount = (int) transformed.stream()
                .filter(r -> r.fields().containsKey("name") || r.fields().containsKey("legacy_id"))
                .count();

            batch.setCompletedAt(Instant.now());
            batch.setRecordsMapped(mappedCount);
            batch.setRecordsImported(0);
            batch.setRecordsSkipped(sourceRows.size() - transformed.size());
            batch.setRecordsDuplicate(0);
            batch.setRecordsFailed(0);
            batch.setWarnings(warnings);
            batch.setErrors(List.of());
            batch.setUnmappedFields(unmapped);
            batch.setConfirmationToken(UUID.randomUUID());
            batchRepository.save(batch);

            ImportReport report = toReport(batch);
            log.info("Dry-run complete batchId={} read={} mapped={} warnings={}",
                batch.getId(), sourceRows.size(), mappedCount, warnings.size());
            return ResponseEntity.ok(report);

        } catch (Exception e) {
            log.error("Prepare (dry-run) failed", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Förberedelse misslyckades: " + e.getMessage()));
        }
    }

    /**
     * Step 3 — real import. Requires the confirmationToken from /prepare.
     * The token is invalidated atomically with a single UPDATE to prevent replay attacks.
     */
    @PostMapping("/execute")
    public ResponseEntity<?> execute(@RequestParam UUID confirmationToken,
                                     @RequestBody PrepareRequest request) {
        // Atomically consume the token — 0 rows updated means already used or invalid.
        int invalidated = batchRepository.invalidateToken(confirmationToken);
        if (invalidated == 0) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Ogiltigt eller redan använt confirmationToken."));
        }

        Instant now = Instant.now();
        String operator = resolveOperator();
        ImportBatch batch = null;

        try {
            int maxRows = request.maxRows() > 0 ? request.maxRows() : Integer.MAX_VALUE;

            List<Map<String, Object>> sourceRows = extractor.extractTable(
                request.mapping().getSourceSchema(),
                request.mapping().getSourceTable(),
                maxRows
            );

            // Save RUNNING batch first to get the DB-generated UUID.
            batch = batchRepository.save(ImportBatch.builder()
                .sourceType("visual_arkiv")
                .sourceDatabase(properties.getDatabase())
                .sourceHost(properties.getHost())
                .startedAt(now)
                .status(ImportBatch.Status.RUNNING)
                .dryRun(false)
                .operator(operator)
                .recordsRead(sourceRows.size())
                .build());

            List<VisualArkivTransformService.TransformedRow> transformed =
                transformer.transform(sourceRows, request.mapping(), batch.getId());

            List<String> warnings = collectWarnings(transformed);
            List<String> unmapped = collectUnmapped(transformed);

            batch.setRecordsMapped(transformed.size());
            batch.setRecordsSkipped(sourceRows.size() - transformed.size());
            batch.setWarnings(warnings);
            batch.setErrors(List.of());
            batch.setUnmappedFields(unmapped);
            batchRepository.save(batch);

            VisualArkivLoadService.LoadResult result = loader.load(transformed, batch);

            batch.setCompletedAt(Instant.now());
            batch.setStatus(result.failed() == 0
                ? ImportBatch.Status.COMPLETED
                : ImportBatch.Status.FAILED);
            batchRepository.save(batch);

            ImportReport report = toReport(batch);
            log.info("Import complete batchId={} imported={} duplicate={} failed={}",
                batch.getId(), result.imported(), result.duplicate(), result.failed());
            return ResponseEntity.ok(report);

        } catch (Exception e) {
            log.error("Execute (real import) failed", e);
            if (batch != null) {
                batch.setCompletedAt(Instant.now());
                batch.setStatus(ImportBatch.Status.FAILED);
                batchRepository.save(batch);
            }
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Import misslyckades: " + e.getMessage()));
        }
    }

    /** Step 4 — fetch a reconciliation report for any past batch. */
    @GetMapping("/report/{batchId}")
    public ResponseEntity<?> report(@PathVariable UUID batchId) {
        return batchRepository.findById(batchId)
            .<ResponseEntity<?>>map(b -> ResponseEntity.ok(toReport(b)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private String resolveOperator() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName();
        }
        return defaultUser;
    }

    private List<String> collectWarnings(List<VisualArkivTransformService.TransformedRow> rows) {
        List<String> all = new ArrayList<>();
        rows.forEach(r -> all.addAll(r.warnings()));
        return all;
    }

    private List<String> collectUnmapped(List<VisualArkivTransformService.TransformedRow> rows) {
        Set<String> seen = new LinkedHashSet<>();
        rows.forEach(r -> r.warnings().stream()
            .filter(w -> w.startsWith("Omappade källkolumner:"))
            .forEach(w -> Arrays.stream(w.replace("Omappade källkolumner:", "").split(","))
                .map(String::trim).forEach(seen::add)));
        return new ArrayList<>(seen);
    }

    private ImportReport toReport(ImportBatch b) {
        return new ImportReport(
            b.getId(),
            b.isDryRun(),
            b.getStatus() != null ? b.getStatus().name() : null,
            b.getSourceType(),
            b.getSourceDatabase(),
            b.getRecordsRead(),
            b.getRecordsMapped(),
            b.getRecordsImported(),
            b.getRecordsSkipped(),
            b.getRecordsDuplicate(),
            b.getRecordsFailed(),
            Optional.ofNullable(b.getWarnings()).orElse(List.of()),
            Optional.ofNullable(b.getErrors()).orElse(List.of()),
            Optional.ofNullable(b.getUnmappedFields()).orElse(List.of()),
            b.getConfirmationToken(),
            b.getStartedAt()
        );
    }

    /** Request body for both /prepare and /execute. */
    public record PrepareRequest(VisualArkivFieldMapping mapping, int maxRows) {}
}
