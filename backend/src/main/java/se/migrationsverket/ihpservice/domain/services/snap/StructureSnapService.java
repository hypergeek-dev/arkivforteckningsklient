package se.migrationsverket.ihpservice.domain.services.snap;

import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.WorkRepository;

import java.util.List;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class StructureSnapService {
    private final ClassificationStructureRepository classificationStructureRepository;
    private final WorkRepository workRepository;


    public List<String> getWorkDTO(Integer csnodeId) {
        ClassificationStructureTypeNode dto = classificationStructureRepository.findById(csnodeId)
                .orElseThrow(NotFoundException::new);
        return workRepository.getWorkDto(dto.getPath());
    }

}
