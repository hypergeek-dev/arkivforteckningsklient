package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.DocumentTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.db.DocumentTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.DocumentTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class DocumentRepository implements StructureNodeRepository<DocumentTypeNode, DocumentTypeNodeEntity> {

    DocumentTypeNodeEntityRepository repository;

    @Override
    public DocumentTypeNode add(DocumentTypeNode node, String userId) {
        return repository.save(node.mapToEntity(userId)).map();
    }

    @Override
    public DocumentTypeNode update(DocumentTypeNode node, String userId) {
        node.setUpdatedBy(userId);
        return repository.save(node.mapToEntity()).map();
    }

    @Override
    public DocumentTypeNode patchStatus(DocumentTypeNode node, String userId) {
        return update(node, userId);
    }

    @Override
    public Optional<DocumentTypeNode> findById(Integer id) {
        return findEntityById(id).map(DocumentTypeNodeEntity::map);
    }

    @Override
    public Stream<DocumentTypeNode> streamNodes() {
        return null;
    }

    @Override
    public Stream<DocumentTypeNode> streamActive(Date date) {
        return null;
    }

    @Override
    public Stream<DocumentTypeNode> streamByParent(Integer parentId) {
        return repository.findAllByIssuetypeId(parentId).map(DocumentTypeNodeEntity::map);
    }

    @Override
    public Stream<DocumentTypeNode> streamActiveByParent(Integer parentId, Date date) {
        return repository.findAllActiveByParentId(parentId, date).map(DocumentTypeNodeEntity::map);
    }

    @Override
    public Stream<DocumentTypeNode> findAllByPathContaining(String path) {
        return repository.findAllByPathContaining(path).map(DocumentTypeNodeEntity::map);
    }

    @Override
    public Stream<DocumentTypeNode> findAllByIdIsIn(List<Integer> ids) {
        return repository.findAllByIdIsIn(ids).map(DocumentTypeNodeEntity::map);
    }

    public List<DocumentTypeNodeEntity> findAllByIdIsInList(List<Integer> ids) {
        return repository.findByIdIn(ids);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<DocumentTypeNodeEntity> findEntityById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Integer> findCsnodetypeId(Integer id) {
        return repository.findCsnodetypeId(id);
    }

    public Stream<DocumentTypeNode> streamByPathPrefix(String pathPrefix) {
        return repository.findAllByPathPrefix(pathPrefix).map(DocumentTypeNodeEntity::map);
    }

    public Stream<DocumentTypeNode> updateStatusByPathPrefix(NodeStatus toStatus, NodeStatus fromStatus, String pathPrefix, String userId) {
        return repository.updateStatusByPathPrefix(toStatus.toString().toLowerCase(), fromStatus.toString().toLowerCase(), pathPrefix, userId).map(DocumentTypeNodeEntity::map);
    }


    public void patchStatuses(List<Integer> changingNodes, String status, String userId) {
        try {
            repository.batchUpdateStatuses(changingNodes, status, userId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Kunde inte uppdatera status för handlingar");
        }

    }
}
