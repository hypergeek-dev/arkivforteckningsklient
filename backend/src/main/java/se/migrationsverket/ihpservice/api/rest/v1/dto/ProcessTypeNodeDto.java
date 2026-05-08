package se.migrationsverket.ihpservice.api.rest.v1.dto;

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
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .build();
    }
}
