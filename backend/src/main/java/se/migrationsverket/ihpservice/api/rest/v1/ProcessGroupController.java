package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.MergeProcessDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ProcessGroupTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.services.ProcessGroupTypeService;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app/pgnode"})

public class ProcessGroupController {
    private final ProcessGroupTypeService service;

    @GetMapping(value = "/{parentId}/parent")
    public List<ProcessGroupTypeNodeDto> fetchPgNodesByParentId(@PathVariable String parentId) {
        return service.listByParent(Integer.parseInt(parentId));
    }

    @GetMapping(value = "/{path}/relations")
    public List<StructureNodeDto> fetchRelationNodesByOwner(@PathVariable String path) {
        return service.fetchRelationNodesByOwnerPath(path);
    }

    
    @PostMapping(value = "")
    public ProcessGroupTypeNodeDto addPgNode(@RequestBody ProcessGroupTypeNodeDto node) {
        return service.add(node.addMap(), EventAction.CREATE).mapToDto();
    }

    
    @PutMapping(value = "")
    public ProcessGroupTypeNodeDto updatePgNode(@RequestBody ProcessGroupTypeNodeDto node) {
        return service.update(node.map()).mapToDto();
    }

    
    @PatchMapping(value = "/{id}/approved")
    public void approveProcessGroupNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.GODKAND, EventAction.GODKAND);
    }

    
    @PatchMapping(value = "/{id}/ready")
    public void readyProcessGroupNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.KLAR, EventAction.KLAR);
    }

    
    @PatchMapping(value = "/{id}/draft")
    public void draftProcessGroupNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.UTKAST, EventAction.UTKAST);
    }

    
    @PostMapping(value = "/PGNodeAndmerge")
    public void addPGNodeAndmerge(@RequestBody MergeProcessDto merge) {
        service.addPGNodeAndmerge(merge);
    }

    
    @DeleteMapping(value = "/{id}")
    public void deletePgNode(@PathVariable String id) {
        service.delete(Integer.parseInt(id));
    }

    
    @PostMapping(value = "pgnode/{id}/{copyStruct}")
    public void copyPgNode(@PathVariable String id, @PathVariable Boolean copyStruct) {
        service.copy(Integer.parseInt(id), copyStruct);
    }

}
