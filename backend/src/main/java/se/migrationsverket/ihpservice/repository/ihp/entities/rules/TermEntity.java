package se.migrationsverket.ihpservice.repository.ihp.entities.rules;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.TermAttribute;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.TermOperand;
import se.migrationsverket.ihpservice.domain.rules.Term;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import jakarta.persistence.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "term")
public class TermEntity implements EntityI, EntityMapper<Term> {
    @Id
    @SequenceGenerator(name = "termid_seq", sequenceName = "term_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "termid_seq")
    private Integer id;
    private String attribute;
    private String operand;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_by")
    private String updatedBy;
    @Column(name = "created_at")
    private Date createdAt;
    @Column(name = "updated_at")
    private Date updatedAt;
    @Column(name = "rule_id")
    private Integer ruleId;
    private Integer years;
    private Integer months;
    private Integer days;


    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = new Date();
        }
    }

    @Override
    public Term map() {
        return Term.builder()
                .id(getId())
                .attribute(TermAttribute.valueOf(getAttribute()))
                .operand(TermOperand.valueOf(getOperand()))
                .createdBy(getCreatedBy())
                .createdAt(getCreatedAt())
                .updatedBy(getUpdatedBy())
                .updatedAt(getUpdatedAt())
                .ruleId(getRuleId())
                .years(getYears())
                .months(getMonths())
                .days(getDays())
                .build();
    }
}
