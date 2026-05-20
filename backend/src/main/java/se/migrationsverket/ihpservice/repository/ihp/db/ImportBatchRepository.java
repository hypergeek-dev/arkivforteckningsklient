package se.migrationsverket.ihpservice.repository.ihp.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.domain.visualarkiv.ImportBatch;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImportBatchRepository extends JpaRepository<ImportBatch, UUID> {

    Optional<ImportBatch> findByConfirmationToken(UUID confirmationToken);

    /**
     * Atomically consumes a dry-run confirmation token.
     * Returns 1 if the token was found and invalidated, 0 if already used or not found.
     * Using a single UPDATE prevents the TOCTOU race between token lookup and invalidation.
     */
    @Modifying
    @Transactional
    @Query("UPDATE ImportBatch b SET b.confirmationToken = null, b.status = 'COMPLETED' " +
           "WHERE b.confirmationToken = :token AND b.dryRun = true AND b.status = 'DRY_RUN_COMPLETE'")
    int invalidateToken(@Param("token") UUID token);
}
