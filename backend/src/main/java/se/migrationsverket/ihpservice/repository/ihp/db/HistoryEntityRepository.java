package se.migrationsverket.ihpservice.repository.ihp.db;

import org.springframework.data.jpa.repository.JpaRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.HistoryEntity;

import jakarta.transaction.Transactional;

import java.util.UUID;
import java.util.stream.Stream;

@Transactional
public interface HistoryEntityRepository extends JpaRepository<HistoryEntity, Integer> {
    Stream<HistoryEntity> findAllByUuidOrderById(UUID uuid);
}
