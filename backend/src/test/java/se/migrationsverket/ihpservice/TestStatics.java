package se.migrationsverket.ihpservice;

import se.migrationsverket.ihpservice.api.rest.v1.dto.ClassificationStructureTypeNodeDto;

import java.time.LocalDate;
import java.util.Date;

import static se.migrationsverket.ihpservice.support.IhpUtils.localDateTimeToDate;

public class TestStatics {
    public static final Date TODAY = localDateTimeToDate(LocalDate.now().atStartOfDay());
    public static final Date TOMORROW = localDateTimeToDate(LocalDate.now().atStartOfDay().plusDays(1));
    public static final Date YESTERDAY = localDateTimeToDate(LocalDate.now().atStartOfDay().minusDays(1));

    public static final ClassificationStructureTypeNodeDto CS_DTO = ClassificationStructureTypeNodeDto.builder()
            .name("Klassificeringsstruktur")
            .remark("Anmärkning")
            .start(TODAY)
            .stop(TOMORROW)
            .csVersion(1)
            .authDecision("Verkställs")
            .authName("Migrationsverket")
            .decisionDate(YESTERDAY)
            .build();
}
