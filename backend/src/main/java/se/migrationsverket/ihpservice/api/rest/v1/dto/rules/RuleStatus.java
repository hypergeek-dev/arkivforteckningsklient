package se.migrationsverket.ihpservice.api.rest.v1.dto.rules;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RuleStatus {
    DRAFT("utkast"),
    ESTABLISHED("faststalld");

    private final String value;

    RuleStatus(String value){
        this.value = value;
    }

    @JsonValue
    public String getValue(){
        return value;
    }

    public static RuleStatus getRuleStatus(String str) {
        for(RuleStatus ruleStatus:  RuleStatus.values()){
            if (ruleStatus.getValue().equalsIgnoreCase(str)) {
                return ruleStatus;
            }
        }
        throw new IllegalArgumentException("Not a valid status: " + str);
    }
}
