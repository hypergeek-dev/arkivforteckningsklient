package se.migrationsverket.ihpservice.api.rest.v1;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.migrationsverket.ihpservice.api.rest.v1.dto.*;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;
import se.migrationsverket.ihpservice.domain.SecureWebrequestService;
import se.migrationsverket.ihpservice.domain.authorization.AuthorizationStatics;
import se.migrationsverket.ihpservice.domain.services.*;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app"})
public class ImportController {

    private final ClassificationStructureTypeService csService;
    private final OperationalAreaTypeService oaService;
    private final ProcessGroupTypeService pgService;
    private final ProcessTypeService processService;
    private final IssueTypeService issueService;
    private final DocumentTypeService documentService;
    private final ObjectMapper objectMapper;
    private final SecureWebrequestService secureWebrequestService;

    /**
     * Import an Arkivförteckning from a JSON file produced by the export function.
     * The JSON is an array of node objects (StructureNodeDto / CommonNode shape),
     * ordered so that parents appear before children.
     *
     * Returns the id of the created ClassificationStructure (csnode).
     */
    @PostMapping(value = "/import/arkivforteckning", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportResultDto> importArkivforteckning(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "auth", required = false) String auth) {

        if (!secureWebrequestService.actionAllowed("arkivforteckning", AuthorizationStatics.ACTION_IMPORTERA)) {
            return ResponseEntity.status(403)
                    .body(ImportResultDto.builder().success(false).message("Ej behörig att importera.").build());
        }

        try {
            byte[] bytes = file.getBytes();
            List<Map<String, Object>> nodes = objectMapper.readValue(bytes,
                    new TypeReference<List<Map<String, Object>>>() {});

            if (nodes == null || nodes.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ImportResultDto.builder()
                                .success(false)
                                .message("Filen är tom eller har ogiltigt format.")
                                .build());
            }

            // Map old id -> new id so children can reference their new parents
            Map<String, String> idMapping = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            int created = 0;
            String importedCsNodeId = null;

            for (Map<String, Object> node : nodes) {
                String nodeName = (String) node.get("nodeName");
                String oldId = String.valueOf(node.get("id"));
                String oldParentId = String.valueOf(node.get("parentId"));
                String newParentId = idMapping.getOrDefault(oldParentId, oldParentId);
                String name = (String) node.getOrDefault("name", "Importerad nod");
                Date start = parseDate(sdf, (String) node.get("start"));

                try {
                    switch (nodeName != null ? nodeName : "") {
                        case "csnode" -> {
                            ClassificationStructureTypeNodeDto dto = new ClassificationStructureTypeNodeDto();
                            dto.setName(name);
                            dto.setStart(start);
                            ClassificationStructureTypeNode created_node =
                                    csService.add(dto.addMap(), EventAction.CREATE);
                            String newId = String.valueOf(created_node.getId());
                            idMapping.put(oldId, newId);
                            importedCsNodeId = newId;
                            created++;
                        }
                        case "oanode" -> {
                            OperationalAreaTypeNodeDto dto = new OperationalAreaTypeNodeDto();
                            dto.setName(name);
                            dto.setStart(start);
                            dto.setParentId(newParentId);
                            dto.setAuthDecision((String) node.getOrDefault("authDecision", ""));
                            var newNode = oaService.add(dto.addMap(), EventAction.CREATE);
                            idMapping.put(oldId, String.valueOf(newNode.getId()));
                            created++;
                        }
                        case "pgnode" -> {
                            ProcessGroupTypeNodeDto dto = new ProcessGroupTypeNodeDto();
                            dto.setName(name);
                            dto.setStart(start);
                            dto.setParentId(newParentId);
                            var newNode = pgService.add(dto.addMap(), EventAction.CREATE);
                            idMapping.put(oldId, String.valueOf(newNode.getId()));
                            created++;
                        }
                        case "processnode" -> {
                            ProcessTypeNodeDto dto = new ProcessTypeNodeDto();
                            dto.setName(name);
                            dto.setStart(start);
                            dto.setParentId(newParentId);
                            dto.setSeriesignum((String) node.get("seriesignum"));
                            dto.setSerieRubrik((String) node.get("serieRubrik"));
                            dto.setForvaringsplats((String) node.get("forvaringsplats"));
                            dto.setOmfang((String) node.get("omfang"));
                            dto.setInnehall((String) node.get("innehall"));
                            var newNode = processService.add(dto.addMap(), EventAction.CREATE);
                            idMapping.put(oldId, String.valueOf(newNode.getId()));
                            created++;
                        }
                        case "issuenode" -> {
                            IssueTypeNodeDto dto = new IssueTypeNodeDto();
                            dto.setName(name);
                            dto.setStart(start);
                            dto.setParentId(newParentId);
                            dto.setRegister(false);
                            dto.setKeepingUnit("");
                            var newNode = issueService.add(dto.addMap(), EventAction.CREATE);
                            idMapping.put(oldId, String.valueOf(newNode.getId()));
                            created++;
                        }
                        case "documentnode" -> {
                            DocumentTypeNodeDto dto = new DocumentTypeNodeDto();
                            dto.setName(name);
                            dto.setStart(start);
                            dto.setParentId(newParentId);
                            dto.setRegister(false);
                            dto.setKeepingUnit((String) node.getOrDefault("keepingUnit", ""));
                            dto.setForvaringsplats((String) node.get("forvaringsplats"));
                            dto.setVolymnum((String) node.get("volymnum"));
                            var newNode = documentService.add(dto.addMap(), EventAction.CREATE);
                            idMapping.put(oldId, String.valueOf(newNode.getId()));
                            created++;
                        }
                        default -> log.warn("Okänd nodtyp vid import: {}", nodeName);
                    }
                } catch (Exception e) {
                    log.error("Fel vid skapande av nod {}: {}", oldId, e.getMessage());
                }
            }

            return ResponseEntity.ok(ImportResultDto.builder()
                    .success(true)
                    .message(String.format("Import klar. %d noder skapades.", created))
                    .importedCsnodeId(importedCsNodeId)
                    .build());

        } catch (Exception e) {
            log.error("Import misslyckades", e);
            return ResponseEntity.internalServerError()
                    .body(ImportResultDto.builder()
                            .success(false)
                            .message("Import misslyckades: " + e.getMessage())
                            .build());
        }
    }

    private Date parseDate(SimpleDateFormat sdf, String raw) {
        if (raw == null || raw.isBlank()) {
            return new Date();
        }
        try {
            String datePart = raw.length() > 10 ? raw.substring(0, 10) : raw;
            return sdf.parse(datePart);
        } catch (ParseException e) {
            log.warn("Kunde inte tolka datum '{}', använder dagens datum", raw);
            return new Date();
        }
    }
}
