package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.IssueTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.db.IssueTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.IssueTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class IssueRepository implements StructureNodeRepository<IssueTypeNode, IssueTypeNodeEntity> {

    IssueTypeNodeEntityRepository repository;

    @Override
    public IssueTypeNode add(IssueTypeNode node, String userId) {
        return repository.save(node.mapToEntity(userId)).map();
    }

    @Override
    public IssueTypeNode update(IssueTypeNode node, String userId) {
        node.setUpdatedBy(userId);
        return repository.save(node.mapToEntity()).map();
    }

    @Override
    public IssueTypeNode patchStatus(IssueTypeNode node, String userId) {
        return update(node, userId);
    }

    @Override
    public Optional<IssueTypeNode> findById(Integer id) {
        return findEntityById(id).map(IssueTypeNodeEntity::map);
    }

    @Override
    public Stream<IssueTypeNode> streamNodes() {
        return null;
    }

    @Override
    public Stream<IssueTypeNode> streamActive(Date date) {
        return null;
    }

    @Override
    public Stream<IssueTypeNode> streamByParent(Integer parentId) {
        return repository.findAllByProcessId(parentId).map(IssueTypeNodeEntity::map);
    }

    @Override
    public Stream<IssueTypeNode> streamActiveByParent(Integer parentId, Date date) {
        return repository.findAllActiveByParentId(parentId, date).map(IssueTypeNodeEntity::map);
    }

    @Override
    public Stream<IssueTypeNode> findAllByPathContaining(String path) {
        return repository.findAllByPathContaining(path).map(IssueTypeNodeEntity::map);
    }

    @Override
    public Stream<IssueTypeNode> findAllByIdIsIn(List<Integer> ids) {
        return repository.findAllByIdIsIn(ids).map(IssueTypeNodeEntity::map);
    }

    public List<IssueTypeNodeEntity> findAllByIdIsInList(List<Integer> ids) {
        return repository.findAllByIdIsInList(ids);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<IssueTypeNodeEntity> findEntityById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Integer> findCsnodetypeId(Integer id) {
        return repository.findCsnodetypeId(id);
    }

    public NodeStatus fetchStatusById(Integer parentId) {
        Optional<IssueTypeNodeEntity> optParent = repository.findById(parentId);
        return optParent.map(errandNodeEntity -> NodeStatus.getNodeStatus(errandNodeEntity.getStatus())).orElse(null);

    }

    public Optional<Integer> findByPath(String path, Integer csnodeId) {
        return repository.findIssueIdByPath(path, csnodeId);
    }

    public Optional<IssueTypeNode> findIssueByPath(String path) {
        return repository.findIssueByPath(path).map(IssueTypeNodeEntity::map);
    }

    public Stream<IssueTypeNode> streamByPathPrefix(String pathPrefix) {
        return repository.findAllByPathPrefix(pathPrefix).map(IssueTypeNodeEntity::map);
    }


    public Stream<IssueTypeNode> streamIssuesByPaths(List<String> paths) {
        return repository.streamIssuesByPaths(paths).map(IssueTypeNodeEntity::map);
    }

    public Stream<IssueTypeNode> updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        return repository.updateStatusByPathPrefix(toStatus.toString().toLowerCase(), fromStatus.toString().toLowerCase(), pathPrefix, userId).map(IssueTypeNodeEntity::map);
    }

    public void patchStatuses(List<Integer> changingNodes, String status) {
        try {
            repository.batchUpdateStatuses(changingNodes, status);
        } catch (Exception e) {
            throw new IllegalArgumentException("Kunde inte uppdatera status för ärenden");
        }

    }

}
