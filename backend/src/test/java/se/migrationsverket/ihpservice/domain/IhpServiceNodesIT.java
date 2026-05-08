package se.migrationsverket.ihpservice.domain;

import lombok.extern.slf4j.Slf4j;
import org.junit.Ignore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import se.migrationsverket.ihpservice.api.rest.v1.dto.ClassificationStructureTypeNodeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.api.rest.v1.dto.OperationalAreaTypeNodeDto;
import se.migrationsverket.ihpservice.domain.services.ClassificationStructureTypeService;
import se.migrationsverket.ihpservice.domain.services.OperationalAreaTypeService;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static se.migrationsverket.ihpservice.TestStatics.CS_DTO;
import static se.migrationsverket.ihpservice.support.ApplicationStatics.FASTSTALLD;
import static se.migrationsverket.ihpservice.support.ApplicationStatics.UTKAST;

@Slf4j
@SpringBootTest
@ActiveProfiles("local")
@TestPropertySource(locations = "classpath:./application.properties")
class IhpServiceNodesIT {

    @Autowired
    ClassificationStructureTypeService csService;

    @Autowired
    OperationalAreaTypeService aaService;

    @Test
    void fetchCsNode() {
        Optional<ClassificationStructureTypeNode> node = csService.fetch(959);
        assertTrue(node.isPresent());

        Optional<ClassificationStructureTypeNodeDto> dto = node.map(ClassificationStructureTypeNode::mapToDto);
        assertTrue(dto.isPresent());

    }

    @Test
    void addCsNode() {
        ClassificationStructureTypeNode csNode = CS_DTO.addMap();
        ClassificationStructureTypeNode newNode = csService.add(csNode, EventAction.CREATE);
        ClassificationStructureTypeNodeDto dto = newNode.mapToDto();
        assertEquals(CS_DTO.getAuthName(), dto.getAuthName());
        log.info("Id : {}. Status : {}, {}. Beslut : {}", dto.getId(), dto.getStatus(), dto.getStatus().equals(NodeStatus.FASTSTALLD) ? FASTSTALLD : "Arbetsmaterial", dto.getAuthDecision());
        assertEquals(UTKAST, dto.getStatus().toString());

        newNode.setAuthDecision("Skrotas");
        ClassificationStructureTypeNode updatedNode = csService.update(newNode);
        log.info("Id : {}. Status : {}, {}. Beslut : {}", updatedNode.getId(), updatedNode.getStatus(), updatedNode.isEstablished() ? FASTSTALLD : "Arbetsmaterial", updatedNode.getAuthDecision());
        assertEquals("Skrotas", updatedNode.getAuthDecision());

        csService.patchStatus(updatedNode.getId(), NodeStatus.FASTSTALLD, EventAction.FASTSTALLD);

        Optional<ClassificationStructureTypeNode> optEstablishedNode = csService.fetch(updatedNode.getId());
        assertTrue(optEstablishedNode.isPresent());
        ClassificationStructureTypeNode establishedNode = optEstablishedNode.get();
        assertTrue(establishedNode.isEstablished());
        log.info("Id : {}. Status : {}, {}. Beslut : {}", establishedNode.getId(), establishedNode.getStatus(), establishedNode.isEstablished() ? FASTSTALLD : "Arbetsmaterial", establishedNode.getAuthDecision());

        csService.delete(updatedNode.getId());

    }

    @Test
    void updateCsNodes() {
        List<ClassificationStructureTypeNodeDto> nodes = csService.list();
        for (ClassificationStructureTypeNodeDto dto : nodes) {
            csService.update(dto.map());
        }
        assertEquals(5, nodes.size());
    }

    @Test
    void updateAaNodes() {
        List<OperationalAreaTypeNodeDto> nodes = aaService.listByParent(4);
        for (OperationalAreaTypeNodeDto dto : nodes) {
            aaService.update(dto.map());
        }
        nodes = aaService.listByParent(961);
        for (OperationalAreaTypeNodeDto dto : nodes) {
            aaService.update(dto.map());
        }

    }

    @Test
    void streamCsNodes() {
        List<ClassificationStructureTypeNodeDto> nodes = csService.list();
        assertEquals(5, nodes.size());
    }

    @Test
    @Ignore("Local testing only")
    void establishCsNode() {
        csService.patchStatus(4, NodeStatus.FASTSTALLD, EventAction.FASTSTALLD);
        Optional<ClassificationStructureTypeNode> csNode = csService.fetch(4);
        assertTrue(csNode.isPresent());
        assertTrue(csNode.get().isEstablished());
    }

    @Test
    void getAaNodes() {
        List<OperationalAreaTypeNodeDto> aan = aaService.listByParent(4);

        long nisse = aan.size();
        log.info("count {}", nisse);
    }

    @Test
    void getActiveAaNodes() {
        List<OperationalAreaTypeNodeDto> active = aaService.listActiveByParentId(4, new Date());
        log.info("Active nodes : {}", active.size());
    }
}