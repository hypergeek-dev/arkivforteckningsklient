package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
 *   3. POST /execute?token=  — validate token, extract + transform + load; returns final report
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
     * Returns an ImportReport whose confirmationToken must be passed to /execute.
     */
    @PostMapping("/prepare")
    public ResponseEntity<?> prepare(@RequestBody PrepareRequest request) {
        UUID batchId = UUID.randomUUID();
        UUID confirmationToken = UUID.randomUUID();
        Instant now = Instant.now();
        String operator = resolveOperator();

        try {
            int maxRows = request.maxRows() > 0 ? request.maxRows() : Integer.MAX_VALUE;

            List<Map<String, Object>> sourceRows = extractor.extractTable(
                request.mapping().getSourceSchema(),
                request.mapping().getSourceTable(),
                maxRows
            );

            List<VisualArkivTransformService.TransformedRow> transformed =
                transformer.transform(sourceRows, request.mapping(), batchId);

            List<String> warnings = collectWarnings(transformed);
            List<String> unmapped = collectUnmapped(transformed);
            int mappedCount = (int) transformed.stream()
                .filter(r -> r.fields().containsKey("name") || r.fields().containsKey("legacy_id"))
                .count();

            ImportBatch batch = ImportBatch.builder()
                .id(batchId)
                .sourceType("visual_arkiv")
                .sourceDatabase(properties.getDatabase())
                .sourceHost(properties.getHost())
                .startedAt(now)
                .completedAt(Instant.now())
                .status(ImportBatch.Status.DRY_RUN_COMPLETE.name())
                .dryRun(true)
                .operator(operator)
                .recordsRead(sourceRows.size())
                .recordsMapped(mappedCount)
                .recordsImported(0)
                .recordsSkipped(sourceRows.size() - transformed.size())
                .recordsDuplicate(0)
                .recordsFailed(0)
                .warnings(warnings)
                .errors(List.of())
                .unmappedFields(unmapped)
                .confirmationToken(confirmationToken)
                .build();
            batchRepository.save(batch);

            ImportReport report = toReport(batch);
            log.info("Dry-run complete batchId={} read={} mapped={} warnings={}",
                batchId, sourceRows.size(), mappedCount, warnings.size());
            return ResponseEntity.ok(report);

        } catch (Exception e) {
            log.error("Prepare (dry-run) failed", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Förberedelse misslyckades: " + e.getMessage()));
        }
    }

    /**
     * Step 3 — real import. Requires the confirmationToken from /prepare.
     * Extracts fresh data from source, transforms, and loads into IHP tables.
     */
    @PostMapping("/execute")
    public ResponseEntity<?> execute(@RequestParam UUID confirmationToken,
                                     @RequestBody PrepareRequest request) {
        Optional<ImportBatch> dryRunBatch = batchRepository.findByConfirmationToken(confirmationToken);
        if (dryRunBatch.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Ogiltigt eller redan använt confirmationToken."));
        }
        ImportBatch dry = dryRunBatch.get();
        if (!dry.isDryRun() || !ImportBatch.Status.DRY_RUN_COMPLETE.name().equals(dry.getStatus())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Token avser inte en godkänd dry-run."));
        }

        UUID batchId = UUID.randomUUID();
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

            List<VisualArkivTransformService.TransformedRow> transformed =
                transformer.transform(sourceRows, request.mapping(), batchId);

            List<String> warnings = collectWarnings(transformed);
            List<String> unmapped = collectUnmapped(transformed);

            batch = ImportBatch.builder()
                .id(batchId)
                .sourceType("visual_arkiv")
                .sourceDatabase(properties.getDatabase())
                .sourceHost(properties.getHost())
                .startedAt(now)
                .status(ImportBatch.Status.RUNNING.name())
                .dryRun(false)
                .operator(operator)
                .recordsRead(sourceRows.size())
                .recordsMapped(transformed.size())
                .recordsImported(0)
                .recordsSkipped(sourceRows.size() - transformed.size())
                .recordsDuplicate(0)
                .recordsFailed(0)
                .warnings(warnings)
                .errors(List.of())
                .unmappedFields(unmapped)
                .build();
            batchRepository.save(batch);

            // Invalidate the dry-run token so it cannot be reused
            dry.setConfirmationToken(null);
            dry.setStatus(ImportBatch.Status.COMPLETED.name());
            batchRepository.save(dry);

            VisualArkivLoadService.LoadResult result = loader.load(transformed, batch);

            batch.setCompletedAt(Instant.now());
            batch.setStatus(result.failed() == 0
                ? ImportBatch.Status.COMPLETED.name()
                : ImportBatch.Status.FAILED.name());
            batchRepository.save(batch);

            ImportReport report = toReport(batch);
            log.info("Import complete batchId={} imported={} duplicate={} failed={}",
                batchId, result.imported(), result.duplicate(), result.failed());
            return ResponseEntity.ok(report);

        } catch (Exception e) {
            log.error("Execute (real import) failed batchId={}", batchId, e);
            if (batch != null) {
                batch.setCompletedAt(Instant.now());
                batch.setStatus(ImportBatch.Status.FAILED.name());
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
        return auth != null ? auth.getName() : "anon";
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
            b.getStatus(),
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
