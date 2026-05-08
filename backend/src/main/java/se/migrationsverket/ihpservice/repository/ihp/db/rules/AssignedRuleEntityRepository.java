package se.migrationsverket.ihpservice.repository.ihp.db.rules;

import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.AssignedRuleEntity;

import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface AssignedRuleEntityRepository extends JpaRepository<AssignedRuleEntity, Integer> {
    @NotNull
    @Query(value = "select * from ihp.assignedrule where id = ?1", nativeQuery = true)
    Optional<AssignedRuleEntity> findById(@NotNull Integer id);

    @Query(value = "select * from ihp.assignedrule where doc_id = ?1", nativeQuery = true)
    Stream<AssignedRuleEntity> findAssignedRuleEntityByDocId(Integer id);
}
