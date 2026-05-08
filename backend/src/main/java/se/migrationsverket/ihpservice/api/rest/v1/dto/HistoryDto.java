package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONObject;
import se.migrationsverket.ihpservice.domain.History;

import jakarta.validation.constraints.NotNull;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryDto implements DataTransferObject, DtoMapper<History> {
    @NotNull
    private Integer id;
    @NotNull
    private UUID uuid;
    @NotNull
    private Timestamp ts;
    @NotNull
    private String jsonb;

    @Override
    public History map() {
        return History.builder()
                .id(getId())
                .uuid(getUuid())
                .ts(getTs())
                .jsonb(new JSONObject(getJsonb()))
                .build();
    }

    @Override
    public History addMap() {
        return History.builder()
                .uuid(getUuid())
                .jsonb(new JSONObject(getJsonb()))
                .build();
    }
}

