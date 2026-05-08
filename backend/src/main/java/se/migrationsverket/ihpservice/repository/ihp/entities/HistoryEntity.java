package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.json.JSONObject;
import se.migrationsverket.ihpservice.domain.History;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "history")
public class HistoryEntity implements Serializable, EntityI, EntityMapper<History> {
    @Id
    @SequenceGenerator(name = "history_id_seq", sequenceName = "history_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "history_id_seq")
    private Integer id;
    private UUID uuid;
    @Column(name = "date")
    private Timestamp timestamp;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String json;

    @PrePersist
    void prePersist() {
        if (timestamp == null) {
            timestamp = new Timestamp(System.currentTimeMillis());
        }
    }

    @Override
    public History map() {
        return History.builder()
                .id(getId())
                .uuid(getUuid())
                .ts(getTimestamp())
                .jsonb(new JSONObject(getJson()))
                .build();
    }
}