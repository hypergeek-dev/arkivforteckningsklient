package se.migrationsverket.ihpservice.domain.elements;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ElementStatus {
    DRAFT,
    ESTABLISHED;


    public static ElementStatus getRuleStatus(String str) {
        for (ElementStatus status : ElementStatus.values()) {
            if (status.toString().equalsIgnoreCase(str)) {
                return status;
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
