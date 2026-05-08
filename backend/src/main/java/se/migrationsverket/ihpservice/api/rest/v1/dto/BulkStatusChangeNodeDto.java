package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Comparator;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkStatusChangeNodeDto {
    public static final Comparator<BulkStatusChangeNodeDto> NODE_LEVEL_COMPARATOR = Comparator.comparingInt(BulkStatusChangeNodeDto::getNodeLevel);
    Integer nodeId;
    String nodeType;
    NodeName nodename;
    String path;
    int nodeLevel;

}
