package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.api.rest.v1.dto.*;
import se.migrationsverket.ihpservice.domain.NodeTypeComment;
import se.migrationsverket.ihpservice.domain.event.EstablishEvent;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class BulkUpdateService {
    private final ApplicationEventPublisher eventPublisher;
    ClassificationStructureTypeService csService;
    OperationalAreaTypeService oaService;
    ProcessGroupTypeService pgService;
    ProcessTypeService processService;
    IssueTypeService issueService;
    DocumentTypeService documentService;
    NodeTypeCommentService nodeTypeCommentService;

    public void batchUpdateStatusToDraft(BulkStatusChangeToDraftDto draftNodesAndComment, String correlationId) {
        if (draftNodesAndComment.getComment() != null && draftNodesAndComment.getComment().length() != 0) {
            draftNodesAndComment.getNodesToChange().forEach(node -> nodeTypeCommentService.add(NodeTypeComment.builder()
                    .nodeId(node.getNodeId())
                    .comment(draftNodesAndComment.getComment())
                    .build()
            ));
        }
        batchUpdateStatus(draftNodesAndComment.getNodesToChange(), NodeStatus.UTKAST, correlationId);
    }

    public void batchUpdateStatus(List<BulkStatusChangeNodeDto> nodesToUpdate, NodeStatus status, String correlationId) {

        String ksPath = nodesToUpdate.get(0).getPath().split("/")[1];
        ClassificationStructureTypeNodeDto classificationStructureTypeNodeDto = csService.findByPath("/" + ksPath).orElseThrow();

        AtomicBoolean establishIHP = new AtomicBoolean(false);

        Map<Object, List<BulkStatusChangeNodeDto>> nodeGroupsByType = nodesToUpdate.stream().collect(Collectors.groupingBy(BulkStatusChangeNodeDto::getNodeType));
        nodeGroupsByType.forEach((key, value) -> {
            List<Integer> list = value.stream().map(BulkStatusChangeNodeDto::getNodeId).toList();

            if (key.equals(NodeName.OANODE.getValue()) && !status.equals(NodeStatus.FASTSTALLD)) {
                oaService.batchUpdateStatus(list, status.toString(), getEventActionFromStatus(status), correlationId);
            }

            if (key.equals(NodeName.PGNODE.getValue()) && !status.equals(NodeStatus.FASTSTALLD)) {
                pgService.batchUpdateStatus(list, status.toString(), getEventActionFromStatus(status), correlationId);
            }

            if (key.equals(NodeName.PROCESSNODE.getValue()) && !status.equals(NodeStatus.FASTSTALLD)) {
                processService.batchUpdateStatus(list, status.toString(), getEventActionFromStatus(status), correlationId);
            }

            if (key.equals(NodeName.DOCUMENTNODE.getValue())) {
                documentService.batchUpdateStatus(list, status.toString(), getEventActionFromStatus(status), correlationId);
                establishIHP.set(status.equals(NodeStatus.FASTSTALLD));
            }

            if (key.equals(NodeName.ISSUENODE.getValue())) {
                issueService.batchUpdateStatus(list, status.toString(), getEventActionFromStatus(status), correlationId);
                establishIHP.set(status.equals(NodeStatus.FASTSTALLD));
            }

        });
        if (establishIHP.get()) {
            EstablishEvent event = new EstablishEvent(
                    classificationStructureTypeNodeDto.getPath(),
                    Integer.parseInt(classificationStructureTypeNodeDto.getId()),
                    correlationId);
            eventPublisher.publishEvent(event);
        }

    }

    private EventAction getEventActionFromStatus(NodeStatus nodeStatus) {
        switch (nodeStatus) {
            case FASTSTALLD -> {
                return EventAction.FASTSTALLD;
            }
            case GODKAND -> {
                return EventAction.GODKAND;
            }
            case KLAR -> {
                return EventAction.KLAR;
            }
            default -> {
                return EventAction.UTKAST;
            }
        }
    }
}
