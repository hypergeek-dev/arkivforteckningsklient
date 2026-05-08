package se.migrationsverket.ihpservice.domain.elements;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.domain.Domain;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementIssueEntity;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.UNSUP_IFC;

@Data
@SuperBuilder
public class ElementIssue implements Domain {
    private Integer id;
    private Integer elementId;
    private Integer issueId;
    private String issuePath;


    public void validateRequirements() {
        throw new UnsupportedOperationException(UNSUP_IFC);
    }

    public ElementIssueEntity mapToEntity() {
        return ElementIssueEntity.builder().id(getId()).elementId(getElementId()).issueId(getIssueId()).issuePath(getIssuePath()).build();
    }
}
