package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;

import static se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.WorkQueries.ESTABLISHED_IHP_FROM_PATH;
import static se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.WorkQueries.WORK_DTO_IHP;

@Transactional
@Repository
@Slf4j
public class WorkRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<String> getWorkDto(String path) {
        Query query = entityManager.createNativeQuery(WORK_DTO_IHP);
        query.setParameter(1, "%" + path + "%");
        return query.getResultList();
    }


    public List<String> getEstablishedIHP(String path) {
        Query query = entityManager.createNativeQuery(ESTABLISHED_IHP_FROM_PATH);
        query.setParameter(1, "%" + path + "%");
        return query.getResultList();
    }
}
