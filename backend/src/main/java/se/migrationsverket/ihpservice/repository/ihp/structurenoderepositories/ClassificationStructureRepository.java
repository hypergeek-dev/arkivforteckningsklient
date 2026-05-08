package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.db.ClassificationStructureTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.ClassificationStructureTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class ClassificationStructureRepository implements StructureNodeRepository<ClassificationStructureTypeNode, ClassificationStructureTypeNodeEntity> {

    private final ClassificationStructureTypeNodeEntityRepository repository;

    @Override
    public ClassificationStructureTypeNode add(ClassificationStructureTypeNode node, String userId) {
        return repository.save(node.mapToEntity(userId)).map();
    }

    @Override
    public ClassificationStructureTypeNode update(ClassificationStructureTypeNode node, String userId) {
        node.setUpdatedBy(userId);
        return repository.save(node.mapToEntity()).map();
    }

    @Override
    public ClassificationStructureTypeNode patchStatus(ClassificationStructureTypeNode node, String userId) {
        return update(node, userId);
    }

    @Override
    public Optional<ClassificationStructureTypeNode> findById(Integer id) {
        return findEntityById(id).map(ClassificationStructureTypeNodeEntity::map);
    }

    public Optional<ClassificationStructureTypeNode> findByByPath(String path) {
        return repository.findByPath(path).map(ClassificationStructureTypeNodeEntity::map);
    }


    @Override
    public Stream<ClassificationStructureTypeNode> streamNodes() {
        return repository.streamByIdGreaterThan(Integer.MIN_VALUE).map(ClassificationStructureTypeNodeEntity::map);
    }

    @Override
    public Stream<ClassificationStructureTypeNode> streamActive(Date date) {
        return repository.findActive(date).map(ClassificationStructureTypeNodeEntity::map);
    }

    @Override
    public Stream<ClassificationStructureTypeNode> streamByParent(Integer parentId) {
        return repository.streamByIdGreaterThan(Integer.MIN_VALUE).map(ClassificationStructureTypeNodeEntity::map);
    }

    @Override
    public Stream<ClassificationStructureTypeNode> streamByPathPrefix(String pathPrefix) {
        return repository.findAllByPathPrefix(pathPrefix).map(ClassificationStructureTypeNodeEntity::map);
    }

    @Override
    public Stream<ClassificationStructureTypeNode> streamActiveByParent(Integer parentId, Date date) {
        return repository.findActive(date).map(ClassificationStructureTypeNodeEntity::map);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<ClassificationStructureTypeNodeEntity> findEntityById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Integer> findCsnodetypeId(Integer id) {
        return Optional.of(id);
    }

    @Override
    public List<ClassificationStructureTypeNodeEntity> findAllByIdIsInList(List<Integer> nodeIds) {
        return repository.findAllByIdIsInList(nodeIds);
    }

    @Override
    public Stream<ClassificationStructureTypeNode> findAllByPathContaining(String path) {
        throw new UnsupportedOperationException("Method not implemented on ClassificationStructure top node.");
    }

    @Override
    public Stream<ClassificationStructureTypeNode> findAllByIdIsIn(List<Integer> ids) {
        return repository.findAllByIdIn(ids).map(ClassificationStructureTypeNodeEntity::map);
    }

    public NodeStatus fetchStatusById(Integer parentId) {
        Optional<ClassificationStructureTypeNodeEntity> optParent = repository.findById(parentId);
        return optParent.map(classificationStructureNodeEntity -> NodeStatus.getNodeStatus(classificationStructureNodeEntity.getStatus())).orElse(null);

    }

    public boolean findIllegalCsCombinations(ClassificationStructureTypeNode node) {
        if (node.getStop() == null) {
            return repository.findIllegalInfinite(node.getStart()).findAny().isPresent();
        } else {
            return repository.findIllegalPeriod(node.getStart(), node.getStop()).findAny().isPresent();
        }
    }

    public Integer areAllKsChildrenStatus(String status, String ksPath) {
        return repository.areAllKsChildrenStatus(status, ksPath);
    }


}
