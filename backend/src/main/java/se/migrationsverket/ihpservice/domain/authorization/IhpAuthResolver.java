package se.migrationsverket.ihpservice.domain.authorization;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import se.migrationsverket.ihpservice.support.security.IhpAuthResources;
import se.migrationsverket.ihpservice.support.security.SecurityHelper;

import java.util.function.Predicate;

@Component
@AllArgsConstructor
@Slf4j
public class IhpAuthResolver implements AuthResolver{
    SecurityHelper securityHelper;

    @Override
    public Predicate<String> administreraAllowed() {
        return r -> resourceAllowed(r, AuthorizationStatics.ACTION_ADMINISTRERA);
    }

    @Override
    public Predicate<String> visaAllowed() {
        return r -> resourceAllowed(r, AuthorizationStatics.ACTION_VISA);
    }

    @Override
    public Predicate<String> faststallAllowed() {
        return r -> resourceAllowed(r, AuthorizationStatics.ACTION_FASTSTALL);
    }

    @Override
    public Predicate<String> importeraAllowed() {
        return r -> resourceAllowed(r, AuthorizationStatics.ACTION_IMPORTERA);
    }

    private boolean resourceAllowed(String resource, String action){
        IhpAuthResources ihpAuthResources = IhpAuthResources.builder()
                .resource(resource)
                .build();
        log.info("@@ Auth on : {} With action : {}", ihpAuthResources.toString(), action);
        return securityHelper.isAllowed(action, ihpAuthResources);
    }
}