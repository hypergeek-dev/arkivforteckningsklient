package se.migrationsverket.ihpservice.domain.services;

import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeName;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.ClassificationStructureTypeNode;

import java.util.Date;
import java.util.UUID;

public class CsTestStatics {
    private CsTestStatics(){}

    static final String USER = "timgra";
    static final UUID csId = UUID.fromString("dbd2687e-0614-477b-aa84-4a42ab21ba3b");

    static final ClassificationStructureTypeNode nodeToAdd = ClassificationStructureTypeNode.builder()
            .id(47)
            .name("csNodeToAdd")
            .localPath("1")
            .status(NodeStatus.UTKAST.toString())
            .start(new Date())
            .nodeName(NodeName.CSNODE)
            .authDecision("Beslut")
            .uuid(csId)
            .build();

    static final ClassificationStructureTypeNode preparedNode = ClassificationStructureTypeNode.builder()
            .id(47)
            .name("csNodeToAdd")
            .path("/" + csId)
            .csVersion(0)
            .localPath("1")
            .status(NodeStatus.UTKAST.toString())
            .start(new Date())
            .nodeName(NodeName.CSNODE)
            .authDecision("Beslut")
            .uuid(csId)
            .build();

    static final ClassificationStructureTypeNode nodeKlar = ClassificationStructureTypeNode.builder()
            .id(47)
            .name("csNodeToAdd")
            .path("/" + csId)
            .csVersion(0)
            .localPath("1")
            .status(NodeStatus.KLAR.toString())
            .start(new Date())
            .nodeName(NodeName.CSNODE)
            .authDecision("Beslut")
            .build();
    static final ClassificationStructureTypeNode nonExistingNode = ClassificationStructureTypeNode.builder()
            .id(1)
            .name("csNodeToAdd")
            .path("/" + csId)
            .csVersion(0)
            .localPath("1")
            .status(NodeStatus.KLAR.toString())
            .start(new Date())
            .nodeName(NodeName.CSNODE)
            .authDecision("Beslut")
            .build();

    static final ClassificationStructureTypeNode nodeGodkand = ClassificationStructureTypeNode.builder()
            .id(47)
            .name("csNodeToAdd")
            .path("/" + csId)
            .csVersion(0)
            .localPath("1")
            .status(NodeStatus.GODKAND.toString())
            .start(new Date())
            .updateAt(new Date())
            .nodeName(NodeName.CSNODE)
            .authDecision("Beslut")
            .build();

}
