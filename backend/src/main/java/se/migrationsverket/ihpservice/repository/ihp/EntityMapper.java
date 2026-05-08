package se.migrationsverket.ihpservice.repository.ihp;

import se.migrationsverket.ihpservice.domain.IhpEventLoggEvent;
import se.migrationsverket.ihpservice.repository.ihp.entities.IhpEventLoggEntity;

import java.util.List;
import java.util.stream.Collectors;

public class EntityMapper {
    private EntityMapper() {
    }

    public static IhpEventLoggEntity map(IhpEventLoggEvent eventLogg) {
        return IhpEventLoggEntity.builder()
                .type(eventLogg.getType())
                .action(eventLogg.getAction())
                .description(eventLogg.getDescription())
                .objectId(eventLogg.getObjectId())
                .objectName(eventLogg.getObjectName())
                .userId(eventLogg.getUserId())
                .modelId(eventLogg.getModelId())
                .historyId(eventLogg.getHistoryId())
                .build();
    }

    public static IhpEventLoggEvent map(IhpEventLoggEntity ihpEventLoggEntity) {
        IhpEventLoggEvent eventLog = new IhpEventLoggEvent(new Object());
        return eventLog.setAction(ihpEventLoggEntity.getAction())
                .setDescription(ihpEventLoggEntity.getDescription())
                .setUserId(ihpEventLoggEntity.getUserId())
                .setObjectName(ihpEventLoggEntity.getObjectName())
                .setObjectId(ihpEventLoggEntity.getObjectId())
                .setType(ihpEventLoggEntity.getType())
                .setCreated(ihpEventLoggEntity.getCreated())
                .setModelId(ihpEventLoggEntity.getModelId());
    }

    public static List<IhpEventLoggEvent> mapEventLog(List<IhpEventLoggEntity> eventLoggEntityList) {
        return eventLoggEntityList.stream().map(EntityMapper::map).collect(Collectors.toList());
    }

}