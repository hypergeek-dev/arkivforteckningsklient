package se.migrationsverket.ihpservice.api.rest.v1.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventLogDto {
    @NotNull
    @Schema(allowableValues = {"utkast", "klar", "godkand", "faststalld", "create", "delete", "update", "comment", "copy", "move"})
    private String action;
    private String description;
    @NotNull
    private String userId;
    @NotNull
    private String objectName;
    @NotNull
    private UUID objectId;
    @NotNull
    @Schema(allowableValues = {"csnode", "documentnode", "issuenode", "oanode", "pgnode", "processnode"})
    private String type;
    @NotNull
    private Date created;
    @NotNull
    private String modelId;
}
