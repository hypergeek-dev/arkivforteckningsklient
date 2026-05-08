package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ClassificationStructureTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.NODE_NF;
import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class ClassificationStructureTypeService implements StructureNodeService<ClassificationStructureTypeNode, ClassificationStructureTypeNodeDto> {
    private final RequestContextHolder requestContextHolder;
    private final ClassificationStructureRepository repository;
    private final OperationalAreaTypeService oaService;
    private final ProcessGroupTypeService processGroupTypeService;
    private final ProcessTypeService processTypeService;
    private final IssueTypeService issueTypeService;
    private final DocumentTypeService documentTypeService;
    private final HistoryService historyService;
    private final NodeRelationService relationService;
    private final ModelSnapshotEstablishedService snapService;


    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    @Override
    public ClassificationStructureTypeNode add(ClassificationStructureTypeNode node, EventAction eventAction) {
        node.add(getUserId());
        ClassificationStructureTypeNode added = repository.add(node, getUserId());
        historyService.log(added.mapToDto(), eventAction, added.mapToDto().getNodeName(), getUserId());
        return added;
    }

    @Override
    public ClassificationStructureTypeNode update(ClassificationStructureTypeNode node) {
        node.update(getUserId(), fetchLocal(node.getId()));
        ClassificationStructureTypeNode updated = repository.update(node, getUserId());
        historyService.log(updated.mapToDto(), EventAction.UPDATE, updated.mapToDto().getNodeName(), getUserId());
        return updated;
    }

    public void handleEstablishUpdate(int ksId) {
        ClassificationStructureTypeNode ksNode = fetchLocal(ksId);
        ksNode.allowEstablish();
        if (Boolean.FALSE.equals(areAllKsChildrenStatus(NodeStatus.GODKAND.toString(), ksNode.getPath()))) {
            throw new PreconditionFailedException("Det finns noder i den här klassificeringsstrukturen som inte är godkända. Godkänn dem först.");
        }
        establishKS(ksNode, getUserId());
        snapService.createSnapshot(ksId, ksNode.getInstruction());

    }

    private void establishChildren(String ksPath, String userId) {
        documentTypeService.updateStatusByPathPrefix(NodeStatus.FASTSTALLD, NodeStatus.GODKAND, ksPath, userId);
        issueTypeService.updateStatusByPathPrefix(NodeStatus.FASTSTALLD, NodeStatus.GODKAND, ksPath, userId);
        processTypeService.updateStatusByPathPrefix(NodeStatus.FASTSTALLD, NodeStatus.GODKAND, ksPath, userId);
        processGroupTypeService.updateStatusByPathPrefix(NodeStatus.FASTSTALLD, NodeStatus.GODKAND, ksPath, userId);
        oaService.updateStatusByPathPrefix(NodeStatus.FASTSTALLD, NodeStatus.GODKAND, ksPath, userId);
    }

    private void establishKS(ClassificationStructureTypeNode ksNode, String userId) {
        ksNode.establish();
        // check for date overlaps
        checkPreviousCsNodes(ksNode);
        establishChildren(ksNode.getPath(), userId);
        ksNode.updatesPostEstablish();

        repository.update(ksNode, getUserId());
    }

    private void establishedChildrenToApproved(String ksPath, String userId) {
        documentTypeService.updateStatusByPathPrefix(NodeStatus.GODKAND, NodeStatus.FASTSTALLD, ksPath, userId);
        issueTypeService.updateStatusByPathPrefix(NodeStatus.GODKAND, NodeStatus.FASTSTALLD, ksPath, userId);
        processTypeService.updateStatusByPathPrefix(NodeStatus.GODKAND, NodeStatus.FASTSTALLD, ksPath, userId);
        processGroupTypeService.updateStatusByPathPrefix(NodeStatus.GODKAND, NodeStatus.FASTSTALLD, ksPath, userId);
        oaService.updateStatusByPathPrefix(NodeStatus.GODKAND, NodeStatus.FASTSTALLD, ksPath, userId);
    }

    @Override
    public void patchStatus(int id, NodeStatus toStatus, EventAction action) {
        ClassificationStructureTypeNode node = fetchLocal(id);
        node.validateRequirements();
        node.allowPatchStatus(toStatus);
        if (toStatus == NodeStatus.UTKAST && NodeStatus.FASTSTALLD.toString().equals(node.getStatus())) {
            establishedChildrenToApproved(node.getPath(), getUserId());
            historyService.log(repository.patchStatus(node, getUserId()).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
        }
        node.setStatus(toStatus.toString());
        historyService.log(repository.patchStatus(node, getUserId()).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
    }

    @Override
    public void delete(int id) {
        ClassificationStructureTypeNode node = fetchLocal(id);
        node.allowDelete();

        if (!oaService.deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()))) {
            throw new PreconditionFailedException("Node har barn som inte kunde raderas - förmodligen högre status än deras förälder");
        }
        historyService.log(node.mapToDto(), EventAction.DELETE, node.mapToDto().getNodeName(), getUserId());
        repository.delete(id);
    }

    public void copyCs(int id) {
        prepareForCopy(id);
    }

    public void copyCsAndStruct(int id) {
        CopyCsPrep prep = prepareForCopy(id);
        relationService.copy(prep.originalPath(), prep.original().getPath());
        oaService.copyChildren(prep.original().getId(), prep.copy().getId(), prep.copy().getPath(), false);
    }

    private CopyCsPrep prepareForCopy(int id) {
        ClassificationStructureTypeNode node = fetchLocal(id);
        String oldPath = node.getPath();
        node.copyCs();
        ClassificationStructureTypeNode copy = repository.add(node, getUserId());
        historyService.log(copy.mapToDto(), EventAction.COPY, node.mapToDto().getNodeName(), getUserId());

        return new CopyCsPrep(oldPath, node, copy);
    }


    @Override
    public List<ClassificationStructureTypeNodeDto> findAllByPathPrefix(String pathPrefix) {
        return repository.streamByPathPrefix(pathPrefix).map(ClassificationStructureTypeNode::mapToDto).toList();
    }

    public Optional<ClassificationStructureTypeNodeDto> findByPath(String pathPrefix) {
        return repository.findByByPath(pathPrefix).map(ClassificationStructureTypeNode::mapToDto);
    }

    private ClassificationStructureTypeNode fetchLocal(int id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
    }

    @Override
    public Optional<ClassificationStructureTypeNode> fetch(int id) {
        return repository.findById(id);
    }

    @Override
    public void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action,String correlationId) {
        throw new NotImplementedException();
    }

    public Boolean areAllKsChildrenStatus(String status, String ksPath) {
        return repository.areAllKsChildrenStatus(status, ksPath) == 0;
    }

    public Boolean wholeStructureContainsOnly(String status, String ksPath) {
        return repository.areAllKsChildrenStatus(status, ksPath) == 0;
    }

    public List<ClassificationStructureTypeNodeDto> list() {
        return repository.streamNodes().map(ClassificationStructureTypeNode::mapToDto).toList();
    }

    public void checkPreviousCsNodes(ClassificationStructureTypeNode node) {
        String userId = getUserId();

        // Check for illegal combinations
        if (repository.findIllegalCsCombinations(node)) {
            throw new PreconditionFailedException("There are active ksnodes with datespans that makes this establish impossible");
        }

        List<ClassificationStructureTypeNode> startHits = repository.streamActive(node.getStart()).toList();
        for (ClassificationStructureTypeNode chgStop : startHits) {
            // Change found node(s) stop date to date before new nodes start-date
            chgStop.setStop(DateUtils.addDays(node.getStart(), -1));
            repository.update(chgStop, userId);
            snapService.createSnapshot(chgStop.getId(), chgStop.getInstruction());
        }

        if (node.getStop() != null) {
            List<ClassificationStructureTypeNode> stopHits = repository.streamActive(node.getStop()).toList();
            for (ClassificationStructureTypeNode chgStart : stopHits) {
                // Change found node(s) start date to date after new nodes stop-date
                chgStart.setStart(DateUtils.addDays(node.getStop(), 1));
                repository.update(chgStart, userId);
                snapService.createSnapshot(chgStart.getId(), chgStart.getInstruction());
            }
        }
    }

    @Override
    public boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public void copyChildren(int parentId, int newParent, String parentPath, boolean partialCopy) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public void copy(int id, Boolean copyStruct) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public void copy(int id, Integer newParent, String parentPath, boolean partialCopy, Boolean copyStruct) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public boolean newPathExists(ClassificationStructureTypeNode node) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public void updatePathIfChanged(ClassificationStructureTypeNode node) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public void updatePathFromParent(String newParentPath, int parentId) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public List<ClassificationStructureTypeNodeDto> listByParent(Integer parentId) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public List<ClassificationStructureTypeNodeDto> listActiveByParentId(Integer parentId, Date date) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}
