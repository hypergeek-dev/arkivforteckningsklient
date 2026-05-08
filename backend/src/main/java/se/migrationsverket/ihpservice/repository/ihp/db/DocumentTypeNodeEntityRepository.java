package se.migrationsverket.ihpservice.repository.ihp.db;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.migrationsverket.ihpservice.repository.ihp.entities.DocumentTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface DocumentTypeNodeEntityRepository extends JpaRepository<DocumentTypeNodeEntity, Integer> {
    String ESTABLISHED_BY_PATH = "SELECT * FROM ihp.documenttypenode WHERE path LIKE :path% AND status = :status AND COALESCE(stop,'9999-01-01') > now() AND start < now();";

    Stream<DocumentTypeNodeEntity> findAllByIssuetypeId(Integer issuetypeId);

    Stream<DocumentTypeNodeEntity> findAllByIdIsIn(List<Integer> ids);

    List<DocumentTypeNodeEntity> findByIdIn(List<Integer> ids);

    Stream<DocumentTypeNodeEntity> findAllByPathContaining(String path);

    @Query(value = "select * from ihp.documenttypenode where issuetype_id = ?1 and ?2 between start and coalesce(stop, '9999-12-31') and status='faststalld'", nativeQuery = true)
    Stream<DocumentTypeNodeEntity> findAllActiveByParentId(Integer issuetypeId, Date date);

    @Query(value = "SELECT id FROM ihp.classificationstructuretypenode where path = (select SUBSTRING(path,1, 37) from ihp.documenttypenode WHERE id = ?1)", nativeQuery = true)
    Optional<Integer> findCsnodetypeId(Integer id);

    @Query(value = ESTABLISHED_BY_PATH, nativeQuery = true)
    Stream<DocumentTypeNodeEntity> streamByEstablishedByPath(@Param("path") String path, @Param("status") String status);

    @Query(value = "select * from ihp.documenttypenode where path like ?1%", nativeQuery = true)
    Stream<DocumentTypeNodeEntity> findAllByPathPrefix(String pathPrefix);

    @Modifying
    @Query(value = "UPDATE ihp.documenttypenode SET status = :tostatus, updated_at = now(), updated_by = :userId WHERE path LIKE :pathPrefix% AND status = :fromStatus RETURNING *", nativeQuery = true)
    Stream<DocumentTypeNodeEntity> updateStatusByPathPrefix(@Param("tostatus") String toStatus, @Param("fromStatus") String fromStatus, @Param("pathPrefix") String pathPrefix, @Param("userId") String userId);

    @Modifying
    @Query(value = "UPDATE ihp.documenttypenode SET status = :status, updated_at = now(), updated_by = :userId WHERE id IN :ids", nativeQuery = true)
    void batchUpdateStatuses(@Param("ids") List<Integer> ids, @Param("status") String status, @Param("userId") String userId);


}
