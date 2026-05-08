package se.migrationsverket.ihpservice.domain.elements;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ElementNodType {
    DOCUMENT, ISSUE;

    public static ElementNodType getTypeName(String str) {
        for (ElementNodType nodeStatus : ElementNodType.values()) {
            if (nodeStatus.toString().equalsIgnoreCase(str)) {
                return nodeStatus;
            }
        }
        throw new IllegalArgumentException("Inte en giltig status: " + str);
    }

    @Override
    @JsonValue
    public String toString() {
        return name();
    }
}
