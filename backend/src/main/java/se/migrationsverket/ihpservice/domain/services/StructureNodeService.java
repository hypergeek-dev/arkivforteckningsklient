package se.migrationsverket.ihpservice.domain.services;

import se.migrationsverket.ihpservice.api.rest.v1.dto.NodeStatus;
import se.migrationsverket.ihpservice.domain.StructureTypeNode;
import se.migrationsverket.ihpservice.support.events.EventAction;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface StructureNodeService<T extends StructureTypeNode, U> {
    T add(T node, EventAction eventAction);

    T update(T node);

    void patchStatus(int id, NodeStatus toStatus, EventAction action);

    void delete(int id);

    boolean childrenHasHigherStatus(int parentId, NodeStatus parentStatus);

    void copyChildren(int oldParent, int newParent, String parentPath, boolean partialCopy);

    void copy(int id, Boolean copyStruct);

    void copy(int id, Integer newParent, String parentPath, boolean partialCopy, Boolean copyStruct);

    boolean newPathExists(T node);

    void updatePathIfChanged(T node);

    void updatePathFromParent(String newParentPath, int parentId);

    List<U> listByParent(Integer parentId);

    List<U> listActiveByParentId(Integer parentId, Date date);

    List<U> findAllByPathPrefix(String pathPrefix);

    Optional<T> fetch(int id);

    void batchUpdateStatus(List<Integer> changingNodes, String status, EventAction action, String correlationId);

}
