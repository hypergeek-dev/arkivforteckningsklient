package se.migrationsverket.ihpservice.repository.ihp.rules;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.rules.AssignedRule;
import se.migrationsverket.ihpservice.repository.ihp.db.rules.AssignedRuleEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.AssignedRuleEntity;

import jakarta.transaction.Transactional;

import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class AssignedRuleRepository {
    AssignedRuleEntityRepository repository;

    public void add(AssignedRule rule) {
        repository.save(rule.mapToEntity()).map();
    }

    public void deleteByDocId(Integer docId) {
        repository.findAssignedRuleEntityByDocId(docId).forEach(ar -> delete(ar.getId()));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Stream<AssignedRule> findByDocId(Integer docId) {
        return repository.findAssignedRuleEntityByDocId(docId).map(AssignedRuleEntity::map);
    }
}
