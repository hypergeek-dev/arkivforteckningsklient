package se.migrationsverket.ihpservice.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DocumentTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.elements.Element;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.rules.Rule;
import se.migrationsverket.ihpservice.repository.ihp.entities.DocumentTypeNodeEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static se.migrationsverket.ihpservice.support.IhpUtils.nullIntegerToString;

@Data
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class DocumentTypeNode extends StructureTypeNode implements Domain, DomainMapper<DocumentTypeNodeDto, DocumentTypeNodeEntity> {
    private Integer issuetypeId;
    private boolean register;
    private String keepingUnit;
    private boolean signatureRequired;
    private Integer informationsecurityclass;
    private Boolean secrecy;
    private String secrecyLawsection;
    private Boolean personalData;
    private NodeStatus parentStatus;
    private String regulation;
    private Boolean manualEvaluation;
    private List<Rule> assignedRules;
    private List<Element> assignedElements;
    private Integer index;
    private String volymnum;
    private String forvaringsplats;
    private String formatBeskriv;
    private String tillganglighet;
    private String omfang;

    @Override
    public DocumentTypeNodeDto mapToDto() {
        return DocumentTypeNodeDto.builder()
                .id(Integer.toString(getId()))
                .parentId(Integer.toString(getIssuetypeId()))
                .replacesId(nullIntegerToString(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .parentStatus(getParentStatus())
                .status(NodeStatus.getNodeStatus(getStatus()))
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .signatureRequired(isSignatureRequired())
                .informationsecurityclass(Integer.toString(getInformationsecurityclass()))
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updated(getUpdateAt())
                .updatedBy(getUpdatedBy())
                .localPath(extractLocalPath())
                .index(getIndex())
                .secrecy(getSecrecy())
                .secrecyLawsection(getSecrecyLawsection())
                .personalData(getPersonalData())
                .uuid(getUuid())
                .assignedRules(getAssignedRules() == null ? new ArrayList<>() : getAssignedRules().stream().map(Rule::mapToDto).collect(Collectors.toList()))
                .assignedElements(getAssignedElements() == null ? new ArrayList<>() : getAssignedElements().stream().map(Element::mapToDto).collect(Collectors.toList()))
                .regulation(getRegulation())
                .manualEvaluation(getManualEvaluation())
                .volymnum(getVolymnum())
                .forvaringsplats(getForvaringsplats())
                .formatBeskriv(getFormatBeskriv())
                .tillganglighet(getTillganglighet())
                .omfang(getOmfang())
                .build();
    }

    @Override
    public DocumentTypeNodeEntity mapToEntity() {
        return DocumentTypeNodeEntity.builder()
                .id(getId())
                .issuetypeId(getIssuetypeId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .signatureRequired(isSignatureRequired())
                .informationsecurityclass(getInformationsecurityclass())
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updatedAt(new Date())
                .updatedBy(getUpdatedBy())
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

    @Override
    public DocumentTypeNodeEntity mapToEntity(String userId) {
        return DocumentTypeNodeEntity.builder()
                .issuetypeId(getIssuetypeId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .signatureRequired(isSignatureRequired())
                .informationsecurityclass(getInformationsecurityclass())
                .path(getPath())
                .createdBy(userId)
                .uuid(getUuid())
                .index(getIndex())
                .regulation(getRegulation())
                .manualEvaluation(getManualEvaluation())
                .secrecy(getSecrecy())
                .secrecyLawsection(getSecrecyLawsection())
                .personalData(getPersonalData())
                .volymnum(getVolymnum())
                .forvaringsplats(getForvaringsplats())
                .formatBeskriv(getFormatBeskriv())
                .tillganglighet(getTillganglighet())
                .omfang(getOmfang())
                .build();
    }

    @Override
    public String extractLocalPath() {
        String[] split = getPath().split("/");
        return split[split.length - 3] + "." + getIndex();
    }

    public String extractName() {
        return getPath().substring(getPath().lastIndexOf("/HT") + 4);
    }

    public void updatePath() {
        setPath(getPath().substring(0, getPath().lastIndexOf("/HT") + 4) + getModifiedName());
    }

    public void updateFromParentPath(String newParentPath) {
        setPath(newParentPath + "/HT " + getModifiedName());
    }

    public void copy(Integer toParentId, String toParentPath, boolean partialCopy) {
        if (partialCopy) {
            setStatus(NodeStatus.UTKAST.toString());
            setCopyName();
        }
        setUuid(UUID.randomUUID());
        if (toParentId != null) {
            setIssuetypeId(toParentId);
            setPath(toParentPath + "/HT " + getModifiedName());
        } else {
            setPath(getPath().replace("/HT", "/HT COPY"));
        }
    }

    public boolean hasValidAssignment() {
        if(assignmentsExist() && regulationIsMissing()){
            throw new PreconditionFailedException("Lagrum måste vara ifyllt om man kopplat gallringregler till handlingstypen: "+getAssignedRules().toString());
        }
        return assignmentsExist();
    }

    @Override
    public void validateRequirements() {
        super.validateRequirements();
        if (getIssuetypeId() == null || getIssuetypeId() == 0 ||
                getKeepingUnit() == null || getKeepingUnit().isEmpty()) {
            throw new PreconditionFailedException("Obligatoriska attribut saknas");
        }
    }

    private boolean assignmentsExist() {
        return getAssignedRules() != null && !getAssignedRules().isEmpty();
    }

    private boolean regulationIsMissing() {
        return getRegulation() == null || getRegulation().isEmpty();
    }

}
