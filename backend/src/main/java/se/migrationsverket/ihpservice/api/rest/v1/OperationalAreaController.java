package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.OperationalAreaTypeNodeDto;
import se.migrationsverket.ihpservice.domain.services.OperationalAreaTypeService;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app"})

public class OperationalAreaController {
    private final OperationalAreaTypeService service;

    @GetMapping(value = "/oanodes/{parentId}")
    public List<OperationalAreaTypeNodeDto> fetchAaNodesByParentId(@PathVariable String parentId) {
        return service.listByParent(Integer.parseInt(parentId));
    }

    
    @PostMapping(value = "/oanode")
    public OperationalAreaTypeNodeDto addAaNode(@RequestBody OperationalAreaTypeNodeDto node) {
        return service.add(node.addMap(), EventAction.CREATE).mapToDto();
    }

    
    @PutMapping(value = "/oanode")
    public OperationalAreaTypeNodeDto updateOaNode(@RequestBody OperationalAreaTypeNodeDto node) {
        return service.update(node.map()).mapToDto();
    }

    
    @PatchMapping(value = "/oanode/{id}/ready")
    public void readyOperationalAreaNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.KLAR, EventAction.KLAR);
    }

    
    @PatchMapping(value = "/oanode/{id}/approved")
    public void approveOperationalAreaNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.GODKAND, EventAction.GODKAND);
    }

    
    @PatchMapping(value = "/oanode/{id}/draft")
    public void draftOperationalAreaNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.UTKAST, EventAction.UTKAST);
    }

    
    @DeleteMapping(value = "/oanode/{id}")
    public void deleteOaNode(@PathVariable String id) {
        service.delete(Integer.parseInt(id));
    }

    
    @PostMapping(value = "oanode/{id}/{copyStruct}")
    public void copyOaNode(@PathVariable String id, @PathVariable Boolean copyStruct) {
        service.copy(Integer.parseInt(id), copyStruct);
    }
}
