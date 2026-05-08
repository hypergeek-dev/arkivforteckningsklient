package se.migrationsverket.ihpservice.domain.services.rules;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.domain.rules.Term;
import se.migrationsverket.ihpservice.repository.ihp.rules.TermRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

import java.util.List;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class TermService {
    private final RequestContextHolder requestContextHolder;
    private final TermRepository termRepository;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    public List<Term> addTerms(List<Term> terms, Integer ruleId){
        return terms.stream().map(t -> add(t,ruleId)).toList();
    }
    public Term add(Term term, Integer ruleId) {
        term.setRuleId(ruleId);
        return termRepository.add(term, getUserId());
    }

    public void deleteTermsNotPresent(List<Term> terms, Integer ruleId){
        List<Integer> newTerms = terms.stream().map(Term::getId).toList();
        List<Integer> currentTerms = termRepository.findTermsByRuleId(ruleId).map(Term::getId).toList();

        for(int i : currentTerms){
            if(!newTerms.contains(i)){
                termRepository.delete(i);
            }
        }
    }

    public Integer updateTerms(List<Term> terms, Integer ruleId) {
        deleteTermsNotPresent(terms, ruleId);
        return terms.stream().map(t -> update(t, ruleId)).reduce(Integer::sum).orElse(0);
    }

    public Integer update(Term term, Integer ruleId){
        Integer updated = 0;
        term.setRuleId(ruleId);
        if(term.getId() == null){
            termRepository.add(term, getUserId());
            updated++;
        } else {
            Term currentTerm = termRepository.fetch(term.getId())
                    .orElseThrow(() -> new IllegalArgumentException("No term with id : " + term.getId()));

            if(!term.equals(currentTerm)){
                term.setCreatedAt(currentTerm.getCreatedAt());
                term.setCreatedBy(currentTerm.getCreatedBy());
                term.setUpdatedBy(getUserId());
                termRepository.update(term);
                updated++;
            }
        }
        return updated;
    }

    public List<Term> listByRule(Integer ruleId){
        return termRepository.findTermsByRuleId(ruleId).toList();
    }
}