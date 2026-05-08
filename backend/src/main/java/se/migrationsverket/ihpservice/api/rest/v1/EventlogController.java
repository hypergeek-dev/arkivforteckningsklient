package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.migrationsverket.ihpservice.api.rest.v1.dto.EventLogDto;
import se.migrationsverket.ihpservice.domain.IhpService;

import java.time.LocalDate;
import java.time.Year;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/rest/app")
public class EventlogController {
    private final IhpService ihpService;

    @GetMapping(value = "/eventlog/sorted")
    public List<EventLogDto> fetch(@RequestParam Integer limit, @RequestParam Integer offset, @RequestParam Sort.Direction direction, @RequestParam String sortBy) {
        return ihpService.fetchSorted(limit, offset, direction, sortBy);
    }

    @GetMapping(value = "/eventlog/timeperiod")
    public List<EventLogDto> fetchEventlogTimeperiod(@RequestParam String from, @RequestParam String to) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDate fromDate = LocalDate.parse(from, formatter);
        LocalDate toDate = LocalDate.parse(to, formatter);

        return ihpService.fetchEventLogsTimeperiod(dateCheck(fromDate), dateCheck(toDate));
    }

    public Date dateCheck(LocalDate date) {
        if (date.getYear() < Year.MIN_VALUE || date.getYear() > Year.MAX_VALUE) {
            throw new IllegalArgumentException("Ogiltigt år");
        } else if (date.getDayOfMonth() > date.lengthOfMonth()) {
            throw new IllegalArgumentException("Ogiltig dag");
        }

        ZoneId defaultZoneId = ZoneId.systemDefault();
        return Date.from(date.atStartOfDay(defaultZoneId).toInstant());
    }
}
