package se.migrationsverket.ihpservice.repository.ihp.entities;

import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.json.JSONArray;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;

import jakarta.persistence.*;

import java.io.Serializable;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "ihp_established")
public class IHPEstablishedEntity implements Serializable, EntityI, EntityMapper<ModelSnapshotEstablished> {
    @Id
    @SequenceGenerator(name = "ihp_established_id_seq", sequenceName = "ihp_established_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ihp_established_id_seq")
    private Integer id;
    @Column(name = "csnode_id")
    private Integer csnodeId;
    private Timestamp timestamp;
    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
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
                .modelb(new JSONArray(getModelb()))
                .build();
    }
}
