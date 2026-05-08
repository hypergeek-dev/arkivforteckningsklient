package se.migrationsverket.ihpservice.domain.elements;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.domain.DomainMapper;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementEntity;

import java.util.Date;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@SuperBuilder
public class Element implements Domain, DomainMapper<ElementDto, ElementEntity> {
    private Integer id;
    private String name;
    private String description;
    private Integer datatype;
    private boolean mandatory;
    private Date startDate;
    private Date endDate;
    private ElementNodType nodType;
    private ElementStatus status;
    private String createdBy;
    private String updatedBy;
    private Date createdAt;
    private Date updatedAt;

    @Override
    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    @Override
    public ElementDto mapToDto() {
        return ElementDto.builder()
                .id(getId())
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodeType(getNodType())
                .status(getStatus())
                .updatedAt(getUpdatedAt())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .build();
    }

    @Override
    public ElementEntity mapToEntity() {
        return ElementEntity.builder()
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodeType(getNodType().toString())
                .status(getStatus().name())
                .updatedAt(new Date())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .build();

    }

    @Override
    public ElementEntity mapToEntity(String userId) {
        return ElementEntity.builder()
                .id(getId())
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodeType(getNodType().toString())
                .status(getStatus().name())
                .updatedAt(new Date())
                .updatedBy(userId)
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .build();
    }

    public ElementEntity addMapToEntity(String userId) {
        return ElementEntity.builder()
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodeType(getNodType().toString())
                .status(getStatus().name())
                .createdBy(userId)
                .createdAt(new Date())
                .build();
    }

    public ElementDocument mapToElementDocument(int documentId, String documentPath){
        return ElementDocument.builder().elementId(getId()).documentId(documentId).documentPath(documentPath).build();
    }

    public ElementIssue mapToElementIssue(int issueId, String issuePath){
        return ElementIssue.builder().elementId(getId()).issueId(issueId).issuePath(issuePath).build();
    }
}
