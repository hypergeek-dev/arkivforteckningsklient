package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Loads transformed Visual Arkiv rows into IHP archival node tables.
 *
 * Idempotency: each INSERT uses ON CONFLICT DO NOTHING against the partial unique index
 * (legacy_source_system, legacy_table, legacy_id) WHERE legacy_source_system IS NOT NULL,
 * so re-running an import skips already-imported records instead of creating duplicates.
 *
 * Only targets the IHP PostgreSQL database. The Visual Arkiv source datasource is not used here.
 */
@Slf4j
@Service
public class VisualArkivLoadService {

    private static final Map<String, String> TARGET_TABLE = Map.of(
        "csnode",       "classificationstructuretypenode",
        "oanode",       "operationalareatypenode",
        "pgnode",       "processgrouptypenode",
        "processnode",  "processtypenode",
        "issuenode",    "issuetypenode",
        "documentnode", "documenttypenode"
    );

    // These must never appear in an INSERT — either auto-assigned by DB or transform-only metadata
    private static final Set<String> EXCLUDED = Set.of("id", "target_type");

    private final NamedParameterJdbcTemplate jdbc;

    public VisualArkivLoadService(DataSource dataSource) {
        this.jdbc = new NamedParameterJdbcTemplate(dataSource);
    }

    /**
     * Persists transformed rows into their target IHP tables and updates the batch record.
     *
     * @param rows  rows produced by {@link VisualArkivTransformService}
     * @param batch already-persisted ImportBatch that will be updated with final counts
     * @return per-batch load counts
     */
    @Transactional("ihpTransactionManager")
    public LoadResult load(List<VisualArkivTransformService.TransformedRow> rows, ImportBatch batch) {
        int imported = 0, duplicate = 0, failed = 0;
        List<String> errors = new ArrayList<>();

        for (VisualArkivTransformService.TransformedRow row : rows) {
            String table = TARGET_TABLE.get(row.targetType());
            if (table == null) {
                String msg = "Okänd targetType: " + row.targetType();
                errors.add(msg);
                log.warn(msg);
                failed++;
                continue;
            }

            try {
                Map<String, Object> params = toInsertParams(row);
                int affected = jdbc.update(buildSql(table, params), params);
                if (affected == 1) {
                    imported++;
                } else {
                    duplicate++;
                    log.debug("Skipped duplicate: table={} legacy_id={}", table, row.legacyId());
                }
            } catch (Exception e) {
                String msg = "Insert misslyckades legacy_id=" + row.legacyId() + ": " + e.getMessage();
                errors.add(msg);
                log.error(msg, e);
                failed++;
            }
        }

        batch.setRecordsImported(imported);
        batch.setRecordsDuplicate(duplicate);
        batch.setRecordsFailed(failed);
        if (!errors.isEmpty()) {
            List<String> combined = new ArrayList<>(Optional.ofNullable(batch.getErrors()).orElse(List.of()));
            combined.addAll(errors);
            batch.setErrors(combined);
        }

        log.info("Load complete: imported={} duplicate={} failed={}", imported, duplicate, failed);
        return new LoadResult(imported, duplicate, failed, errors);
    }

    private Map<String, Object> toInsertParams(VisualArkivTransformService.TransformedRow row) {
        Map<String, Object> params = new LinkedHashMap<>(row.fields());
        EXCLUDED.forEach(params::remove);
        return params;
    }

    private String buildSql(String table, Map<String, Object> params) {
        String cols = String.join(", ", params.keySet());
        String vals = params.keySet().stream().map(k -> ":" + k).collect(Collectors.joining(", "));
        return "INSERT INTO ihp." + table + " (" + cols + ") VALUES (" + vals + ") " +
               "ON CONFLICT (legacy_source_system, legacy_table, legacy_id) " +
               "WHERE legacy_source_system IS NOT NULL DO NOTHING";
    }

    public record LoadResult(int imported, int duplicate, int failed, List<String> errors) {}
}
