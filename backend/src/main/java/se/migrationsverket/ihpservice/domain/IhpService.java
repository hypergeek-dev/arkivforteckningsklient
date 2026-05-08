package se.migrationsverket.ihpservice.domain;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.EventLogDto;
import se.migrationsverket.ihpservice.repository.ihp.EventLoggRepository;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class IhpService {

    private final EventLoggRepository eventLoggRepository;

    public List<EventLogDto> fetchSorted(Integer limit, Integer offset, Sort.Direction direction, String sortBy) {
        return eventLoggRepository.fetchSorted(limit, offset, direction, sortBy).stream().map(IhpEventLoggEvent::mapToDto).collect(Collectors.toList());
    }

    public List<EventLogDto> fetchEventLogsTimeperiod(Date from, Date to) {
        return eventLoggRepository.findAllTimePeriod(from, to)
                .stream()
                .map(IhpEventLoggEvent::mapToDto)
                .collect(Collectors.toList());
    }
}

