package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.*;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.*;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class ProcessGroupTypeService implements StructureNodeService<ProcessGroupTypeNode, ProcessGroupTypeNodeDto> {
    private final RequestContextHolder requestContextHolder;
    private final OperationalAreaRepository operationalAreaRepository;
    private final ProcessGroupRepository processGroupRepository;
    private final ProcessRepository childRepository;
    private final ProcessTypeService processService;
    private final HistoryService historyService;
    private final NodeRelationService relationService;
    private final ApplicationEventPublisher eventPublisher;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    public void establishedAddCheck(Integer id) {
        operationalAreaRepository.findById(id)
                .ifPresent(oat -> {
                    if (oat.getStatus().equals(NodeStatus.FASTSTALLD.toString())) {
                        throw new PreconditionFailedException("Verksamhetsområdet är i status fastställt, ej tillåtet att lägga till processgrupp.");
                    }
                });

        processGroupRepository.findById(id)
                .ifPresent(pgt -> {
                    if (pgt.getStatus().equals(NodeStatus.FASTSTALLD.toString())) {
                        throw new PreconditionFailedException("Processgrupp är i status fastställt, ej tillåtet att lägga till processgrupp.");
                    }
                });
    }

    @Override
    public ProcessGroupTypeNode add(ProcessGroupTypeNode node, EventAction eventAction) {
        establishedAddCheck(node.getParentId());
        if (node.pathIsNullOrEmpty()) {
            updatePath(node);
        }
        relationService.handleRelationsFromNodes(node,
                ProcessGroupTypeNode::getRelations,
                ProcessGroupTypeNode::getPath);

        ProcessGroupTypeNode added = processGroupRepository.add(node, getUserId());
        historyService.log(added.mapToDto(), eventAction, added.mapToDto().getNodeName(), getUserId());
        return added;
    }

    @Override

    public ProcessGroupTypeNode update(ProcessGroupTypeNode incoming) {
        incoming.allowUpdate();
        Optional<ProcessGroupTypeNode> currentNode = fetch(incoming.getId());
        currentNode.ifPresent(current -> {
            current.validatePut(incoming);
            updatePathIfChanged(incoming, current);
        });

        relationService.update(currentNode.map(ProcessGroupTypeNode::getRelations).orElse(new ArrayList<>()), incoming.getRelations());
        ProcessGroupTypeNode updated = processGroupRepository.update(incoming, getUserId());
        updated.setRelations(incoming.getRelations());
        historyService.log(updated.mapToDto(), EventAction.UPDATE, updated.mapToDto().getNodeName(), getUserId());
        return updated;
    }

    @Override

    public void patchStatus(int id, NodeStatus toStatus, EventAction action) {
        ProcessGroupTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.validateRequirements();

        node.setStatus(toStatus.toString());
        historyService.log(processGroupRepository.patchStatus(node, getUserId()).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
    }


    @Override
    public void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action, String correlationId) {
        processGroupRepository.patchStatuses(changingNodes, status);
        eventPublisher.publishEvent(new BatchStatusEvent(changingNodes, action, getUserId(), NodeName.PGNODE, correlationId));
    }

    @Override
    public void delete(int id) {
        ProcessGroupTypeNode node = processGroupRepository.findById(id).map(this::appendRelations).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        if (node.getStatus().equals(NodeStatus.UTKAST.toString())) {
            if (childrenHasHigherStatus(id, NodeStatus.getNodeStatus(node.getStatus())) || processService.childrenHasHigherStatus(id, NodeStatus.getNodeStatus(node.getStatus()))) {
                throw new PreconditionFailedException("Nod har barn som inte kunde raderas - förmodligen högre status än deras förälder");
            }
            historyService.log(node.mapToDto(), EventAction.DELETE, node.mapToDto().getNodeName(), getUserId());
            deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()));
            processService.deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()));
            processGroupRepository.delete(id);
            relationService.deleteByPath(node.getPath());
        } else {
            throw new PreconditionFailedException(String.format(PC_DELETE_FAILED, id, node.getStatus()));
        }
    }

    public boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus) {
        List<ProcessGroupTypeNodeDto> children = listByParent(parentId);
        return childrenHasHigherStatus(children, parentStatus);
    }

    private boolean childrenHasHigherStatus(List<ProcessGroupTypeNodeDto> children, NodeStatus parentStatus) {
        for (ProcessGroupTypeNodeDto child : children) {
            if (child.getStatus().ordinal() > parentStatus.ordinal()) {
                return true;
            }
            if (childrenHasHigherStatus(Integer.parseInt(child.getId()), parentStatus)) {
                return true;
            }
            if (processService.childrenHasHigherStatus(Integer.parseInt(child.getId()), parentStatus)) {
                return true;
            }
        }
        return false;
    }


    public void deleteChildren(int parentId, NodeStatus parentStatus) {
        List<ProcessGroupTypeNodeDto> children = listByParent(parentId);
        if (!childrenHasHigherStatus(children, parentStatus)) {
            deleteChildren(children);
        }
    }

    private void deleteChildren(List<ProcessGroupTypeNodeDto> children) {
        for (ProcessGroupTypeNodeDto child : children) {
            delete(Integer.parseInt(child.getId()));
        }
    }

    @Override

    public void copyChildren(int oldParent, int newParent, String parentPath, boolean partialCopy) {
        processGroupRepository.streamByParent(oldParent).forEach(n -> copy(n.getId(), newParent, parentPath, partialCopy, true));
    }

    @Override

    public void copy(int id, Boolean copyStruct) {
        copy(id, null, null, true, copyStruct);
    }

    @Override

    public void copy(int id, Integer newParent, String parentPath, boolean partialCopy, Boolean copyStruct) {
        ProcessGroupTypeNode node = processGroupRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.copy(newParent, parentPath, partialCopy);
        ProcessGroupTypeNode copy = newParent == null ? add(node, EventAction.COPY) : processGroupRepository.add(node, getUserId());
        if (Boolean.TRUE.equals(copyStruct)) {
            copyChildren(node.getId(), copy.getId(), copy.getPath(), partialCopy);
            processService.copyChildren(node.getId(), copy.getId(), copy.getPath(), partialCopy);
        }
    }

    @Override
    public boolean newPathExists(ProcessGroupTypeNode node) {
        return Stream.concat(processGroupRepository.streamByParent(node.getParentId()).map(ProcessGroupTypeNode::extractPartialPath), childRepository.streamByParent(node.getParentId())
                .map(ProcessTypeNode::extractPartialPath)).anyMatch(i -> i.equals(node.getPartialPath()));
    }

    @Override
    public void updatePathIfChanged(ProcessGroupTypeNode node) {
        throw new UnsupportedOperationException("Not supported anymore.");
    }

    public void updatePathIfChanged(ProcessGroupTypeNode incoming, ProcessGroupTypeNode current){
        if (!incoming.getPath().equals(current.getPath())) {
            if (newPathExists(incoming)) {
                throw new IllegalArgumentException(String.format(PATH_EXISTS, incoming.getPartialPath()));
            }
            incoming.updatePath();
            updatePathFromParent(incoming.getPath(), incoming.getId());
            processService.updatePathFromParent(incoming.getPath(), incoming.getId());
            List<NodeRelation> updatedRelations = relationService.updatePaths(incoming.getRelations(), incoming.getPath());
            incoming.setRelations(updatedRelations);
            // SIDE EFFECT - change all paths where node is being related to
            relationService.updateRelatedPaths(current.getPath(), incoming.getPath());
        }
    }

    public void updateThisPathAndChildren(ProcessGroupTypeNode node, String newParentPath) {
        node.updatePath();
        node.updateFromParentPath(newParentPath);
        update(node);
        processService.updatePathFromParent(node.getPath(), node.getId());
        List<ProcessGroupTypeNode> pgNodes = processGroupRepository.streamByParent(node.getId()).toList();
        for (ProcessGroupTypeNode pgNode : pgNodes) {
            updateThisPathAndChildren(pgNode, node.getPath());
        }
    }

    @Override

    public void updatePathFromParent(String newParentPath, int parentId) {

        List<ProcessGroupTypeNode> pgNodes = processGroupRepository.streamByParent(parentId).toList();
        for (ProcessGroupTypeNode node : pgNodes) {
            node.updateFromParentPath(newParentPath);
            update(node);
            updatePathFromParent(node.getPath(), node.getId());
            processService.updatePathFromParent(node.getPath(), node.getId());
        }
    }

    public Stream<ProcessGroupTypeNode> listProcessGroupTypeNodeByParent(Integer parentId) {
        return processGroupRepository.streamByParent(parentId);
    }

    @Override
    public List<ProcessGroupTypeNodeDto> listByParent(Integer parentId) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return processGroupRepository.streamByParent(parentId).map(this::appendRelations).peek(n -> n.setParentStatus(sts)).map(ProcessGroupTypeNode::mapToDto).toList();
    }

    @Override
    public List<ProcessGroupTypeNodeDto> listActiveByParentId(Integer parentId, Date date) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return processGroupRepository.streamActiveByParent(parentId, date).map(this::appendRelations).peek(n -> n.setParentStatus(sts)).map(ProcessGroupTypeNode::mapToDto).toList();
    }

    @Override
    public List<ProcessGroupTypeNodeDto> findAllByPathPrefix(String pathPrefix) {
        return processGroupRepository.streamByPathPrefix(pathPrefix).map(ProcessGroupTypeNode::mapToDto).toList();
    }

    @Override
    public Optional<ProcessGroupTypeNode> fetch(int id) {

        Optional<ProcessGroupTypeNode> optNode = processGroupRepository.findById(id).map(this::appendRelations);
        if (optNode.isPresent()) {
            ProcessGroupTypeNode node = optNode.get();
            node.setParentStatus(fetchParentStatusById(node.getParentId()));
            return Optional.of(node);
        }
        return Optional.empty();
    }

    private Stream<StructureNodeDto> fetchNodesByPathList(List<String> paths) {
        Stream<ProcessTypeNodeDto> processes = childRepository.streamProcessByPaths(paths).map(ProcessTypeNode::mapToDto);
        Stream<ProcessGroupTypeNodeDto> processGroups = processGroupRepository.streamProcessGroupsByPaths(paths).map(ProcessGroupTypeNode::mapToDto);

        return Stream.concat(processes, processGroups);
    }

    public List<StructureNodeDto> fetchRelationNodesByOwnerPath(String path) {
        String decodedPath = IhpUtils.resolveTyp(path);
        List<NodeRelation> relations = relationService.listByPath(decodedPath);
        List<String> relationsPaths = relations.stream().map(NodeRelation::getRelatedPath).toList();
        Stream<StructureNodeDto> relatedNodes = fetchNodesByPathList(relationsPaths);

        return relatedNodes.toList();
    }

    public List<StructureNodeDto> getSnapshotEstablished(String pathPrefix) {

        return processGroupRepository.findAllEstablishedByPathPrefix(pathPrefix)
                .map(this::appendRelations)
                .map(ProcessGroupTypeNode::mapToDto)
                .collect(Collectors.toList());
    }

    public NodeStatus fetchParentStatusById(Integer parentId) {
        return processGroupRepository.fetchStatusById(parentId) == NodeStatus.UTKAST
                ? operationalAreaRepository.fetchStatusById(parentId)
                : processGroupRepository.fetchStatusById(parentId);
    }

    public String fetchParentPathById(int parentId) {
        return operationalAreaRepository.findById(parentId)
                .map(StructureTypeNode::getPath)
                .orElse(processGroupRepository.findById(parentId)
                        .map(StructureTypeNode::getPath).orElse(""));
    }

    public int countNodes(int parentId) {
        return listByParent(parentId).size() + processService.listByParent(parentId).size();

    }

    private void updatePath(ProcessGroupTypeNode node) {
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


    public void addPGNodeAndmerge(MergeProcessDto merge) {
        ProcessGroupTypeNode pgNode = add(merge.getPgNode().addMap(), EventAction.CREATE);
        childRepository.changeProcessParent(pgNode.getId(), merge.getProcessIds());
        processService.updatePathFromParent(pgNode.getPath(), pgNode.getId());
    }

    private ProcessGroupTypeNode appendRelations(ProcessGroupTypeNode node) {
        node.setRelations(relationService.listByPath(node.getPath()));
        return node;
    }

    void updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        processGroupRepository.updateStatusByPathPrefix(toStatus, fromStatus, pathPrefix, userId).forEach(this::appendRelations);
    }
}
