package se.migrationsverket.ihpservice.domain;

import lombok.Builder;
import lombok.Data;
import org.json.JSONArray;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ModelSnapshotEstablishedDto;
import se.migrationsverket.ihpservice.repository.ihp.entities.IHPEstablishedEntity;
import se.migrationsverket.ihpservice.repository.ihp.entities.ModelSnapshotEstablishedEntity;

import java.sql.Timestamp;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@Builder
public class ModelSnapshotEstablished implements Domain, DomainMapper<ModelSnapshotEstablishedDto, ModelSnapshotEstablishedEntity> {
    private Integer id;
    private Integer csnodeId;
    private Timestamp timestamp;
    private JSONArray modelb;
    private String instructionCode;

    @Override
    public ModelSnapshotEstablishedDto mapToDto() {
        return ModelSnapshotEstablishedDto.builder()
                .id(getId())
                .csnodeId(getCsnodeId())
                .timestamp(getTimestamp())
                .modelb(getModelb().toString())
                .instructionCode(getInstructionCode())
                .build();
    }

    @Override
    public ModelSnapshotEstablishedEntity mapToEntity() {
        return ModelSnapshotEstablishedEntity.builder()
                .csnodeId(getCsnodeId())
                .modelb(getModelb().toString())
                .instructionCode(getInstructionCode())
                .build();
    }

    public IHPEstablishedEntity mapToIHPEntity() {
        return IHPEstablishedEntity.builder()
                .csnodeId(getCsnodeId())
                .modelb(getModelb().toString())
                .instructionCode(getInstructionCode())
                .build();
    }

    @Override
    public ModelSnapshotEstablishedEntity mapToEntity(String userId) {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }
}
