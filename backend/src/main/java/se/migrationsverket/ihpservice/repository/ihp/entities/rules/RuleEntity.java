package se.migrationsverket.ihpservice.repository.ihp.entities.rules;

import jakarta.persistence.*;
import lombok.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleType;
import se.migrationsverket.ihpservice.domain.rules.Rule;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "rule")
public class RuleEntity implements Serializable, EntityI, EntityMapper<Rule> {
    @Id
    @SequenceGenerator(name = "ruleid_seq", sequenceName = "rule_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ruleid_seq")
    private Integer id;
    @Column(name = "ruletype")
    private String ruleType;
    private String description;
    private String comment;
    @Column(name = "status")
    private String ruleStatus;
    private String name;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_by")
    private String updatedBy;
    @Column(name = "created_at")
    private Date createdAt;
    @Column(name = "updated_at")
    private Date updatedAt;
    private UUID uuid;

    @PrePersist
    void prePersist() {

        if (createdAt == null) {
            createdAt = new Date();
        }
        if (ruleStatus == null) {
            ruleStatus = "utkast";
        }
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }

    @Override
    public Rule map() {
        return Rule.builder()
                .id(getId())
                .ruleType(RuleType.valueOf(getRuleType()))
                .description(getDescription())
                .ruleStatus(RuleStatus.getRuleStatus(getRuleStatus()))
                .name(getName())
                .comment(getComment())
                .createdBy(getCreatedBy())
                .createdAt(getCreatedAt())
                .updatedBy(getUpdatedBy())
                .updatedAt(getUpdatedAt())
                .uuid(getUuid())
                .build();
    }
}
