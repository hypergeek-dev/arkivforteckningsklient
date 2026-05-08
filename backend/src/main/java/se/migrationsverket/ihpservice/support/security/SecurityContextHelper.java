package se.migrationsverket.ihpservice.support.security;

import lombok.extern.slf4j.Slf4j;

/**
 * Hjälpklass för att hantera säkerhetsparametrar.
 */
@Slf4j
public class SecurityContextHelper implements SecurityHelper {

    @Override
    public boolean isAllowed(String action, IhpAuthResources ihpAuthResources) {
        return true;
    }

}