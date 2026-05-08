package se.migrationsverket.ihpservice.repository.ihp.entities.rules;

import lombok.*;
import se.migrationsverket.ihpservice.domain.rules.AssignedRule;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import jakarta.persistence.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "assignedrule")
public class AssignedRuleEntity implements Serializable, EntityI, EntityMapper<AssignedRule> {
    @Id
    @SequenceGenerator(name = "assignedrule_id_seq", sequenceName = "assignedrule_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "assignedrule_id_seq")
    private Integer id;
    @Column(name = "rule_id")
    private Integer ruleId;
    @Column(name = "doc_id")
    private Integer docId;
    @Column(name = "doc_path")
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

}

