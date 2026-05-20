package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Read-only introspection of a Visual Arkiv SQL Server database.
 * NEVER executes DML. Connection is explicitly set read-only before use.
 *
 * Identifies likely archival tables by name pattern matching since Visual Arkiv
 * schema varies across versions and installations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "visual.arkiv.datasource.enabled", havingValue = "true")
public class VisualArkivSchemaInspector {

    private static final Pattern ARCHIVAL_TABLE_PATTERN = Pattern.compile(
        "(?i)(arkiv|serie|volym|handl|arkivbild|foreteckn|klassif|process|issue|document|record|fond|bestand)"
    );

    @Qualifier("visualArkivDataSource")
    private final DataSource visualArkivDataSource;

    private final VisualArkivProperties props;

    public SchemaMetadata inspectSchema() throws SQLException {
        log.info("Inspecting Visual Arkiv schema on host='{}' database='{}'",
            props.getHost(), props.getDatabase());

        try (Connection conn = visualArkivDataSource.getConnection()) {
            conn.setReadOnly(true);

            List<SchemaMetadata.TableMetadata> tables = new ArrayList<>();
            DatabaseMetaData meta = conn.getMetaData();

            try (ResultSet rs = meta.getTables(props.getDatabase(), null, "%", new String[]{"TABLE"})) {
                while (rs.next()) {
                    String tableName = rs.getString("TABLE_NAME");
                    String schema    = rs.getString("TABLE_SCHEM");
                    boolean likelyArchival = ARCHIVAL_TABLE_PATTERN.matcher(tableName).find();

                    List<SchemaMetadata.ColumnMetadata> columns = inspectColumns(conn, meta, schema, tableName);
                    long rowCount = estimateRowCount(conn, schema, tableName);

                    tables.add(SchemaMetadata.TableMetadata.builder()
                        .tableName(tableName)
                        .schema(schema)
                        .rowCount(rowCount)
                        .likelyArchival(likelyArchival)
                        .columns(columns)
                        .build());
                }
            }

            log.info("Schema inspection complete: {} tables found ({} likely archival)",
                tables.size(), tables.stream().filter(SchemaMetadata.TableMetadata::isLikelyArchival).count());

            return SchemaMetadata.builder()
                .host(props.getHost())
                .database(props.getDatabase())
                .inspectedAt(Instant.now().toString())
                .tables(tables)
                .build();
        }
    }

    private List<SchemaMetadata.ColumnMetadata> inspectColumns(
            Connection conn, DatabaseMetaData meta, String schema, String tableName) throws SQLException {

        Set<String> primaryKeys = collectPrimaryKeys(meta, schema, tableName);
        List<SchemaMetadata.ColumnMetadata> columns = new ArrayList<>();

        try (ResultSet rs = meta.getColumns(props.getDatabase(), schema, tableName, null)) {
            while (rs.next()) {
                String colName  = rs.getString("COLUMN_NAME");
                String dataType = rs.getString("TYPE_NAME");
                boolean nullable = rs.getInt("NULLABLE") == DatabaseMetaData.columnNullable;
                int maxLength   = rs.getInt("COLUMN_SIZE");

                columns.add(SchemaMetadata.ColumnMetadata.builder()
                    .columnName(colName)
                    .dataType(dataType)
                    .nullable(nullable)
                    .maxLength(maxLength)
                    .isPrimaryKey(primaryKeys.contains(colName))
                    .build());
            }
        }
        return columns;
    }

    private Set<String> collectPrimaryKeys(DatabaseMetaData meta, String schema, String tableName) {
        Set<String> pks = new java.util.HashSet<>();
        try (ResultSet rs = meta.getPrimaryKeys(props.getDatabase(), schema, tableName)) {
            while (rs.next()) {
                pks.add(rs.getString("COLUMN_NAME"));
            }
        } catch (SQLException e) {
            log.debug("Could not retrieve primary keys for {}: {}", tableName, e.getMessage());
        }
        return pks;
    }

    private long estimateRowCount(Connection conn, String schema, String tableName) {
        String fqn = schema != null ? "[" + schema + "].[" + tableName + "]" : "[" + tableName + "]";
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(1) FROM " + fqn);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getLong(1);
        } catch (SQLException e) {
            log.debug("Could not count rows in {}: {}", fqn, e.getMessage());
        }
        return -1;
    }
}
