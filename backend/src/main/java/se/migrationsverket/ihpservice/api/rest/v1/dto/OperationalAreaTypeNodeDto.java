package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.relations.NodeRelationDto;
import se.migrationsverket.ihpservice.domain.OperationalAreaTypeNode;
import se.migrationsverket.ihpservice.support.IhpUtils;

import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class OperationalAreaTypeNodeDto extends StructureNodeDto implements DataTransferObject, DtoMapper<OperationalAreaTypeNode> {
    @NotNull
    @Schema(allowableValues = {"oanode"})
    private final String nodeName = NodeName.OANODE.getValue();
    @NotNull
    private String parentId;
    private String informationResponsible;
    private String contact;
    private String lawsection;
    private String relationStructuralunit;
    @NotNull
    private String authDecision;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date decisionDate;
    private NodeStatus parentStatus;
    private List<NodeRelationDto> relations;
    private String orgNummer;
    private String arkivansvarig;
    private String adress;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date verksamhetsperiodStart;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date verksamhetsperiodSlut;

    @Override
    public OperationalAreaTypeNode map() {
        return OperationalAreaTypeNode.builder()
                .id(Integer.parseInt(getId()))
                .csnodeId(Integer.parseInt(this.getParentId()))
                .replacesId(IhpUtils.nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(String.valueOf(getStatus()))
                .informationResponsible(getInformationResponsible())
                .contact(getContact())
                .lawsection(getLawsection())
                .relationStructuralunit(getRelationStructuralunit())
                .path(getPath())
                .partialPath(getPartialPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .authDecision(getAuthDecision())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .orgNummer(getOrgNummer())
                .arkivansvarig(getArkivansvarig())
                .adress(getAdress())
                .verksamhetsperiodStart(getVerksamhetsperiodStart())
                .verksamhetsperiodSlut(getVerksamhetsperiodSlut())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public OperationalAreaTypeNode addMap() {
        return OperationalAreaTypeNode.builder()
                .csnodeId(Integer.parseInt(this.getParentId()))
                .replacesId(IhpUtils.nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus() == null ? NodeStatus.UTKAST.toString() : String.valueOf(getStatus()))
                .informationResponsible(getInformationResponsible())
                .contact(getContact())
                .lawsection(getLawsection())
                .relationStructuralunit(getRelationStructuralunit())
                .path(getPath())
                .authDecision(getAuthDecision())
                .decisionDate(getDecisionDate())
                .uuid(UUID.randomUUID())
                .orgNummer(getOrgNummer())
                .arkivansvarig(getArkivansvarig())
                .adress(getAdress())
                .verksamhetsperiodStart(getVerksamhetsperiodStart())
                .verksamhetsperiodSlut(getVerksamhetsperiodSlut())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }

}
