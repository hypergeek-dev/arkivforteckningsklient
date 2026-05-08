package se.migrationsverket.ihpservice.domain.event;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.services.HistoryService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.*;

@Component
@AllArgsConstructor
@Slf4j
public class BatchStatusEventListener {

    private final IssueRepository issueRepository;
    private final DocumentRepository documentRepository;
    private final ProcessRepository processRepository;
    private final ProcessGroupRepository processGroupRepository;
    private final OperationalAreaRepository operationalAreaRepository;
    private final HistoryService historyService;


    @Async
    @EventListener
    public void handleBatchStatusEvent(BatchStatusEvent event) {
        log.info("Processing batch status event asynchronously for {} nodes with action {}",
                event.getNodeIds().size(), event.getAction());

        try {
            if (event.getNodeName().equals(NodeName.ISSUENODE)) {
                issueRepository.findAllByIdIsInList(event.getNodeIds()).forEach(node -> {
                    StructureNodeDto dto = node.map().mapToDto();
                    historyService.log(dto, event.getAction(), dto.getNodeName(), event.getUserId());
                });
            } else if (event.getNodeName().equals(NodeName.DOCUMENTNODE)) {
                documentRepository.findAllByIdIsInList(event.getNodeIds()).forEach(node -> {
                    StructureNodeDto dto = node.map().mapToDto();
                    historyService.log(dto, event.getAction(), dto.getNodeName(), event.getUserId());
                });
            } else if (event.getNodeName().equals(NodeName.PROCESSNODE)) {
                processRepository.findAllByIdIsInList(event.getNodeIds()).forEach(node -> {
                    StructureNodeDto dto = node.map().mapToDto();
                    historyService.log(dto, event.getAction(), dto.getNodeName(), event.getUserId());
                });
            } else if (event.getNodeName().equals(NodeName.PGNODE)) {
                processGroupRepository.findAllByIdIsInList(event.getNodeIds()).forEach(node -> {
                    StructureNodeDto dto = node.map().mapToDto();
                    historyService.log(dto, event.getAction(), dto.getNodeName(), event.getUserId());
                });
            } else if (event.getNodeName().equals(NodeName.OANODE)) {
                operationalAreaRepository.findAllByIdIsInList(event.getNodeIds()).forEach(node -> {
                    StructureNodeDto dto = node.map().mapToDto();
                    historyService.log(dto, event.getAction(), dto.getNodeName(), event.getUserId());
                });
            }

            log.info("Successfully completed batch status logging for {} nodes", event.getNodeIds().size());
        } catch (Exception e) {
            log.error("Error processing batch status logging", e);
        }
    }

}
