package se.migrationsverket.ihpservice.repository.ihp.db;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.ModelSnapshotEstablishedEntity;

import java.sql.Timestamp;
import java.util.Optional;
import java.util.stream.Stream;

@Transactional
public interface ModelSnapshotEstablishedEntityRepository extends JpaRepository<ModelSnapshotEstablishedEntity, Integer> {

    @Query(value = "select * from ihp.model_snapshot_established where (id, timestamp) in(select max(id), max(timestamp) from ihp.model_snapshot_established where timestamp < ?1 and csnode_id = ?2)", nativeQuery = true)
    Optional<ModelSnapshotEstablishedEntity> getSnapshotByCsPriorTo(Timestamp ts, Integer csnodeId);

    Stream<ModelSnapshotEstablishedEntity> streamAllByCsnodeIdOrderByTimestampDesc(Integer csnodeId);

}
