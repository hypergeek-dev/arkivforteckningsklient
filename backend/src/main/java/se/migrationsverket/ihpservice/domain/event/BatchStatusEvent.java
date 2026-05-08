package se.migrationsverket.ihpservice.domain.event;

import lombok.Getter;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.List;

@Getter
public class BatchStatusEvent {
    private final List<Integer> nodeIds;
    private final EventAction action;
    private final String userId;
    private final NodeName nodeName;
    private final String correlationId;

    public BatchStatusEvent(List<Integer> nodeIds, EventAction action, String userId, NodeName nodeName, String correlationId) {
        this.nodeIds = nodeIds;
        this.action = action;
        this.userId = userId;
        this.nodeName = nodeName;
        this.correlationId = correlationId;
    }
}
