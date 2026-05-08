package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.NodeTypeComment;
import se.migrationsverket.ihpservice.repository.ihp.db.NodeTypeCommentEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.NodeTypeCommentEntity;

import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class NodeTypeCommentRepository {
    NodeTypeCommentEntityRepository repository;

    public NodeTypeComment add(NodeTypeComment nodeComment, String userId) {
        return repository.save(nodeComment.mapToEntity(userId)).map();
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Optional<NodeTypeComment> findById(Integer id) {
        return repository.findById(id).map(NodeTypeCommentEntity::map);
    }

    public Stream<NodeTypeComment> streamAllByNodeId(Integer nodeId) {
        return repository.streamAllByNodeIdOrderByCreatedAtDesc(nodeId).map(NodeTypeCommentEntity::map);
    }
}
