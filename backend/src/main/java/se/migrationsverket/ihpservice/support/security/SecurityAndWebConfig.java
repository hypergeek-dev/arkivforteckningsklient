package se.migrationsverket.ihpservice.support.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.event.EventListener;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
@PropertySource("classpath:application.properties")
public class SecurityAndWebConfig implements WebMvcConfigurer {

    private static final int ORDER = 2;

    @Value("${defaultUser}")
    String defaultUser;
    @Value("${spring.application.name}")
    String appName;
    @Value("${environment}")
    String env;

    @EventListener(ApplicationReadyEvent.class)
    public void warnIfMockAuthActive() {
        if ("local".equalsIgnoreCase(env)) {
            log.warn("╔══════════════════════════════════════════════════════════════╗");
            log.warn("║  VARNING: MOCK-IAM ÄR AKTIV – ALLA ÅTGÄRDER TILLÅTS         ║");
            log.warn("║  Sätt ENVIRONMENT=production i miljövariablerna för          ║");
            log.warn("║  alla driftsättningar utanför lokal utveckling.              ║");
            log.warn("╚══════════════════════════════════════════════════════════════╝");
        }
    }

    /* Central Service Provider */
    @Bean
    @ConditionalOnExpression("!'local'.equals('${environment}')")
    public SecurityHelper getSecurityContextHelper() {
        log.info("Initializing REAL IAM");
        return new SecurityContextHelper();
    }

    @Bean
    //@Profile({"utv", "local"})
    @ConditionalOnExpression("'local'.equals('${environment}')")
    public SecurityHelper getSecurityContextHelperNoIam() {
        log.info("Initializing MOCKED IAM");
        return (action, ihpAuthResources) -> {
            log.info("@@@ LOCAL: action: {} - resource: {}", action, ihpAuthResources.getResource());
            return true;
        };
    }


}