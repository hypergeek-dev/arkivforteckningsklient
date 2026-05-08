package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.io.Serial;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@Entity
@Table(name = "handelselogg")
public class IhpEventLoggEntity extends AbstractUuidEntity {
    @Serial
    private static final long serialVersionUID = 7025746531255120041L;
    @Column(name = "handelse")
    private String action;
    @Column(name = "beskrivning")
    private String description;
    @Column(name = "anvandar_id")
    private String userId;
    @Column(name = "objektnamn")
    private String objectName;
    @Column(name = "objekt_id")
    private UUID objectId;
    @Column(name = "modell_id")
    private String modelId;
    @Column(name = "typ")
    private String type;
    @Column(name = "history_id")
    private Integer historyId;
}