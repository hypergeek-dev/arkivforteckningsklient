package se.migrationsverket.ihpservice.api.rest.v1.noderelations;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.migrationsverket.ihpservice.api.rest.v1.dto.noderelations.RelationCandidate;
import se.migrationsverket.ihpservice.domain.services.noderelations.NodeRelationService;

import java.util.List;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping({"/rest/app/relation"})
public class NodeRelationController {
    NodeRelationService service;

    @GetMapping(value = "/issuenode/{oaPath}")
    public List<RelationCandidate> getIssueRelationCandidates(@PathVariable String oaPath){
        return service.getCandidates(false, oaPath);
    }

    @GetMapping(value = "/processnode/{oaPath}")
    public List<RelationCandidate> getProcessRelationCanditates(@PathVariable String oaPath){
        return service.getCandidates(true, oaPath);
    }
}