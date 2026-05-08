package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeTypeCommentDto;
import se.migrationsverket.ihpservice.domain.*;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.NodeTypeCommentRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class NodeTypeCommentService {
    private final RequestContextHolder requestContextHolder;
    private final ApplicationEventPublisher applicationEventPublisher;
    ClassificationStructureTypeService csService;
    NodeTypeCommentRepository repository;
    OperationalAreaTypeService oaService;
    ProcessGroupTypeService pgService;
    ProcessTypeService processService;
    IssueTypeService issueTypeService;
    DocumentTypeService documentTypeService;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    public NodeTypeComment add(NodeTypeComment nodeTypeComment) {
        Optional<? extends StructureTypeNode> node = getNode(nodeTypeComment.getNodeId());
        if (node.isPresent()) {
            NodeTypeComment comment = repository.add(nodeTypeComment, getUserId());
            publishCommentEvent(comment, node.get(), getUserId());
            return comment;
        }
        return null;
    }

    public Optional<NodeTypeComment> fetch(int id) {
        return repository.findById(id);
    }

    public void delete(int id) {
        repository.delete(id);
    }

    public List<NodeTypeCommentDto> listByNodeId(Integer nodeId) {
        return repository.streamAllByNodeId(nodeId).map(NodeTypeComment::mapToDto).toList();
    }

    public Optional<? extends StructureTypeNode> getNode(Integer nodeId) {
        Optional<DocumentTypeNode> doc = documentTypeService.fetch(nodeId);
        if (doc.isPresent()) {
            return doc;
        }
        Optional<IssueTypeNode> issue = issueTypeService.fetch(nodeId);
        if (issue.isPresent()) {
            return issue;
        }
        Optional<ProcessTypeNode> process = processService.fetch(nodeId);
        if (process.isPresent()) {
            return process;
        }
        Optional<ProcessGroupTypeNode> pg = pgService.fetch(nodeId);
        if (pg.isPresent()) {
            return pg;
        }
        Optional<OperationalAreaTypeNode> oa = oaService.fetch(nodeId);
        if (oa.isPresent()) {
            return oa;
        }
        return csService.fetch(nodeId);
    }

    private void publishCommentEvent(NodeTypeComment comment, StructureTypeNode node, String userId) {
        IhpEventLoggEvent eventLog = new IhpEventLoggEvent(this);
        eventLog.setAction(EventAction.COMMENT.name())
                .setDescription(EventAction.COMMENT.getDescription())
                .setUserId(userId)
                .setObjectName(comment.getComment())
                .setObjectId(node.getUuid())
                .setType(getNodeName(node))
                .setCreated(new Date())
                .setModelId(node.getPath())
                .setHistoryId(null);
        applicationEventPublisher.publishEvent(eventLog);

    }

    private String getNodeName(StructureTypeNode node) {
        if (node instanceof DocumentTypeNode) {
            return NodeName.DOCUMENTNODE.getValue();
        } else if (node instanceof IssueTypeNode) {
            return NodeName.ISSUENODE.getValue();
        } else if (node instanceof ProcessTypeNode) {
            return NodeName.PROCESSNODE.getValue();
        } else if (node instanceof ProcessGroupTypeNode) {
            return NodeName.PGNODE.getValue();
        } else if (node instanceof OperationalAreaTypeNode) {
            return NodeName.OANODE.getValue();
        }
        return NodeName.CSNODE.getValue();
    }
}
