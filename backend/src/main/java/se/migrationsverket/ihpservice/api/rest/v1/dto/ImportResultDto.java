package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImportResultDto {
    private boolean success;
    private String message;
    private String importedCsnodeId;
    private int nodesFailed;
}
