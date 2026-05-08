package se.migrationsverket.ihpservice.domain.rules;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleType;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.TermAttribute;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.domain.DomainMapper;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.RuleEntity;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Data
@SuperBuilder
public class Rule implements Domain, DomainMapper<RuleDto, RuleEntity> {
    private Integer id;
    private RuleType ruleType;
    private String description;
    private RuleStatus ruleStatus;
    private String comment;
    private List<Term> terms;
    private String name;
    private String createdBy;
    private String updatedBy;
    private Date createdAt;
    private Date updatedAt;
    private UUID uuid;


    @Override
    public RuleDto mapToDto() {
        return RuleDto.builder()
                .id(getId())
                .ruleType(getRuleType())
                .description(getDescription())
                .status(getRuleStatus())
                .terms(getRuleType().equals(RuleType.TEXT_RULE) || getTerms() == null ? new ArrayList<>() : getTerms().stream().map(Term::mapToDto).collect(Collectors.toList()))
                .name(getName())
                .comment(getComment() != null ? getComment() : "")
                .createdBy(getCreatedBy())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .updatedAt(getUpdatedAt())
                .uuid(getUuid())
                .build();
    }

    @Override
    public RuleEntity mapToEntity() {
        return RuleEntity.builder()
                .id(getId())
                .ruleType(getRuleType().name())
                .description(getDescription())
                .ruleStatus(getRuleStatus().getValue())
                .name(getName())
                .comment(getComment())
                .createdBy(getCreatedBy())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .updatedAt(new Date())
                .uuid(getUuid())
                .build();
    }

    @Override
    public RuleEntity mapToEntity(String userId) {
        return RuleEntity.builder()
                .ruleType(getRuleType().name())
                .description(getDescription())
                .comment(getComment())
                .name(getName())
                .createdBy(userId)
                .build();
    }

    @Override
    public void validateRequirements() {
        Predicate<Term> invalidExcTerms = t -> {
            TermAttribute attribute = t.getAttribute();
            return !attribute.equals(TermAttribute.ISSUE_APPEALED) &&
                    !attribute.equals(TermAttribute.RELATED_ISSUE_APPEALED);
        };

        Predicate<Term> invalidDefaultTerms = t -> {
            TermAttribute attribute = t.getAttribute();
            return attribute.equals(TermAttribute.ISSUE_APPEALED) ||
                    attribute.equals(TermAttribute.RELATED_ISSUE_APPEALED);
        };

        RuleType type = getRuleType();
        switch (type) {
            case TEXT_RULE:
                if (getTerms() != null && !getTerms().isEmpty()) {
                    throw new IllegalArgumentException("Textrule cannot have terms");
                }
                break;
            case DEFAULT_RULE:
                if (getTerms().stream().anyMatch(invalidDefaultTerms)) {
                    throw new IllegalArgumentException("Invalid termattribute for defaultrule");
                }
                break;
            case EXCEPTION_RULE:
                if (getTerms().stream().anyMatch(invalidExcTerms)) {
                    throw new IllegalArgumentException("Invalid termattribute for exceptionrule");
                }
                break;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Rule rule = (Rule) o;
        return ruleType == rule.ruleType && Objects.equals(description, rule.description) && Objects.equals(comment, rule.comment) && Objects.equals(name, rule.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ruleType, description, comment, name);
    }
}