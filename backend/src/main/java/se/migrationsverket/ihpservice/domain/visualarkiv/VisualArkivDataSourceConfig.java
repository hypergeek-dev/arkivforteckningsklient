package se.migrationsverket.ihpservice.domain.visualarkiv;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * SQL Server DataSource for Visual Arkiv — read-only source connection.
 * Only instantiated when visual.arkiv.datasource.enabled=true.
 *
 * SAFETY: This DataSource is intentionally separate from the application's
 * primary PostgreSQL DataSource. It must never be used for writes.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(name = "visual.arkiv.datasource.enabled", havingValue = "true")
public class VisualArkivDataSourceConfig {

    private final VisualArkivProperties props;

    @Bean(name = "visualArkivDataSource")
    public DataSource visualArkivDataSource() {
        log.info("Initializing Visual Arkiv SQL Server connection to host='{}' database='{}'",
            props.getHost(), props.getDatabase());

        SQLServerDataSource ds = new SQLServerDataSource();
        ds.setServerName(props.getHost());
        ds.setPortNumber(props.getPort());
        ds.setDatabaseName(props.getDatabase());
        ds.setUser(props.getUsername());
        ds.setPassword(props.getPassword());
        ds.setTrustServerCertificate(true);
        ds.setLoginTimeout(30);
        ds.setLockTimeout(5000);

        if (props.getInstance() != null && !props.getInstance().isBlank()) {
            ds.setInstanceName(props.getInstance());
        }

        return ds;
    }
}
