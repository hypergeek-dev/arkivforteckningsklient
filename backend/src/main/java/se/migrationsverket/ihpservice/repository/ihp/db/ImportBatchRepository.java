package se.migrationsverket.ihpservice.repository.ihp.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import se.migrationsverket.ihpservice.domain.visualarkiv.ImportBatch;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImportBatchRepository extends JpaRepository<ImportBatch, UUID> {
    Optional<ImportBatch> findByConfirmationToken(UUID confirmationToken);
}
