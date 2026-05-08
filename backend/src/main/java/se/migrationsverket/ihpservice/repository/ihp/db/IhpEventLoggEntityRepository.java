package se.migrationsverket.ihpservice.repository.ihp.db;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import se.migrationsverket.ihpservice.repository.ihp.entities.IhpEventLoggEntity;

import java.util.Date;
import java.util.List;

public interface IhpEventLoggEntityRepository extends PagingAndSortingRepository<IhpEventLoggEntity, Integer>,
        UuidAsIdRepository, CrudRepository<IhpEventLoggEntity, Integer> {
    @NotNull
    List<IhpEventLoggEntity> findAll();

    @NotNull
    @Query(value = "select * from ihp.handelselogg", countQuery = "select count(*) from ihp.handelselogg", nativeQuery = true)
    Page<IhpEventLoggEntity> findAll(@NotNull Pageable pageable);

    @Query(value = "select * from ihp.handelselogg", countQuery = "select count(*) from ihp.handelselogg", nativeQuery = true)
    Page<IhpEventLoggEntity> fetchSorted(Pageable pageable);

    @Query(value = "select * from ihp.handelselogg where skapad_datum between ? and ?", nativeQuery = true)
    List<IhpEventLoggEntity> fetchSortedTimeperiod(Date from, Date to);
}