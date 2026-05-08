package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ProcessTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.ProcessGroupTypeNode;
import se.migrationsverket.ihpservice.domain.ProcessTypeNode;
import se.migrationsverket.ihpservice.domain.StructureTypeNode;
import se.migrationsverket.ihpservice.domain.event.BatchStatusEvent;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.OperationalAreaRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessGroupRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.IhpUtils;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.*;

@AllArgsConstructor
@Transactional
@Service
@Timed
public class ProcessTypeService implements StructureNodeService<ProcessTypeNode, ProcessTypeNodeDto> {
    private final RequestContextHolder requestContextHolder;
    private final OperationalAreaRepository operationalAreaRepository;
    private final ProcessGroupRepository processGroupRepository;
    private final ProcessRepository repository;
    private final IssueTypeService issueTypeService;
    private final HistoryService historyService;
    private final NodeRelationService relationService;
    private final ApplicationEventPublisher eventPublisher;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    public void establishedAddCheck(Integer id) {
        operationalAreaRepository.findById(id)
                .ifPresent(oat -> {
                    if (oat.isEstablished()) {
                        throw new PreconditionFailedException("Verksamhetsområdet är i status fastställt, ej tillåtet att lägga till process.");
                    }
                });
        processGroupRepository.findById(id)
                .ifPresent(pgt -> {
                    if (pgt.isEstablished()) {
                        throw new PreconditionFailedException("Processgrupp är i status fastställt, ej tillåtet att lägga till process.");
                    }
                });
    }

    @Override

    public ProcessTypeNode add(ProcessTypeNode node, EventAction eventAction) {
        establishedAddCheck(node.getParentId());
        if (node.pathIsNullOrEmpty()) {
            updatePath(node);
        }
        relationService.handleRelationsFromNodes(node,
                ProcessTypeNode::getRelations,
                ProcessTypeNode::getPath);

        ProcessTypeNode added = repository.add(node, getUserId());
        historyService.log(added.mapToDto(), eventAction, added.mapToDto().getNodeName(), getUserId());
        return added;
    }

    @Override

    public ProcessTypeNode update(ProcessTypeNode incoming) {
        incoming.allowUpdate();

        Optional<ProcessTypeNode> currentNode = fetch(incoming.getId());
        currentNode.ifPresent(current -> {
            current.validatePut(incoming);
            updatePathIfChanged(incoming, current);
        });

        ProcessTypeNode updated = repository.update(incoming, getUserId());

        relationService.add(incoming.getRelations());
        updated.setRelations(incoming.getRelations());
        historyService.log(updated.mapToDto(), EventAction.UPDATE, updated.mapToDto().getNodeName(), getUserId());
        return updated;
    }

    @Override
    public void patchStatus(int id, NodeStatus toStatus, EventAction action) {
        ProcessTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.validateRequirements();

        node.setStatus(toStatus.toString());
        historyService.log(repository.patchStatus(node, getUserId()).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
    }

    @Override
    public void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action,String correlationId) {
        repository.patchStatuses(changingNodes, status);
        eventPublisher.publishEvent(new BatchStatusEvent(changingNodes, action, getUserId(), NodeName.PROCESSNODE,correlationId));
    }


    @Override

