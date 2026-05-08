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
@Table(name = "version")
public class VersionEntity implements Serializable {
    @Id
    @NotNull
    private Integer id;
    private Integer version;
    @Column(name = "giltig_till")
    private Date giltigTill;
    @Column(name = "giltig_fran")
    private Date giltigFran;
}
