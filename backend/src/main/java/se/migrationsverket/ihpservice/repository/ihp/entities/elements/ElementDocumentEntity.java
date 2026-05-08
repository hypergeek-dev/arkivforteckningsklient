package se.migrationsverket.ihpservice.repository.ihp.entities.elements;

import lombok.*;
import se.migrationsverket.ihpservice.domain.elements.ElementDocument;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import jakarta.persistence.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "elements_document")
public class ElementDocumentEntity implements Serializable, EntityI, EntityMapper<ElementDocument> {
    @Id
    @SequenceGenerator(name = "elements_document_id_seq", sequenceName = "elements_document_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "elements_document_id_seq")
    private Integer id;
    @Column(name = "element_id")
    private Integer elementId;
    @Column(name = "document_id")
    private Integer documentId;
    @Column(name = "document_path")
    private String documentPath;

    @Override
    public ElementDocument map() {
        return ElementDocument.builder().id(getId()).documentId(getDocumentId()).documentPath(getDocumentPath()).elementId(getElementId()).build();
    }
}
