package se.migrationsverket.ihpservice.api.rest.v1;

import se.migrationsverket.ihpservice.api.rest.v1.dto.IhpUserDto;

public class Mapper {

    private Mapper() {
    }


    public static IhpUserDto map(String userId) {
        return IhpUserDto.builder().userId(userId).build();
    }

}
