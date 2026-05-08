package se.migrationsverket.ihpservice.api.rest.v1.dto.elements;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DtoMapper;
import se.migrationsverket.ihpservice.domain.elements.ElementDataType;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ElementDataTypeDto implements DataTransferObject, DtoMapper<ElementDataType> {
    @NotNull
    private Integer id;
    @NotNull
    private String type;

    @Override
    public ElementDataType map() {
        return ElementDataType.builder().id(getId()).type(getType()).build();
    }

    @Override
    public ElementDataType addMap() {
        return ElementDataType.builder().id(getId()).type(getType()).build();
    }
}
