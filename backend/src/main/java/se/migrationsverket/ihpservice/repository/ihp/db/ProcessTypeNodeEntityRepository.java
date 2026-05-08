package se.migrationsverket.ihpservice.repository.ihp.db;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.migrationsverket.ihpservice.repository.ihp.entities.ProcessTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface ProcessTypeNodeEntityRepository extends JpaRepository<ProcessTypeNodeEntity, Integer> {
    Stream<ProcessTypeNodeEntity> findAllByParentId(Integer parentId);

    Stream<ProcessTypeNodeEntity> findAllByIdIsIn(List<Integer> ids);

    @Query(value = "select * from ihp.processtypenode where parent_id = ?1 and ?2 between start and coalesce(stop, '9999-12-31') and status='faststalld'", nativeQuery = true)
    Stream<ProcessTypeNodeEntity> findAllActiveByParentId(Integer parentId, Date date);

    @Query(value = "select * from ihp.processtypenode where path like ?1% and status = 'faststalld'", nativeQuery = true)
    Stream<ProcessTypeNodeEntity> findAllEstablishedByPathPrefix(String pathPrefix);

    @Query(value = "SELECT id FROM ihp.classificationstructuretypenode where path = (select SUBSTRING(path,1, 37) from ihp.processtypenode WHERE id = ?1)", nativeQuery = true)
    Optional<Integer> findCsnodetypeId(Integer id);

    @Query(value = "select p1.id from ihp.processtypenode p1 where path = ?1 and ?2 in (" +
            "select id from ihp.classificationstructuretypenode where id = (" +
            "select csnode_id from ihp.operationalareatypenode where id = (With recursive pgs AS(" +
            "select id, name, parent_id, cast(1 as integer) as recursion_level from ihp.processgrouptypenode where id = (select parent_id from ihp.processtypenode where id= p1.id) " +
            "union all " +
            "select p.id, p.name, p.parent_id, s.recursion_level + 1 from ihp.processgrouptypenode p " +
            "inner join pgs s on s.parent_id = p.id) " +
            "select parent_id from pgs where recursion_level = (select max(recursion_level) from pgs))) " +
            "union all " +
            "select id from ihp.classificationstructuretypenode where id = (" +
            "select csnode_id from ihp.operationalareatypenode where id in(select parent_id from ihp.processtypenode where id = p1.id)))"
            , nativeQuery = true)
    Optional<Integer> findProcessIdByPathAndCsnode(String path, Integer csnodeId);

    @Query(value = "select * from ihp.processtypenode where path = ?1", nativeQuery = true)
    Optional<ProcessTypeNodeEntity> findProcessByPath(String path);

    @Query(value = "select * from ihp.processtypenode where path like ?1%", nativeQuery = true)
    Stream<ProcessTypeNodeEntity> findAllByPathPrefix(String pathPrefix);

    @Query(value = "SELECT * FROM ihp.processtypenode WHERE path IN :paths", nativeQuery = true)
    Stream<ProcessTypeNodeEntity> streamProcessByPaths(@Param("paths") List<String> paths);

    @Modifying
    @Query(value = " UPDATE ihp.processtypenode SET status = :status WHERE id IN :ids", nativeQuery = true)
    void batchPatchUpdates(@Param("ids") List<Integer> ids, @Param("status") String status);

    Stream<ProcessTypeNodeEntity> findAllByPathContaining(String path);

    @Modifying
    @Query(value = "UPDATE ihp.processtypenode SET status = :tostatus, updated_at = now(), updated_by = :userId WHERE path LIKE :pathPrefix% AND status = :fromStatus RETURNING *", nativeQuery = true)
    Stream<ProcessTypeNodeEntity> updateStatusByPathPrefix(@Param("tostatus") String toStatus, @Param("fromStatus") String fromStatus, @Param("pathPrefix") String pathPrefix, @Param("userId") String userId);

    @Query(value = "select * from ihp.processtypenode where id in ?1 ", nativeQuery = true)
    List<ProcessTypeNodeEntity> findAllByIdIsInList(List<Integer> ids);
}
