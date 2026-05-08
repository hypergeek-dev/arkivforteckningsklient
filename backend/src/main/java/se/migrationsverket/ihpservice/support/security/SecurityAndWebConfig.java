package se.migrationsverket.ihpservice.support.security;

import jakarta.servlet.DispatcherType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import se.migrationsverket.ihpservice.support.ApplicationStatics;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@PropertySource("classpath:application.properties")
public class SecurityAndWebConfig implements WebMvcConfigurer {

    private static int ORDER = 2;

    @Value("${defaultUser}")
    String defaultUser;
    @Value("${spring.application.name}")
    String appName;
    @Value("${environment}")
    String env;

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


    @Bean
    @ConditionalOnExpression("!'${environment}'.equals('local')")
    public FilterRegistrationBean centralServiceProviderFilter() {

        Map<String, String> initParameters = new HashMap<>();
        // Åtkomst till dessa URL:er ska släppas igenom även om man inte är inloggad.
        initParameters.put("application.name", ApplicationStatics.NAME);
        initParameters.put("uriWhitelist",
                "/info,/health,/error,/static/*,/,/rest/v1/*,*/swagger-ui/*,/swagger-ui.html,/swagger-ui.html/*,/webjars/*,/swagger-resources,/swagger-resources/*,/v2/*,/actuator/prometheus,/favicon.ico,/manifest.json,/actuator/*,/**/actuator/**,/actuator/,/ihpappbackend/actuator/,/actuator/*,/ihpappbackend/actuator/*,/ihpappbackend/v3/*,/v3/*,/ihpappbackend/rest/v1/*");
        // Dessa URL:er skyddas av CSPFilter.
        return filterRegistrationBean( initParameters, new String[]{"/*"});
    }


    private FilterRegistrationBean filterRegistrationBean( Map<String, String> initParameters,
                                                          String[] urlPatterns) {
        FilterRegistrationBean registration = new FilterRegistrationBean();

        registration.setInitParameters(initParameters);
        registration.setEnabled(true);
        registration.setOrder(ORDER);
        registration.addUrlPatterns(urlPatterns);
        registration.setDispatcherTypes(DispatcherType.ERROR, DispatcherType.FORWARD, DispatcherType.REQUEST);
        return registration;
    }
}