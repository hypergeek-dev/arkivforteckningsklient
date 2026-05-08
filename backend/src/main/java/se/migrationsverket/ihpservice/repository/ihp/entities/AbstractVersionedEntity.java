package se.migrationsverket.ihpservice.repository.ihp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@MappedSuperclass
public class AbstractVersionedEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 6146759914868069417L;
    @Setter
    @Getter
    @Version
    @Column(name = "version")
    private Integer version;
}