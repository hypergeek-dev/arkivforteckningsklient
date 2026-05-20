package se.migrationsverket.ihpservice.support.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SecurityContextHelperTest {

    private final SecurityContextHelper helper = new SecurityContextHelper();
    private final IhpAuthResources res = IhpAuthResources.builder().resource("test").build();

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void arkivansvarigCanDoAnything() {
        authenticate("ROLE_ARKIVANSVARIG");
        assertTrue(helper.isAllowed("visa", res));
        assertTrue(helper.isAllowed("administrera", res));
        assertTrue(helper.isAllowed("faststalla", res));
        assertTrue(helper.isAllowed("importera", res));
    }

    @Test
    void arkivarieCannotFaststalla() {
        authenticate("ROLE_ARKIVARIE");
        assertTrue(helper.isAllowed("visa", res));
        assertTrue(helper.isAllowed("administrera", res));
        assertTrue(helper.isAllowed("importera", res));
        assertFalse(helper.isAllowed("faststalla", res));
    }

    @Test
    void lasareCanOnlyVisa() {
        authenticate("ROLE_LASARE");
        assertTrue(helper.isAllowed("visa", res));
        assertFalse(helper.isAllowed("administrera", res));
        assertFalse(helper.isAllowed("faststalla", res));
        assertFalse(helper.isAllowed("importera", res));
    }

    @Test
    void noAuthenticationDeniesAll() {
        // SecurityContext is empty — no authentication set
        assertFalse(helper.isAllowed("visa", res));
    }

    @Test
    void unknownRoleDeniesAll() {
        authenticate("ROLE_UNKNOWN");
        assertFalse(helper.isAllowed("visa", res));
        assertFalse(helper.isAllowed("faststalla", res));
    }

    private void authenticate(String role) {
        var token = new UsernamePasswordAuthenticationToken(
            "testuser", "password", List.of(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(token);
    }
}
