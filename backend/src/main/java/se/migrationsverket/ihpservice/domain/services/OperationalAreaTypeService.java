package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.OperationalAreaTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.domain.OperationalAreaTypeNode;
import se.migrationsverket.ihpservice.domain.StructureTypeNode;
import se.migrationsverket.ihpservice.domain.event.BatchStatusEvent;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.OperationalAreaRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.IhpUtils;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.*;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class OperationalAreaTypeService implements StructureNodeService<OperationalAreaTypeNode, OperationalAreaTypeNodeDto> {
    private final RequestContextHolder requestContextHolder;
    private final ClassificationStructureRepository parentRepository;
    private final OperationalAreaRepository repository;
    private final ProcessGroupTypeService processGroupService;
    private final ProcessTypeService processTypeService;
    private final HistoryService historyService;
    private final NodeRelationService relationService;
    private final ApplicationEventPublisher eventPublisher;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    @Override
    public OperationalAreaTypeNode add(OperationalAreaTypeNode node, EventAction eventAction) {
        ClassificationStructureTypeNode cs = parentRepository.findById(node.getCsnodeId()).orElseThrow(() -> new PreconditionFailedException("Toppnod existerar inte."));
        if (cs.getStatus().equals(NodeStatus.FASTSTALLD.toString())) {
            throw new PreconditionFailedException("KS är i status fastställd och det är inte tillåtet att lägga till ett nytt verksamhetsområde.");
        }
        updatePath(node);
        relationService.add(node.getRelations());
        OperationalAreaTypeNode added = repository.add(node, getUserId());
        historyService.log(added.mapToDto(), eventAction, added.mapToDto().getNodeName(), getUserId());
        return added;
    }

    @Override
    public OperationalAreaTypeNode update(OperationalAreaTypeNode incoming) {
        incoming.allowUpdate();
        Optional<OperationalAreaTypeNode> currentNode = fetch(incoming.getId());
        currentNode.ifPresent(current -> {
            current.validatePut(incoming);
            updatePathIfChanged(incoming, current);
        });


        OperationalAreaTypeNode updated = repository.update(incoming, getUserId());
        relationService.update(currentNode.map(OperationalAreaTypeNode::getRelations).orElse(new ArrayList<>()), incoming.getRelations());
        historyService.log(updated.mapToDto(), EventAction.UPDATE, updated.mapToDto().getNodeName(), getUserId());
        return updated;
    }

    @Override
    public void patchStatus(int id, NodeStatus toStatus, EventAction action) {
        OperationalAreaTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.validateRequirements();

        node.setStatus(toStatus.toString());
        historyService.log(repository.patchStatus(node, getUserId()).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
    }

    @Override
    public void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action, String correlationId) {
        repository.patchStatuses(changingNodes, status);
        eventPublisher.publishEvent(new BatchStatusEvent(changingNodes, action, getUserId(), NodeName.OANODE, correlationId));
    }

    @Override
    public void delete(int id) {
        OperationalAreaTypeNode node = repository.findById(id).map(this::appendRelations).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        if (node.getStatus().equals(NodeStatus.UTKAST.toString())) {
            if (processGroupService.childrenHasHigherStatus(id, NodeStatus.getNodeStatus(node.getStatus())) || processTypeService.childrenHasHigherStatus(id, NodeStatus.getNodeStatus(node.getStatus()))) {
                throw new PreconditionFailedException("\n" +
                        "Nod har barn som inte kunde raderas - förmodligen högre status än deras förälder");
            }
            historyService.log(node.mapToDto(), EventAction.DELETE, node.mapToDto().getNodeName(), getUserId());
            processGroupService.deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()));
            processTypeService.deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()));
            repository.delete(id);
            relationService.deleteByPath(node.getPath());
        } else {
            throw new PreconditionFailedException(String.format(PC_DELETE_FAILED, id, node.getStatus()));
        }
    }

    public boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus) {
        List<OperationalAreaTypeNodeDto> children = listByParent(parentId);
        return childrenHasHigherStatus(children, parentStatus);
    }

    private boolean childrenHasHigherStatus(List<OperationalAreaTypeNodeDto> children, NodeStatus parentStatus) {
        for (OperationalAreaTypeNodeDto child : children) {
            if (child.getStatus().ordinal() > parentStatus.ordinal()) {
                return true;
            }
            if (processGroupService.childrenHasHigherStatus(Integer.parseInt(child.getId()), parentStatus)) {
                return true;
            }
            if (processTypeService.childrenHasHigherStatus(Integer.parseInt(child.getId()), parentStatus)) {
                return true;
            }
        }
        return false;
    }


    public boolean deleteChildren(int parentId, NodeStatus parentStatus) {
        List<OperationalAreaTypeNodeDto> children = listByParent(parentId);
        if (!childrenHasHigherStatus(children, parentStatus)) {
            deleteChildren(children);
            return true;
        }
        return false;
    }

    private void deleteChildren(List<OperationalAreaTypeNodeDto> children) {
        for (OperationalAreaTypeNodeDto child : children) {
            delete(Integer.parseInt(child.getId()));
        }
    }

    @Override

    public void copyChildren(int parentId, int newParent, String parentPath, boolean partialCopy) {
        repository.streamByParent(parentId).forEach(n -> copy(n.getId(), newParent, parentPath, partialCopy, true));
    }

    @Override

    public void copy(int id, Boolean copyStruct) {
        copy(id, null, null, true, copyStruct);
    }

    @Override

    public void copy(int id, Integer newParent, String parentPath, boolean partialCopy, Boolean copyStruct) {
        OperationalAreaTypeNode node = repository.findById(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.copy(newParent, parentPath, partialCopy);
        OperationalAreaTypeNode copy = newParent == null ? add(node, EventAction.COPY) : repository.add(node, getUserId());
        if (Boolean.TRUE.equals(copyStruct)) {
            processGroupService.copyChildren(node.getId(), copy.getId(), copy.getPath(), partialCopy);
            processTypeService.copyChildren(node.getId(), copy.getId(), copy.getPath(), partialCopy);
        }
    }

    @Override
    public boolean newPathExists(OperationalAreaTypeNode node) {
        return repository.streamByParent(node.getCsnodeId()).map(OperationalAreaTypeNode::extractPartialPath).anyMatch(n -> n.equals(node.getPartialPath()));
    }

    @Override

    public void updatePathIfChanged(OperationalAreaTypeNode node) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    public void updatePathIfChanged(OperationalAreaTypeNode incoming, OperationalAreaTypeNode current) {
        if (!incoming.getPath().equals(current.getPath())) {
            if (newPathExists(incoming)) {
                throw new IllegalArgumentException(String.format(PATH_EXISTS, incoming.getPartialPath()));
            }

            incoming.updatePath();
            processGroupService.updatePathFromParent(incoming.getPath(), incoming.getId());
            processTypeService.updatePathFromParent(incoming.getPath(), incoming.getId());
        }
    }

    @Override
    public void updatePathFromParent(String newParentPath, int parentId) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public List<OperationalAreaTypeNodeDto> listByParent(Integer parentId) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return repository.streamByParent(parentId).map(this::appendRelations).peek(n -> n.setParentStatus(sts)).map(OperationalAreaTypeNode::mapToDto).toList();
    }

    @Override
    public List<OperationalAreaTypeNodeDto> listActiveByParentId(Integer parentId, Date date) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return repository.streamActiveByParent(parentId, date)
                .map(this::appendRelations)
                .peek(n -> n.setParentStatus(sts))
                .map(OperationalAreaTypeNode::mapToDto)
                .toList();
    }

    @Override
    public List<OperationalAreaTypeNodeDto> findAllByPathPrefix(String pathPrefix) {
        return repository.streamByPathPrefix(pathPrefix).map(OperationalAreaTypeNode::mapToDto).toList();
    }

    @Override
    public Optional<OperationalAreaTypeNode> fetch(int id) {

        Optional<OperationalAreaTypeNode> optNode = repository.findById(id).map(this::appendRelations);
        if (optNode.isPresent()) {
            OperationalAreaTypeNode node = optNode.get();
            node.setParentStatus(fetchParentStatusById(node.getCsnodeId()));
            return Optional.of(node);
        }

        return Optional.empty();
    }


    public List<StructureNodeDto> getSnapshotEstablished(Integer id, String path) {
        List<StructureNodeDto> activityAreas = repository.findAllEstablishedByParent(id)
                .map(this::appendRelations)
                .map(OperationalAreaTypeNode::mapToDto)
                .collect(Collectors.toList());
        activityAreas.addAll(processGroupService.getSnapshotEstablished(path));
        activityAreas.addAll(processTypeService.getSnapshotEstablished(path));
        return activityAreas;
    }

    public NodeStatus fetchParentStatusById(Integer parentId) {
        return parentRepository.fetchStatusById(parentId);
    }

    public String fetchParentPathById(int parentId) {
        return parentRepository.findById(parentId).map(StructureTypeNode::getPath).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, parentId)));
    }

    public int countNodes(int parentId) {
        return repository.countByParent(parentId);
    }

    private void updatePath(OperationalAreaTypeNode node) {
        if (node.getCsnodeId() == null) {
            throw new IllegalArgumentException("Node must have a parent");
        }
        String parentPath = fetchParentPathById(node.getCsnodeId());
        int nodes = countNodes(node.getCsnodeId());
        do {
            node.setPartialPath(nodes);
            node.setPath(IhpUtils.composeOaPath(parentPath, nodes, 0));
        } while (newPathExists(node) && nodes++ < 50);
    }

    private OperationalAreaTypeNode appendRelations(OperationalAreaTypeNode node) {
        node.setRelations(relationService.listByPath(node.getPath()));
        return node;
    }

    void updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        repository.updateStatusByPathPrefix(toStatus, fromStatus, pathPrefix, userId);
    }
}
