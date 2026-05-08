package se.migrationsverket.ihpservice.repository.ihp.db.elements;

import org.springframework.data.jpa.repository.JpaRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementDataTypeEntity;

import jakarta.transaction.Transactional;

@Transactional
public interface ElementDataTypeEntityRepository extends JpaRepository<ElementDataTypeEntity, Integer> {

}
