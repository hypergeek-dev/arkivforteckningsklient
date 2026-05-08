package se.migrationsverket.ihpservice.api.rest.v1.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.relations.NodeRelationDto;
import se.migrationsverket.ihpservice.domain.IssueTypeNode;
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
public class IssueTypeNodeDto extends StructureNodeDto implements DataTransferObject, DtoMapper<IssueTypeNode> {
    @NotNull
    @Schema(allowableValues = {"issuenode"})
    private final String nodeName = NodeName.ISSUENODE.getValue();
    @NotNull
    private String parentId;
    @NotNull
    private boolean register;
    @NotNull
    private String keepingUnit;
    private String number;
    private NodeStatus parentStatus;
    private List<NodeRelationDto> relations;
    private List<ElementDto> assignedElements;
    @NotNull
    private Integer index;

    public Integer getIndex() {
        return index == null ? 0 : index;
    }

    @Override
    public IssueTypeNode map() {
        return IssueTypeNode.builder()
                .id(Integer.parseInt(getId()))
                .processId(Integer.parseInt(this.getParentId()))
                .replacesId(IhpUtils.nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(String.valueOf(getStatus()))
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .number(getNumber())
                .uuid(getUuid())
                .index(getIndex())
                .localPath(getLocalPath())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .assignedElements(getAssignedElements() == null ? new ArrayList<>() : getAssignedElements().stream().map(ElementDto::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public IssueTypeNode addMap() {
        return IssueTypeNode.builder()
                .processId(Integer.parseInt(this.getParentId()))
                .replacesId(IhpUtils.nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus() == null ? NodeStatus.UTKAST.toString() : String.valueOf(getStatus()))
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .path(getPath())
                .index(getIndex())
                .number(getNumber())
                .uuid(UUID.randomUUID())
                .localPath(getLocalPath())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelationDto::map).collect(Collectors.toList()))
                .assignedElements(getAssignedElements() == null ? new ArrayList<>() : getAssignedElements().stream().map(ElementDto::map).collect(Collectors.toList()))
                .build();
    }

    @Override
    public Integer extractPartialPath() {
        return index;
    }
}
