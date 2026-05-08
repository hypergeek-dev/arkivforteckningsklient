package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.api.rest.v1.dto.*;
import se.migrationsverket.ihpservice.domain.*;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.function.ToIntFunction;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UTKAST;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class TreeService {
    private static final Supplier<IllegalArgumentException> forbiddenDestination = () -> new IllegalArgumentException("Otillåten destination för denna nodtyp");
    private static final Supplier<IllegalArgumentException> forbiddenChildStatus = () -> new IllegalArgumentException("Något av barnen är inte i status utkast");
    private static final Supplier<IllegalArgumentException> forbiddenNodeStatus = () -> new IllegalArgumentException("Noden har inte status utkast");
    private static final Supplier<IllegalArgumentException> hasBeenEstablished = () -> new IllegalArgumentException("Strukturenheten har varit fastställd tidigare");
    private static final Supplier<NotFoundException> notFoundParent = () -> new NotFoundException("Hittar inte förälder");
    private final OperationalAreaTypeService oaTypeService;
    private final ProcessGroupTypeService pgTypeService;
    private final ProcessTypeService processTypeService;
    private final IssueTypeService issueTypeService;
    private final DocumentTypeService documentTypeService;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final ClassificationStructureTypeService classificationStructureTypeService;
    private final RequestContextHolder requestContextHolder;
    private final ModelSnapshotEstablishedService establishedService;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    private void updatePGChildren(Integer parent, String parentPath, DroppedNodeDto dropped, StructureTypeNode structureTypeNode) {
        int nodeId = dropped.getNode().getId();
        int moveIndex = dropped.getTo().getIndex();

        Stream<ProcessGroupTypeNode> processGroupTypeNodeStream = pgTypeService.listProcessGroupTypeNodeByParent(parent);
        Stream<ProcessTypeNode> processTypeNodeStream = processTypeService.listProcessTypeNodeByParent(parent);

        List<StructureTypeNode> list = Stream.concat(processGroupTypeNodeStream, processTypeNodeStream)
                .filter(n -> n.getId() != nodeId)
                .sorted(Comparator.comparingInt((ToIntFunction<StructureTypeNode>) StructureTypeNode::extractPartialPath))
                .collect(Collectors.toList());

        list.add(moveIndex, structureTypeNode);

        for (int i = 0; i < list.size(); i++) {
            StructureTypeNode node = list.get(i);
            updatePathAndChildren(parentPath, i + 1, node);
        }

    }


    private void updatePathAndChildren(String parentPath, int newIndex, StructureTypeNode node) {
        node.setPartialPath(newIndex);
        if (node.getNodeName() == NodeName.PGNODE) {
            ProcessGroupTypeNode pg = (ProcessGroupTypeNode) node;
            pgTypeService.updateThisPathAndChildren(pg, parentPath);
        } else if (node.getNodeName() == NodeName.PROCESSNODE) {
            ProcessTypeNode processTypeNode = (ProcessTypeNode) node;
            processTypeService.updateThisPathAndChildren(processTypeNode, parentPath);
        }

    }


    private void moveSiblings(DroppedNodeDto dropped, StructureTypeNode node) {
        int parentId = dropped.getTo().getId();
        NodeName toNodeName = NodeName.getNodename(dropped.getTo().getNodeName());
        if (toNodeName == NodeName.OANODE) {
            OperationalAreaTypeNode oa = oaTypeService.fetch(parentId).orElseThrow(notFoundParent);
            updatePGChildren(parentId, oa.getPath(), dropped, node);

        } else if (toNodeName == NodeName.PGNODE) {
            ProcessGroupTypeNode pg = pgTypeService.fetch(parentId).orElseThrow(notFoundParent);
            updatePGChildren(parentId, pg.getPath(), dropped, node);
        }
    }

    private StructureTypeNode getParent(DroppedNodeDto dropped) {
        int parentId = dropped.getTo().getId();
        NodeName droppedNodeName = NodeName.getNodename(dropped.getTo().getNodeName());

        return switch (droppedNodeName) {
            case PGNODE -> pgTypeService.fetch(parentId).map(s -> (StructureTypeNode) s).orElseThrow(notFoundParent);
            case PROCESSNODE -> processTypeService.fetch(parentId).map(s -> (StructureTypeNode) s).orElseThrow(notFoundParent);
            case ISSUENODE -> issueTypeService.fetch(parentId).map(s -> (StructureTypeNode) s).orElseThrow(notFoundParent);
            case OANODE -> oaTypeService.fetch(parentId).map(s -> (StructureTypeNode) s).orElseThrow(notFoundParent);
            default -> null;
        };
    }

    public void dropNode(DroppedNodeDto dropped) {
        NodeName droppedNodeName = NodeName.getNodename(dropped.getNode().getNodeName());
        Supplier<IllegalArgumentException> noPath = () -> new IllegalArgumentException("No parent path found");

        StructureTypeNode parent = getParent(dropped);
        if (parent == null) {
            throw new IllegalArgumentException("Hittar ingen förälder med id " + dropped.getTo().getId());
        }

        switch (droppedNodeName) {
            case PGNODE -> {
                ProcessGroupTypeNode pgNode = validatePgMove(dropped);
                String pgParentPath = oaTypeService.fetch(parent.getId()).map(OperationalAreaTypeNode::getPath)
                        .or(() -> pgTypeService.fetch(parent.getId()).map(ProcessGroupTypeNode::getPath)).orElseThrow(noPath);
                moveSiblings(dropped, pgNode);
                pgNode.setParentId(parent.getId());
                pgTypeService.updateThisPathAndChildren(pgNode, pgParentPath);
                publishEvent(pgNode, EventAction.MOVE, parent);
            }
            case PROCESSNODE -> {
                ProcessTypeNode processNode = validateProcessMove(dropped);
                processNode.setParentId(parent.getId());
                String processParentPath = pgTypeService.fetch(parent.getId()).map(ProcessGroupTypeNode::getPath)
                        .or(() -> oaTypeService.fetch(parent.getId()).map(OperationalAreaTypeNode::getPath)).orElseThrow(noPath);
                moveSiblings(dropped, processNode);
                processNode.setParentId(parent.getId());
                processTypeService.updateThisPathAndChildren(processNode, processParentPath);
                publishEvent(processNode, EventAction.MOVE, parent);
            }
            case ISSUENODE -> {
                IssueTypeNode issueNode = validateIssueMove(dropped);
                List<IssueTypeNode> list = issueTypeService.listByParent(parent.getId()).stream()
                        .map(IssueTypeNodeDto::map)
                        .filter(p -> !p.getId().equals(issueNode.getId()))
                        .sorted(Comparator.comparingInt(IssueTypeNode::getIndex))
                        .collect(Collectors.toList());

                issueNode.setProcessId(parent.getId());
                String issueParentPath = processTypeService.fetch(parent.getId()).map(ProcessTypeNode::getPath).orElseThrow(noPath);
                int toIndex = list.size() < dropped.getTo().getIndex() ? list.size() : dropped.getTo().getIndex();
                issueNode.setLocalPath(issueNode.extractLocalPath() + "." + toIndex);
                list.add(toIndex, issueNode);

                for (int i = 0; i < list.size(); i++) {
                    IssueTypeNode node = list.get(i);
                    node.setIndex(i);
                    issueTypeService.update(node);
                }

                issueTypeService.updateThisPathAndChildren(issueNode, issueParentPath);
                publishEvent(issueNode, EventAction.MOVE, parent);
            }
            case DOCUMENTNODE -> {
                DocumentTypeNode documentNode = validateDocumentMove(dropped);
                List<DocumentTypeNode> doclist = documentTypeService.listByParent(parent.getId()).stream()
                        .map(DocumentTypeNodeDto::map)
                        .filter(p -> !p.getId().equals(documentNode.getId()))
                        .sorted(Comparator.comparingInt(DocumentTypeNode::getIndex))
                        .collect(Collectors.toList());
                int toIndex = doclist.size() < dropped.getTo().getIndex() ? doclist.size() : dropped.getTo().getIndex();
                documentNode.setLocalPath(documentNode.extractLocalPath() + "." + toIndex);
                documentNode.setIssuetypeId(parent.getId());
                doclist.add(toIndex, documentNode);
                for (int i = 0; i < doclist.size(); i++) {
                    DocumentTypeNode node = doclist.get(i);
                    node.setIndex(i);
                    documentTypeService.appendRulesAndElements(node);
                    documentTypeService.update(node);
                }
                documentTypeService.appendRulesAndElements(documentNode);
                documentTypeService.updateThisPath(documentNode, parent.getPath());
                publishEvent(documentNode, EventAction.MOVE, parent);
            }
            default -> {
            }
        }

    }


    private ProcessGroupTypeNode validatePgMove(DroppedNodeDto dropped) {

        // Kontrollera att noden har status utkast
        ProcessGroupTypeNode pgNode = pgTypeService.fetch(dropped.getNode().getId())
                .filter(n -> UTKAST.equalsIgnoreCase(n.getStatus()))
                .orElseThrow(forbiddenNodeStatus);

        // Kontrollera att adressen är godkänd
        if (!NodeName.validDrop(NodeName.PGNODE, NodeName.getNodename(dropped.getTo().getNodeName()))) {
            throw forbiddenDestination.get();
        }

        if (!structureIsOk(pgNode.getPath())) {
            throw forbiddenChildStatus.get();
        }

        if (hasBeenEstablished(pgNode.getId(), pgNode.getPath())) {
            throw hasBeenEstablished.get();
        }


        return pgNode;
    }

    private boolean hasBeenEstablished(Integer id, String path) {
        String csPath = path.substring(0, 37);
        Optional<ClassificationStructureTypeNodeDto> optionalCS = classificationStructureTypeService.findByPath(csPath);

        if (optionalCS.isPresent()) {
            ClassificationStructureTypeNodeDto cs = optionalCS.get();
            List<ModelSnapshotEstablished> list = establishedService.fetchAllEstablished(Integer.parseInt(cs.getId()));
            List<Integer> ids = list.stream().map(modelSnapshotEstablished -> {
                for (int i = 0; i < modelSnapshotEstablished.getModelb().length(); i++) {
                    JSONObject o = modelSnapshotEstablished.getModelb().getJSONObject(i);
                    if (o.getInt("id") == id) {
                        return id;
                    }
                }
                return 0;
            }).toList();
            return ids.contains(id);
        }
        return false;
    }

    private ProcessTypeNode validateProcessMove(DroppedNodeDto dropped) {

        ProcessTypeNode processNode = processTypeService.fetch(dropped.getNode().getId()).filter(n -> UTKAST.equalsIgnoreCase(n.getStatus()))
                .orElseThrow(forbiddenNodeStatus);

        if (!NodeName.validDrop(NodeName.PROCESSNODE, NodeName.getNodename(dropped.getTo().getNodeName()))) {
            throw forbiddenDestination.get();
        }
        if (hasBeenEstablished(processNode.getId(), processNode.getPath())) {
            throw hasBeenEstablished.get();
        }

        return processNode;
    }

    private IssueTypeNode validateIssueMove(DroppedNodeDto dropped) {

        IssueTypeNode issueNode = issueTypeService.fetch(dropped.getNode().getId())
                .filter(n -> UTKAST.equalsIgnoreCase(n.getStatus()))
                .orElseThrow(forbiddenNodeStatus);

        if (!NodeName.validDrop(NodeName.ISSUENODE, NodeName.getNodename(dropped.getTo().getNodeName()))) {
            throw forbiddenDestination.get();
        }

        if (!structureIsOk(issueNode.getPath())) {
            throw forbiddenChildStatus.get();
        }
        return issueNode;
    }

    private DocumentTypeNode validateDocumentMove(DroppedNodeDto dropped) {

        DocumentTypeNode documentNode = documentTypeService.fetch(dropped.getNode().getId())
                .filter(n -> UTKAST.equalsIgnoreCase(n.getStatus()))
                .orElseThrow(forbiddenNodeStatus);

        if (!NodeName.validDrop(NodeName.DOCUMENTNODE, NodeName.getNodename(dropped.getTo().getNodeName()))) {
            throw forbiddenDestination.get();
        }
        return documentNode;
    }

    private boolean structureIsOk(String path) {
        return classificationStructureTypeService.wholeStructureContainsOnly("utkast", path);
    }

    public <T extends StructureTypeNode> void publishEvent(T node, EventAction eventAction, T parentNode) {
        IhpEventLoggEvent eventLog = new IhpEventLoggEvent(this);
        eventLog.setAction(eventAction.name())
                .setDescription(eventAction.getDescription())
                .setUserId(getUserId())
                .setObjectName(node.extractLocalPath() + " in under " + parentNode.extractLocalPath())
                .setObjectId(node.getUuid())
                .setType(node.getNodeName().getValue())
                .setCreated(new Date())
                .setModelId(node.getPath());
        applicationEventPublisher.publishEvent(eventLog);
    }


}
