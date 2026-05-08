package se.migrationsverket.ihpservice.repository.ihp.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotNull;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class AbstractUuidEntity extends AbstractVersionedEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @NotNull
    @SequenceGenerator(name = "ihpservice_seq", sequenceName = "ihpservice_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ihpservice_seq")
    @Column(name = "id", nullable = false)
    private Integer id;
    @NotNull
    @Column(columnDefinition = "uuid", name = "uuid", nullable = false, updatable = false)
    private UUID uuid;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "skapad_datum")
    private Date created = new Date();
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "uppdaterad_datum")
    private Date updated = new Date();
}