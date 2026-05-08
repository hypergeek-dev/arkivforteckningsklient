package se.migrationsverket.ihpservice.repository.ihp.db;

import org.springframework.data.jpa.repository.JpaRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.NodeTypeCommentEntity;

import jakarta.transaction.Transactional;

import java.util.stream.Stream;

@Transactional
public interface NodeTypeCommentEntityRepository extends JpaRepository<NodeTypeCommentEntity, Integer> {

    Stream<NodeTypeCommentEntity> streamAllByNodeIdOrderByCreatedAtDesc(Integer nodeId);

}
