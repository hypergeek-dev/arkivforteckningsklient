package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Connection properties for the Visual Arkiv SQL Server source database.
 * All values must be supplied via environment variables — never hardcoded.
 *
 * Environment variables:
 *   VISUAL_ARKIV_ENABLED   = true to activate the connector
 *   VISUAL_ARKIV_HOST      = SQL Server hostname or IP
 *   VISUAL_ARKIV_PORT      = port (default 1433)
 *   VISUAL_ARKIV_DATABASE  = database name
 *   VISUAL_ARKIV_USERNAME  = SQL Server login
 *   VISUAL_ARKIV_PASSWORD  = SQL Server password (never logged)
 *   VISUAL_ARKIV_INSTANCE  = named instance (optional)
 */
@Data
@Component
@ConfigurationProperties(prefix = "visual.arkiv.datasource")
public class VisualArkivProperties {
    private boolean enabled = false;
    private String host;
    private int port = 1433;
    private String database;
    private String username;
    private String password;
    private String instance;
    /** Set true only when the SQL Server uses a self-signed certificate. Default false. */
    private boolean trustServerCertificate = false;

    public String buildJdbcUrl() {
        StringBuilder url = new StringBuilder("jdbc:sqlserver://")
            .append(host).append(":").append(port)
            .append(";databaseName=").append(database)
            .append(";trustServerCertificate=").append(trustServerCertificate)
            .append(";loginTimeout=30");
        if (instance != null && !instance.isBlank()) {
            url.append(";instanceName=").append(instance);
        }
        return url.toString();
    }
}
