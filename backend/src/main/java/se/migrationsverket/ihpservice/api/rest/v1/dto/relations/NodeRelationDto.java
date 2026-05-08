package se.migrationsverket.ihpservice.api.rest.v1.dto.relations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DtoMapper;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NodeRelationDto implements DataTransferObject, DtoMapper<NodeRelation> {
    private Integer id;
    @NotNull
    private String path;
    @NotNull
    private String relatedPath;
    private String comment;
    private String type;
    private String fullName;
    private Integer nodeId;


    @Override
    public NodeRelation map() {
        return NodeRelation.builder()
                .id(getId())
                .path(getPath())
                .relatedPath(getRelatedPath())
                .comment(getComment())
                .type(getType())
                .build();
    }

    @Override
    public NodeRelation addMap() {
        return NodeRelation.builder()
                .path(getPath())
                .relatedPath(getRelatedPath())
                .comment(getComment())
                .type(getType())
                .build();
    }
}
