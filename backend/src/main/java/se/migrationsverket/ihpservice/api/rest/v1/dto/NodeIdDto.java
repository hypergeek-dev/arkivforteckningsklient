package se.migrationsverket.ihpservice.api.rest.v1.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
public class NodeIdDto {
    @NotNull
    Integer id;
    @NotNull
    @Schema(allowableValues = {"issuenode", "documentnode", "processnode", "pgnode", "oanode", "csnode"})
    String nodeName;
    Integer index;
}
