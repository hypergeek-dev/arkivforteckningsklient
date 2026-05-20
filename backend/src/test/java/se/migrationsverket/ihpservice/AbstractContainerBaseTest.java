package se.migrationsverket.ihpservice;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Shared Testcontainers base for integration tests that need a PostgreSQL database.
 * A single static container is started once per JVM and reused across all subclasses,
 * cutting container startup overhead from O(n tests) to O(1).
 */
@SpringBootTest(properties = {
    "environment=local",
    "visual.arkiv.datasource.enabled=false",
    "spring.flyway.enabled=true"
})
@Testcontainers
public abstract class AbstractContainerBaseTest {

    @Container
    @SuppressWarnings("resource")
    static final PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("ihp")
            .withUsername("ihp")
            .withPassword("ihp");

    @DynamicPropertySource
    static void configureDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url",      postgres::getJdbcUrl);
        registry.add("spring.datasource.username",  postgres::getUsername);
        registry.add("spring.datasource.password",  postgres::getPassword);
    }
}
