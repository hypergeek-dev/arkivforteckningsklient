package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.migrationsverket.ihpservice.domain.NodeTypeComment;

import java.util.Date;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NodeTypeCommentDto implements DataTransferObject, DtoMapper<NodeTypeComment> {
    private Integer id;
    private Integer nodeId;
    private String comment;
    private String createdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdAt;

    @Override
    public NodeTypeComment map() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public NodeTypeComment addMap() {
        return NodeTypeComment.builder()
                .nodeId(getNodeId())
                .comment(getComment())
                .build();
    }
}