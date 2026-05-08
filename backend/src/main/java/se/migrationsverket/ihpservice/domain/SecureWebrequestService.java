package se.migrationsverket.ihpservice.domain;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.domain.authorization.AuthorizationService;

@Slf4j
@Service
@AllArgsConstructor
public class SecureWebrequestService {
    AuthorizationService authorizationService;

    public boolean actionAllowed(String resource, String action){
        return authorizationService.actionAllowed(resource, action);
    }
}
