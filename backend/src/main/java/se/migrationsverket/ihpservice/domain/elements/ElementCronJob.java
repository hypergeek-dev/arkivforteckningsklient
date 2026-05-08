package se.migrationsverket.ihpservice.domain.elements;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import se.migrationsverket.ihpservice.repository.ihp.db.elements.ElementDocumentEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.db.elements.ElementIssueEntityRepository;

@Configuration
@EnableScheduling
@AllArgsConstructor
@Slf4j
public class ElementCronJob {
    ElementIssueEntityRepository elementIssueEntityRepository;
    ElementDocumentEntityRepository elementDocumentEntityRepository;

    @Scheduled(cron = "0 */5 * ? * *")
    public void runEvey5Minutes() {
        elementIssueEntityRepository.deleteEndedElementConnection();
        elementDocumentEntityRepository.deleteEndedElementConnection();
    }
}
