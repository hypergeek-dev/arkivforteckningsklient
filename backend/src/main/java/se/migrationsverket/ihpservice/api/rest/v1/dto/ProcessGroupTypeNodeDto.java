package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.relations.NodeRelationDto;
import se.migrationsverket.ihpservice.domain.ProcessGroupTypeNode;
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
public class ProcessGroupTypeNodeDto extends StructureNodeDto implements DataTransferObject, DtoMapper<ProcessGroupTypeNode> {
    @NotNull
    @Schema(allowableValues = {"pgnode"})
    private final String nodeName = NodeName.PGNODE.getValue();
    @NotNull
    private String parentId;
    private String informationResponsible;
    private String contact;
    private String lawsection;
    private String relationStructuralunit;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date decisionDate;
    private NodeStatus parentStatus;
    private List<NodeRelationDto> relations;
    private String arkivIdBeteckning;
    private String forvaringsplats;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date handlingarFran;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date handlingarTill;
    private Integer volymAntal;

    @Override
    public ProcessGroupTypeNode map() {
        return ProcessGroupTypeNode.builder()
                .id(Integer.parseInt(getId()))
                .parentId(Integer.parseInt(getParentId()))
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
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .arkivIdBeteckning(getArkivIdBeteckning())
                .forvaringsplats(getForvaringsplats())
                .handlingarFran(getHandlingarFran())
                .handlingarTill(getHandlingarTill())
                .volymAntal(getVolymAntal())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public ProcessGroupTypeNode addMap() {
        return ProcessGroupTypeNode.builder()
                .parentId(Integer.parseInt(getParentId()))
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
                .decisionDate(getDecisionDate())
                .uuid(UUID.randomUUID())
                .arkivIdBeteckning(getArkivIdBeteckning())
                .forvaringsplats(getForvaringsplats())
                .handlingarFran(getHandlingarFran())
                .handlingarTill(getHandlingarTill())
                .volymAntal(getVolymAntal())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }


}
