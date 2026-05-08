package se.migrationsverket.ihpservice.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.OperationalAreaTypeNodeDto;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.repository.ihp.entities.OperationalAreaTypeNodeEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static se.migrationsverket.ihpservice.support.IhpUtils.nullIntegerToString;

@Data
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class OperationalAreaTypeNode extends StructureTypeNode implements Domain, DomainMapper<OperationalAreaTypeNodeDto, OperationalAreaTypeNodeEntity> {
    private Integer csnodeId;
    private String informationResponsible;
    private String contact;
    private String lawsection;
    private String relationStructuralunit;
    private String authDecision;
    private Date decisionDate;
    private NodeStatus parentStatus;
    private List<NodeRelation> relations;

    @Override
    public OperationalAreaTypeNodeDto mapToDto() {
        return OperationalAreaTypeNodeDto.builder()
                .id(Integer.toString(getId()))
                .parentId(Integer.toString(getCsnodeId()))
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
                .updated(getUpdateAt())
                .updatedBy(getUpdatedBy())
                .authDecision(getAuthDecision())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelation::mapToDto).collect(Collectors.toList()))
                .build();
    }

    @Override
    public OperationalAreaTypeNodeEntity mapToEntity() {
        return OperationalAreaTypeNodeEntity.builder()
                .id(getId())
                .csnodeId(getCsnodeId())
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
                .authDecision(getAuthDecision())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .build();
    }

    @Override
    public OperationalAreaTypeNodeEntity mapToEntity(String userId) {
        return OperationalAreaTypeNodeEntity.builder()
                .csnodeId(getCsnodeId())
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
                .authDecision(getAuthDecision())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .build();
    }

    @Override
    public Integer extractPartialPath() {
        return Integer.parseInt(getPath().substring(getPath().lastIndexOf("/") + 1));
    }

    public void updatePath() {
        if (getPartialPath() != null) {
            setPath(getPath().replace(getPath().substring(getPath().lastIndexOf("/") + 1), Integer.toString(getPartialPath())));
        }
    }

    public void copy(Integer toParentId, String toParentPath, boolean partialCopy) {
        if (partialCopy) {
            setName("Kopia " + getName());
        }
        setStatus(NodeStatus.UTKAST.toString());
        setUuid(UUID.randomUUID());
        if (toParentId != null) {
            setCsnodeId(toParentId);
            setPath(toParentPath + getPath().substring(getPath().lastIndexOf("/")));
        }
    }

    @Override
    public void validateRequirements() {
        super.validateRequirements();
        if (getCsnodeId() == null || this.getCsnodeId() == 0) {
            throw new PreconditionFailedException("Obligatoriska attribut saknas");
        }
    }
}
