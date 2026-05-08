package se.migrationsverket.ihpservice.repository.ihp.rules;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.domain.rules.Term;
import se.migrationsverket.ihpservice.repository.ihp.db.rules.TermEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.TermEntity;

import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class TermRepository {
    TermEntityRepository repository;

    public Term add(Term term, String userId){
        return repository.save(term.mapToEntity(userId)).map();
    }

    public Optional<Term> fetch(Integer id) {
        return repository.findTermById(id).map(TermEntity::map);
    }

    public Stream<Term> findTermsByRuleId(Integer ruleId){
        return repository.findTermsByRule(ruleId).map(TermEntity::map);
    }

    public void delete (Integer id) {
        repository.deleteById(id);
    }

    public void update(Term term) {
        repository.save(term.mapToEntity());
    }
}