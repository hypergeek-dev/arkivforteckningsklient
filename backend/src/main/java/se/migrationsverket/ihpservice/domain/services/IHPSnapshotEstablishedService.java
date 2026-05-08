package se.migrationsverket.ihpservice.domain.services;

import io.micrometer.core.annotation.Timed;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataAccessException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;
import se.migrationsverket.ihpservice.domain.event.EstablishEvent;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IHPEstablishedRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.WorkRepository;


@Service
@AllArgsConstructor
@Slf4j
@Timed
public class IHPSnapshotEstablishedService {

    private final WorkRepository workRepository;
    private final ClassificationStructureRepository classificationStructureRepository;
    private final IHPEstablishedRepository repository;

    @EventListener
    @Retryable(backoff = @Backoff(delay = 5000, multiplier = 2))
    public void onEstablishIHPEvent(EstablishEvent event) {
        ClassificationStructureTypeNode classificationStructureTypeNodeEntity = classificationStructureRepository.findById(event.csNodeId()).orElseThrow();
        createIHPSnap(event.csNodePath(), event.csNodeId(), classificationStructureTypeNodeEntity.getInstructionCodeIhp());
    }

    public void createIHPSnap(String nodePath, Integer csNodeId, String instructionCode) throws DataAccessException {
        try {
            log.info("Skapar snapshot av informationshanteringsplanen för klassificeringsstruktur {} med path {}", csNodeId, nodePath);
            ModelSnapshotEstablished snap = ModelSnapshotEstablishedService.createSnap(workRepository.getEstablishedIHP(nodePath), csNodeId, instructionCode);
            repository.add(snap);
            log.info("Snapshot av informationshanteringsplan sparad.");
        } catch (Exception e) {
            log.warn("Det gick inte att skapa en snapshot. Försök att fastställa igen");
            throw new DataAccessException("Kunde inte skapa en snapshot av informationshanteringsplanen", e) {
            };
        }

    }


}
