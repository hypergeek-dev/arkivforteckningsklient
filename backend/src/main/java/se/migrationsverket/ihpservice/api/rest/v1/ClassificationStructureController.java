package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ClassificationStructureTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.domain.services.ClassificationStructureTypeService;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.List;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app"})
public class ClassificationStructureController {
    private final ClassificationStructureTypeService service;

    @GetMapping(value = "/csnode/{id}")
    public ResponseEntity<ClassificationStructureTypeNodeDto> fetchClassificationStructureNode(@PathVariable String id) {
        Optional<ClassificationStructureTypeNode> optNode = service.fetch(Integer.parseInt(id));

        return optNode.map(node -> ResponseEntity.ok().body(node.mapToDto()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping(value = "/csnodes")
    public List<ClassificationStructureTypeNodeDto> fetchCsNodes() {
        return service.list();
    }

    
    @PostMapping(value = "/csnode")
    public ClassificationStructureTypeNodeDto addCsNode(@RequestBody ClassificationStructureTypeNodeDto node) {
        return service.add(node.addMap(), EventAction.CREATE).mapToDto();
    }

    
    @PutMapping(value = "/csnode")
    public ClassificationStructureTypeNodeDto updateCsNode(@RequestBody ClassificationStructureTypeNodeDto node) {
        return service.update(node.map()).mapToDto();
    }

    
    @PatchMapping(value = "/csnode/{id}/established")
    public void establishCsNode(@PathVariable String id) {
        service.handleEstablishUpdate(Integer.parseInt(id));
    }


    @PatchMapping(value = "/csnode/{id}/approved")
    public void approveCsNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.GODKAND, EventAction.GODKAND);
    }

    
    @PatchMapping(value = "/csnode/{id}/ready")
    public void readyCsNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.KLAR, EventAction.KLAR);
    }

    
    @PatchMapping(value = "/csnode/{id}/draft")
    public void draftCsNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.UTKAST, EventAction.UTKAST);
    }

    
    @DeleteMapping(value = "/csnode/{id}")
    public void deleteCsNode(@PathVariable String id) {
        service.delete(Integer.parseInt(id));
    }

    
    @PostMapping(value = "csnode/{id}/{copyStruct}")
    public void copyCsNode(@PathVariable String id, @PathVariable Boolean copyStruct) {
        if (Boolean.TRUE.equals(copyStruct)) {
            service.copyCsAndStruct(Integer.parseInt(id));
        } else {
            service.copyCs(Integer.parseInt(id));
        }
    }
}