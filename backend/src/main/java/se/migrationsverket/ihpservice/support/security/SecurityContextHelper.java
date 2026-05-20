package se.migrationsverket.ihpservice.support.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Production SecurityHelper — enforces role-based access using the authenticated
 * Spring Security principal from the current request context.
 *
 * Role-to-action mapping:
 *   ROLE_ARKIVANSVARIG → administrera, visa, faststalla, importera
 *   ROLE_ARKIVARIE     → administrera, visa, importera
 *   ROLE_LASARE        → visa only
 */
@Slf4j
public class SecurityContextHelper implements SecurityHelper {

    @Override
    public boolean isAllowed(String action, IhpAuthResources ihpAuthResources) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            log.warn("Auth check for action '{}' failed: no authenticated principal", action);
            return false;
        }

        boolean allowed = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role -> roleAllowsAction(role, action));

        log.debug("Auth check: principal='{}' action='{}' resource='{}' allowed={}",
            auth.getName(), action, ihpAuthResources.getResource(), allowed);
        return allowed;
    }

    private boolean roleAllowsAction(String role, String action) {
        return switch (role) {
            case "ROLE_ARKIVANSVARIG" -> true;
            case "ROLE_ARKIVARIE"     -> !"faststalla".equalsIgnoreCase(action);
            case "ROLE_LASARE"        -> "visa".equalsIgnoreCase(action);
            default -> false;
        };
    }
}
