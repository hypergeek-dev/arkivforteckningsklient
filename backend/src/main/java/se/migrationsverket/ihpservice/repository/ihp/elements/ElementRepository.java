package se.migrationsverket.ihpservice.repository.ihp.elements;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.domain.elements.Element;
import se.migrationsverket.ihpservice.repository.ihp.db.elements.ElementsEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.elements.ElementEntity;

import java.util.Optional;
import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
@Slf4j
public class ElementRepository {
    ElementsEntityRepository elementsEntityRepository;

    public Element add(Element element, String userId) {
        return elementsEntityRepository.save(element.addMapToEntity(userId)).map();
    }

    public Element update(Element element, String userId) {
        return elementsEntityRepository.save(element.mapToEntity(userId)).map();
    }

    public Optional<Element> fetch(Integer id) {
        return elementsEntityRepository.fetch(id).map(ElementEntity::map);
    }

    public void delete(Integer id) {
        elementsEntityRepository.deleteById(id);
    }

    public Stream<Element> streamAllForDocumentId(Integer id) {
        return elementsEntityRepository.streamAllForDocument(id).map(ElementEntity::map);
    }

    public Stream<Element> streamAllForIssueId(Integer id) {
        return elementsEntityRepository.streamAllForIssue(id).map(ElementEntity::map);
    }

    public Stream<Element> streamAll() {
        return elementsEntityRepository.findAll().stream().map(ElementEntity::map);
    }


}
