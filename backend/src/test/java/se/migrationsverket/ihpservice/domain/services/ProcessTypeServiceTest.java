package se.migrationsverket.ihpservice.domain.services;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.OperationalAreaRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessGroupRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessRepository;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

@ActiveProfiles("local")
@TestPropertySource(locations = "classpath:./application.properties")
class ProcessTypeServiceTest {
    private final RequestContextHolder requestContextHolder = mock(RequestContextHolder.class);
    private final OperationalAreaRepository oaRepository = mock(OperationalAreaRepository.class);
    private final ProcessGroupRepository parentRepository = mock(ProcessGroupRepository.class);
    private final ProcessRepository repository = mock(ProcessRepository.class);
    private final IssueTypeService issueTypeService = mock(IssueTypeService.class);
    private final HistoryService historyService = mock(HistoryService.class);
    private final NodeRelationService relationService = mock(NodeRelationService.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final ProcessTypeService service = new ProcessTypeService(requestContextHolder, oaRepository, parentRepository, repository, issueTypeService, historyService, relationService, eventPublisher);


    @Test
    void copy() {
        assertThrows(IllegalArgumentException.class, () -> service.copy(989898, true));
        assertThrows(IllegalArgumentException.class, () -> service.copy(5348, true));
    }
}