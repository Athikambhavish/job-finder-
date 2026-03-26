package com.jobfinder.repository;

import com.jobfinder.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("SELECT a FROM Application a JOIN FETCH a.job j JOIN FETCH j.company WHERE a.userId = :userId ORDER BY a.appliedAt DESC")
    List<Application> findByUserId(@Param("userId") Long userId);

    Optional<Application> findByUserIdAndJobId(@Param("userId") Long userId, @Param("jobId") Long jobId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
