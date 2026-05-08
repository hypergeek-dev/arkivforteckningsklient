package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.io.Serial;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@Entity
@Table(name = "restriktion")
public class RestrictionEntity extends AbstractUuidEntity {
    @Serial
    private static final long serialVersionUID = 4567035357880128232L;
    @Column(name = "modell_id")
    private String modelId;
    @Column(name = "sekretess_beskrivning")
    private String sekretess;
    @Column(name = "personuppgifter_beskrivning")
    private String personuppgifter;
    @Column(name = "informationsklass")
    private short informationsklass;
}