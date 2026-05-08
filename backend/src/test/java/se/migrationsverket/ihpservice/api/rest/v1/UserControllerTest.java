package se.migrationsverket.ihpservice.api.rest.v1;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import se.migrationsverket.ihpservice.domain.SecureWebrequestService;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class UserControllerTest {

    private final SecureWebrequestService secureWebrequestService = mock(SecureWebrequestService.class);
    private final RequestContextHolder requestContextHolder = mock(RequestContextHolder.class);

    @InjectMocks
    private UserController userController;
    @Before
    public void setUp() {

        userController = new UserController(requestContextHolder, secureWebrequestService);
    }

    @Test
    public void getAuthorizedMember() {
        userController.getAuthorizedMember();
        verify(requestContextHolder).getStringValue(ApplicationStatics.IAM_USER);
    }
}