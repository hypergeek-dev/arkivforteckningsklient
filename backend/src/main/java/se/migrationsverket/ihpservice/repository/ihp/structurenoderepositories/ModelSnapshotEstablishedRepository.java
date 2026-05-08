package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;
import se.migrationsverket.ihpservice.repository.ihp.db.ModelSnapshotEstablishedEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.ModelSnapshotEstablishedEntity;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ModelSnapshotEstablishedQueries.ACTIVE_KS_WITH_IHP;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class ModelSnapshotEstablishedRepository {

    private static final String ACTIVE_SNAPSHOT_QUERY = """
        SELECT * 
        FROM ihp.model_snapshot_established 
        WHERE CAST(modelb->0->>'start' AS DATE) < now() 
        AND CAST(coalesce(modelb->>'stop', '9999-12-31') AS DATE) > now() 
        ORDER BY timestamp DESC 
        LIMIT 1
        """;

    ModelSnapshotEstablishedEntityRepository repository;
    @PersistenceContext
    private EntityManager entityManager;


    public void insert(ModelSnapshotEstablished model) {
        ModelSnapshotEstablishedEntity entity = new ModelSnapshotEstablishedEntity();
        entity.setCsnodeId(model.getCsnodeId());
        entity.setModelb(model.getModelb().toString());
        entity.setInstructionCode(model.getInstructionCode());
        entity.setTimestamp(model.getTimestamp());
        repository.save(entity);
    }

    public void add(ModelSnapshotEstablished snap) {
        insert(snap);
    }

    public Optional<ModelSnapshotEstablished> fetch(Timestamp ts, Integer id) {
        return repository.getSnapshotByCsPriorTo(ts, id).map(ModelSnapshotEstablishedEntity::map);
    }

    public Stream<ModelSnapshotEstablished> findAllByCsnodeId(Integer id) {
        return repository.streamAllByCsnodeIdOrderByTimestampDesc(id).map(ModelSnapshotEstablishedEntity::map);
    }


    public Optional<ModelSnapshotEstablished> getActiveIHP() {
        JSONArray jsonArray = new JSONArray();

        // Hämta aktiv snapshot info
        Query snapshotQuery = entityManager.createNativeQuery(ACTIVE_SNAPSHOT_QUERY, ModelSnapshotEstablishedEntity.class);
        List<ModelSnapshotEstablishedEntity> entities = snapshotQuery.getResultList();

        if (entities.isEmpty()) {
            log.debug("No active snapshot found");
            return Optional.empty();
        }


        ModelSnapshotEstablishedEntity entity = entities.get(0);
        // Convert to domain object
        ModelSnapshotEstablished snapShot = entity.map();

        // Hämta KS data
        Query ksQuery = entityManager.createNativeQuery(ACTIVE_KS_WITH_IHP);
        List<Object> ksResults = ksQuery.getResultList();

        for (Object ksResult : ksResults) {
            String jsonData = (String) ksResult;
            jsonArray.put(new JSONObject(jsonData));
        }

        if (jsonArray.length() == 0 || snapShot.getCsnodeId() == null) {
            return Optional.empty();
        }

        snapShot.setModelb(jsonArray);
        return Optional.of(snapShot);
    }
}
