package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicUpdate;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@DynamicUpdate
@Entity
@Table(name = "classificationstructuretypenode")
public class ClassificationStructureTypeNodeEntity implements Serializable, EntityI, EntityMapper<ClassificationStructureTypeNode> {
    @Id
    @NotNull
    @SequenceGenerator(name = "id_sequence", sequenceName = "generic_nod_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_sequence")
    private Integer id;
    @Column(name = "replaces_id")
    private Integer replacesId;
    private String name;
    private String path;
    private String status;
    private Date start;
    private Date stop;
    @Column(name = "created_at")
    private Date createdAt;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_at")
    private Date updatedAt;
    @Column(name = "updated_by")
    private String updatedBy;
    private UUID uuid;
    private String instruction;

    @Column(name = "decision_date")
    private Date decisionDate;
    private String remark;
    @Column(name = "cs_version")
    private Integer csVersion;
    @Column(name = "auth_decision")
    private String authDecision;
    @Column(name = "auth_name")
    private String authName;
    private String revised;
    @Column(name = "instruction_code_ihp")
    private String instructionCodeIhp;

    @PrePersist
    void prePersist() {

        if (createdAt == null) {
            createdAt = new Date();
        }
        if (status == null) {
            status = "utkast";
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        ClassificationStructureTypeNodeEntity that = (ClassificationStructureTypeNodeEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public ClassificationStructureTypeNode map() {
        return ClassificationStructureTypeNode.builder()
                .id(getId())
                .instructionCodeIhp(getInstructionCodeIhp())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark() == null ? "" : getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .csVersion(getCsVersion())
                .authDecision(getAuthDecision())
                .authName(getAuthName())
                .path(getPath())
                .revised(getRevised())
                .instruction(getInstruction())
                .nodeName(NodeName.CSNODE)
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updateAt(getUpdatedAt())
                .updatedBy(getUpdatedBy())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .build();
    }
}