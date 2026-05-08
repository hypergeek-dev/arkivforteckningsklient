package se.migrationsverket.ihpservice.domain.rules;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.AssignedRuleDto;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.domain.DomainMapper;
import se.migrationsverket.ihpservice.repository.ihp.entities.rules.AssignedRuleEntity;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@SuperBuilder
public class AssignedRule implements Domain, DomainMapper<AssignedRuleDto, AssignedRuleEntity> {
    private Integer id;
    private Integer ruleId;
    private Integer docId;
    private String docPath;

    @Override
    public AssignedRuleDto mapToDto() {
        return AssignedRuleDto.builder()
                .id(getId())
                .ruleId(getRuleId())
                .docId(getDocId())
                .docPath(getDocPath())
                .build();
    }

    @Override
    public AssignedRuleEntity mapToEntity() {
        return AssignedRuleEntity.builder()
                .id(getId())
                .ruleId(getRuleId())
                .docId(getDocId())
                .docPath(getDocPath())
                .build();
    }

    @Override
    public AssignedRuleEntity mapToEntity(String userId) {
        return AssignedRuleEntity.builder()
                .ruleId(getRuleId())
                .docId(getDocId())
                .docPath(getDocPath())
                .build();
    }

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}
