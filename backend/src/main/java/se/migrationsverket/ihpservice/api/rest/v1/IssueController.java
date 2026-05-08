package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.FetchArendeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IssueTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IssueTypeNodeWithDocumentDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.services.IssueTypeService;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.EstablishedIssueRepository;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.List;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.CORRELATION_ID;


@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app"})
public class IssueController {
    private final IssueTypeService service;
    EstablishedIssueRepository establishedRepo;

    @GetMapping(value = "/issuenode/{path}/relations")
    public List<IssueTypeNodeDto> fetchRelationNodesByOwnerPath(@PathVariable String path) {
        return service.fetchRelationNodesByOwnerPath(path);
    }

    @GetMapping("/issuenodes/active")
    public List<IssueTypeNodeDto> fetchActiveIssueNodes() {
        return establishedRepo.getActiveIssueNodes();
    }

    @PostMapping(value = "/issuenode/path", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<IssueTypeNodeWithDocumentDto> getIssueByPathWithDocuments(
            @RequestBody FetchArendeDto fetchDto) {

        return new ResponseEntity<>(establishedRepo.getIssueByPathWithDocuments(fetchDto.getArendetyp()), HttpStatus.OK);
    }


    @PostMapping(value = "/issuenode")
    public IssueTypeNodeDto addErrandNode(@RequestBody IssueTypeNodeDto node) {
        return service.add(node.addMap(), EventAction.CREATE).mapToDto();
    }

    @PutMapping(value = "/issuenode")
    public IssueTypeNodeDto updateIssueNode(@RequestBody IssueTypeNodeDto node) {
        return service.update(node.map()).mapToDto();
    }

    
    @PatchMapping(value = "/issuenode/{id}/established")
    public void establishIssueNode(@PathVariable String id, @RequestHeader(CORRELATION_ID) String correlationId) {
        service.handleEstablish(id, correlationId);
    }

    
    @PatchMapping(value = "/issuenode/{id}/approved")
    public void approveIssueNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.GODKAND, EventAction.GODKAND);
    }


    @PatchMapping(value = "/issuenode/{id}/ready")
    public void readyIssueNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.KLAR, EventAction.KLAR);
    }


    @PatchMapping(value = "/issuenode/{id}/draft")
    public void draftIssueNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.UTKAST, EventAction.UTKAST);
    }

    @DeleteMapping(value = "/issuenode/{id}")
    public void deleteIssueNode(@PathVariable String id) {
        service.delete(Integer.parseInt(id));
    }

    @PostMapping(value = "/issuenode/{id}/{copyStruct}")
    public void copyIssueNode(@PathVariable String id, @PathVariable Boolean copyStruct) {
        service.copy(Integer.parseInt(id), copyStruct);
    }


}
