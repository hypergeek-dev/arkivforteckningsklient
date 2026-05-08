package se.migrationsverket.ihpservice.repository.ihp.db.rules;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.RuleEntity;

import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface RuleEntityRepository extends JpaRepository<RuleEntity, Integer> {

    @Query(value = "select * from ihp.rule where id = ?1", nativeQuery = true)
    Optional<RuleEntity> findByRuleId(Integer id);

    @Query(value = "select * from ihp.rule order by created_at desc", nativeQuery = true)
    Stream<RuleEntity> streamAll();

    @Query(value = "select * from ihp.rule where status='faststalld' and ruletype = ?1 order by created_at desc", nativeQuery = true)
    Stream<RuleEntity> streamByRuleType(String ruleType);

    @Query(value = "select * from ihp.rule where id in(select rule_id from ihp.assignedrule where doc_id = ?1)", nativeQuery = true)
    Stream<RuleEntity> findRulesByDocId(Integer docId);

}

