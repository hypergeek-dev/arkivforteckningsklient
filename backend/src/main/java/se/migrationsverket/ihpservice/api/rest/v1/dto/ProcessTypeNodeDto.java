package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.relations.NodeRelationDto;
import se.migrationsverket.ihpservice.domain.ProcessTypeNode;
import se.migrationsverket.ihpservice.support.IhpUtils;

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
public class ProcessTypeNodeDto extends StructureNodeDto implements DataTransferObject, DtoMapper<ProcessTypeNode> {
    @NotNull
    @Schema(allowableValues = {"processnode"})
    private final String nodeName = NodeName.PROCESSNODE.getValue();
    @NotNull
    private String parentId;
    private String informationResponsible;
    private String contact;
    private String lawsection;
    private String relationStructuralunit;
    private String number;
    private NodeStatus parentStatus;
    private List<NodeRelationDto> relations;
    private String seriesignum;
    private String serieRubrik;
    private String forvaringsplats;
    private String innehall;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date handlingarFran;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date handlingarTill;
    private String omfang;

    @Override
    public ProcessTypeNode map() {
        return ProcessTypeNode.builder()
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
                .number(getNumber())
                .uuid(getUuid())
                .seriesignum(getSeriesignum())
                .serieRubrik(getSerieRubrik())
                .forvaringsplats(getForvaringsplats())
                .innehall(getInnehall())
                .handlingarFran(getHandlingarFran())
                .handlingarTill(getHandlingarTill())
                .omfang(getOmfang())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public ProcessTypeNode addMap() {
        return ProcessTypeNode.builder()
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
                .number(getNumber())
                .uuid(UUID.randomUUID())
                .seriesignum(getSeriesignum())
                .serieRubrik(getSerieRubrik())
                .forvaringsplats(getForvaringsplats())
                .innehall(getInnehall())
                .handlingarFran(getHandlingarFran())
                .handlingarTill(getHandlingarTill())
                .omfang(getOmfang())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }
}
