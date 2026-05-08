package se.migrationsverket.ihpservice.repository.ihp.entities.relations;

import jakarta.persistence.*;
import lombok.*;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "noderelation")
public class NodeRelationEntity implements Serializable, EntityI, EntityMapper<NodeRelation> {
    @Id
    @SequenceGenerator(name = "noderelation_id_seq", sequenceName = "noderelation_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "noderelation_id_seq")
    private Integer id;
    private String path;
    @Column(name = "related_path")
    private String relatedPath;
    private String comment;
    private String type;

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
}
