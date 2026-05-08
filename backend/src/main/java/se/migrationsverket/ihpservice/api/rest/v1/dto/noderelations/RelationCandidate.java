package se.migrationsverket.ihpservice.api.rest.v1.dto.noderelations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import se.migrationsverket.ihpservice.api.rest.v1.dto.StructureNodeDto;
import se.migrationsverket.ihpservice.domain.services.NodePathHelper;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelationCandidate implements Comparable<RelationCandidate>{
    private String id;
    private String name;
    private String path;
    private String fullName;

    private RelationCandidate(String nodeId, String name, String path){
        this.id = nodeId;
        this.name = name;
        this.path = path;
        this.fullName = NodePathHelper.getNumber(path) + NodePathHelper.getTypePrefix(getPath()) + name;
    }

    public static RelationCandidate getInstance(StructureNodeDto node){
        return new RelationCandidate(node.getId(), node.getName(), node.getPath());
    }

    @Override
    public int compareTo(@NotNull RelationCandidate o) {
        int thisNumber = NodePathHelper.getSortValueFromPath(getPath());
        int oNumber = NodePathHelper.getSortValueFromPath(o.getPath());

        if(thisNumber == oNumber){
            String thisName = NodePathHelper.extractName(getPath(), getName());
            String oName = NodePathHelper.extractName(o.getPath(), o.getName());
            return thisName.compareToIgnoreCase(oName);

        } else {
            return thisNumber - oNumber;
        }

    }
}

