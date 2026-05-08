package se.migrationsverket.ihpservice.domain;

import se.migrationsverket.ihpservice.api.rest.v1.dto.ClassificationStructureTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.repository.ihp.entities.ClassificationStructureTypeNodeEntity;

import java.util.Date;

import static se.migrationsverket.ihpservice.support.IhpUtils.nullIntegerToString;

public class ClassificationStructureMapper {
    private ClassificationStructureMapper() {
    }

    static ClassificationStructureTypeNodeDto mapToDto(ClassificationStructureTypeNode node) {
        return ClassificationStructureTypeNodeDto.builder()
                .id(Integer.toString(node.getId()))
                .replacesId(nullIntegerToString(node.getReplacesId()))
                .name(node.getName())
                .remark(node.getRemark())
                .start(node.getStart())
                .stop(node.getStop())
                .status(NodeStatus.getNodeStatus(node.getStatus()))
                .csVersion(node.getCsVersion())
                .authDecision(node.getAuthDecision())
                .authName(node.getAuthName())
                .path(node.getPath())
                .createdAt(node.getCreatedAt())
                .createdBy(node.getCreatedBy())
                .updated(node.getUpdateAt())
                .updatedBy(node.getUpdatedBy())
                .decisionDate(node.getDecisionDate())
                .uuid(node.getUuid())
                .localPath("0")
                .instruction(node.getInstruction())
                .instructionCodeIhp(node.getInstructionCodeIhp())
                .revised(node.getRevised())
                .build();
    }

    static ClassificationStructureTypeNodeEntity mapToEntity(ClassificationStructureTypeNode node) {
        return ClassificationStructureTypeNodeEntity.builder()
                .id(node.getId())
                .replacesId(node.getReplacesId())
                .name(node.getName())
                .remark(node.getRemark())
                .start(node.getStart())
                .stop(node.getStop())
                .status(node.getStatus())
                .csVersion(node.getCsVersion())
                .authDecision(node.getAuthDecision())
                .authName(node.getAuthName())
                .path(node.getPath())
                .createdAt(node.getCreatedAt())
                .createdBy(node.getCreatedBy())
                .updatedAt(new Date())
                .updatedBy(node.getUpdatedBy())
                .decisionDate(node.getDecisionDate())
                .uuid(node.getUuid())
                .instruction(node.getInstruction())
                .instructionCodeIhp(node.getInstructionCodeIhp())
                .revised(node.getRevised())
                .build();
    }

    static ClassificationStructureTypeNodeEntity mapToEntity(ClassificationStructureTypeNode node, String userId) {
        return ClassificationStructureTypeNodeEntity.builder()
                .replacesId(node.getReplacesId())
                .name(node.getName())
                .remark(node.getRemark())
                .start(node.getStart())
                .stop(node.getStop())
                .csVersion(node.getCsVersion())
                .authDecision(node.getAuthDecision())
                .authName(node.getAuthName())
                .path(node.getPath())
                .createdBy(userId)
                .decisionDate(node.getDecisionDate())
                .uuid(node.getUuid())
                .instruction(node.getInstruction())
                .instructionCodeIhp(node.getInstructionCodeIhp())
                .revised(node.getRevised())
                .build();
    }
}
