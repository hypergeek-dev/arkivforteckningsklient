package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.Map;

/**
 * Lightweight read-only endpoint for Visual Arkiv import provenance metadata.
 * Returns legacy_id, legacy_source_system, legacy_table, imported_at for any
 * archival node that was imported via the ETL pipeline.
 *
 * Uses a direct JDBC query instead of the entity/domain/DTO stack to avoid
 * threading read-only audit fields through the full mapping chain.
 */
@Slf4j
@RestController
@RequestMapping("/rest/app")
public class LegacyMetaController {

    private static final Map<String, String> NODE_TYPE_TABLE = Map.of(
        "csnode",       "classificationstructuretypenode",
        "oanode",       "operationalareatypenode",
        "pgnode",       "processgrouptypenode",
        "processnode",  "processtypenode",
        "issuenode",    "issuetypenode",
        "documentnode", "documenttypenode"
    );

    private final NamedParameterJdbcTemplate jdbc;

    public LegacyMetaController(DataSource dataSource) {
        this.jdbc = new NamedParameterJdbcTemplate(dataSource);
    }

    /**
     * Returns legacy import metadata for a node, or 204 No Content if the node
     * was not imported from an external system.
     */
    @GetMapping("/{nodeType}/{id}/legacy-meta")
    public ResponseEntity<LegacyMetaDto> getLegacyMeta(
            @PathVariable String nodeType,
            @PathVariable int id) {

        String table = NODE_TYPE_TABLE.get(nodeType);
        if (table == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            var rows = jdbc.query(
                "SELECT legacy_id, legacy_source_system, legacy_table, " +
                "       imported_at, import_batch_id::text " +
                "FROM ihp." + table + " WHERE id = :id AND legacy_source_system IS NOT NULL",
                Map.of("id", id),
                (rs, rowNum) -> new LegacyMetaDto(
                    rs.getString("legacy_id"),
                    rs.getString("legacy_source_system"),
                    rs.getString("legacy_table"),
                    rs.getString("imported_at"),
                    rs.getString("import_batch_id")
                )
            );

            if (rows.isEmpty()) return ResponseEntity.noContent().build();
            return ResponseEntity.ok(rows.get(0));

        } catch (Exception e) {
            log.warn("Could not fetch legacy meta for {}/{}: {}", nodeType, id, e.getMessage());
            return ResponseEntity.noContent().build();
        }
    }

    public record LegacyMetaDto(
        String legacyId,
        String legacySourceSystem,
        String legacyTable,
        String importedAt,
        String importBatchId
    ) {}
}
