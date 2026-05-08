package se.migrationsverket.ihpservice.repository.ihp.entities;

import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicUpdate;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.domain.IssueTypeNode;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotNull;

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
@Table(name = "issuetypenode")
public class IssueTypeNodeEntity implements Serializable, EntityI, EntityMapper<IssueTypeNode> {
    @Id
    @NotNull
    @SequenceGenerator(name = "id_sequence", sequenceName = "generic_nod_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_sequence")
    private Integer id;
    @Column(name = "process_id")
    private Integer processId;
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
    private String remark;
    private Boolean register;
    @Column(name = "keeping_unit")
    private String keepingUnit;
    private String number;
    private Integer index;
    private UUID uuid;

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
        IssueTypeNodeEntity that = (IssueTypeNodeEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public Integer getIndex() {
        return index == null ? 0 : index;
    }

    @Override
    public IssueTypeNode map() {
        return IssueTypeNode.builder()
                .id(getId())
                .processId(getProcessId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .register(getRegister())
                .keepingUnit(getKeepingUnit())
                .nodeName(NodeName.ISSUENODE)
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updateAt(getUpdatedAt())
                .updatedBy(getUpdatedBy())
                .number(getNumber())
                .uuid(getUuid())
                .index(getIndex())
                .build();
    }
}