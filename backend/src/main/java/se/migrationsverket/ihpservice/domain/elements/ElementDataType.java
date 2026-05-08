package se.migrationsverket.ihpservice.domain.elements;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDataTypeDto;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.domain.DomainMapper;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementDataTypeEntity;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@SuperBuilder
public class ElementDataType implements Domain, DomainMapper<ElementDataTypeDto, ElementDataTypeEntity> {
    private Integer id;
    private String type;

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public ElementDataTypeDto mapToDto() {
        return ElementDataTypeDto.builder().id(getId()).type(getType()).build();
    }

    @Override
    public ElementDataTypeEntity mapToEntity() {
        return ElementDataTypeEntity.builder()
                .id(getId())
                .type(getType()).build();
    }

    @Override
    public ElementDataTypeEntity mapToEntity(String userId) {
        return ElementDataTypeEntity.builder()
                .id(getId())
                .type(getType()).build();
    }
}
