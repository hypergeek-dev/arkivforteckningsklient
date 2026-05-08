package se.migrationsverket.ihpservice.repository.ihp.db;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.migrationsverket.ihpservice.repository.ihp.entities.OperationalAreaTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface OperationalAreaTypeNodeEntityRepository extends JpaRepository<OperationalAreaTypeNodeEntity, Integer> {


    Stream<OperationalAreaTypeNodeEntity> findAllByCsnodeId(Integer csnodeId);

    Stream<OperationalAreaTypeNodeEntity> findAllByPathContaining(String path);

    @Query(value = "select * from ihp.operationalareatypenode where id in ?1 ", nativeQuery = true)
    List<OperationalAreaTypeNodeEntity> findAllByIdIsInList(List<Integer> ids);

    Stream<OperationalAreaTypeNodeEntity> findAllByIdIsIn(List<Integer> ids);

    @Query(value = "select * from ihp.operationalareatypenode where csnode_id = ?1 and ?2 between start and coalesce(stop, '9999-12-31') and status='faststalld'", nativeQuery = true)
    Stream<OperationalAreaTypeNodeEntity> findAllActiveByParentId(Integer csnodeId, Date date);

    @Query(value = "select * from ihp.operationalareatypenode where csnode_id = ?1 and status = 'faststalld'", nativeQuery = true)
    Stream<OperationalAreaTypeNodeEntity> findAllEstablishedByParent(Integer csnodeId);

    @Query(value = "select id from ihp.classificationstructuretypenode where id = (select csnode_id from ihp.operationalareatypenode where id = ?1)", nativeQuery = true)
    Optional<Integer> findCsnodetypeId(Integer id);

    @Query(value = "select * from ihp.operationalareatypenode where path like :pathPrefix%", nativeQuery = true)
    Stream<OperationalAreaTypeNodeEntity> findAllByPathPrefix(@Param("pathPrefix") String pathPrefix);

    @Modifying
    @Query(value = "UPDATE ihp.operationalareatypenode SET status = :status WHERE id IN :ids", nativeQuery = true)
    void batchUpdateStatuses(@Param("ids") List<Integer> ids, @Param("status") String status);

    @Modifying
    @Query(value = "UPDATE ihp.operationalareatypenode SET status = :tostatus, updated_at = now(), updated_by = :userId WHERE path LIKE :pathPrefix% AND status = :fromStatus", nativeQuery = true)
    void updateStatusByPathPrefix(@Param("tostatus") String toStatus, @Param("fromStatus") String fromStatus, @Param("pathPrefix") String pathPrefix, @Param("userId") String userId);

    @Query(value = "SELECT COUNT(*) FROM ihp.operationalareatypenode WHERE csnode_id = :parentID", nativeQuery = true)
    Integer countByParent(@Param("parentID") Integer id);
}
