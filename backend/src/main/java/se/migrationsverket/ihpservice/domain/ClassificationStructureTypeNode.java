package se.migrationsverket.ihpservice.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ClassificationStructureTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;
import se.migrationsverket.ihpservice.repository.ihp.entities.ClassificationStructureTypeNodeEntity;

import java.util.Date;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class ClassificationStructureTypeNode extends StructureTypeNode implements Domain, DomainMapper<ClassificationStructureTypeNodeDto, ClassificationStructureTypeNodeEntity> {
    private Integer csVersion;
    private String authDecision;
    private String instruction;
    private String authName;
    private Date decisionDate;
    private String revised;
    private String instructionCodeIhp;

    @Override
    public ClassificationStructureTypeNodeDto mapToDto() {
        return ClassificationStructureMapper.mapToDto(this);
    }

    @Override
    public ClassificationStructureTypeNodeEntity mapToEntity() {
        return ClassificationStructureMapper.mapToEntity(this);
    }

    @Override
    public ClassificationStructureTypeNodeEntity mapToEntity(String userId) {
        return ClassificationStructureMapper.mapToEntity(this, userId);
    }

    @Override
    public void validateRequirements() {
        super.validateRequirements();
        if (getAuthDecision() == null || getAuthDecision().isEmpty()) {
            throw new PreconditionFailedException("Obligatoriska attribut saknas");
        }
    }

    public void add(String userId) {
        if (getPath() == null || getPath().isEmpty()) {
            setPath("/" + getUuid());
        }
        if (getCsVersion() == null) {
            setCsVersion(0);
        }
        setCreatedBy(userId);
    }

    public void update(String userId) {
        super.allowUpdate();
        setPath("/" + getUuid());
        setUpdatedBy(userId);
    }

    public void update(String userId, ClassificationStructureTypeNode persistedNode) {
        if (!persistedNode.getStatus().equals(getStatus())) {
            throw new UnsupportedOperationException("Inte tillåtet att ändra status vid uppdatering (PUT)");
        }
        update(userId);
    }


    public void updatesPostEstablish() {
        setDecisionDate(new Date());
    }

    public void copyCs() {
        setStatus(NodeStatus.UTKAST.toString());
        setName(getCopyName(getName()));
        setUuid(UUID.randomUUID());
        setPath("/" + getUuid());
    }

    private String getCopyName(String name) {
        int nameLength = name.length();
        return switch (nameLength) {
            case 50 -> name;
            case 49 -> "C" + name;
            case 48 -> "C " + name;
            case 47 -> "CP " + name;
            case 46 -> "CPY " + name;
            default -> "COPY " + name;
        };
    }

    public void allowPatchStatus(NodeStatus toStatus) {
        if (toStatus == NodeStatus.UTKAST && NodeStatus.FASTSTALLD.toString().equals(getStatus())) {
            if (getStop() != null && getStop().before(new Date())) {
                throw new PreconditionFailedException("Klassificeringsstruktur är fastställd och slutdatum är passerat, det är inte tillåtet att låsa upp till utkast.");
            }
        } else if (toStatus.equals(NodeStatus.FASTSTALLD)) {
            throw new UnsupportedOperationException(String.format("Otillåten väg till fastställning av Klassificeringsstruktur : %s", getName()));
        }
    }
}
