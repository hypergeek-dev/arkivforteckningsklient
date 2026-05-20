package se.migrationsverket.ihpservice;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import se.migrationsverket.ihpservice.domain.visualarkiv.ImportBatch;
import se.migrationsverket.ihpservice.domain.visualarkiv.VisualArkivFieldMapping;
import se.migrationsverket.ihpservice.domain.visualarkiv.VisualArkivLoadService;
import se.migrationsverket.ihpservice.domain.visualarkiv.VisualArkivTransformService;
import se.migrationsverket.ihpservice.repository.ihp.db.ImportBatchRepository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Verifies that importing the same Visual Arkiv row twice does not create duplicates.
 * The ON CONFLICT DO NOTHING partial index (legacy_source_system, legacy_table, legacy_id)
 * must silently skip the second insert and report it as a duplicate.
 */
@SpringBootTest(properties = {
    "environment=local",
    "visual.arkiv.datasource.enabled=false",
    "spring.flyway.enabled=true"
})
@Testcontainers
class ImportIdempotencyIT {

    @Container
    @SuppressWarnings("resource")
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("ihp")
            .withUsername("ihp")
            .withPassword("ihp");

    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url",     postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    VisualArkivTransformService transformer;

    @Autowired
    VisualArkivLoadService loader;

    @Autowired
    ImportBatchRepository batchRepository;

    @Autowired
    NamedParameterJdbcTemplate jdbc;

    private ImportBatch savedBatch;

    @BeforeEach
    void createBatch() {
        savedBatch = batchRepository.save(ImportBatch.builder()
            .sourceType("visual_arkiv")
            .sourceDatabase("test_db")
            .sourceHost("localhost")
            .startedAt(Instant.now())
            .status(ImportBatch.Status.RUNNING)
            .dryRun(false)
            .operator("test")
            .recordsRead(1)
            .recordsMapped(1)
            .build());
    }

    @Test
    void importingSameRowTwice_countsSecondAsDuplicate() {
        VisualArkivFieldMapping mapping = VisualArkivFieldMapping.builder()
            .sourceTable("Arkiv")
            .sourceSchema("dbo")
            .targetType("csnode")
            .sourcePrimaryKeyColumn("ArkivID")
            .sourceParentKeyColumn(null)
            .columnMap(Map.of(
                "ArkivID",   "legacy_id",
                "ArkivNamn", "name"
            ))
            .build();

        List<Map<String, Object>> sourceRows = List.of(
            Map.of("ArkivID", "42", "ArkivNamn", "Kommunarkivet")
        );

        UUID batchId = savedBatch.getId();
        List<VisualArkivTransformService.TransformedRow> rows =
            transformer.transform(sourceRows, mapping, batchId);
        assertEquals(1, rows.size());

        // First import — should insert 1 row
        VisualArkivLoadService.LoadResult first = loader.load(rows, savedBatch);
        assertEquals(1, first.imported());
        assertEquals(0, first.duplicate());

        // Create a second batch for the re-run
        ImportBatch batch2 = batchRepository.save(ImportBatch.builder()
            .sourceType("visual_arkiv")
            .sourceDatabase("test_db")
            .sourceHost("localhost")
            .startedAt(Instant.now())
            .status(ImportBatch.Status.RUNNING)
            .dryRun(false)
            .operator("test")
            .recordsRead(1)
            .recordsMapped(1)
            .build());

        List<VisualArkivTransformService.TransformedRow> rows2 =
            transformer.transform(sourceRows, mapping, batch2.getId());

        // Second import of the same source row — must be a duplicate, not a new insert
        VisualArkivLoadService.LoadResult second = loader.load(rows2, batch2);
        assertEquals(0, second.imported());
        assertEquals(1, second.duplicate());

        // Exactly one row in the DB for this legacy key
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM ihp.classificationstructuretypenode " +
            "WHERE legacy_source_system = 'visual_arkiv' AND legacy_id = '42'",
            Map.of(), Integer.class);
        assertEquals(1, count);
    }
}
