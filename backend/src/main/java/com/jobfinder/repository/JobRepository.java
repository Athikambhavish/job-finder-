package com.jobfinder.repository;

import com.jobfinder.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByIsActiveTrueOrderByPostedAtDesc();

    @Query("""
        SELECT j FROM Job j
        JOIN FETCH j.company c
        WHERE j.isActive = true
          AND (:keyword IS NULL OR
               LOWER(j.title)    LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(c.name)     LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(j.tags)     LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:location IS NULL OR
               LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:type IS NULL OR j.type = :type)
          AND (:remote IS NULL OR j.remote = :remote)
        ORDER BY j.postedAt DESC
        """)
    List<Job> search(
        @Param("keyword")  String keyword,
        @Param("location") String location,
        @Param("type")     Job.JobType type,
        @Param("remote")   Boolean remote
    );

    @Query("SELECT j FROM Job j JOIN FETCH j.company WHERE j.id IN :ids AND j.isActive = true")
    List<Job> findAllByIdIn(@Param("ids") List<Long> ids);
}
