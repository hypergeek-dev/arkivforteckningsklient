package se.migrationsverket.ihpservice.repository.ihp.db;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.migrationsverket.ihpservice.repository.ihp.entities.ClassificationStructureTypeNodeEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface ClassificationStructureTypeNodeEntityRepository extends JpaRepository<ClassificationStructureTypeNodeEntity, Integer> {
    // returns 0 if all children are of a queried status
    // if a another status is found, it will return a int corresponding to that table
    String KS_CONTAINS_ONLY =
            "SELECT COALESCE(" +
                    "(SELECT 1 FROM ihp.operationalareatypenode WHERE NOT status = :status AND path LIKE :path% LIMIT 1)," +
                    "(SELECT 2 FROM ihp.processgrouptypenode WHERE NOT status = :status AND path LIKE :path% LIMIT 1)," +
                    "(SELECT 3 FROM ihp.processtypenode WHERE NOT status = :status AND path LIKE :path% LIMIT 1)," +
                    " 0)";

    Stream<ClassificationStructureTypeNodeEntity> streamByIdGreaterThan(Integer zero);

    @Query(value = "select * from ihp.classificationstructuretypenode where ?1 between start and coalesce(stop, '9999-12-31') and status='faststalld'", nativeQuery = true)
    Stream<ClassificationStructureTypeNodeEntity> findActive(Date date);

    @Query(value = "select * from ihp.classificationstructuretypenode where status = 'faststalld' and stop is not null and ((start < ?1 and stop > ?2) or (start > ?1 and stop < ?2))", nativeQuery = true)
    Stream<ClassificationStructureTypeNodeEntity> findIllegalPeriod(Date start, Date stop);

    @Query(value = "select * from ihp.classificationstructuretypenode where status = 'faststalld' and start > ?1 and stop is null", nativeQuery = true)
    Stream<ClassificationStructureTypeNodeEntity> findIllegalInfinite(Date start);

    @Query(value = KS_CONTAINS_ONLY, nativeQuery = true)
    Integer areAllKsChildrenStatus(@Param("status") String status, @Param("path") String ksPath);

    @Query(value = "select * from ihp.classificationstructuretypenode where path like ?1%", nativeQuery = true)
    Stream<ClassificationStructureTypeNodeEntity> findAllByPathPrefix(String pathPrefix);

    @Query(value = "select * from ihp.classificationstructuretypenode where path = ?1", nativeQuery = true)
    Optional<ClassificationStructureTypeNodeEntity> findByPath(String path);

    Stream<ClassificationStructureTypeNodeEntity> findAllByIdIn(List<Integer> ids);

    @Query(value = "select * from ihp.classificationstructuretypenode where id in ?1 ", nativeQuery = true)
    List<ClassificationStructureTypeNodeEntity> findAllByIdIsInList(List<Integer> nodeIds);
}


