package se.migrationsverket.ihpservice.api.rest.v1.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleDto;
import se.migrationsverket.ihpservice.domain.DocumentTypeNode;
import se.migrationsverket.ihpservice.support.IhpUtils;

import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class DocumentTypeNodeDto extends StructureNodeDto implements DataTransferObject, DtoMapper<DocumentTypeNode> {
    @NotNull
    @Schema(allowableValues = {"documentnode"})
    private final String nodeName = NodeName.DOCUMENTNODE.getValue();
    @NotNull
    private String parentId;
    @NotNull
    private NodeStatus parentStatus;
    @NotNull
    private boolean register;
    @NotNull
    private String keepingUnit;
    @NotNull
    private boolean signatureRequired;
    @NotNull
    private String informationsecurityclass;
    @NotNull
    private boolean secrecy;
    private String secrecyLawsection;
    @NotNull
    private boolean personalData;
    private String regulation;
    @NotNull
    private Boolean manualEvaluation;
    @NotNull
    private List<RuleDto> assignedRules;
    @NotNull
    private List<ElementDto> assignedElements;
    @NotNull
    private Integer index;

    public Integer getIndex() {
        return index == null ? 0 : index;
    }

    @Override
    public DocumentTypeNode map() {
        return DocumentTypeNode.builder()
                .id(Integer.parseInt(getId()))
                .issuetypeId(Integer.parseInt(this.getParentId()))
                .replacesId(IhpUtils.nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(String.valueOf(getStatus()))
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .signatureRequired(isSignatureRequired())
                .informationsecurityclass(Integer.parseInt(getInformationsecurityclass()))
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .secrecy(isSecrecy())
                .secrecyLawsection(getSecrecyLawsection())
                .personalData(isPersonalData())
                .uuid(getUuid())
                .localPath(getLocalPath())
                .index(getIndex())
                .regulation(getRegulation())
                .manualEvaluation(getManualEvaluation())
                .assignedRules(getAssignedRules() == null ? new ArrayList<>() : getAssignedRules().stream().map(RuleDto::map).collect(Collectors.toList()))
                .assignedElements(getAssignedElements() == null ? new ArrayList<>() : getAssignedElements().stream().map(ElementDto::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public DocumentTypeNode addMap() {
        int infoClass = getInformationsecurityclass() == null || getInformationsecurityclass().isEmpty() ? 0 : Integer.parseInt(getInformationsecurityclass());
        return DocumentTypeNode.builder()
                .issuetypeId(Integer.parseInt(this.getParentId()))
                .replacesId(IhpUtils.nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus() == null ? NodeStatus.UTKAST.toString() : String.valueOf(getStatus()))
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .signatureRequired(isSignatureRequired())
                .informationsecurityclass(infoClass)
                .path(getPath())
                .secrecy(isSecrecy())
                .personalData(isPersonalData())
                .uuid(UUID.randomUUID())
                .regulation(getRegulation())
                .localPath(getLocalPath())
                .index(getIndex())
                .manualEvaluation(getManualEvaluation())
                .assignedRules(getAssignedRules() == null ? new ArrayList<>() : getAssignedRules().stream().map(RuleDto::map).collect(Collectors.toList()))
                .assignedElements(getAssignedElements() == null ? new ArrayList<>() : getAssignedElements().stream().map(ElementDto::map).collect(Collectors.toList()))
                .secrecyLawsection(getSecrecyLawsection())
                .build();
    }

    @Override
    public Integer extractPartialPath() {
        return index;
    }
}
