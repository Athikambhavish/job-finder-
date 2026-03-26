package com.jobfinder.repository;

import com.jobfinder.model.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    @Query("SELECT s FROM SavedJob s JOIN FETCH s.job j JOIN FETCH j.company WHERE s.userId = :userId ORDER BY s.savedAt DESC")
    List<SavedJob> findByUserId(@Param("userId") Long userId);

    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
