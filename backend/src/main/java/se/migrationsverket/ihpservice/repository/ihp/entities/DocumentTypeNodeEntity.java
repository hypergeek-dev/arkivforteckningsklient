package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.DynamicUpdate;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.domain.DocumentTypeNode;

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
@Table(name = "documenttypenode")
public class DocumentTypeNodeEntity implements Serializable, EntityI, EntityMapper<DocumentTypeNode> {
    @Id
    @NotNull
    @SequenceGenerator(name = "id_sequence", sequenceName = "generic_nod_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_sequence")
    private Integer id;
    @Column(name = "issuetype_id")
    private Integer issuetypeId;
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
    @Column(name = "signature_required")
    private Boolean signatureRequired;
    private Integer informationsecurityclass;
    private Boolean secrecy;
    @Column(name = "secrecy_lawsection")
    private String secrecyLawsection;
    @Column(name = "personal_data")
    private Boolean personalData;
    private UUID uuid;
    private String regulation;
    @Column(name = "manual_evaluation")
    private Boolean manualEvaluation;
    private Integer index;
    @Column(name = "volymnum")
    private String volymnum;
    @Column(name = "forvaringsplats")
    private String forvaringsplats;
    @Column(name = "format_beskriv")
    private String formatBeskriv;
    @Column(name = "tillganglighet")
    private String tillganglighet;
    @Column(name = "omfang")
    private String omfang;

    @PrePersist
    void prePersist() {

        if (createdAt == null) {
            createdAt = new Date();
        }
        if (secrecy == null) {
            secrecy = false;
        }
        if (personalData == null) {
            personalData = false;
        }
        if (status == null) {
            status = "utkast";
        }
        if (manualEvaluation == null) {
            manualEvaluation = false;
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
        DocumentTypeNodeEntity that = (DocumentTypeNodeEntity) o;
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
    public DocumentTypeNode map() {
        return DocumentTypeNode.builder()
                .id(getId())
                .issuetypeId(getIssuetypeId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .register(getRegister())
                .keepingUnit(getKeepingUnit())
                .signatureRequired(getSignatureRequired())
                .informationsecurityclass(getInformationsecurityclass())
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updateAt(getUpdatedAt())
                .updatedBy(getUpdatedBy())
                .nodeName(NodeName.DOCUMENTNODE)
                .secrecy(getSecrecy())
                .secrecyLawsection(getSecrecyLawsection())
                .personalData(getPersonalData())
                .uuid(getUuid())
                .index(getIndex())
                .regulation(getRegulation())
                .manualEvaluation(getManualEvaluation())
                .volymnum(getVolymnum())
                .forvaringsplats(getForvaringsplats())
                .formatBeskriv(getFormatBeskriv())
                .tillganglighet(getTillganglighet())
                .omfang(getOmfang())
                .build();
    }
}