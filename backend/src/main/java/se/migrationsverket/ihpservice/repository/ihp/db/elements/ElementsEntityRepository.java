package se.migrationsverket.ihpservice.repository.ihp.db.elements;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementEntity;

import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface ElementsEntityRepository extends JpaRepository<ElementEntity, Integer> {

    @Query(value = "select * from ihp.elements where node_type = ?1 AND endDate > now()", nativeQuery = true)
    Stream<ElementEntity> streamAllByNodeType(String nodeType);

    @Query(value = "select * from ihp.elements where id = ?1", nativeQuery = true)
    Optional<ElementEntity> fetch(Integer id);

    @Query(value = "select * from ihp.elements elm where EXISTS (\n" +
            "SELECT * FROM ihp.elements_issue issue where elm.id = issue.element_id and issue.issue_id = ?1)", nativeQuery = true)
    Stream<ElementEntity> streamAllForIssue(Integer issueId);

    @Query(value = "select * from ihp.elements elm where EXISTS (\n" +
            "SELECT * FROM ihp.elements_document doc where elm.id = doc.element_id and doc.document_id = ?1)", nativeQuery = true)
    Stream<ElementEntity> streamAllForDocument(Integer documentId);


}
