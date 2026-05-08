package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IhpUserDto;
import se.migrationsverket.ihpservice.domain.SecureWebrequestService;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

@Slf4j
@RestController
@RequestMapping({"/rest/app"})

public class UserController {
    private final RequestContextHolder requestContextHolder;
    private final SecureWebrequestService secureWebrequestService;

    @Autowired
    public UserController(RequestContextHolder requestContextHolder, SecureWebrequestService secureWebrequestService) {
        this.requestContextHolder = requestContextHolder;
        this.secureWebrequestService = secureWebrequestService;
    }

    @GetMapping(value = "/user/authorized")
    public IhpUserDto getAuthorizedMember() {
        return Mapper.map(requestContextHolder.getStringValue(ApplicationStatics.IAM_USER));
    }

    @GetMapping(value = "/hasauth/{resource}/{action}")
    public boolean hasAuth(@PathVariable String resource, @PathVariable String action){
        log.info("Check auth on resource: {} and action: {}", resource, action);
        return secureWebrequestService.actionAllowed(resource, action);
    }
}
