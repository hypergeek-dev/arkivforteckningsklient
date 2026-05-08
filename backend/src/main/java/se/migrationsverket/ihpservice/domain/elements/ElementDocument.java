package se.migrationsverket.ihpservice.domain.elements;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementDocumentEntity;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@SuperBuilder
public class ElementDocument implements Domain {
    private Integer id;
    private Integer elementId;
    private Integer documentId;
    private String documentPath;

    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    public ElementDocumentEntity mapToEntity() {
        return ElementDocumentEntity.builder().id(getId()).documentId(getDocumentId()).documentPath(getDocumentPath()).elementId(getElementId()).build();
    }
}
