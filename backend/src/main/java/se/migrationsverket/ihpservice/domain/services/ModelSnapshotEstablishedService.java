package se.migrationsverket.ihpservice.domain.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ClassificationStructureRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IHPEstablishedRepository;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.ModelSnapshotEstablishedRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class ModelSnapshotEstablishedService {
    ModelSnapshotEstablishedRepository repository;
    IHPEstablishedRepository ihpEstablishedRepository;
    ClassificationStructureRepository csRepository;
    OperationalAreaTypeService aaService;
    ProcessTypeService processTypeService;
    ProcessGroupTypeService processGroupTypeService;

    public static ModelSnapshotEstablished convertObjToSnap(List<StructureNodeDto> cs, Integer csnodeId, String instructionCode) {
        log.info("Konverterar till Snap av en lista av noder {}", cs.size());
        ObjectMapper om = new ObjectMapper();
        String model = "";
        try {
            model = om.writeValueAsString(cs);
        } catch (JsonProcessingException e) {
            log.error("Could not serialize structure for snapshot ", e);
        }

        return ModelSnapshotEstablished.builder()
                .csnodeId(csnodeId)
                .modelb(new JSONArray(model))
                .instructionCode(instructionCode)
                .build();
    }

    public static ModelSnapshotEstablished createSnap(List<String> dto, Integer csnodeId, String instructionCode) {
        return ModelSnapshotEstablished.builder()
                .csnodeId(csnodeId)
                .modelb(new JSONArray(dto.stream().map(JSONObject::new).toList()))
                .instructionCode(instructionCode)
                .build();
    }

    public void add(List<StructureNodeDto> list, Integer csnodeId, String instructionCode) {
        repository.add(convertObjToSnap(list, csnodeId, instructionCode));
    }

    public Optional<ModelSnapshotEstablished> fetchByTimestamp(Timestamp ts, Integer id) {
        return repository.fetch(ts, id);
    }

    public List<ModelSnapshotEstablished> fetchAllEstablished(Integer id) {
        return repository.findAllByCsnodeId(id).toList();
    }

    public Optional<ModelSnapshotEstablished> getActiveIHP() {
        return repository.getActiveIHP();
    }

    public void createSnapshot(Integer csnodeId, String instructionCode) {
        StructureNodeDto cs = csRepository.findById(csnodeId)
                .map(ClassificationStructureTypeNode::mapToDto)
                .orElseThrow(NotFoundException::new);
        int id = Integer.parseInt(cs.getId());
        List<StructureNodeDto> nodeDtoList = aaService.getSnapshotEstablished(id, cs.getPath());

        nodeDtoList.add(cs);
        List<StructureNodeDto> sortedList = nodeDtoList.stream().sorted(StructureNodeDto.byLocalPath()).toList();
        add(sortedList, csnodeId, instructionCode);
    }

}
