package se.migrationsverket.ihpservice.support.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

/**
 * Refuses to start in non-local environments if the admin account still has
 * the default "changeme" password from V3__auth_tables.sql.
 *
 * Only active when environment != local, where PasswordEncoder and JDBC auth are present.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnExpression("!'local'.equals('${environment}')")
public class DefaultPasswordCheck implements ApplicationRunner {

    private final PasswordEncoder passwordEncoder;
    private final DataSource dataSource;

    @Override
    public void run(ApplicationArguments args) {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        String hash;
        try {
            hash = jdbc.queryForObject(
                "SELECT password FROM ihp.ihp_users WHERE username = 'admin'",
                String.class);
        } catch (EmptyResultDataAccessException e) {
            return; // admin account removed — fine
        }

        if (hash != null && passwordEncoder.matches("changeme", hash)) {
            throw new IllegalStateException(
                "STARTFEL: Standardlösenordet (changeme) för 'admin'-kontot är fortfarande aktivt. " +
                "Byt lösenordet omedelbart innan produktionsdrift.");
        }
    }
}
