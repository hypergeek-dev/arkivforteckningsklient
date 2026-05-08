package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ProcessTypeNodeDto;
import se.migrationsverket.ihpservice.domain.services.ProcessTypeService;
import se.migrationsverket.ihpservice.support.events.EventAction;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app/processnode"})
public class ProcessController {
    private final ProcessTypeService service;

    
    @PostMapping(value = "")
    public ProcessTypeNodeDto addProcessNode(@RequestBody ProcessTypeNodeDto node) {
        return service.add(node.addMap(), EventAction.CREATE).mapToDto();
    }

    
    @PutMapping(value = "")
    public ProcessTypeNodeDto updateProcessNode(@RequestBody ProcessTypeNodeDto node) {
        return service.update(node.map()).mapToDto();
    }

    
    @PatchMapping(value = "/{id}/approved")
    public void approveProcessNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.GODKAND, EventAction.GODKAND);
    }

    
    @PatchMapping(value = "/{id}/ready")
    public void readyProcessNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.KLAR, EventAction.KLAR);
    }

    
    @PatchMapping(value = "/{id}/draft")
    public void draftProcessNode(@PathVariable String id) {
        service.patchStatus(Integer.parseInt(id), NodeStatus.UTKAST, EventAction.UTKAST);
    }

    
    @DeleteMapping(value = "/{id}")
    public void deleteProcessNode(@PathVariable String id) {
        service.delete(Integer.parseInt(id));
    }

    
    @PostMapping(value = "/{id}/{copyStruct}")
    public void copyProcessNode(@PathVariable String id, @PathVariable Boolean copyStruct) {
        service.copy(Integer.parseInt(id), copyStruct);
    }

}
