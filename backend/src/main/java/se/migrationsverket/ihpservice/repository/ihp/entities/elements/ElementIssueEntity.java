package se.migrationsverket.ihpservice.repository.ihp.entities.elements;

import lombok.*;
import se.migrationsverket.ihpservice.domain.elements.ElementIssue;
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
@Table(name = "elements_issue")
public class ElementIssueEntity implements Serializable, EntityI, EntityMapper<ElementIssue> {
    @Id
    @SequenceGenerator(name = "elements_issue_id_seq", sequenceName = "elements_issue_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "elements_issue_id_seq")
    private Integer id;
    @Column(name = "element_id")
    private Integer elementId;
    @Column(name = "issue_id")
    private Integer issueId;
    @Column(name = "issue_path")
    private String issuePath;

    @Override
    public ElementIssue map() {
        return ElementIssue.builder().id(getId()).elementId(getElementId()).issueId(getIssueId()).issuePath(getIssuePath()).build();
    }
}
