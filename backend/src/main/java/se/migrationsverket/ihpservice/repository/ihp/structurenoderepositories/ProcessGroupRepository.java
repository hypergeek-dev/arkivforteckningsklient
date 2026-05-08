package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.ProcessGroupTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.db.ProcessGroupTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.ProcessGroupTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class ProcessGroupRepository implements StructureNodeRepository<ProcessGroupTypeNode, ProcessGroupTypeNodeEntity> {

    ProcessGroupTypeNodeEntityRepository repository;

    @Override
    public ProcessGroupTypeNode add(ProcessGroupTypeNode node, String userId) {
        return repository.save(node.mapToEntity(userId)).map();
    }

    @Override
    public ProcessGroupTypeNode update(ProcessGroupTypeNode node, String userId) {
        node.setUpdatedBy(userId);
        return repository.save(node.mapToEntity()).map();
    }

    @Override
    public ProcessGroupTypeNode patchStatus(ProcessGroupTypeNode node, String userId) {
        return update(node, userId);
    }

    public void patchStatuses(List<Integer> changingNodes, String status) {
        try {
            repository.batchUpdateStatuses(changingNodes, status);
        } catch (Exception e) {
            throw new IllegalArgumentException("Kunde inte uppdatera status för processgrupp");
        }

    }

    @Override
    public Optional<ProcessGroupTypeNode> findById(Integer id) {
        return findEntityById(id).map(ProcessGroupTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessGroupTypeNode> streamNodes() {
        return null;
    }

    @Override
    public Stream<ProcessGroupTypeNode> streamActive(Date date) {
        return null;
    }

    @Override
    public Stream<ProcessGroupTypeNode> streamByParent(Integer parentId) {
        return repository.findAllByParentId(parentId).map(ProcessGroupTypeNodeEntity::map);
    }

    public Stream<ProcessGroupTypeNode> findAllEstablishedByPathPrefix(String path) {
        return repository.findAllEstablishedByPathPrefix(path).map(ProcessGroupTypeNodeEntity::map);
    }


    @Override
    public Stream<ProcessGroupTypeNode> streamActiveByParent(Integer parentId, Date date) {
        return repository.findAllActiveByParentId(parentId, date).map(ProcessGroupTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessGroupTypeNode> findAllByPathContaining(String path) {
        return repository.findAllByPathContaining(path).map(ProcessGroupTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessGroupTypeNode> findAllByIdIsIn(List<Integer> ids) {
        return repository.findAllByIdIsIn(ids).map(ProcessGroupTypeNodeEntity::map);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<ProcessGroupTypeNodeEntity> findEntityById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Integer> findCsnodetypeId(Integer id) {
        return repository.findCsnodetypeId(id);
    }

    @Override
    public List<ProcessGroupTypeNodeEntity> findAllByIdIsInList(List<Integer> nodeIds) {
        return repository.findAllByIdIsInList(nodeIds);
    }

    public NodeStatus fetchStatusById(Integer parentId) {
        Optional<ProcessGroupTypeNodeEntity> optParent = repository.findById(parentId);
        return optParent.map(processGroupNodeEntity -> NodeStatus.getNodeStatus(processGroupNodeEntity.getStatus())).orElse(null);

    }

    public Stream<ProcessGroupTypeNode> streamByPathPrefix(String pathPrefix) {
        return repository.findAllByPathPrefix(pathPrefix).map(ProcessGroupTypeNodeEntity::map);
    }

    public Stream<ProcessGroupTypeNode> streamProcessGroupsByPaths(List<String> paths) {
        return repository.streamProcessGroupsByPaths(paths).map(ProcessGroupTypeNodeEntity::map);
    }

    public Stream<ProcessGroupTypeNode> updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        return repository.updateStatusByPathPrefix(toStatus.toString().toLowerCase(), fromStatus.toString().toLowerCase(), pathPrefix, userId).map(ProcessGroupTypeNodeEntity::map);
    }

}
