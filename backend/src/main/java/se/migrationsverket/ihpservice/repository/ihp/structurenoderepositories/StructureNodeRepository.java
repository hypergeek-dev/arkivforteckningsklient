package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

import se.migrationsverket.ihpservice.domain.StructureTypeNode;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public interface StructureNodeRepository<T extends StructureTypeNode, U> {
    T add(T node, String userId);

    T update(T node, String userId);

    T patchStatus(T node, String userId);

    Optional<T> findById(Integer id);

    Stream<T> streamNodes();

    Stream<T> streamActive(Date date);

    Stream<T> streamByParent(Integer parentId);

    Stream<T> streamByPathPrefix(String path);

    Stream<T> streamActiveByParent(Integer parentId, Date date);

    Stream<T> findAllByPathContaining(String path);

    Stream<T> findAllByIdIsIn(List<Integer> ids);

    void delete(Integer id);

    Optional<U> findEntityById(Integer id);

    Optional<Integer> findCsnodetypeId(Integer id);

    List<U> findAllByIdIsInList(List<Integer> nodeIds);
}
