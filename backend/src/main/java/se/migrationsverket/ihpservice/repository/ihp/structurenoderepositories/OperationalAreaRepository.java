package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.OperationalAreaTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.db.OperationalAreaTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.OperationalAreaTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class OperationalAreaRepository implements StructureNodeRepository<OperationalAreaTypeNode, OperationalAreaTypeNodeEntity> {

    OperationalAreaTypeNodeEntityRepository repository;

    @Override
    public OperationalAreaTypeNode add(OperationalAreaTypeNode node, String userId) {
        return repository.save(node.mapToEntity(userId)).map();
    }

    @Override
    public OperationalAreaTypeNode update(OperationalAreaTypeNode node, String userId) {
        node.setUpdatedBy(userId);
        return repository.save(node.mapToEntity()).map();
    }

    @Override
    public OperationalAreaTypeNode patchStatus(OperationalAreaTypeNode node, String userId) {
        return update(node, userId);
    }

    public void patchStatuses(List<Integer> changingNodes, String status) {
        try {
            repository.batchUpdateStatuses(changingNodes, status);
        } catch (Exception e) {
            throw new IllegalArgumentException("Kunde inte uppdatera status för verksamhetsområden");
        }
    }

    @Override
    public Optional<OperationalAreaTypeNode> findById(Integer id) {
        return findEntityById(id).map(OperationalAreaTypeNodeEntity::map);
    }

    @Override
    public Stream<OperationalAreaTypeNode> streamNodes() {
        return null;
    }

    @Override
    public Stream<OperationalAreaTypeNode> streamActive(Date date) {
        return null;
    }

    @Override
    public Stream<OperationalAreaTypeNode> streamByParent(Integer parentId) {
        return repository.findAllByCsnodeId(parentId).map(OperationalAreaTypeNodeEntity::map);
    }

    @Override
    public Stream<OperationalAreaTypeNode> streamActiveByParent(Integer parentId, Date date) {
        return repository.findAllActiveByParentId(parentId, date).map(OperationalAreaTypeNodeEntity::map);
    }

    public Stream<OperationalAreaTypeNode> findAllEstablishedByParent(Integer parentId) {
        return repository.findAllEstablishedByParent(parentId).map(OperationalAreaTypeNodeEntity::map);
    }

    @Override
    public Stream<OperationalAreaTypeNode> findAllByIdIsIn(List<Integer> ids) {
        return repository.findAllByIdIsIn(ids).map(OperationalAreaTypeNodeEntity::map);
    }

    @Override
    public Stream<OperationalAreaTypeNode> findAllByPathContaining(String path) {
        return repository.findAllByPathContaining(path).map(OperationalAreaTypeNodeEntity::map);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<OperationalAreaTypeNodeEntity> findEntityById(Integer id) {
        return repository.findById(id);
    }

    public NodeStatus fetchStatusById(Integer parentId) {
        Optional<OperationalAreaTypeNodeEntity> optParent = repository.findById(parentId);
        return optParent.map(activityAreaNodeEntity -> NodeStatus.getNodeStatus(activityAreaNodeEntity.getStatus())).orElse(null);
    }

    public Stream<OperationalAreaTypeNode> streamByPathPrefix(String pathPrefix) {
        return repository.findAllByPathPrefix(pathPrefix).map(OperationalAreaTypeNodeEntity::map);
    }

    @Override
    public Optional<Integer> findCsnodetypeId(Integer id) {
        return repository.findCsnodetypeId(id);
    }

    @Override
    public List<OperationalAreaTypeNodeEntity> findAllByIdIsInList(List<Integer> nodeIds) {
        return repository.findAllByIdIsInList(nodeIds);
    }

    public void updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        repository.updateStatusByPathPrefix(toStatus.toString().toLowerCase(), fromStatus.toString().toLowerCase(), pathPrefix, userId);
    }

    public Integer countByParent(Integer id) {
        return repository.countByParent(id);
    }
}
