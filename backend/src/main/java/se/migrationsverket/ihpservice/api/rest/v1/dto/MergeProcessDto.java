package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MergeProcessDto {
    private ProcessGroupTypeNodeDto pgNode;
    private List<Integer> processIds;
}
