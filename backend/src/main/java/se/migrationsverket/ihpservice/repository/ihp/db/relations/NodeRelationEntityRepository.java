package se.migrationsverket.ihpservice.repository.ihp.db.relations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import se.migrationsverket.ihpservice.repository.ihp.entities.relations.NodeRelationEntity;

import jakarta.transaction.Transactional;

import java.util.stream.Stream;

@Transactional
public interface NodeRelationEntityRepository extends JpaRepository<NodeRelationEntity, Integer> {

    @Query(value = "SELECT * FROM ihp.noderelation WHERE related_path = ?1", nativeQuery = true)
    Stream<NodeRelationEntity> findRelationByRelatedPath(String path);

    //value = "select * from ihp.noderelation where path = ?1 or related_path = ?1",
    @Query(value = "select * from ihp.noderelation where path = ?1", nativeQuery = true)
    Stream<NodeRelationEntity> findAllNodesRelations(String path);

    @Modifying
    @Query(value = "UPDATE ihp.noderelation SET related_path = ?2 WHERE id = ?1", nativeQuery = true)
    void updateRelatedPath(Integer id, String path);

    // value = "delete from ihp.noderelation where path = :path or related_path = :path"
    @Modifying
    @Query(value = "delete from ihp.noderelation where path = :path or related_path = :path", nativeQuery = true)
    void deleteByPath(@Param("path") String path);

    @Modifying
    @Query(value = "delete from ihp.noderelation where id = ?1", nativeQuery = true)
    void deleteById(Integer id);

    @Query(value = "select * from ihp.noderelation where path like :path% or related_path like :path%", nativeQuery = true)
    Stream<NodeRelationEntity> streamAllByCsPath(@Param("path") String path);
}
