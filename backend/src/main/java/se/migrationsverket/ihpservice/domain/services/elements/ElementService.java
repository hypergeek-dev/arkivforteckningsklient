package se.migrationsverket.ihpservice.domain.services.elements;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDataTypeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.domain.elements.*;
import se.migrationsverket.ihpservice.repository.ihp.db.DocumentTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.db.IssueTypeNodeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.db.elements.ElementDataTypeEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.db.elements.ElementDocumentEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.db.elements.ElementIssueEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.elements.ElementRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.DocumentTypeNodeEntity;
import se.migrationsverket.ihpservice.repository.ihp.entities.IssueTypeNodeEntity;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementDataTypeEntity;
import se.migrationsverket.ihpservice.support.ApplicationStatics;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Transactional
@Service
@Slf4j
public class ElementService {
    private final RequestContextHolder requestContextHolder;
    private final ElementRepository elementRepository;

    ElementDataTypeEntityRepository elementDataTypeEntityRepository;
    ElementIssueEntityRepository elementIssueEntityRepository;
    ElementDocumentEntityRepository elementDocumentEntityRepository;
    IssueTypeNodeEntityRepository issueTypeNodeEntityRepository;
    DocumentTypeNodeEntityRepository documentTypeNodeEntityRepository;

    private String getUserId() {
        return requestContextHolder.getStringValue(ApplicationStatics.IAM_USER);
    }

    public ElementDto add(Element elm) {
        return elementRepository.add(elm, getUserId()).mapToDto();
    }

    public void disconnectDocument(Integer id) {
        elementDocumentEntityRepository.deleteByDocumentId(id);
    }

    public void disconnectIssue(Integer id) {
        elementIssueEntityRepository.deleteByIssueId(id);
    }

    public void connectDocuments(List<ElementDocument> elmDtoArr) {
        elmDtoArr
                .forEach(elm -> {
                    DocumentTypeNodeEntity documentTypeNodeEntity = documentTypeNodeEntityRepository.findById(elm.getDocumentId()).orElseThrow(() -> new IllegalArgumentException("Document id finns inte : " + elm.getDocumentId()));
                    elm.setDocumentPath(documentTypeNodeEntity.getPath());
                    validConnect(elm.getElementId(), ElementNodType.DOCUMENT);
                    elementDocumentEntityRepository.save(elm.mapToEntity());
                });

    }

    public void connectIssues(List<ElementIssue> elmDtoArr) {
        elmDtoArr.forEach(elm -> {
            IssueTypeNodeEntity issueTypeNode = issueTypeNodeEntityRepository.findById(elm.getIssueId()).orElseThrow(() -> new IllegalArgumentException("Issue id doesn't exist : " + elm.getIssueId()));
            elm.setIssuePath(issueTypeNode.getPath());
            validConnect(elm.getElementId(), ElementNodType.ISSUE);
            elementIssueEntityRepository.save(elm.mapToEntity());
        });
    }

    private void validConnect(Integer id, ElementNodType type) {
        Element element = fetchLocal(id);
        if (!element.getNodType().equals(type)) {
            throw new IllegalArgumentException("Not allowed to connect " + type.name() + " to element for : " + element.getNodType().name());
        }
        if (element.getStatus().equals(ElementStatus.DRAFT)) {
            throw new IllegalArgumentException("Not allowed to connect draft element : " + element.getId());
        }
    }

    public List<ElementDto> getConnectedElementsForIssue(Integer id) {
        return elementRepository.streamAllForIssueId(id).map(Element::mapToDto).toList();
    }

    public List<ElementDto> getConnectedElementsForDocument(Integer id) {
        return elementRepository.streamAllForDocumentId(id).map(Element::mapToDto).toList();
    }

    public void update(Element map) {
        Element current = fetchLocal(map.getId());

        if (current.getStatus().equals(ElementStatus.ESTABLISHED)) {
            current.setDescription(map.getDescription());
            current.setMandatory(map.isMandatory());
            current.setStartDate(map.getStartDate());
            current.setEndDate(map.getEndDate());
            elementRepository.update(current, getUserId()).mapToDto();
        } else {
            map.setCreatedAt(current.getCreatedAt());
            map.setCreatedBy(current.getCreatedBy());
            elementRepository.update(map, getUserId()).mapToDto();
        }

    }

    public void establish(Integer id) {
        Element current = fetchLocal(id);
        if (current.getStatus().equals(ElementStatus.ESTABLISHED)) {
            throw new IllegalArgumentException("Not allowed to update established element : " + current.getId());
        }
        current.setStatus(ElementStatus.ESTABLISHED);
        elementRepository.update(current, getUserId()).mapToDto();
    }

    public ElementDto fetch(Integer id) {
        return fetchLocal(id).mapToDto();
    }

    public void delete(Integer id) {
        Element current = fetchLocal(id);
        if (current.getStatus().equals(ElementStatus.ESTABLISHED)) {
            throw new IllegalArgumentException("Not allowed to delete established element : " + current.getId());
        }
        elementRepository.delete(id);

    }

    public List<ElementDto> list() {
        return elementRepository.streamAll().map(Element::mapToDto).toList();
    }

    private Element fetchLocal(Integer id) {
        return elementRepository.fetch(id)
                .orElseThrow(() -> new IllegalArgumentException("Hittar inget element med id " + id));
    }

    public List<ElementDataTypeDto> getDataTypes() {
        return elementDataTypeEntityRepository.findAll().stream().map(ElementDataTypeEntity::map).map(ElementDataType::mapToDto).toList();
    }

    public void updateAssignedDocumentsElements(List<Element> assignedElements, Integer id, String path) {
        disconnectDocument(id);
        List<ElementDocument> docs = assignedElements.stream().map(elm -> elm.mapToElementDocument(id,path))
                .collect(Collectors.toList());

        connectDocuments(docs);
    }

    public void updateAssignedIssueElements(List<Element> assignedElements, Integer id, String path) {
        disconnectIssue(id);
        List<ElementIssue> issues = assignedElements.stream().map(elm -> elm.mapToElementIssue(id, path)).collect(Collectors.toList());

        connectIssues(issues);
    }
}
