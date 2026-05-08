package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IssueTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.domain.IssueTypeNode;
import se.migrationsverket.ihpservice.domain.ProcessTypeNode;
import se.migrationsverket.ihpservice.domain.event.BatchStatusEvent;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.domain.services.elements.ElementService;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IssueRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.*;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class IssueTypeService implements StructureNodeService<IssueTypeNode, IssueTypeNodeDto> {
    private final RequestContextHolder requestContextHolder;
    private final ProcessRepository parentRepository;
    private final IssueRepository repository;
    private final DocumentTypeService documentTypeService;
    private final HistoryService historyService;
    private final NodeRelationService nodeRelationService;
    private final ElementService elementService;
    private final ApplicationEventPublisher eventPublisher;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    @Override

    public IssueTypeNode add(IssueTypeNode node, EventAction eventAction) {
        if (node.pathIsNullOrEmpty()) {
            if (newPathExists(node)) {
                throw new IllegalArgumentException(String.format(NAME_EXISTS, "process"));
            }
            setPathAndNumber(node);
        }
        List<NodeRelation> relations = nodeRelationService.handleRelationsFromNodes(node,
                IssueTypeNode::getRelations,
                IssueTypeNode::getPath);

        List<IssueTypeNode> issueTypeNodes = repository.streamByParent(node.getProcessId()).toList();
        node.setIndex(issueTypeNodes.size());

        IssueTypeNode added = repository.add(node, getUserId());
        added.setRelations(relations);
        IssueTypeNodeDto dto = added.mapToDto();
        historyService.log(dto, eventAction, dto.getNodeName(), getUserId());
        return added;
    }


    public Optional<IssueTypeNode> findById(Integer id) {
        return repository.findById(id);
    }


    @Override
    public IssueTypeNode update(IssueTypeNode incoming) {
        Optional<IssueTypeNode> currentNode = fetch(incoming.getId());
        currentNode.ifPresent(current -> current.validatePut(incoming));

        if (incoming.allowedStatuses(NodeStatus.UTKAST, NodeStatus.KLAR)) {
            updatePathIfChanged(incoming);
            IssueTypeNode updated = repository.update(incoming, getUserId());
            updated.setRelations(incoming.getRelations());
            if (incoming.getAssignedElements() != null) {
                elementService.updateAssignedIssueElements(incoming.getAssignedElements(), incoming.getId(), incoming.getPath());
            }
            // if name path changed we need to update path on all relations
            if (currentNode.isPresent() && !incoming.getPath().equals(currentNode.get().getPath())) {
                // change all paths where the node is the relator
                List<NodeRelation> updatedRelations = nodeRelationService.updatePaths(incoming.getRelations(), incoming.getPath());
                updated.setRelations(updatedRelations);
                // SIDE EFFECT - change all paths where node is being related to
                nodeRelationService.updateRelatedPaths(currentNode.get().getPath(), incoming.getPath());
            }
            nodeRelationService.update(currentNode.map(IssueTypeNode::getRelations).orElse(new ArrayList<>()), updated.getRelations());
            appendRelationsAndElements(updated);
            historyService.log(updated.mapToDto(), EventAction.UPDATE, updated.mapToDto().getNodeName(), getUserId());
            return updated;
        }
        throw new PreconditionFailedException("Noden du försöker uppdatera har status fastställd");
    }

    public void handleEstablish(String id, String correlationId) {
        // call pathStatus
        IssueTypeNode node = fetch(Integer.parseInt(id)).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        List<Integer> changingNodes = new ArrayList<>();
        changingNodes.add(node.getId());
        batchUpdateStatus(changingNodes, NodeStatus.FASTSTALLD.toString(),EventAction.FASTSTALLD, correlationId);
    }

    @Override
    public void patchStatus(int id, NodeStatus toStatus, EventAction action) {
        IssueTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.validateRequirements();

        node.setStatus(toStatus.toString());
        historyService.log(repository.patchStatus(node, getUserId()).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
    }

    @Override
    public void delete(int id) {
        IssueTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        if (node.getStatus().equals(NodeStatus.UTKAST.toString())) {
            if (!documentTypeService.deleteChildren(id, NodeStatus.getNodeStatus(node.getStatus()))) {
                throw new PreconditionFailedException("Nod har barn som inte kunde raderas - förmodligen högre status än deras förälder");
            }
            historyService.log(node.mapToDto(), EventAction.DELETE, node.mapToDto().getNodeName(), getUserId());
            elementService.disconnectIssue(id);
            nodeRelationService.deleteByPath(node.getPath());
            repository.delete(id);
        } else {
            throw new PreconditionFailedException(String.format(PC_DELETE_FAILED, id, node.getStatus()));
        }
    }

    @Override
    public boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus) {
        List<IssueTypeNodeDto> children = listByParent(parentId);
        return childrenHasHigherStatus(children, parentStatus);
    }

    private boolean childrenHasHigherStatus(List<IssueTypeNodeDto> children, NodeStatus parentStatus) {
        for (IssueTypeNodeDto child : children) {
            if (child.getStatus().ordinal() > parentStatus.ordinal()) {
                return true;
            }
            if (documentTypeService.childrenHasHigherStatus(Integer.parseInt(child.getId()), parentStatus)) {
                return true;
            }
        }
        return false;
    }


    public boolean deleteChildren(int parentId, NodeStatus parentStatus) {
        List<IssueTypeNodeDto> children = listByParent(parentId);
        if (!childrenHasHigherStatus(children, parentStatus)) {
            deleteChildren(children);
            return true;
        }
        return false;
    }

    private void deleteChildren(List<IssueTypeNodeDto> children) {
        for (IssueTypeNodeDto child : children) {
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
        IssueTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.copy(newParent, parentPath, partialCopy);
        IssueTypeNode copy = add(node, EventAction.COPY);
        if (Boolean.TRUE.equals(copyStruct)) {
            documentTypeService.copyChildren(node.getId(), copy.getId(), copy.getPath(), partialCopy);
        }
    }

    @Override
    public boolean newPathExists(IssueTypeNode node) {
        return repository.streamByParent(node.getProcessId()).map(IssueTypeNode::extractName).anyMatch(n -> n.equals(node.getModifiedName()));
    }

    @Override
    public void updatePathIfChanged(IssueTypeNode node) {
        if (!node.getModifiedName().equals(node.extractName())) {
            if (newPathExists(node)) {
                throw new IllegalArgumentException(String.format(NAME_EXISTS, "process"));
            }
            node.updatePath();
            documentTypeService.updatePathFromParent(node.getPath(), node.getId());
        }
    }


    public void updateThisPathAndChildren(IssueTypeNode node, String newParentPath) {
        node.updatePath();
        node.updateFromParentPath(newParentPath);
        update(node);
        documentTypeService.updatePathFromParent(node.getPath(), node.getId());
    }

    @Override
    public void updatePathFromParent(String newParentPath, int parentId) {
        List<IssueTypeNode> nodes = repository.streamByParent(parentId).toList();
        for (IssueTypeNode node : nodes) {
            node.updateFromParentPath(newParentPath);
            node.setNumber(newParentPath.substring(newParentPath.lastIndexOf('/') + 1));
            update(node);
            documentTypeService.updatePathFromParent(node.getPath(), node.getId());
        }
    }

    @Override
    public List<IssueTypeNodeDto> listByParent(Integer parentId) {
        NodeStatus sts = parentRepository.fetchStatusById(parentId);
        return repository.streamByParent(parentId).map(this::appendRelationsAndElements).peek(n -> n.setParentStatus(sts)).map(IssueTypeNode::mapToDto).toList();
    }


    public Stream<IssueTypeNode> streamByParent(Integer parentId) {
        return repository.streamByParent(parentId);
    }

    @Override
    public List<IssueTypeNodeDto> listActiveByParentId(Integer parentId, Date date) {
        NodeStatus sts = parentRepository.fetchStatusById(parentId);
        return repository.streamActiveByParent(parentId, date).map(this::appendRelationsAndElements).peek(n -> n.setParentStatus(sts)).map(IssueTypeNode::mapToDto).toList();
    }

    @Override
    public List<IssueTypeNodeDto> findAllByPathPrefix(String pathPrefix) {
        return repository.streamByPathPrefix(pathPrefix).map(IssueTypeNode::mapToDto).toList();
    }

    @Override
    public Optional<IssueTypeNode> fetch(int id) {

        Optional<IssueTypeNode> optNode = repository.findById(id).map(this::appendRelationsAndElements);
        if (optNode.isPresent()) {
            IssueTypeNode node = optNode.get();
            node.setParentStatus(parentRepository.fetchStatusById(node.getProcessId()));
            return Optional.of(node);
        }

        return Optional.empty();
    }

    private void setPathAndNumber(IssueTypeNode node) {
        if (node.getProcessId() != null) {
            Optional<ProcessTypeNode> optNode = parentRepository.findById(node.getProcessId());
            if (optNode.isPresent()) {
                String parentPath = optNode.get().getPath();
                String path = parentPath + "/ÄT " + node.getModifiedName();
                node.setPath(path);

                String number = parentPath.substring(parentPath.lastIndexOf('/') + 1);
                node.setNumber(number);
            }
        }
    }

    private Stream<IssueTypeNodeDto> fetchNodesByPathList(List<String> paths) {
        return repository.streamIssuesByPaths(paths).map(IssueTypeNode::mapToDto);
    }

    public List<IssueTypeNodeDto> fetchRelationNodesByOwnerPath(String path) {
        String decodedPath = URLDecoder.decode(path, StandardCharsets.UTF_8);
        List<NodeRelation> relations = nodeRelationService.listByPath(decodedPath);
        List<String> relationsPaths = relations.stream().map(NodeRelation::getRelatedPath).toList();

        return fetchNodesByPathList(relationsPaths).toList();
    }

    private IssueTypeNode appendRelationsAndElements(IssueTypeNode node) {
        node.setRelations(nodeRelationService.listByPath(node.getPath()));
        List<ElementDto> elements = elementService.getConnectedElementsForIssue(node.getId());
        node.setAssignedElements(elements.stream().map(ElementDto::map).toList());
        return node;
    }

    void updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        repository.updateStatusByPathPrefix(toStatus, fromStatus, pathPrefix, userId).forEach(this::appendRelationsAndElements);
    }

    @Override
    public void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action, String correlationId) {
        repository.patchStatuses(changingNodes, status);
        eventPublisher.publishEvent(new BatchStatusEvent(changingNodes, action, getUserId(), NodeName.ISSUENODE, correlationId));
    }
}
