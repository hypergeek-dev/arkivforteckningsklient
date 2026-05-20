package se.migrationsverket.ihpservice.repository.ihp.entities;

import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicUpdate;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.domain.ProcessGroupTypeNode;

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
@Table(name = "processgrouptypenode")
public class ProcessGroupTypeNodeEntity implements Serializable, EntityI, EntityMapper<ProcessGroupTypeNode> {
    @Id
    @NotNull
    @SequenceGenerator(name = "id_sequence", sequenceName = "generic_nod_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_sequence")
    private Integer id;
    @Column(name = "parent_id")
    private Integer parentId;
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

    @Column(name = "decision_date")
    private Date decisionDate;
    private String remark;
    @Column(name = "information_responsible")
    private String informationResponsible;
    private String contact;
    private String lawsection;
    @Column(name = "relation_structuralunit")
    private String relationStructuralunit;
    @Column(name = "arkiv_id_beteckning")
    private String arkivIdBeteckning;
    @Column(name = "forvaringsplats")
    private String forvaringsplats;
    @Column(name = "handlingar_fran")
    private Date handlingarFran;
    @Column(name = "handlingar_till")
    private Date handlingarTill;
    @Column(name = "volym_antal")
    private Integer volymAntal;

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
        ProcessGroupTypeNodeEntity that = (ProcessGroupTypeNodeEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public ProcessGroupTypeNode map() {
        return ProcessGroupTypeNode.builder()
                .id(getId())
                .parentId(getParentId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .informationResponsible(getInformationResponsible())
                .contact(getContact())
                .lawsection(getLawsection())
                .relationStructuralunit(getRelationStructuralunit())
                .nodeName(NodeName.PGNODE)
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updateAt(getUpdatedAt())
                .updatedBy(getUpdatedBy())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .arkivIdBeteckning(getArkivIdBeteckning())
                .forvaringsplats(getForvaringsplats())
                .handlingarFran(getHandlingarFran())
                .handlingarTill(getHandlingarTill())
                .volymAntal(getVolymAntal())
                .build();
    }
}