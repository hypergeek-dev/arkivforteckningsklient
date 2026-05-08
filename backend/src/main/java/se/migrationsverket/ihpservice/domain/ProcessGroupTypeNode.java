package se.migrationsverket.ihpservice.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ProcessGroupTypeNodeDto;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.repository.ihp.entities.ProcessGroupTypeNodeEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static se.migrationsverket.ihpservice.support.IhpUtils.nullIntegerToString;

@Data
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class ProcessGroupTypeNode extends StructureTypeNode implements Domain, DomainMapper<ProcessGroupTypeNodeDto, ProcessGroupTypeNodeEntity> {
    private Integer parentId;
    private String informationResponsible;
    private String contact;
    private String lawsection;
    private String relationStructuralunit;
    private Date decisionDate;
    private NodeStatus parentStatus;
    private List<NodeRelation> relations;
    private List<ProcessGroupTypeNode> relationsNodes;

    @Override
    public ProcessGroupTypeNodeDto mapToDto() {
        return ProcessGroupTypeNodeDto.builder()
                .id(Integer.toString(getId()))
                .parentId(Integer.toString(getParentId()))
                .replacesId(nullIntegerToString(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .parentStatus(getParentStatus())
                .status(NodeStatus.getNodeStatus(getStatus()))
                .informationResponsible(getInformationResponsible())
                .contact(getContact())
                .lawsection(getLawsection())
                .relationStructuralunit(getRelationStructuralunit())
                .path(getPath())
                .partialPath(extractPartialPath())
                .localPath(extractLocalPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updatedBy(getUpdatedBy())
                .updated(getUpdateAt())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelation::mapToDto).collect(Collectors.toList()))
                .build();
    }

    @Override
    public ProcessGroupTypeNodeEntity mapToEntity() {
        return ProcessGroupTypeNodeEntity.builder()
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
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updatedAt(new Date())
                .updatedBy(getUpdatedBy())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .build();
    }

    @Override
    public ProcessGroupTypeNodeEntity mapToEntity(String userId) {
        return ProcessGroupTypeNodeEntity.builder()
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
                .path(getPath())
                .createdBy(userId)
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .build();
    }

    public void updatePath() {
        if (getPartialPath() != null) {
            setPath(getPath().substring(0, getPath().lastIndexOf(".") + 1) + getPartialPath());
        }
    }

    public void updateFromParentPath(String newParentPath) {
        setPath(newParentPath + newParentPath.substring(newParentPath.lastIndexOf("/")) + getPath().substring(getPath().lastIndexOf(".")));
    }

    public void copy(Integer toParentId, String toParentPath, boolean partialCopy) {
        if (partialCopy) {

            setName("Kopia " + getName());
        }
        setStatus(NodeStatus.UTKAST.toString());
        setUuid(UUID.randomUUID());
        if (toParentId != null) {
            setParentId(toParentId);
            setPath(toParentPath + toParentPath.substring(toParentPath.lastIndexOf("/")) + getPath().substring(getPath().lastIndexOf(".")));
        } else {
            setPath(null);
        }
    }

    @Override
    public void validateRequirements() {
        super.validateRequirements();
        if (getParentId() == null || getParentId() == 0) {
            throw new PreconditionFailedException("Obligatoriska attribut saknas");
        }
    }
}
