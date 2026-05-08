package se.migrationsverket.ihpservice.domain.services.rules;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleType;
import se.migrationsverket.ihpservice.domain.IhpEventLoggEvent;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.rules.AssignedRule;
import se.migrationsverket.ihpservice.domain.rules.Rule;
import se.migrationsverket.ihpservice.repository.ihp.rules.AssignedRuleRepository;
import se.migrationsverket.ihpservice.repository.ihp.rules.RuleRepository;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.function.Predicate;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.RULE_DELETE_FAILED;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class RuleService {
    private final RequestContextHolder requestContextHolder;
    private final AssignedRuleRepository assignedRuleRepository;
    private final RuleRepository ruleRepository;
    private final TermService termService;
    private final ApplicationEventPublisher applicationEventPublisher;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    public Rule add(Rule rule) {
        rule.validateRequirements();
        ruleExist(rule);

        Rule created = ruleRepository.add(rule, getUserId());
        if (rule.getTerms() != null && !rule.getTerms().isEmpty()) {
            created.setTerms(termService.addTerms(rule.getTerms(), created.getId()));
        }
        return created;
    }

    public void update(Rule rule) {
        rule.validateRequirements();
        ruleExist(rule);
        Rule current = fetchLocal(rule.getId());

        if (current.getRuleStatus().equals(RuleStatus.ESTABLISHED)) {
            if (current.getRuleType().equals(RuleType.TEXT_RULE)) {
                updateRule(rule, current);
            } else {
                current.setComment(rule.getComment());
                ruleRepository.update(current);
            }

        } else {
            updateRule(rule, current);
        }

    }

    private void updateRule(Rule rule, Rule current) {
        Integer updatedTerms = 0;
        if (rule.getTerms() != null && !rule.getTerms().isEmpty()) {
            updatedTerms = termService.updateTerms(rule.getTerms(), rule.getId());
        }
        if (!rule.equals(current) || updatedTerms > 0) {
            rule.setCreatedBy(current.getCreatedBy());
            rule.setCreatedAt(current.getCreatedAt());
            rule.setUpdatedBy(getUserId());
            rule.setUuid(current.getUuid());
            ruleRepository.update(rule);
        }
    }

    public void updateAssignedRules(List<Rule> rules, Integer docId, String docPath) {
        if (assignedRulesChanged(rules, docId)) {
            deleteAssignedRules(docId);
            addRules(rules, docId, docPath);
        }
    }

    public void addRules(List<Rule> rules, Integer docId, String docPath) {
        rules.forEach(r -> assignedRuleRepository.add(createAssignment(r.getId(), docId, docPath)));
    }

    public void deleteAssignedRules(Integer docId) {
        assignedRuleRepository.deleteByDocId(docId);
    }

    private AssignedRule createAssignment(Integer ruleId, Integer docId, String docPath) {
        return AssignedRule.builder().ruleId(ruleId).docId(docId).docPath(docPath).build();
    }

    public void establish(Integer id) {
        Rule currentRule = fetchLocal(id);

        if (currentRule.getRuleStatus().equals(RuleStatus.DRAFT)) {
            currentRule.setRuleStatus(RuleStatus.ESTABLISHED);
            ruleRepository.update(currentRule);
            publishEvent(currentRule, EventAction.FASTSTALLD, getUserId());
        }
    }

    public List<Rule> getRulesByDocId(Integer docId) {
        return ruleRepository.streamByDocId(docId).map(this::appendTerms).toList();
    }

    public RuleDto fetch(Integer id) {
        return fetchLocal(id).mapToDto();
    }

    private Rule fetchLocal(Integer id) {
        return ruleRepository.fetch(id).map(this::appendTerms)
                .orElseThrow(() -> new IllegalArgumentException("Regel-id finns inte : " + id));
    }

    public void delete(Integer id) {
        Rule currentRule = ruleRepository.fetch(id)
                .orElseThrow(() -> new IllegalArgumentException("Regel-id finns inte : " + id));

        if (currentRule.getRuleStatus().equals(RuleStatus.ESTABLISHED)) {
            throw new PreconditionFailedException(String.format(RULE_DELETE_FAILED, id, currentRule));
        }
        publishEvent(currentRule, EventAction.DELETE, getUserId());
        ruleRepository.delete(id);
    }


    public List<RuleDto> list() {
        return ruleRepository.streamAll().map(this::appendTerms).map(Rule::mapToDto).toList();
    }

    public List<RuleDto> list(RuleType ruleType) {
        return ruleRepository.streamByRuleType(ruleType).map(this::appendTerms).map(Rule::mapToDto).toList();
    }


    public List<RuleDto> list(List<List<Integer>> ranges) {
        return ruleRepository.streamByRuleType(RuleType.DEFAULT_RULE)
                .map(this::appendTerms)
                .filter(RulePredicates.getPredicates(ranges).stream().reduce(Predicate::or).orElse(t -> true))
                .map(Rule::mapToDto)
                .toList();
    }

    private Rule appendTerms(Rule rule) {
        rule.setTerms(termService.listByRule(rule.getId()));
        return rule;
    }

    private void publishEvent(Rule rule, EventAction eventAction, String userId) {
        IhpEventLoggEvent eventLog = new IhpEventLoggEvent(this);
        eventLog.setAction(eventAction.name())
                .setDescription(eventAction.getDescription())
                .setUserId(userId)
                .setObjectName(rule.getName())
                .setObjectId(rule.getUuid())
                .setType(rule.getRuleType().toString())
                .setCreated(new Date())
                .setModelId(null)
                .setHistoryId(null);
        applicationEventPublisher.publishEvent(eventLog);
    }

    private void ruleExist(Rule rule) {
        if (ruleRepository.streamAll().anyMatch(r -> r.equals(rule))) {
            throw new PreconditionFailedException("Regel med samma attribut finns fortfarande");
        }
    }

    private boolean assignedRulesChanged(List<Rule> rules, Integer docId) {
        if (rules != null) {
            List<Integer> newRules = rules.stream().map(Rule::getId).toList();
            List<Integer> currentRules = assignedRuleRepository.findByDocId(docId).map(AssignedRule::getRuleId).toList();

            if (newRules.size() != currentRules.size()) {
                return true;
            } else {
                return newRules.stream().mapToInt(Integer::intValue).sum() != currentRules.stream().mapToInt(Integer::intValue).sum();
            }
        }
        return false;
    }
}