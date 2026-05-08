package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeTypeCommentDto;
import se.migrationsverket.ihpservice.domain.services.NodeTypeCommentService;

import java.util.List;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping({"/rest/app"})

public class NodeCommentController {
    private final NodeTypeCommentService service;

    @GetMapping(value = "/comments/{nodeId}")
    public List<NodeTypeCommentDto> getComments(@PathVariable Integer nodeId) {
        return service.listByNodeId(nodeId);
    }

    @PostMapping(value = "/comment")
    public NodeTypeCommentDto add(@RequestBody NodeTypeCommentDto nodeComment) {
        return service.add(nodeComment.addMap()).mapToDto();
    }
}