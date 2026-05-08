package se.migrationsverket.ihpservice.support.security;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class IhpAuthResources {
    private String arendetyp;
    private String resource;


    @Override
    public String toString() {
        return "IhpAuthResources{" +
                "arendetyp='" + arendetyp + '\'' +
                "resource='" + resource + '\'' +
                '}';
    }


}
