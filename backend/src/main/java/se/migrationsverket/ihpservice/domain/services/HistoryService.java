package se.migrationsverket.ihpservice.domain.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import se.migrationsverket.ihpservice.api.rest.v1.dto.HistoryDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.History;
import se.migrationsverket.ihpservice.domain.IhpEventLoggEvent;
import se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories.HistoryRepository;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
@Timed
public class HistoryService {

    HistoryRepository repository;
    ApplicationEventPublisher applicationEventPublisher;

    private Jackson2ObjectMapperBuilder builder;

    private <T extends StructureNodeDto> int add(T node) {
        ObjectMapper om = builder.build();
        String jsonb = "{}";
        try {
            jsonb = om.writeValueAsString(node);
        } catch (JsonProcessingException e) {
            log.error("Could not serialize nodetype to history-table ", e);
        }

        History hist = History.builder().uuid(node.getUuid()).jsonb(new JSONObject(jsonb)).build();
        return repository.insert(hist);
    }

    public List<HistoryDto> getHistoryByUuid(UUID uuid) {
        return repository.getHistory(uuid).stream().map(History::mapToDto).toList();
    }

    public <T extends StructureNodeDto> int log(T node, EventAction action, String nodeName, String userId) {
        int historyId = add(node);
        publishEvent(node, action, nodeName, userId, historyId);
        return historyId;
    }

    public <T extends StructureNodeDto> void publishEvent(T node, EventAction eventAction, String nodeName, String userId, int historyId) {
        IhpEventLoggEvent eventLog = new IhpEventLoggEvent(this);
        eventLog.setAction(eventAction.name())
                .setDescription(eventAction.getDescription())
                .setUserId(userId)
                .setObjectName(node.getName().length() > 255 ? node.getName().substring(0, 255) : node.getName())
                .setObjectId(node.getUuid())
                .setType(nodeName)
                .setCreated(new Date())
                .setModelId(node.getPath())
                .setHistoryId(historyId);
        applicationEventPublisher.publishEvent(eventLog);
    }
}
