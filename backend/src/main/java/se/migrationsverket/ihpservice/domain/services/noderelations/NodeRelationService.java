package se.migrationsverket.ihpservice.domain.services.noderelations;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.noderelations.RelationCandidate;
import se.migrationsverket.ihpservice.domain.IssueTypeNode;
import se.migrationsverket.ihpservice.domain.ProcessGroupTypeNode;
import se.migrationsverket.ihpservice.domain.ProcessTypeNode;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.repository.ihp.relations.NodeRelationRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IssueRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessGroupRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ProcessRepository;
import se.migrationsverket.ihpservice.support.IhpUtils;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class NodeRelationService {
    private final ProcessGroupRepository processGroupRepository;
    private final ProcessRepository processRepository;
    private final IssueRepository issueRepository;
    private final NodeRelationRepository repository;

    public <T> List<NodeRelation> handleRelationsFromNodes(T node,
                                             Function<T, List<NodeRelation>> relationFinder,
                                             Function<T, String> pathFinder) {
        List<NodeRelation> relations = relationFinder.apply(node) == null ? new ArrayList<>() : relationFinder.apply(node);
        relations.forEach(relation -> relation.setPath(pathFinder.apply(node)));
        add(relations);
        return relations;
    }

    public List<RelationCandidate> getCandidates(boolean struct, String oaPath) {
        // needed to encode as it took slash in path for separate endpoint
        byte[] decodedBytes = Base64.getUrlDecoder().decode(oaPath);
        String decodedString = new String(decodedBytes);
        String pathPrefix = addSlash(IhpUtils.resolveTyp(decodedString));

        if (struct) {
            return Stream.of(getNodeCandidates(
                                    pathPrefix, processGroupRepository::streamByPathPrefix,
                                    ProcessGroupTypeNode::mapToDto, RelationCandidate::getInstance),
                            getNodeCandidates(
                                    pathPrefix, processRepository::streamByPathPrefix,
                                    ProcessTypeNode::mapToDto, RelationCandidate::getInstance))
                    .flatMap(candidate -> candidate).sorted(RelationCandidate::compareTo).toList();

        } else {
            return getNodeCandidates(
                    pathPrefix, issueRepository::streamByPathPrefix,
                    IssueTypeNode::mapToDto,
                    RelationCandidate::getInstance).sorted(RelationCandidate::compareTo).toList();
        }
    }

    private <T, R> Stream<RelationCandidate> getNodeCandidates(
            String pathPrefix,
            Function<String, Stream<T>> nodeRetriever,
            Function<T, R> mapper,
            Function<R, RelationCandidate> candidateMapper) {
        return nodeRetriever.apply(pathPrefix)
                .map(mapper)
                .map(candidateMapper);
    }

    public List<NodeRelation> listByPath(String path) {
        return repository.findByPath(path).toList();
    }


    public List<NodeRelation> listByRelatedPath(String path) {
        return repository.findByRelatedPath(path).toList();
    }

    public void deleteByPath(String path) {
        repository.deleteByPath(path);
    }

    public void add(List<NodeRelation> relations) {
        if (relations != null) {
            relations.forEach(repository::add);
        }
    }

    public void update(List<NodeRelation> currentRelations, List<NodeRelation> newRelations) {
        if(newRelations == null) {
            newRelations = new ArrayList<>();
        }
        if (currentRelations.isEmpty()) {
            add(newRelations);
        } else {
            removeRelations(currentRelations, newRelations);
            newRelations.forEach(repository::add);
        }
    }

    private void updateRelatedPath(Integer id, String path) {
        repository.updateRelatedPath(id, path);
    }

    public List<NodeRelation> updatePaths(List<NodeRelation> relations, String newPath) {
        if (relations == null) {
            return new ArrayList<>();
        }
        return relations.stream().map(r -> NodeRelation.builder()
                .id(r.getId())
                .path(newPath)
                .relatedPath(r.getRelatedPath())
                .comment(r.getComment())
                .build()).toList();
    }

    public void updateRelatedPaths(String currentPath, String newPath) {
        List<NodeRelation> whereRelated = listByRelatedPath(currentPath);
        whereRelated.forEach(relation -> updateRelatedPath(relation.getId(), newPath));
    }

    private void removeRelations(List<NodeRelation> currentRelations, List<NodeRelation> newRelations) {
        List<Integer> newRelationsIds = newRelations.stream().map(NodeRelation::getId).toList();
        currentRelations.stream().filter(current -> !newRelationsIds.contains(current.getId())).forEach(cr -> repository.deleteById(cr.getId()));
    }


    public void copy(String oldPath, String newPath) {
        repository.findAllByCsPath(oldPath).map(n -> copy(n, oldPath, newPath)).forEach(repository::save);
    }

    private NodeRelation copy(NodeRelation oldNode, String oldPath, String newPath) {
        return NodeRelation.builder()
                .path(oldNode.getPath().replace(oldPath, newPath))
                .relatedPath(oldNode.getRelatedPath().replace(oldPath, newPath))
                .comment(oldNode.getComment())
                .build();
    }

    private String addSlash(String path) {
        return path.endsWith("/") ? path : path + "/";
    }
}
