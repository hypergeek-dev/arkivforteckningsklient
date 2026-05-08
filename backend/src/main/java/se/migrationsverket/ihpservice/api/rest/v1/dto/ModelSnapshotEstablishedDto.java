package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONArray;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelSnapshotEstablishedDto implements DataTransferObject, DtoMapper<ModelSnapshotEstablished> {
    @NotNull
    private Integer id;
    @NotNull
    private Integer csnodeId;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Timestamp timestamp;
    @NotNull
    private String modelb;
    @NotNull
    private String instructionCode;

    @Override
    public ModelSnapshotEstablished map() {
        return ModelSnapshotEstablished.builder()
                .id(getId())
                .csnodeId(getCsnodeId())
                .timestamp(getTimestamp())
                .modelb(new JSONArray(getModelb()))
                .instructionCode(getInstructionCode())
                .build();
    }

    @Override
    public ModelSnapshotEstablished addMap() {
        return ModelSnapshotEstablished.builder()
                .csnodeId(getCsnodeId())
                .modelb(new JSONArray(getModelb()))
                .instructionCode(getInstructionCode())
                .build();
    }
}
