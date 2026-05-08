package se.migrationsverket.ihpservice.domain.services;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.OperationalAreaRepository;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

@ActiveProfiles("local")
@TestPropertySource(locations = "classpath:./application.properties")
class OperationalAreaTypeServiceTest {
    private final RequestContextHolder requestContextHolder = mock(RequestContextHolder.class);
    private final ClassificationStructureRepository parentRepository = mock(ClassificationStructureRepository.class);
    private final OperationalAreaRepository repository = mock(OperationalAreaRepository.class);
    private final ProcessGroupTypeService processGroupService = mock(ProcessGroupTypeService.class);
    private final ProcessTypeService processTypeService = mock(ProcessTypeService.class);
    private final HistoryService historyService = mock(HistoryService.class);
    private final NodeRelationService relationService = mock(NodeRelationService.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);

    final OperationalAreaTypeService service = new OperationalAreaTypeService(requestContextHolder, parentRepository, repository, processGroupService, processTypeService, historyService, relationService, eventPublisher);

    @Test
    void copy() {
        assertThrows(IllegalArgumentException.class, () -> service.copy(989898, true));
        assertThrows(IllegalArgumentException.class, () -> service.copy(5299, true));
    }
}