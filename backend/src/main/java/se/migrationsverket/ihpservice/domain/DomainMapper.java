package se.migrationsverket.ihpservice.domain;

import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;

public interface DomainMapper <T extends DataTransferObject, S extends EntityI> {

    T mapToDto();

    S mapToEntity();
    S mapToEntity(String userId);
}
