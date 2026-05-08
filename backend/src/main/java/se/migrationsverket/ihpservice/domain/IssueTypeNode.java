package se.migrationsverket.ihpservice.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IssueTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.elements.Element;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.repository.ihp.entities.IssueTypeNodeEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static se.migrationsverket.ihpservice.support.IhpUtils.nullIntegerToString;

@Data
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class IssueTypeNode extends StructureTypeNode implements Domain, DomainMapper<IssueTypeNodeDto, IssueTypeNodeEntity> {
    private Integer processId;
    private boolean register;
    private String keepingUnit;
    private String number;
    private NodeStatus parentStatus;
    private List<NodeRelation> relations;
    private List<Element> assignedElements;
    private Integer index;

    public Integer getIndex() {
        if (index == null){
            return 0;
        }
        return index;
    }

    @Override
    public IssueTypeNodeDto mapToDto() {
        return IssueTypeNodeDto.builder()
                .id(Integer.toString(getId()))
                .parentId(Integer.toString(getProcessId()))
                .replacesId(nullIntegerToString(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .parentStatus(getParentStatus())
                .status(NodeStatus.getNodeStatus(getStatus()))
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .localPath(extractLocalPath())
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updated(getUpdateAt())
                .updatedBy(getUpdatedBy())
                .number(getNumber())
                .index(getIndex())
                .uuid(getUuid())
                .relations(getRelations() == null ? new ArrayList<>() : getRelations().stream().map(NodeRelation::mapToDto).collect(Collectors.toList()))
                .assignedElements(getAssignedElements() == null ? new ArrayList<>() : getAssignedElements().stream().map(Element::mapToDto).collect(Collectors.toList()))
                .build();
    }

    @Override
    public IssueTypeNodeEntity mapToEntity() {
        return IssueTypeNodeEntity.builder()
                .id(getId())
                .processId(getProcessId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .updatedAt(new Date())
                .updatedBy(getUpdatedBy())
                .number(extractNumber())
                .index(getIndex())
                .uuid(getUuid())
                .build();
    }

    private String extractNumber(){
        if(getNumber() == null && getPath() != null){
            String shorterPath = getPath().substring(0, getPath().lastIndexOf('/'));
            return shorterPath.substring(shorterPath.lastIndexOf('/') + 1);
        } else if(getNumber() == null && getLocalPath() != null){
            return getLocalPath().substring(0, getLocalPath().lastIndexOf('.'));
        }
        return getNumber();
    }

    @Override
    public IssueTypeNodeEntity mapToEntity(String userId) {
        return IssueTypeNodeEntity.builder()
                .processId(getProcessId())
                .replacesId(getReplacesId())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .status(getStatus())
                .register(isRegister())
                .keepingUnit(getKeepingUnit())
                .path(getPath())
                .createdBy(userId)
                .number(getNumber())
                .index(getIndex())
                .uuid(getUuid())
                .build();
    }

    public String extractName() {
        return getPath().substring(getPath().lastIndexOf("/ÄT") + 4);
    }

    public void updatePath() {
        setPath(getPath().substring(0, getPath().lastIndexOf("/ÄT") + 4) + getModifiedName());
    }

    public void updateFromParentPath(String newParentPath) {
        setPath(newParentPath + "/ÄT " + getModifiedName());
        String[] partial = newParentPath.split("/");
        setNumber(partial[partial.length-1]);
    }

    public void copy(Integer toParentId, String toParentPath, boolean partialCopy) {
        if (partialCopy) {
            setStatus(NodeStatus.UTKAST.toString());
            setCopyName();
        }
        setUuid(UUID.randomUUID());
        if (toParentId != null) {
            setProcessId(toParentId);
            setPath(toParentPath + "/ÄT " + getModifiedName());
            setNumber(toParentPath.substring(toParentPath.lastIndexOf('/') + 1));
        } else {
            setPath(getPath().replace("/ÄT", "/ÄT COPY"));
        }
    }

    @Override
    public String extractLocalPath() {
        String[] split = getPath().split("/");
        return split[split.length - 2] + "." + getIndex();
    }


    @Override
    public void validateRequirements() {
        super.validateRequirements();
        if (getProcessId() == null || getProcessId() == 0 ||
                getKeepingUnit() == null || getKeepingUnit().isEmpty()) {
            throw new PreconditionFailedException("Obligatoriska attribut saknas");
        }
    }
}