package se.migrationsverket.ihpservice.support.security;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Local/development security config — disables all Spring Security restrictions.
 * Active only when environment=local. All requests are permitted without authentication.
 *
 * This pairs with the mock SecurityHelper bean (getSecurityContextHelperNoIam)
 * in SecurityAndWebConfig which also permits all actions.
 *
 * NEVER activate this in production. Use IhpSecurityConfig instead.
 */
@Configuration
@EnableWebSecurity
@ConditionalOnExpression("'local'.equals('${environment}')")
public class IhpLocalSecurityConfig {

    @Bean
    public SecurityFilterChain localSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
