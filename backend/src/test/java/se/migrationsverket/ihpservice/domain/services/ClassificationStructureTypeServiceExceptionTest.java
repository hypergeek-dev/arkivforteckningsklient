package se.migrationsverket.ihpservice.domain.services;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;
import static org.mockito.Mockito.*;
import static se.migrationsverket.ihpservice.domain.services.CsTestStatics.*;

@ExtendWith(MockitoExtension.class)
@Slf4j
class ClassificationStructureTypeServiceExceptionTest {
    @Mock
    ClassificationStructureRepository repository;

    @Mock
    RequestContextHolder contextHolder;

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
    @DisplayName("Illegal calls to update")
    void updateNotAllowed() {
        when(repository.findById(any())).thenReturn(Optional.empty());
        when(repository.findById(47)).thenReturn(Optional.of(nodeKlar));

        assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> service.update(nonExistingNode));
        assertThatExceptionOfType(PreconditionFailedException.class)
                .isThrownBy(() -> service.update(nodeKlar));
        assertThatExceptionOfType(UnsupportedOperationException.class)
                .isThrownBy(() -> service.update(nodeToAdd));

        verify(repository, times(3)).findById(any());
        verify(repository, times(0)).update(any(), any());
        verify(contextHolder, times(3)).getStringValue(anyString());
    }


    @Test
    void handleEstablishUpdate() {
        when(repository.findById(1)).thenReturn(Optional.empty());
        when(repository.findById(47)).thenReturn(Optional.of(nodeKlar))
                .thenReturn(Optional.of(nodeGodkand))
                .thenReturn(Optional.of(nodeGodkand));
        when(repository.areAllKsChildrenStatus(any(), any())).thenReturn(1).thenReturn(0);

        assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> service.handleEstablishUpdate(1));
        assertThatExceptionOfType(PreconditionFailedException.class)
                .isThrownBy(() -> service.handleEstablishUpdate(47));
        assertThatExceptionOfType(PreconditionFailedException.class)
                .isThrownBy(() -> service.handleEstablishUpdate(47));

        verify(snapService, times(0)).createSnapshot(any(), any());
        verify(documentTypeService, times(0)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(issueTypeService, times(0)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(processTypeService, times(0)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(processGroupTypeService, times(0)).updateStatusByPathPrefix(any(), any(), any(), any());
        verify(oaService, times(0)).updateStatusByPathPrefix(any(), any(), any(), any());
    }

    @Test
    void patchStatus() {
        when(repository.findById(any()))
                .thenReturn(Optional.empty());

        assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> service.patchStatus(1, NodeStatus.FASTSTALLD, EventAction.FASTSTALLD));
    }

    @Test
    void delete() {
        when(repository.findById(any()))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(nodeToAdd))
                .thenReturn(Optional.of(nodeKlar));
        when(oaService.deleteChildren(47, NodeStatus.UTKAST))
                .thenReturn(false)
                .thenReturn(true);
        assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> service.delete(1));
        assertThatExceptionOfType(PreconditionFailedException.class)
                .isThrownBy(() -> service.delete(47));
        assertThatExceptionOfType(PreconditionFailedException.class)
                .isThrownBy(() -> service.delete(47));
    }

    @Test
    void copyCs() {
        when(repository.findById(any())).thenReturn(Optional.empty());

        assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> service.copyCs(1));

        verify(repository, times(1)).findById(any());
        verify(repository, times(0)).add(any(), any());
        verify(relationService, times(0)).copy(any(), any());
        verify(oaService, times(0)).copyChildren(anyInt(), anyInt(), any(), anyBoolean());

    }

    @Test
    void checkPreviousCsNodes() {
        when(repository.findIllegalCsCombinations(nodeGodkand)).thenReturn(true);
        assertThatExceptionOfType(PreconditionFailedException.class)
                .isThrownBy(() -> service.checkPreviousCsNodes(nodeGodkand));

        verify(repository, times(1)).findIllegalCsCombinations(any());
        verify(repository, times(0)).update(any(), any());
        verify(snapService, times(0)).createSnapshot(any(), any());
    }
}