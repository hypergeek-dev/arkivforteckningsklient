package se.migrationsverket.ihpservice.repository.ihp;

import org.springframework.data.domain.Sort;
import se.migrationsverket.ihpservice.domain.IhpEventLoggEvent;

import java.util.Date;
import java.util.List;

public interface EventLoggRepository {
    void addEventLogg(IhpEventLoggEvent eventLogg);

    List<IhpEventLoggEvent> fetchSorted(Integer limit, Integer offset, Sort.Direction direction, String sortBy);

    List <IhpEventLoggEvent> findAllTimePeriod(Date from, Date to);
}