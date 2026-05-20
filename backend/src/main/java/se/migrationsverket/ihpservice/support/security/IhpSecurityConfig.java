package se.migrationsverket.ihpservice.support.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

/**
 * Spring Security configuration for production deployments (environment != local).
 *
 * Authentication: JDBC-backed via ihp_users / ihp_authorities tables (V3 migration).
 * Session: stateful with HttpOnly + Secure cookies — appropriate for an internal web tool.
 * CSRF: enabled for all state-changing endpoints.
 *
 * Role mapping:
 *   ROLE_ARKIVANSVARIG → administrera, visa, faststalla, importera
 *   ROLE_ARKIVARIE     → administrera, visa, importera
 *   ROLE_LASARE        → visa only
 */
@Slf4j
@Configuration
@EnableWebSecurity
@ConditionalOnExpression("!'local'.equals('${environment}')")
public class IhpSecurityConfig {

    @Value("${environment}")
    private String env;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.setUsersByUsernameQuery(
            "SELECT username, password, enabled FROM ihp.ihp_users WHERE username = ?"
        );
        manager.setAuthoritiesByUsernameQuery(
            "SELECT username, authority FROM ihp.ihp_authorities WHERE username = ?"
        );
        return manager;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // Public endpoints: health probes, metrics scrape, API docs
                .requestMatchers(
                    "/actuator/health",
                    "/actuator/health/**",
                    "/actuator/prometheus",
                    "/actuator/info",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/error",
                    "/favicon.ico",
                    "/manifest.json"
                ).permitAll()
                // All REST endpoints require authentication
                .requestMatchers("/rest/**").authenticated()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .sessionManagement(session -> session
                .maximumSessions(5)
                .expiredUrl("/login?expired")
            )
            // CSRF enabled by default — protects all POST/PUT/DELETE endpoints.
            // The frontend must include the CSRF token in requests (Spring sends it as a cookie).
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/actuator/**")
            );

        return http.build();
    }
}
