package se.migrationsverket.ihpservice.domain.relations;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import se.migrationsverket.ihpservice.api.rest.v1.dto.relations.NodeRelationDto;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.domain.DomainMapper;
import se.migrationsverket.ihpservice.repository.ihp.entities.relations.NodeRelationEntity;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@Builder
@EqualsAndHashCode(exclude = "id")
public class NodeRelation implements Domain, DomainMapper<NodeRelationDto, NodeRelationEntity> {
    private Integer id;
    private String path;
    private String relatedPath;
    private String comment;
    private String type;

    @Override
    public NodeRelationDto mapToDto() {
        return NodeRelationDto.builder()
                .id(getId())
                .path(getPath())
                .relatedPath(getRelatedPath())
                .comment(getComment())
                .type(getType())
                .build();
    }

    @Override
    public NodeRelationEntity mapToEntity() {
        return NodeRelationEntity.builder()
                .id(getId())
                .path(getPath())
                .relatedPath(getRelatedPath())
                .comment(getComment())
                .type(getType())
                .build();
    }

    @Override
    public NodeRelationEntity mapToEntity(String userId) {
        return NodeRelationEntity.builder()
                .path(getPath())
                .relatedPath(getRelatedPath())
                .comment(getComment())
                .type(getType())
                .build();
    }

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}