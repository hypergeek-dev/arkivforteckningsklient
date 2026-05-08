package se.migrationsverket.ihpservice.api.rest.v1.dto.elements;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DtoMapper;
import se.migrationsverket.ihpservice.domain.elements.Element;
import se.migrationsverket.ihpservice.domain.elements.ElementNodType;
import se.migrationsverket.ihpservice.domain.elements.ElementStatus;

import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ElementDto implements DataTransferObject, DtoMapper<Element> {
    @NotNull
    private Integer id;
    @NotNull
    private String name;
    @NotNull
    private String description;
    @NotNull
    private Integer datatype;
    private boolean mandatory;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date startDate;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date endDate;
    @NotNull
    private ElementNodType nodeType;
    @NotNull
    private ElementStatus status;
    @NotNull
    private String createdBy;
    private String updatedBy;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date updatedAt;

    @Override
    public Element map() {
        return Element.builder()
                .id(getId())
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodType(getNodeType())
                .status(getStatus())
                .createdAt(getCreatedAt())
                .updatedBy(getUpdatedBy())
                .createdBy(getCreatedBy())
                .build();
    }

    @Override
    public Element addMap() {
        return Element.builder()
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodType(getNodeType())
                .status(ElementStatus.DRAFT)
                .createdBy(getCreatedBy())
                .build();
    }
}
