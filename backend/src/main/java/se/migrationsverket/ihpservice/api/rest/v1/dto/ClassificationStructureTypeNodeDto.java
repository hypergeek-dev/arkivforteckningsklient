package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;

import java.util.Date;
import java.util.UUID;

import static se.migrationsverket.ihpservice.support.IhpUtils.nullStringToInteger;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class ClassificationStructureTypeNodeDto extends StructureNodeDto implements DataTransferObject, DtoMapper<ClassificationStructureTypeNode> {
    @NotNull
    private static final String parentId = "0";
    @NotNull
    @Schema(allowableValues = {"csnode"})
    private final String nodeName = NodeName.CSNODE.getValue();
    private Integer csVersion;
    @NotNull
    private String authDecision;
    private String authName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date decisionDate;
    private String instruction;
    private String revised;
    private String instructionCodeIhp;

    @Override
    public ClassificationStructureTypeNode map() {
        return ClassificationStructureTypeNode
                .builder()
                .instructionCodeIhp(getInstructionCodeIhp())
                .instruction(getInstruction())
                .id(Integer.parseInt(getId()))
                .replacesId(nullStringToInteger(getReplacesId()))
                .name(getName())
                .remark(getRemark())
                .revised(this.getRevised())
                .start(getStart())
                .stop(getStop())
                .status(String.valueOf(getStatus()))
                .csVersion(getCsVersion())
                .authDecision(getAuthDecision())
                .authName(getAuthName())
                .path(getPath())
                .createdAt(getCreatedAt())
                .createdBy(getCreatedBy())
                .decisionDate(getDecisionDate())
                .uuid(getUuid())
                .localPath("0")
                .build();
    }

    @Override
    public ClassificationStructureTypeNode addMap() {
        return ClassificationStructureTypeNode.builder()
                .replacesId(nullStringToInteger(getReplacesId()))
                .instructionCodeIhp(getInstructionCodeIhp())
                .name(getName())
                .remark(getRemark())
                .start(getStart())
                .stop(getStop())
                .revised(this.getRevised())
                .csVersion(getCsVersion())
                .authDecision(getAuthDecision())
                .authName(getAuthName())
                .path(getPath())
                .decisionDate(getDecisionDate())
                .uuid(UUID.randomUUID())
                .build();
    }

}
