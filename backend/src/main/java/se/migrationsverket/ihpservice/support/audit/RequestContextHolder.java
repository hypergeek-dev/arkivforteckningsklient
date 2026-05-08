package se.migrationsverket.ihpservice.support.audit;

import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RequestContextHolder {

    private final Map<String, Object> parameter = new HashMap<>();

    public Object get(String key) {
        return this.parameter.get(key.toLowerCase());
    }

    public void put(String key, Object value) {
        this.parameter.put(key.toLowerCase(), value);
    }

    public String getStringValue(String key) {
        return String.valueOf(this.get(key.toLowerCase()));
    }

    public String toString() {
        return "RequestContextHolder{parameter=" + this.parameter + '}';
    }
}
