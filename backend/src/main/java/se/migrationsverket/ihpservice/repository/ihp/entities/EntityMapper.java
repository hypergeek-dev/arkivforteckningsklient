package se.migrationsverket.ihpservice.repository.ihp.entities;

import se.migrationsverket.ihpservice.domain.Domain;

public interface EntityMapper <T extends Domain>{
    T map();
}
