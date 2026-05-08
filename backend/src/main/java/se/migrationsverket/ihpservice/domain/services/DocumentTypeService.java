package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DocumentTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleStatus;
import se.migrationsverket.ihpservice.domain.DocumentTypeNode;
import se.migrationsverket.ihpservice.domain.StructureTypeNode;
import se.migrationsverket.ihpservice.domain.elements.Element;
import se.migrationsverket.ihpservice.domain.elements.ElementDocument;
import se.migrationsverket.ihpservice.domain.event.BatchStatusEvent;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.rules.Rule;
import se.migrationsverket.ihpservice.domain.services.elements.ElementService;
import se.migrationsverket.ihpservice.domain.services.rules.RuleService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.DocumentRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IssueRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
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
public class DocumentTypeService implements StructureNodeService<DocumentTypeNode, DocumentTypeNodeDto> {
    private final RequestContextHolder requestContextHolder;
    private final IssueRepository parentRepository;
    private final RuleService ruleService;
    private final DocumentRepository repository;
    private final HistoryService historyService;
    private final ElementService elementService;
    private final ApplicationEventPublisher eventPublisher;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    @Override
    public DocumentTypeNode add(DocumentTypeNode node, EventAction eventAction) {
        if (node.getPath() == null || node.getPath().isEmpty()) {
            if (newPathExists(node)) {
                throw new IllegalArgumentException(String.format(NAME_EXISTS, "ärende"));
            }
            updatePath(node);
        }

        boolean hasAssignedRule = node.hasValidAssignment();
        List<DocumentTypeNode> documentTypeNodes = repository.streamByParent(node.getIssuetypeId()).toList();
        node.setIndex(documentTypeNodes.size());

        DocumentTypeNode added = repository.add(node, getUserId());

        if (hasAssignedRule) {
            listHasDraftRules(node.getAssignedRules());
            ruleService.addRules(node.getAssignedRules(), added.getId(), added.getPath());
            added.setAssignedRules(node.getAssignedRules());
        }

        addElements(added, node.getAssignedElements());

        historyService.log(added.mapToDto(), eventAction, added.mapToDto().getNodeName(), getUserId());
        return added;
    }

    private void addElements(DocumentTypeNode node, List<Element> getAssignedElements) {
        if (!getAssignedElements.isEmpty()) {

            List<ElementDocument> connected = getAssignedElements.stream().map(element ->
                    element.mapToElementDocument(node.getIssuetypeId(), node.getPath())
            ).collect(Collectors.toList());
            elementService.connectDocuments(connected);
        }
    }

    @Override
    public DocumentTypeNode update(DocumentTypeNode node) {
        allowUpdate(node);
        try {
            node.hasValidAssignment();
        } catch (Exception e) {
            throw new PreconditionFailedException("Handling id " + node.getId() + " " + node.getName() + " " + e.getMessage());
        }

        listHasDraftRules(node.getAssignedRules());
        updatePathIfChanged(node);

        DocumentTypeNode updated = repository.update(node, getUserId());
        if (node.getAssignedElements() != null) {
            elementService.updateAssignedDocumentsElements(node.getAssignedElements(), node.getId(), node.getPath());
        }

        List<ElementDto> elements = elementService.getConnectedElementsForDocument(node.getId());

        ruleService.updateAssignedRules(node.getAssignedRules(), node.getId(), node.getPath());
        updated.setAssignedRules(node.getAssignedRules());
        updated.setAssignedElements(elements.stream().map(ElementDto::map).toList());
        historyService.log(updated.mapToDto(), EventAction.UPDATE, updated.mapToDto().getNodeName(), getUserId());
        return updated;
    }
    private void allowUpdate(final DocumentTypeNode node) {
        node.allowUpdate();
        if (fetch(node.getId()).stream().anyMatch(n -> !n.getStatus().equals(node.getStatus()))) {
            throw new UnsupportedOperationException("Inte tillåtet att ändra status vid uppdatering (PUT)");
        }
    }

    private void listHasDraftRules(List<Rule> rules) {
        if (rules != null && rules.stream().anyMatch(r -> ruleService.fetch(r.getId()).getStatus().equals(RuleStatus.DRAFT))) {
            throw new IllegalArgumentException("Regeln/reglerna som du försökte tilldela har status utkast");
        }
    }

    public void handleEstablish(String id, String correlationId) {
        // Fastställ handlingstyp och hantera den på samma sätt som batch status
        DocumentTypeNode node = fetch(Integer.parseInt(id)).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        List<Integer> changingNodes = new ArrayList<>();
        changingNodes.add(node.getId());
        batchUpdateStatus(changingNodes, NodeStatus.FASTSTALLD.toString(),EventAction.FASTSTALLD, correlationId);
    }

    @Override
    public void patchStatus(int id, NodeStatus toStatus, EventAction action) {
        DocumentTypeNode node = fetch(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.validateRequirements();

        node.setStatus(toStatus.toString());
        historyService.log(appendRulesAndElements(repository.patchStatus(node, getUserId())).mapToDto(), action, node.mapToDto().getNodeName(), getUserId());
    }

    @Override
    public void delete(int id) {
        DocumentTypeNode node = repository.findById(id).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        if (node.getStatus().equals(NodeStatus.UTKAST.toString())) {
            historyService.log(node.mapToDto(), EventAction.DELETE, node.mapToDto().getNodeName(), getUserId());
            ruleService.deleteAssignedRules(id);
            elementService.disconnectDocument(id);
            repository.delete(id);
        } else {
            throw new PreconditionFailedException(String.format(PC_DELETE_FAILED, id, node.getStatus()));
        }
    }

    @Override
    public boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus) {
        List<DocumentTypeNodeDto> children = listByParent(parentId);
        return childrenHasHigherStatus(children, parentStatus);
    }

