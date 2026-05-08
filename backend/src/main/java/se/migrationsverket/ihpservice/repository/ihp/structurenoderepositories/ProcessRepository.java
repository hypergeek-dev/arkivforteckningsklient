package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.ProcessTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.db.ProcessTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.ProcessTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class ProcessRepository implements StructureNodeRepository<ProcessTypeNode, ProcessTypeNodeEntity> {

    ProcessTypeNodeEntityRepository repository;

    @Override
    public ProcessTypeNode add(ProcessTypeNode node, String userId) {
        return repository.save(node.mapToEntity(userId)).map();
    }

    @Override
    public ProcessTypeNode update(ProcessTypeNode node, String userId) {
        node.setUpdatedBy(userId);
        return repository.save(node.mapToEntity()).map();
    }

    @Override
    public ProcessTypeNode patchStatus(ProcessTypeNode node, String userId) {
        return update(node, userId);
    }

    public void patchStatuses(List<Integer> changingNodes, String status) {
        try {
            repository.batchPatchUpdates(changingNodes, status);
        } catch (Exception e) {
            throw new IllegalArgumentException("NOT WORKING");
        }
    }

    @Override
    public Optional<ProcessTypeNode> findById(Integer id) {
        return findEntityById(id).map(ProcessTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessTypeNode> streamNodes() {
        return null;
    }

    @Override
    public Stream<ProcessTypeNode> streamActive(Date date) {
        return null;
    }

    @Override
    public Stream<ProcessTypeNode> streamByParent(Integer parentId) {
        return repository.findAllByParentId(parentId).map(ProcessTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessTypeNode> streamActiveByParent(Integer parentId, Date date) {
        return repository.findAllActiveByParentId(parentId, date).map(ProcessTypeNodeEntity::map);
    }

    public Stream<ProcessTypeNode> findAllEstablishedByPathPrefix(String path) {
        return repository.findAllEstablishedByPathPrefix(path).map(ProcessTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessTypeNode> findAllByPathContaining(String path) {
        return repository.findAllByPathContaining(path).map(ProcessTypeNodeEntity::map);
    }

    @Override
    public Stream<ProcessTypeNode> findAllByIdIsIn(List<Integer> ids) {
        return repository.findAllByIdIsIn(ids).map(ProcessTypeNodeEntity::map);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<ProcessTypeNodeEntity> findEntityById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Integer> findCsnodetypeId(Integer id) {
        return repository.findCsnodetypeId(id);
    }

    @Override
    public List<ProcessTypeNodeEntity> findAllByIdIsInList(List<Integer> nodeIds) {
        return repository.findAllByIdIsInList(nodeIds);
    }

    public void changeProcessParent(Integer parentId, List<Integer> processIDs) {
        Iterable<ProcessTypeNodeEntity> result = repository.findAllById(processIDs);
        result.forEach(processTypeNodeEntity -> {
            processTypeNodeEntity.setParentId(parentId);
            repository.save(processTypeNodeEntity);
        });
    }

    public NodeStatus fetchStatusById(Integer parentId) {
        Optional<ProcessTypeNodeEntity> optParent = repository.findById(parentId);
        return optParent.map(processNodeEntity -> NodeStatus.getNodeStatus(processNodeEntity.getStatus())).orElse(null);

    }

    public Optional<Integer> findByPathAndCsnode(String path, Integer csnodeId) {
        return repository.findProcessIdByPathAndCsnode(path, csnodeId);
    }

    public Optional<ProcessTypeNode> findProcessByPath(String path) {
        return repository.findProcessByPath(path).map(ProcessTypeNodeEntity::map);
    }

    public Stream<ProcessTypeNode> streamProcessByPaths(List<String> paths) {
        return repository.streamProcessByPaths(paths).map(ProcessTypeNodeEntity::map);
    }

    public Stream<ProcessTypeNode> streamByPathPrefix(String pathPrefix) {
        return repository.findAllByPathPrefix(pathPrefix).map(ProcessTypeNodeEntity::map);
    }

    public Stream<ProcessTypeNode> updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        return repository.updateStatusByPathPrefix(toStatus.toString().toLowerCase(), fromStatus.toString().toLowerCase(), pathPrefix, userId).map(ProcessTypeNodeEntity::map);
    }
}
