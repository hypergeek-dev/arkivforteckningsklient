package se.migrationsverket.ihpservice.domain;

import lombok.Builder;
import lombok.Data;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeTypeCommentDto;
import se.migrationsverket.ihpservice.repository.ihp.entities.NodeTypeCommentEntity;

import java.util.Date;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@Builder
public class NodeTypeComment implements Domain, DomainMapper<NodeTypeCommentDto, NodeTypeCommentEntity> {
    private Integer id;
    private Integer nodeId;
    private String comment;
    private String createdBy;
    private Date createdAt;
    @Override
    public NodeTypeCommentDto mapToDto() {
        return NodeTypeCommentDto.builder()
                .id(getId())
                .nodeId(getNodeId())
                .comment(getComment())
                .createdBy(getCreatedBy())
                .createdAt(getCreatedAt())
                .build();
    }

    @Override
    public NodeTypeCommentEntity mapToEntity() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public NodeTypeCommentEntity mapToEntity(String userId) {
        return NodeTypeCommentEntity.builder()
                .nodeId(getNodeId())
                .comment(getComment())
                .createdBy(userId)
                .build();
    }

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}
