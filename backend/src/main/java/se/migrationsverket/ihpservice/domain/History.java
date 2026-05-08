package se.migrationsverket.ihpservice.domain;

import lombok.Builder;
import lombok.Data;
import org.json.JSONObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.HistoryDto;
import se.migrationsverket.ihpservice.repository.ihp.entities.HistoryEntity;

import java.sql.Timestamp;
import java.util.UUID;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@Builder
public class History implements Domain, DomainMapper<HistoryDto, HistoryEntity> {
    private Integer id;
    private UUID uuid;
    private Timestamp ts;
    private JSONObject jsonb;

    @Override
    public HistoryDto mapToDto() {
        return HistoryDto.builder()
                .id(getId())
                .uuid(getUuid())
                .ts(getTs())
                .jsonb(getJsonb().toString())
                .build();
    }

    @Override
    public HistoryEntity mapToEntity() {
        return HistoryEntity.builder()
                .id(getId())
                .uuid(getUuid())
                .timestamp(getTs())
                .json(getJsonb().toString())
                .build();
    }

    @Override
    public HistoryEntity mapToEntity(String userId) {
        return HistoryEntity.builder()
                .uuid(getUuid())
                .json(getJsonb().toString())
                .build();
    }

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}
