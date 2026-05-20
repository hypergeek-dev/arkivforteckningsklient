package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * Field-level mapping between a Visual Arkiv source table and a target archival node type.
 *
 * Operators supply this mapping after reviewing the schema inspection result.
 * It is not hardcoded because Visual Arkiv schema varies across installations.
 *
 * Example mapping for a source table "Arkiv":
 *   sourceTable  = "Arkiv"
 *   targetType   = "pgnode"
 *   columnMap    = { "ArkivNamn" -> "name", "ArkivID" -> "legacy_id", "ParentID" -> "legacy_parent_id" }
 */
@Data
@Builder
public class VisualArkivFieldMapping {

    /** SQL Server table name to read from */
    private String sourceTable;

    /** SQL Server schema, e.g. "dbo". Null means no schema qualifier. */
    private String sourceSchema;

    /** Target node type: csnode | oanode | pgnode | processnode | issuenode | documentnode */
    private String targetType;

    /**
     * Column name in source → field name in target domain.
     * Known target fields: name, remark, start, stop, legacy_id, legacy_parent_id,
     *   legacy_code, seriesignum, serie_rubrik, forvaringsplats, innehall, omfang,
     *   underseriesignum, volymnum, format_beskriv, tillganglighet,
     *   org_nummer, arkivansvarig, adress, arkiv_id_beteckning
     */
    private Map<String, String> columnMap;

    /** Column in source that holds the source primary key (maps to legacy_id) */
    private String sourcePrimaryKeyColumn;

    /** Column in source that holds the parent foreign key (maps to legacy_parent_id) */
    private String sourceParentKeyColumn;
}
