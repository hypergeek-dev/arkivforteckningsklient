package se.migrationsverket.ihpservice.repository.ihp.db;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.migrationsverket.ihpservice.repository.ihp.entities.ProcessGroupTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface ProcessGroupTypeNodeEntityRepository extends JpaRepository<ProcessGroupTypeNodeEntity, Integer> {
    Stream<ProcessGroupTypeNodeEntity> findAllByParentId(Integer parentId);

    Stream<ProcessGroupTypeNodeEntity> findAllByIdIsIn(List<Integer> ids);

    @Query(value = "select * from ihp.processgrouptypenode where id in ?1 ", nativeQuery = true)
    List<ProcessGroupTypeNodeEntity> findAllByIdIsInList(List<Integer> ids);

    @Query(value = "select * from ihp.processgrouptypenode where parent_id = ?1 and ?2 between start and coalesce(stop, '9999-12-31') and status='faststalld'", nativeQuery = true)
    Stream<ProcessGroupTypeNodeEntity> findAllActiveByParentId(Integer parentId, Date date);

    @Query(value = "select * from ihp.processgrouptypenode where path like ?1% and status = 'faststalld'", nativeQuery = true)
    Stream<ProcessGroupTypeNodeEntity> findAllEstablishedByPathPrefix(String pathPrefix);

    @Query(value = "SELECT id FROM ihp.classificationstructuretypenode where path = (select SUBSTRING(path,1, 37) from ihp.processgrouptypenode WHERE id = ?1)", nativeQuery = true)
    Optional<Integer> findCsnodetypeId(Integer id);

    @Query(value = "select * from ihp.processgrouptypenode where path like ?1%", nativeQuery = true)
    Stream<ProcessGroupTypeNodeEntity> findAllByPathPrefix(String pathPrefix);

    @Query(value = "SELECT * FROM ihp.processgrouptypenode WHERE path IN :paths", nativeQuery = true)
    Stream<ProcessGroupTypeNodeEntity> streamProcessGroupsByPaths(@Param("paths") List<String> paths);

    @Modifying
    @Query(value = "UPDATE ihp.processgrouptypenode SET status = :status WHERE id IN :ids", nativeQuery = true)
    void batchUpdateStatuses(@Param("ids") List<Integer> ids, @Param("status") String status);

    Stream<ProcessGroupTypeNodeEntity> findAllByPathContaining(String path);

    @Modifying
    @Query(value = "UPDATE ihp.processgrouptypenode SET status = :tostatus, updated_at = now(), updated_by = :userId WHERE path LIKE :pathPrefix% AND status = :fromStatus RETURNING *", nativeQuery = true)
    Stream<ProcessGroupTypeNodeEntity> updateStatusByPathPrefix(@Param("tostatus") String toStatus, @Param("fromStatus") String fromStatus, @Param("pathPrefix") String pathPrefix, @Param("userId") String userId);
}
