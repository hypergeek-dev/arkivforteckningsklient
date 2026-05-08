package se.migrationsverket.ihpservice.api.rest.v1.dto;

import se.migrationsverket.ihpservice.domain.Domain;

public interface DtoMapper<T extends Domain> {

    T map();

    T addMap();

}
