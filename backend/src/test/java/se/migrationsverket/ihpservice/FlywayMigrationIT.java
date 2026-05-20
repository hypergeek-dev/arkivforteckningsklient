package se.migrationsverket.ihpservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies that all Flyway migrations (V1–V5) apply cleanly to a fresh database.
 * Uses a real PostgreSQL container via {@link AbstractContainerBaseTest}.
 */
class FlywayMigrationIT extends AbstractContainerBaseTest {

    @Autowired
    JdbcTemplate jdbc;

    @Test
    void v1_baselineTables_exist() {
        assertTrue(tableExists("classificationstructuretypenode"), "csnode table missing");
        assertTrue(tableExists("operationalareatypenode"),         "oanode table missing");
        assertTrue(tableExists("processgrouptypenode"),            "pgnode table missing");
        assertTrue(tableExists("processtypenode"),                 "processnode table missing");
        assertTrue(tableExists("issuetypenode"),                   "issuenode table missing");
        assertTrue(tableExists("documenttypenode"),                "documentnode table missing");
    }

    @Test
    void v2_arkivExtensionColumns_exist() {
        assertTrue(columnExists("processtypenode",  "seriesignum"),      "seriesignum missing");
        assertTrue(columnExists("issuetypenode",    "underseriesignum"), "underseriesignum missing");
        assertTrue(columnExists("issuetypenode",    "innehall"),         "innehall missing");
        assertTrue(columnExists("issuetypenode",    "handlingar_fran"),  "handlingar_fran missing");
    }

    @Test
    void v3_authTables_exist() {
        assertTrue(tableExists("ihp_users"),       "ihp_users table missing");
        assertTrue(tableExists("ihp_authorities"), "ihp_authorities table missing");
    }

    @Test
    void v4_legacyImportColumns_exist() {
        assertTrue(columnExists("processtypenode", "legacy_id"),            "legacy_id missing");
        assertTrue(columnExists("processtypenode", "legacy_source_system"), "legacy_source_system missing");
        assertTrue(columnExists("processtypenode", "imported_at"),          "imported_at missing");
    }

    @Test
    void v5_importBatchTable_exists() {
        assertTrue(tableExists("import_batch"), "import_batch table missing");
        assertTrue(columnExists("import_batch", "confirmation_token"), "confirmation_token missing");
    }

    private boolean tableExists(String table) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM information_schema.tables " +
            "WHERE table_schema = 'ihp' AND table_name = ?",
            Integer.class, table);
        return count != null && count > 0;
    }

    private boolean columnExists(String table, String column) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM information_schema.columns " +
            "WHERE table_schema = 'ihp' AND table_name = ? AND column_name = ?",
            Integer.class, table, column);
        return count != null && count > 0;
    }
}
