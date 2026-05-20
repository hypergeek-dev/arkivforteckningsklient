package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Schema introspection result from a Visual Arkiv SQL Server database. */
@Data
@Builder
public class SchemaMetadata {
    private String host;
    private String database;
    private String inspectedAt;
    private List<TableMetadata> tables;

    @Data
    @Builder
    public static class TableMetadata {
        private String tableName;
        private String schema;
        private long rowCount;
        private boolean likelyArchival;
        private List<ColumnMetadata> columns;
    }

    @Data
    @Builder
    public static class ColumnMetadata {
        private String columnName;
        private String dataType;
        private boolean nullable;
        private Integer maxLength;
        private boolean isPrimaryKey;
    }
}
