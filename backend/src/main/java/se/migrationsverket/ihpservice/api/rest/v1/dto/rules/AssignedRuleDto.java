package se.migrationsverket.ihpservice.api.rest.v1.dto.rules;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DtoMapper;
import se.migrationsverket.ihpservice.domain.rules.AssignedRule;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AssignedRuleDto implements DataTransferObject, DtoMapper<AssignedRule> {
    private Integer id;
    private Integer ruleId;
    private Integer docId;
    private String docPath;

    @Override
    public AssignedRule map() {
        return AssignedRule.builder()
                .id(getId())
                .ruleId(getRuleId())
                .docId(getDocId())
                .docPath(getDocPath())
                .build();
    }

    @Override
    public AssignedRule addMap() {
        return AssignedRule.builder()
                .ruleId(getRuleId())
                .docId(getDocId())
                .docPath(getDocPath())
                .build();
    }
}
