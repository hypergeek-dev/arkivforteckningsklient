package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class BulkStatusChangeToDraftDto {
    List<BulkStatusChangeNodeDto> nodesToChange;
    String comment;
}
