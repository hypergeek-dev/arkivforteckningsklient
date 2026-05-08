package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.json.JSONArray;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;

import java.io.Serializable;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "model_snapshot_established")
public class ModelSnapshotEstablishedEntity implements Serializable, EntityI, EntityMapper<ModelSnapshotEstablished> {
    @Id
    @SequenceGenerator(name = "id_sequence", sequenceName = "snapshot_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_sequence")
    private Integer id;
    @Column(name = "csnode_id")
    private Integer csnodeId;
    private Timestamp timestamp;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String modelb;
    @Column(name = "instruction_code")
    private String instructionCode;

    @PrePersist
    void prePersist() {

        if (timestamp == null) {
            timestamp = new Timestamp(System.currentTimeMillis());
        }

    }

    @Override
    public ModelSnapshotEstablished map() {
        return ModelSnapshotEstablished.builder()
                .id(getId())
                .csnodeId(getCsnodeId())
                .timestamp(getTimestamp())
                .modelb(enforceModelb(getModelb()))
                .instructionCode(getInstructionCode())
                .build();
    }

    private JSONArray enforceModelb(String str) {
        if (str.startsWith("{")) {
            String arr = "[" + str + "]";
            return new JSONArray(arr);
        }
        return new JSONArray(str);
    }
}