    public void delete(int id) {
        ProcessTypeNode node = repository.findById(id).map(this::appendRelations).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        if (node.getStatus().equals(NodeStatus.UTKAST.toString())) {
            if (!issueTypeService.deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()))) {
                throw new PreconditionFailedException("Nod har barn som inte kunde raderas - förmodligen högre status än deras förälder");
            }
            historyService.log(node.mapToDto(), EventAction.DELETE, node.mapToDto().getNodeName(), getUserId());
            repository.delete(id);
            relationService.deleteByPath(node.getPath());
        } else {
            throw new PreconditionFailedException(String.format(PC_DELETE_FAILED, id, node.getStatus()));
        }
    }

    @Override
    public boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus) {
        List<ProcessTypeNodeDto> children = listByParent(parentId);
        return childrenHasHigherStatus(children, parentStatus);
    }

    private boolean childrenHasHigherStatus(List<ProcessTypeNodeDto> children, NodeStatus parentStatus) {
        for (ProcessTypeNodeDto child : children) {
            if (child.getStatus().ordinal() > parentStatus.ordinal()) {
                return true;
            }
            if (issueTypeService.childrenHasHigherStatus(Integer.parseInt(child.getId()), parentStatus)) {
                return true;
            }
        }
        return false;
    }

    public void deleteChildren(int parentId, NodeStatus parentStatus) {
        List<ProcessTypeNodeDto> children = listByParent(parentId);
        if (!childrenHasHigherStatus(children, parentStatus)) {
            deleteChildren(children);
        }
    }

    private void deleteChildren(List<ProcessTypeNodeDto> children) {
        for (ProcessTypeNodeDto child : children) {
            delete(Integer.parseInt(child.getId()));
        }
    }

    @Override
    public void copy(int id, Boolean copyStruct) {
        copy(id, null, null, true, copyStruct);
    }

    @Override
    public void copyChildren(int parentId, int newParent, String parentPath, boolean partialCopy) {
        repository.streamByParent(parentId).forEach(n -> copy(n.getId(), newParent, parentPath, partialCopy, true));
    }

    @Override
    public void copy(int id, Integer newParent, String parentPath, boolean partialCopy, Boolean copyStruct) {
        ProcessTypeNode node = repository.findById(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.copy(newParent, parentPath, partialCopy);
        ProcessTypeNode copy = newParent == null ? add(node, EventAction.COPY) : repository.add(node, getUserId());
        if (Boolean.TRUE.equals(copyStruct)) {
            issueTypeService.copyChildren(node.getId(), copy.getId(), copy.getPath(), partialCopy);
        }
    }

    @Override
    public boolean newPathExists(ProcessTypeNode node) {
        return Stream.concat(repository.streamByParent(node.getParentId())
                        .map(ProcessTypeNode::extractPartialPath), processGroupRepository.streamByParent(node.getParentId())
                        .map(ProcessGroupTypeNode::extractPartialPath))
                .anyMatch(i -> i.equals(node.getPartialPath()));
    }

    @Override
    public void updatePathIfChanged(ProcessTypeNode node){
        throw new UnsupportedOperationException("Not supported anymore.");
    }
    private void updatePathIfChanged(ProcessTypeNode incoming, ProcessTypeNode current) {
        if (!incoming.getPath().equals(current.getPath())) {
            if (newPathExists(incoming)) {
                throw new IllegalArgumentException(String.format(PATH_EXISTS, incoming.getPartialPath()));
            }
            incoming.updatePath();
            issueTypeService.updatePathFromParent(incoming.getPath(), incoming.getId());
            List<NodeRelation> updatedRelations = relationService.updatePaths(incoming.getRelations(), incoming.getPath());
            incoming.setRelations(updatedRelations);
            // SIDE EFFECT - change all paths where node is being related to
            relationService.updateRelatedPaths(current.getPath(), incoming.getPath());
        }
    }

    public void updateThisPathAndChildren(ProcessTypeNode node, String newParentPath) {
        node.updatePath();
        node.updateFromParentPath(newParentPath);
        issueTypeService.updatePathFromParent(node.getPath(), node.getId());
        update(node);
    }

    @Override
    public void updatePathFromParent(String newParentPath, int parentId) {
        List<ProcessTypeNode> nodes = repository.streamByParent(parentId).toList();
        for (ProcessTypeNode node : nodes) {
            node.updateFromParentPath(newParentPath);
            update(node);
            issueTypeService.updatePathFromParent(node.getPath(), node.getId());
        }
    }

    public Stream<ProcessTypeNode> listProcessTypeNodeByParent(Integer parentId) {
        return repository.streamByParent(parentId);
    }

    @Override
    public List<ProcessTypeNodeDto> listByParent(Integer parentId) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return repository.streamByParent(parentId).map(this::appendRelations).peek(n -> n.setParentStatus(sts)).map(ProcessTypeNode::mapToDto).toList();
    }

    @Override
    public List<ProcessTypeNodeDto> listActiveByParentId(Integer parentId, Date date) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return repository.streamActiveByParent(parentId, date).map(this::appendRelations).peek(n -> n.setParentStatus(sts)).map(ProcessTypeNode::mapToDto).toList();
    }

    @Override
    public List<ProcessTypeNodeDto> findAllByPathPrefix(String pathPrefix) {
        return repository.streamByPathPrefix(pathPrefix).map(ProcessTypeNode::mapToDto).toList();
    }

    @Override
    public Optional<ProcessTypeNode> fetch(int id) {

        Optional<ProcessTypeNode> optNode = repository.findById(id).map(this::appendRelations);
        if (optNode.isPresent()) {
            ProcessTypeNode node = optNode.get();
            node.setParentStatus(fetchParentStatusById(node.getParentId()));
            return Optional.of(node);
        }

        return Optional.empty();
    }

    public List<StructureNodeDto> getSnapshotEstablished(String path) {
        return repository.findAllEstablishedByPathPrefix(path)
                .map(this::appendRelations)
                .map(ProcessTypeNode::mapToDto)
                .collect(Collectors.toList());
    }

    public NodeStatus fetchParentStatusById(Integer parentId) {
        return operationalAreaRepository.fetchStatusById(parentId) == NodeStatus.UTKAST
                ? processGroupRepository.fetchStatusById(parentId)
                : operationalAreaRepository.fetchStatusById(parentId);
    }

    public String fetchParentPathById(int parentId) {
        return processGroupRepository.findById(parentId)
                .map(StructureTypeNode::getPath)
                .orElse(operationalAreaRepository.findById(parentId)
                        .map(StructureTypeNode::getPath).orElse(""));
    }

    public int countNodes(int parentId) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return listByParent(parentId).size() +
                (int) processGroupRepository.streamByParent(parentId).peek(n -> n.setParentStatus(sts)).map(ProcessGroupTypeNode::mapToDto).count();
    }

    private void updatePath(ProcessTypeNode node) {
        if (node.getParentId() == null) {
            throw new IllegalArgumentException("Node must have a parent");
        }

        String parentPath = fetchParentPathById(node.getParentId());
        int nodes = countNodes(node.getParentId());
        do {
            node.setPartialPath(nodes);
            node.setPath(IhpUtils.composePath(parentPath, nodes, 0));
        } while (newPathExists(node) && nodes++ < 50);
    }

    protected ProcessTypeNode appendRelations(ProcessTypeNode node) {
        node.setRelations(relationService.listByPath(node.getPath()));
        return node;
    }

    void updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        repository.updateStatusByPathPrefix(toStatus, fromStatus, pathPrefix, userId).forEach(this::appendRelations);
    }
}