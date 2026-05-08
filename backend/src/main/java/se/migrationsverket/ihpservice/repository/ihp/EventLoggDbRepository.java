package se.migrationsverket.ihpservice.repository.ihp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.IhpEventLoggEvent;
import se.migrationsverket.ihpservice.repository.ihp.db.IhpEventLoggEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.IhpEventLoggEntity;

import jakarta.transaction.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
@Transactional
public class EventLoggDbRepository implements EventLoggRepository {
    private final IhpEventLoggEntityRepository ihpEventLoggEntityRepository;

    public EventLoggDbRepository(IhpEventLoggEntityRepository ihpEventLoggEntityRepository) {
        this.ihpEventLoggEntityRepository = ihpEventLoggEntityRepository;
    }

    @Override
    public void addEventLogg(IhpEventLoggEvent eventLogg) {
        IhpEventLoggEntity entity = EntityMapper.map(eventLogg);
        entity.setUuid(UUID.randomUUID());
        ihpEventLoggEntityRepository.save(entity);
    }

    public List<IhpEventLoggEvent> fetchSorted(Integer limit, Integer offset, Sort.Direction direction, String sortBy) {
        Page<IhpEventLoggEntity> eventEntity = ihpEventLoggEntityRepository.fetchSorted(PageRequest.of(offset, limit, direction, sortBy));
        return EntityMapper.mapEventLog(eventEntity.getContent());
    }

    @Override
    public List<IhpEventLoggEvent> findAllTimePeriod(Date from, Date to) {
        List<IhpEventLoggEntity> eventEntity = ihpEventLoggEntityRepository.fetchSortedTimeperiod(from, to);
        return EntityMapper.mapEventLog(eventEntity);
    }


}