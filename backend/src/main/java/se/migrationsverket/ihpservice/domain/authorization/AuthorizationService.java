package se.migrationsverket.ihpservice.domain.authorization;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class AuthorizationService {
    private final AuthResolver authResolver;

    public boolean actionAllowed(String resource, String action) {
        // always check actions with case-insensitive
        return switch (action.toLowerCase()) {
            case AuthorizationStatics.ACTION_ADMINISTRERA -> authResolver.administreraAllowed().test(resource);
            case AuthorizationStatics.ACTION_VISA -> authResolver.visaAllowed().test(resource);
            case AuthorizationStatics.ACTION_FASTSTALL -> authResolver.faststallAllowed().test(resource);
            case AuthorizationStatics.ACTION_IMPORTERA -> authResolver.importeraAllowed().test(resource);
            default -> {
                log.info(" @@@ Action: {} is not a valid action", action);
                yield false;
            }
        };
    }
}
