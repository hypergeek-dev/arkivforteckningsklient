package se.migrationsverket.ihpservice.domain.visualarkiv;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Reconciliation report for a completed import batch.
 * Returned by the import API and stored in import_batch.errors / .warnings.
 */
public record ImportReport(
    UUID batchId,
    boolean dryRun,
    String status,
    String sourceType,
    String sourceDatabase,
    int recordsRead,
    int recordsMapped,
    int recordsImported,
    int recordsSkipped,
    int recordsDuplicate,
    int recordsFailed,
    List<String> warnings,
    List<String> errors,
    List<String> unmappedFields,
    UUID confirmationToken,
    Instant generatedAt
) {}
