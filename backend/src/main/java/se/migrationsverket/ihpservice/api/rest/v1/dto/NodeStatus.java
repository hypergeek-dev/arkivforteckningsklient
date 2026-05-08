package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@ApiResponse
public enum NodeStatus {
    UTKAST, KLAR, GODKAND, FASTSTALLD;

    public static NodeStatus getNodeStatus(String str) {
        for (NodeStatus nodeStatus : NodeStatus.values()) {
            if (nodeStatus.toString().equalsIgnoreCase(str)) {
                return nodeStatus;
            }
        }
        throw new IllegalArgumentException("Ingen giltig status: " + str);
    }

    @Override
    @JsonValue
    public String toString() {
        return name().toLowerCase();
    }
}
