package se.migrationsverket.ihpservice.repository.ihp.rules;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleType;
import se.migrationsverket.ihpservice.domain.rules.Rule;
import se.migrationsverket.ihpservice.repository.ihp.db.rules.RuleEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.RuleEntity;

import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class RuleRepository {
    RuleEntityRepository repository;

    public Rule add(Rule rule, String userId) {
        return repository.save(rule.mapToEntity(userId)).map();
    }

    public void update(Rule rule) {
        repository.save(rule.mapToEntity());
    }

    public Optional<Rule> fetch(Integer id) {
        return repository.findByRuleId(id).map(RuleEntity::map);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Stream<Rule> streamAll() {
        return repository.streamAll().map(RuleEntity::map);
    }

    public Stream<Rule> streamByRuleType(RuleType ruleType){
        return repository.streamByRuleType(ruleType.toString()).map(RuleEntity::map);
    }

    public Stream<Rule> streamByDocId(Integer docId) {
        return repository.findRulesByDocId(docId).map(RuleEntity::map);
    }
}
