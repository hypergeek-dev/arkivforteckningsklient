package se.migrationsverket.ihpservice.domain.services;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Optional;
import java.util.stream.Stream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.*;
import static se.migrationsverket.ihpservice.domain.services.CsTestStatics.*;

@ExtendWith(MockitoExtension.class)
@Slf4j
class ClassificationStructureTypeServiceTest {
    @Mock
    ClassificationStructureRepository repository;

    @Mock
    RequestContextHolder contextHolder;

    @Mock
    HistoryService historyService;

    @Mock
    ModelSnapshotEstablishedService snapService;

    @Mock
    DocumentTypeService documentTypeService;

    @Mock
    IssueTypeService issueTypeService;

    @Mock
    ProcessTypeService processTypeService;

    @Mock
    ProcessGroupTypeService processGroupTypeService;

    @Mock
    OperationalAreaTypeService oaService;

    @Mock
    NodeRelationService relationService;

    @InjectMocks
    ClassificationStructureTypeService service;

    @Test
    @DisplayName("Path and Version is added when not present")
    void add() {
        when(contextHolder.getStringValue(any())).thenReturn(USER);
        when(historyService.log(any(), any(), any(), any())).thenReturn(1);
        when(repository.add(preparedNode, USER)).thenReturn(preparedNode);

        String pathPreInsert = nodeToAdd.getPath();
        Integer csVersionPreInsert = nodeToAdd.getCsVersion();

        service.add(nodeToAdd, EventAction.CREATE);

        verify(contextHolder, times(3)).getStringValue(ApplicationStatics.IAM_USER);
        verify(repository, times(1)).add(any(), eq(USER));
        verify(historyService, times(1)).log(preparedNode.mapToDto(), EventAction.CREATE, preparedNode.mapToDto().getNodeName(), USER);

        //assertThat(csVersionPreInsert, isNull());
        assertThat(nodeToAdd.getPath(), not(pathPreInsert));
        assertThat(nodeToAdd.getCsVersion(), not(csVersionPreInsert));
        log.info("nta {}", nodeToAdd.getPath());
        assertThat(nodeToAdd.getPath(), is(preparedNode.getPath()));
        assertThat(nodeToAdd.getCsVersion(), is(preparedNode.getCsVersion()));

    }

    @Test
    void update() {
        when(contextHolder.getStringValue(any())).thenReturn(USER);
        when(historyService.log(any(), any(), any(), any())).thenReturn(1);
        when(repository.findById(47)).thenReturn(Optional.of(preparedNode));
        when(repository.update(preparedNode, USER)).thenReturn(preparedNode);

        service.update(preparedNode);

        verify(repository, times(1)).findById(any());
        verify(repository, times(1)).update(any(), any());
        verify(contextHolder, times(3)).getStringValue(anyString());
    }


    @Test
    void handleEstablishUpdate() {
        when(repository.findById(47)).thenReturn(Optional.of(nodeGodkand));
        when(repository.areAllKsChildrenStatus(any(), any())).thenReturn(0);
        when(repository.findIllegalCsCombinations(any())).thenReturn(false);
        when(repository.streamActive(any())).thenReturn(Stream.empty());
        when(repository.update(any(), any())).thenReturn(nodeGodkand);

        service.handleEstablishUpdate(47);

        verify(snapService, times(1)).createSnapshot(any(), any());
        verify(documentTypeService, times(1)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(issueTypeService, times(1)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(processTypeService, times(1)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(processGroupTypeService, times(1)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(oaService, times(1)).updateStatusByPathPrefix(any(), any(), any(), any());
    }

    @Test
    void copyCs() {
        when(repository.findById(any())).thenReturn(Optional.of(nodeKlar));
        when(repository.add(any(), any())).thenReturn(nodeKlar);

        service.copyCs(47);
        verify(repository, times(1)).findById(any());
        verify(repository, times(1)).add(any(), any());
        verify(relationService, times(0)).copy(any(), any());
        verify(oaService, times(0)).copyChildren(anyInt(), anyInt(), any(), anyBoolean());

    }
}