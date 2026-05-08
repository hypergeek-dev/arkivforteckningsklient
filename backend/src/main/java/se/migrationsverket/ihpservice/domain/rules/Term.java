package se.migrationsverket.ihpservice.domain.rules;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.TermAttribute;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.TermDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.TermOperand;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.domain.DomainMapper;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.TermEntity;

import java.util.Date;
import java.util.Objects;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@SuperBuilder
public class Term implements Domain, DomainMapper<TermDto, TermEntity> {
    private Integer id;
    private TermAttribute attribute;
    private TermOperand operand;
    private String createdBy;
    private String updatedBy;
    private Date createdAt;
    private Date updatedAt;
    private Integer ruleId;
    private Integer years;
    private Integer months;
    private Integer days;

    @Override
    public TermDto mapToDto() {
        return TermDto.builder()
                .id(getId())
                .attribute(getAttribute())
                .operand(getOperand())
                .createdBy(getCreatedBy())
                .createdAt(getCreatedAt())
                .updatedBy(getUpdatedBy())
                .updatedAt(getUpdatedAt())
                .years(getYears())
                .months(getMonths())
                .days(getDays())
                .build();
    }

    @Override
    public TermEntity mapToEntity() {
        return TermEntity.builder()
                .id(getId())
                .attribute(getAttribute().name())
                .operand(getOperand().name())
                .createdBy(getCreatedBy())
                .createdAt(getCreatedAt())
                .updatedBy(getUpdatedBy())
                .updatedAt(new Date())
                .ruleId(getRuleId())
                .days(getDays())
                .months(getMonths())
                .years(getYears())
                .build();
    }

    @Override
    public TermEntity mapToEntity(String userId) {
        return TermEntity.builder()
                .id(getId())
                .attribute(getAttribute().name())
                .operand(getOperand().name())
                .createdBy(userId)
                .ruleId(getRuleId())
                .days(getDays())
                .months(getMonths())
                .years(getYears())
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Term term = (Term) o;
        return id.equals(term.id)
                && attribute == term.attribute
                && operand == term.operand
                && ruleId.equals(term.ruleId)
                && years.equals(term.years)
                && months.equals(term.months)
                && days.equals(term.days);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, attribute, operand, ruleId);
    }

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}
