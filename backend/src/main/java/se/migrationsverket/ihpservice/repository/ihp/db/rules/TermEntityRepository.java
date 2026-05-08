package se.migrationsverket.ihpservice.repository.ihp.db.rules;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.TermEntity;

import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface TermEntityRepository extends JpaRepository<TermEntity, Integer> {

    @Query(value = "select * from ihp.term where rule_id = ?1", nativeQuery = true)
    Stream<TermEntity> findTermsByRule(Integer ruleId);

    @Query(value = "select * from ihp.term where id = ?1", nativeQuery = true)
    Optional<TermEntity> findTermById(Integer termId);
}

