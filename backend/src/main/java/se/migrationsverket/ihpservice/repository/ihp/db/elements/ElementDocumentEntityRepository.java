package se.migrationsverket.ihpservice.repository.ihp.db.elements;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementDocumentEntity;

import jakarta.transaction.Transactional;

@Transactional
public interface ElementDocumentEntityRepository extends JpaRepository<ElementDocumentEntity, Integer> {

    @Modifying
    @Query(value = "DELETE FROM ihp.elements_document WHERE EXISTS (SELECT * FROM ihp.elements WHERE ihp.elements.enddate < now() AND ihp.elements.id = ihp.elements_document.element_id)", nativeQuery = true)
    void deleteEndedElementConnection();

    @Modifying
    @Query(value = "DELETE FROM ihp.elements_document WHERE ihp.elements_document.document_id = ?1", nativeQuery = true)
    void deleteByDocumentId(Integer docid);
}
