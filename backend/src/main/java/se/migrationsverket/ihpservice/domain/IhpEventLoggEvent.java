package se.migrationsverket.ihpservice.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.context.ApplicationEvent;
import se.migrationsverket.ihpservice.api.rest.v1.dto.EventLogDto;

import java.io.Serial;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
public class IhpEventLoggEvent extends ApplicationEvent {
    @Serial
    private static final long serialVersionUID = 7343265181604263530L;
    private Date created;
    private String action;
    private String description;
    private String userId;
    private String objectName;
    private UUID objectId;
    private String type;
    private String modelId;
    private Integer historyId;

    /**
     * Create a new ApplicationEvent.
     *
     * @param source the object on which the event initially occurred (never {@code null})
     */
    public IhpEventLoggEvent(Object source) {
        super(source);
    }

    public EventLogDto mapToDto(){
        return EventLogDto.builder()
                .action(getAction().toLowerCase())
                .description(getDescription())
                .objectId(getObjectId())
                .objectName(getObjectName())
                .userId(getUserId())
                .type(getType())
                .created(getCreated())
                .modelId(getModelId())
                .build();
    }
}
