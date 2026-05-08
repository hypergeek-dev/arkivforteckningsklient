package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DroppedNodeDto {
    @NotNull
    NodeIdDto node;
    @NotNull
    NodeIdDto to;
}
