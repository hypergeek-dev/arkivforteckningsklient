package se.migrationsverket.ihpservice.repository.ihp.entities;

import lombok.*;
import se.migrationsverket.ihpservice.domain.NodeTypeComment;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "nodecomment")
public class NodeTypeCommentEntity implements Serializable, EntityI, EntityMapper<NodeTypeComment> {
    @Id
    @SequenceGenerator(name = "nodecomment_id_seq", sequenceName = "nodecomment_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "nodecomment_id_seq")
    private Integer id;
    @Column(name = "node_id")
    private Integer nodeId;
    private String comment;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "created_at")
    private Date createdAt;

    @PrePersist
    void prePersist() {
        createdAt = new Date();
    }

    @Override
    public NodeTypeComment map() {
        return NodeTypeComment.builder()
                .id(getId())
                .nodeId(getNodeId())
                .comment(getComment())
                .createdBy(getCreatedBy())
                .createdAt(getCreatedAt())
                .build();
    }
}