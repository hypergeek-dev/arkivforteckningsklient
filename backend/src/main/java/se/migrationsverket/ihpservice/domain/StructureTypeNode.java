package se.migrationsverket.ihpservice.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.PC_DELETE_FAILED;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Slf4j
public class StructureTypeNode implements Domain {
    private Integer id;
    private Integer replacesId;
    private String name;
    private String path;
    private Integer partialPath;
    private String localPath;
    private String status;
    private NodeStatus parentStatus;
    private Date start;
    private Date stop;
    private Date createdAt;
    private String createdBy;
    private Date updateAt;
    private String updatedBy;
    private String remark;
    private UUID uuid;
    private NodeName nodeName;

    public final void establish() {
        setStatus(NodeStatus.FASTSTALLD.toString());
    }

    public final boolean isEstablished() {
        return getStatus().equals(NodeStatus.FASTSTALLD.toString());
    }

    public final void allowUpdate() {
        if (!isUtkast()) {
            throw new PreconditionFailedException("Inte tillåtet att uppdatera eller ta bort klar, godkänd eller fastställd nodtyp");
        }
    }
    public final boolean allowedStatuses(NodeStatus... statuses ) {
        return Arrays.stream(statuses).filter(nodestatus -> nodestatus.equals(NodeStatus.valueOf(getStatus().toUpperCase()))).count() == 1;
    }

    public final void allowDelete() {
        if(!isUtkast()){
            throw new PreconditionFailedException(String.format(PC_DELETE_FAILED, id, status));
        }
    }
    public boolean pathIsNullOrEmpty() {
        return getPath() == null || getPath().isEmpty();
    }
    private boolean isUtkast(){
        return NodeStatus.UTKAST.toString().equalsIgnoreCase(status);
    }

    public String extractLocalPath() {
        return getPath().substring(getPath().lastIndexOf("/") + 1);
    }

    public String getModifiedName() {
        return getName() == null ? "" : getName().replace("/", "~");
    }

    public void validateRequirements() {
        if (getName() == null || getName().isEmpty() ||
                getStatus() == null ||
                getStart() == null) {
            throw new PreconditionFailedException("Obligatoriska attribut saknas");
        }

        if (getStop() != null && getStart().after(getStop())) {
            throw new IllegalArgumentException("Du kan inte sätta en stopptid som ligger innan din starttid");
        }
    }

    public Integer extractPartialPath() {
        return Integer.parseInt(getPath().substring(getPath().lastIndexOf(".") + 1));
    }

    public void validatePut(StructureTypeNode incoming) {
        allowUpdate();
        if (!incoming.getStatus().equals(getStatus())) {
            throw new UnsupportedOperationException("Inte tillåtet att ändra status vid uppdatering (PUT)");
        }
    }

    protected void setCopyName() {
        setName(String.format("Kopia(%s) %s",UUID.randomUUID(), getName()));
    }

    public void allowEstablish() {
        if(!getStatus().equalsIgnoreCase(NodeStatus.GODKAND.toString())){
            throw new PreconditionFailedException("Bara tillåtet att fastställa en godkänd strukturenhet");
        }
    }
}