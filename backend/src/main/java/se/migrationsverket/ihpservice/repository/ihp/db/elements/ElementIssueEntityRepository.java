package se.migrationsverket.ihpservice.repository.ihp.db.elements;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementIssueEntity;

import jakarta.transaction.Transactional;

@Transactional
public interface ElementIssueEntityRepository extends JpaRepository<ElementIssueEntity, Integer> {

    @Modifying
    @Query(value = "DELETE FROM ihp.elements_issue WHERE EXISTS (SELECT * FROM ihp.elements WHERE ihp.elements.enddate < now() AND ihp.elements.id = ihp.elements_issue.element_id)", nativeQuery = true)
    void deleteEndedElementConnection();

    @Modifying
    @Query(value = "DELETE FROM ihp.elements_issue WHERE ihp.elements_issue.issue_id = ?1", nativeQuery = true)
    void deleteByIssueId(Integer id);
}
