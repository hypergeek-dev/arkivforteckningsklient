package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DocumentTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.services.DocumentTypeService;
import se.migrationsverket.ihpservice.support.events.EventAction;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.CORRELATION_ID;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app/documentnode"})
public class DocumentController {
    private final DocumentTypeService service;

    @PostMapping(value = "/")
    public DocumentTypeNodeDto addDocumentNode(@RequestBody DocumentTypeNodeDto node) {
        return service.add(node.addMap(), EventAction.CREATE).mapToDto();
    }

    @PutMapping(value = "/")
    public DocumentTypeNodeDto updateDocumentNode(@RequestBody DocumentTypeNodeDto node) {
        return service.update(node.map()).mapToDto();
    }

    
    @PatchMapping(value = "/{id}/established")
    public void establishDocumentNode(@PathVariable String id, @RequestHeader(CORRELATION_ID) String correlationId) {
        service.handleEstablish(id, correlationId);
    }

    
    @PatchMapping(value = "/{id}/approved")
    public void approveDocumentNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.GODKAND, EventAction.GODKAND);
    }


    @PatchMapping(value = "/{id}/draft")
    public void draftDocumentNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.UTKAST, EventAction.UTKAST);
    }


    @PatchMapping(value = "/{id}/ready")
    public void readyDocumentNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.KLAR, EventAction.KLAR);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteDocumentNode(@PathVariable String id) {
        service.delete(Integer.parseInt(id));
    }

    @PostMapping(value = "/{id}/{copyStruct}")
    public void copyDocumentTypeNode(@PathVariable String id, @PathVariable Boolean copyStruct) {
        service.copy(Integer.parseInt(id), copyStruct);
    }

}
