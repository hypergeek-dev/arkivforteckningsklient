package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@Entity
@Table(name = "type")
public class TypeEntity implements Serializable {
    @Id
    @NotNull
    private Integer id;
    private String namn;
    @Column(name = "skapad_datum")
    private Date skapadDatum;
}
