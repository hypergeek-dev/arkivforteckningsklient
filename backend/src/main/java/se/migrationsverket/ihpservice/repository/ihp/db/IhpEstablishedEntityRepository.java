package se.migrationsverket.ihpservice.repository.ihp.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import se.migrationsverket.ihpservice.repository.ihp.entities.IHPEstablishedEntity;

import jakarta.transaction.Transactional;

import java.sql.Timestamp;
import java.util.Optional;

@Transactional
public interface IhpEstablishedEntityRepository extends JpaRepository<IHPEstablishedEntity, Integer> {
    /*
         *FASTSTÄLLD IHP*              FASTSTÄLLD IHP     FASTSTÄLLD IHP
              |                             |                   |
      TID -----------------X---------------------------------------------->
                       2025-01-25
                Fastställd inkommen ärende/handling
     */
    @Query(value = "select * from ihp.ihp_established where (id, timestamp) in(select max(id), max(timestamp) from ihp.ihp_established where timestamp < ?1 and csnode_id = ?2)", nativeQuery = true)
    Optional<IHPEstablishedEntity> getSnapshotByCsPriorTo(Timestamp ts, Integer csnodeId);



}
