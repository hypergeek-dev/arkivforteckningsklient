package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

/**
 * Extracts raw rows from a Visual Arkiv SQL Server database.
 * Connection is always opened as read-only. No DML is ever executed.
 *
 * The source schema is not assumed to be a specific Visual Arkiv version.
 * Table and column names are provided by the caller based on the schema inspection result.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "visual.arkiv.datasource.enabled", havingValue = "true")
public class VisualArkivExtractService {

    @Qualifier("visualArkivDataSource")
    private final DataSource visualArkivDataSource;

    /**
     * Reads all rows from a SQL Server table and returns them as a list of column→value maps.
     * Value types are left as JDBC native types (String, Long, Date, etc.) for the transform layer.
     *
     * @param schema    SQL Server schema (e.g. "dbo"), or null to omit schema qualifier
     * @param tableName table to read
     * @param maxRows   safety cap — use Integer.MAX_VALUE for no limit
     */
    public List<Map<String, Object>> extractTable(String schema, String tableName, int maxRows)
            throws SQLException {

        String fqn = schema != null
            ? "[" + schema + "].[" + tableName + "]"
            : "[" + tableName + "]";

        log.info("Extracting from Visual Arkiv table {} (max {} rows)", fqn, maxRows);

        List<Map<String, Object>> rows = new ArrayList<>();

        try (Connection conn = visualArkivDataSource.getConnection()) {
            conn.setReadOnly(true);

            String sql = "SELECT TOP " + Math.min(maxRows, Integer.MAX_VALUE) + " * FROM " + fqn;
            try (PreparedStatement ps = conn.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {

                ResultSetMetaData rsMeta = rs.getMetaData();
                int colCount = rsMeta.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>(colCount);
                    for (int i = 1; i <= colCount; i++) {
                        row.put(rsMeta.getColumnName(i), rs.getObject(i));
                    }
                    rows.add(row);
                }
            }
        }

        log.info("Extracted {} rows from {}", rows.size(), fqn);
        return rows;
    }

    /**
     * Executes an arbitrary read-only query. Only SELECT statements are permitted.
     * Callers must validate the SQL before calling this method.
     */
    public List<Map<String, Object>> extractQuery(String selectSql) throws SQLException {
        if (!selectSql.trim().toUpperCase().startsWith("SELECT")) {
            throw new IllegalArgumentException("Only SELECT queries are permitted on the Visual Arkiv source");
        }

        List<Map<String, Object>> rows = new ArrayList<>();

        try (Connection conn = visualArkivDataSource.getConnection()) {
            conn.setReadOnly(true);

            try (PreparedStatement ps = conn.prepareStatement(selectSql);
                 ResultSet rs = ps.executeQuery()) {

                ResultSetMetaData rsMeta = rs.getMetaData();
                int colCount = rsMeta.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>(colCount);
                    for (int i = 1; i <= colCount; i++) {
                        row.put(rsMeta.getColumnName(i), rs.getObject(i));
                    }
                    rows.add(row);
                }
            }
        }
        return rows;
    }
}
