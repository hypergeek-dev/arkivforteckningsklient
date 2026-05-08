package se.migrationsverket.ihpservice.repository.ihp.entities.elements;

import lombok.*;
import se.migrationsverket.ihpservice.domain.elements.ElementDataType;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import jakarta.persistence.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "elements_datatype")
public class ElementDataTypeEntity implements Serializable, EntityI, EntityMapper<ElementDataType> {
    @Id
    @SequenceGenerator(name = "elements_datatype_id_seq", sequenceName = "elements_datatype_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "elements_datatype_id_seq")
    private Integer id;
    private String type;

    @Override
    public ElementDataType map() {
        return ElementDataType.builder().id(getId()).type(getType()).build();
    }
}
