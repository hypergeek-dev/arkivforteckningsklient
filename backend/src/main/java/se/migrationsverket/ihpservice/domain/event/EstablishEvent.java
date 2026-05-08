package se.migrationsverket.ihpservice.domain.event;

public record EstablishEvent(String csNodePath, Integer csNodeId, String correlationId) {
}
