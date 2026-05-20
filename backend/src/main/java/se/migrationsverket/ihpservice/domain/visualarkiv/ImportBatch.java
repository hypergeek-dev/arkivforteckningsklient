package se.migrationsverket.ihpservice.domain.visualarkiv;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "import_batch", schema = "ihp")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(name = "source_database", length = 300)
    private String sourceDatabase;

    @Column(name = "source_host", length = 300)
    private String sourceHost;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "is_dry_run", nullable = false)
    private boolean dryRun;

    @Column(name = "operator", length = 150)
    private String operator;

    @Column(name = "records_read")
    private int recordsRead;

    @Column(name = "records_mapped")
    private int recordsMapped;

    @Column(name = "records_imported")
    private int recordsImported;

    @Column(name = "records_skipped")
    private int recordsSkipped;

    @Column(name = "records_duplicate")
    private int recordsDuplicate;

    @Column(name = "records_failed")
    private int recordsFailed;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "warnings", columnDefinition = "jsonb")
    private List<String> warnings;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "errors", columnDefinition = "jsonb")
    private List<String> errors;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "unmapped_fields", columnDefinition = "jsonb")
    private List<String> unmappedFields;

    @Column(name = "confirmation_token", columnDefinition = "uuid")
    private UUID confirmationToken;

    public enum Status {
        RUNNING, COMPLETED, FAILED, DRY_RUN_COMPLETE
    }
}
