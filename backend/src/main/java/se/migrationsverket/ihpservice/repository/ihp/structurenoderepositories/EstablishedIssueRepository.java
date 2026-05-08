package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DocumentTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IssueTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.IssueTypeNodeWithDocumentDto;
import se.migrationsverket.ihpservice.domain.exceptions.JsonMappingException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IssueNodeQueries.FETCH_ESTABLISHED_ISSUETYPE;
import static se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.IssueNodeQueries.FETCH_ESTABLISHED_ISSUETYPES;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class EstablishedIssueRepository {
    private final ObjectMapper mapper = new ObjectMapper();

    @PersistenceContext
    private EntityManager entityManager;

    public List<IssueTypeNodeDto> getActiveIssueNodes() {
        Query query = entityManager.createNativeQuery(FETCH_ESTABLISHED_ISSUETYPES);
        String jsonArray = (String) query.getSingleResult();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            TypeReference<List<IssueTypeNodeDto>> typeRef = new TypeReference<>() {
            };
            return objectMapper.readValue(jsonArray, typeRef);

        } catch (Exception e) {
            throw new JsonMappingException("Kunde inte hantera json arrayen med aktiva ärendetyper... ", e);
        }
    }


    public IssueTypeNodeWithDocumentDto getIssueByPathWithDocuments(String arendetypPath) {

        try {
            String searchPath = "%" + arendetypPath + "%";
            List<JsonNode> nodes = fetchNodes(searchPath);
            IssueTypeNodeWithDocumentDto issueTypeNodeWithDocumentDto = getArendeFromNodes(nodes);

            if (issueTypeNodeWithDocumentDto != null) {
                issueTypeNodeWithDocumentDto.setHandlingstyper(getHandlingarFromNodes(nodes));
                return issueTypeNodeWithDocumentDto;
            } else {
                throw new IllegalArgumentException("Hittade inget ärende.");
            }
        } catch (Exception exception) {
            log.error(exception.getMessage());
            throw new IllegalArgumentException(exception.getMessage());
        }
    }

    private IssueTypeNodeWithDocumentDto getArendeFromNodes(List<JsonNode> nodes) throws JsonProcessingException {
        IssueTypeNodeWithDocumentDto issueTypeNodeDto = null;
        for (JsonNode node : nodes) {
            if (isArende(node)) {
                issueTypeNodeDto = mapper.readValue(node.toString(), IssueTypeNodeWithDocumentDto.class);
            }
        }
        return issueTypeNodeDto;
    }

    private List<DocumentTypeNodeDto> getHandlingarFromNodes(List<JsonNode> nodes) throws JsonProcessingException {
        List<DocumentTypeNodeDto> documentTypeNodes = new ArrayList<>();
        for (JsonNode node : nodes) {
            if (!isArende(node)) {
                documentTypeNodes.add(mapper.readValue(node.toString(), DocumentTypeNodeDto.class));
            }
        }
        return documentTypeNodes;
    }


    @SuppressWarnings("unchecked")
    private List<JsonNode> fetchNodes(String searchPath) {
        Query query = entityManager.createNativeQuery(FETCH_ESTABLISHED_ISSUETYPE);
        query.setParameter(1, searchPath);

        List<Object> results = query.getResultList();

        return results.stream()
                .map(result -> {
                    try {
                        String data = (String) result;
                        return mapper.readTree(data);
                    } catch (IOException e) {
                        throw new RuntimeException("Någonting gick fel när jag skulle läsa json-datan", e);
                    }
                })
                .collect(Collectors.toList());
    }


    private boolean isArende(JsonNode node) {
        return node.has("nodeName") && "issuenode".equals(node.get("nodeName").asText());
    }

}