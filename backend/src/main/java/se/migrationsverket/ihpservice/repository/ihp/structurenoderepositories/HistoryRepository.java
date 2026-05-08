package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.History;
import se.migrationsverket.ihpservice.repository.ihp.db.HistoryEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.HistoryEntity;

import java.util.List;
import java.util.UUID;

@Transactional
@Repository
@Slf4j
@AllArgsConstructor
public class HistoryRepository {

    HistoryEntityRepository repository;

    public List<History> getHistory(UUID uuid) {
        return repository.findAllByUuidOrderById(uuid).map(HistoryEntity::map).toList();
    }

    public int insert(History hist) {
        return repository.save(hist.mapToEntity()).getId();
    }
}
