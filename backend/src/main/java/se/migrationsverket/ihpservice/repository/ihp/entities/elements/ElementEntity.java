package se.migrationsverket.ihpservice.repository.ihp.entities.elements;

import lombok.*;
import se.migrationsverket.ihpservice.domain.elements.Element;
import se.migrationsverket.ihpservice.domain.elements.ElementNodType;
import se.migrationsverket.ihpservice.domain.elements.ElementStatus;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityI;
import se.migrationsverket.ihpservice.repository.ihp.entities.EntityMapper;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "elements")
public class ElementEntity implements Serializable, EntityI, EntityMapper<Element> {
    @Id
    @SequenceGenerator(name = "elements_id_seq", sequenceName = "elements_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "elements_id_seq")
    private Integer id;
    private String name;
    private String description;
    private Integer datatype;
    private boolean mandatory;
    @Column(name = "startdate")
    private Date startDate;
    @Column(name = "enddate")
    private Date endDate;
    @Column(name = "node_type")
    private String nodeType;
    private String status;
    @Column(name = "created_by")
    private String createdBy;
    @Column(name = "updated_by")
    private String updatedBy;
    @Column(name = "created_at")
    private Date createdAt;
    @Column(name = "updated_at")
    private Date updatedAt;

    @Override
    public Element map() {
        return Element.builder()
                .id(getId())
                .name(getName())
                .description(getDescription())
                .datatype(getDatatype())
                .mandatory(isMandatory())
                .startDate(getStartDate())
                .endDate(getEndDate())
                .nodType(ElementNodType.getTypeName(getNodeType()))
                .status(ElementStatus.getRuleStatus(getStatus()))
                .createdAt(getCreatedAt())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .build();
    }
}
