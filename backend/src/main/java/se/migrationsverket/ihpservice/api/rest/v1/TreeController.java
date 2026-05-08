package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DroppedNodeDto;
import se.migrationsverket.ihpservice.domain.services.TreeService;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping({"/rest/app"})

public class TreeController {
    private final TreeService treeService;

    
    @PostMapping(value = "/treenode")
    public void moveNode (@RequestBody DroppedNodeDto node){
        treeService.dropNode(node);
    }

}
