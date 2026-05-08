package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;
import se.migrationsverket.ihpservice.repository.ihp.db.IhpEstablishedEntityRepository;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class IHPEstablishedRepository {
    IhpEstablishedEntityRepository repository;

    public void add(ModelSnapshotEstablished snap) {
        repository.save(snap.mapToIHPEntity());
    }
}
