package se.migrationsverket.ihpservice.repository.ihp.relations;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import se.migrationsverket.ihpservice.domain.relations.NodeRelation;
import se.migrationsverket.ihpservice.repository.ihp.db.relations.NodeRelationEntityRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.relations.NodeRelationEntity;

import java.util.stream.Stream;

@AllArgsConstructor
@Transactional
@Repository
public class NodeRelationRepository {
    NodeRelationEntityRepository repository;

    public Stream<NodeRelation> findByPath(String path){
        return repository.findAllNodesRelations(path).map(NodeRelationEntity::map);
    }

    public Stream<NodeRelation> findByRelatedPath(String path){
        return repository.findRelationByRelatedPath(path).map(NodeRelationEntity::map);
    }

    public void deleteByPath(String path){
        repository.deleteByPath(path);
    }

    public void add(NodeRelation relation){
        repository.save(relation.mapToEntity("hej"));
    }

    public void save(NodeRelation relation) {
        repository.save(relation.mapToEntity());
    }

    public void updateRelatedPath(Integer id, String path) {
        repository.updateRelatedPath(id, path);
    }

    public void deleteById(Integer id){
        repository.deleteById(id);
    }

    public Stream<NodeRelation> findAllByCsPath(String path){
        return repository.streamAllByCsPath(path).map(NodeRelationEntity::map);
    }
}