    private boolean childrenHasHigherStatus(List<DocumentTypeNodeDto> children, NodeStatus parentStatus) {
        for (DocumentTypeNodeDto child : children) {
            if (child.getStatus().ordinal() > parentStatus.ordinal()) {
                return true;
            }
        }
        return false;
    }

    public boolean deleteChildren(int parentId, NodeStatus parentStatus) {
        List<DocumentTypeNodeDto> children = listByParent(parentId);
        if (!childrenHasHigherStatus(children, parentStatus)) {
            deleteChildren(children);
            return true;
        }
        return false;
    }

    private void deleteChildren(List<DocumentTypeNodeDto> children) {
        for (DocumentTypeNodeDto child : children) {
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
        DocumentTypeNode node = repository.findById(id).map(this::appendRulesAndElements).orElseThrow(() -> new IllegalArgumentException(String.format(NODE_NF, id)));
        node.copy(newParent, parentPath, partialCopy);
        DocumentTypeNode copiedNode = add(node, EventAction.COPY);
        ruleService.updateAssignedRules(node.getAssignedRules() == null ? new ArrayList<>() : node.getAssignedRules(), copiedNode.getId(), copiedNode.getPath());
    }

    @Override
    public boolean newPathExists(DocumentTypeNode node) {
        return repository.streamByParent(node.getIssuetypeId()).map(DocumentTypeNode::extractName).anyMatch(n -> n.equals(node.getModifiedName()));
    }

    @Override
    public void updatePathIfChanged(DocumentTypeNode node) {
        if (!node.getModifiedName().equals(node.extractName())) {
            if (newPathExists(node)) {
                throw new IllegalArgumentException(String.format(NAME_EXISTS, "ärende"));
            }
            node.updatePath();
        }
    }

    public void updateThisPath(DocumentTypeNode node, String newParentPath) {
        node.updatePath();
        node.updateFromParentPath(newParentPath);
        update(node);
    }

    @Override
    public void updatePathFromParent(String newParentPath, int parentId) {
        List<DocumentTypeNode> nodes = repository.streamByParent(parentId).toList();
        for (DocumentTypeNode node : nodes) {
            node.updateFromParentPath(newParentPath);
            update(node);
        }
    }

    @Override
    public List<DocumentTypeNodeDto> listByParent(Integer parentId) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return repository.streamByParent(parentId).map(this::appendRulesAndElements).peek(n -> n.setParentStatus(sts)).map(DocumentTypeNode::mapToDto).toList();
    }

    @Override
    public List<DocumentTypeNodeDto> listActiveByParentId(Integer parentId, Date date) {
        NodeStatus sts = fetchParentStatusById(parentId);
        return repository.streamActiveByParent(parentId, date).map(this::appendRulesAndElements).peek(n -> n.setParentStatus(sts)).map(DocumentTypeNode::mapToDto).toList();
    }

    @Override
    public List<DocumentTypeNodeDto> findAllByPathPrefix(String pathPrefix) {
        return repository.streamByPathPrefix(pathPrefix).map(DocumentTypeNode::mapToDto).toList();
    }

    @Override
    public Optional<DocumentTypeNode> fetch(int id) {
        Optional<DocumentTypeNode> optNode = repository.findById(id).map(this::appendRulesAndElements);
        if (optNode.isPresent()) {
            DocumentTypeNode node = optNode.get();
            node.setParentStatus(fetchParentStatusById(node.getIssuetypeId()));
            return Optional.of(node);
        }
        return Optional.empty();
    }

    public DocumentTypeNode appendRulesAndElements(DocumentTypeNode node) {
        List<ElementDto> elements = elementService.getConnectedElementsForDocument(node.getId());
        node.setAssignedElements(elements.stream().map(ElementDto::map).toList());
        node.setAssignedRules(ruleService.getRulesByDocId(node.getId()));
        return node;
    }

    public NodeStatus fetchParentStatusById(Integer parentId) {
        return parentRepository.fetchStatusById(parentId);
    }

    private void updatePath(DocumentTypeNode node) {
        if (node.getIssuetypeId() != null) {

            Optional<String> parentPath = parentRepository.findById(node.getIssuetypeId()).map(StructureTypeNode::getPath);
            if (parentPath.isPresent()) {
                String path = parentPath.get() + "/HT " + node.getModifiedName();
                node.setPath(path);
            }
        }
    }

    void updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        repository.updateStatusByPathPrefix(toStatus, fromStatus, pathPrefix, userId).forEach(this::appendRulesAndElements);
    }

    @Override
    public void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action, String correlationId) {
        String userId = getUserId();
        repository.patchStatuses(changingNodes, status, userId);
        eventPublisher.publishEvent(new BatchStatusEvent(changingNodes, action, getUserId(), NodeName.DOCUMENTNODE,correlationId));
    }

}