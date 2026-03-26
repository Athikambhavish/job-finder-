package com.jobfinder.service;

import com.jobfinder.dto.JobDTO;
import com.jobfinder.model.SavedJob;
import com.jobfinder.repository.JobRepository;
import com.jobfinder.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    public Map<String, Object> toggleSave(Long userId, Long jobId) {
        var existing = savedJobRepository.findByUserIdAndJobId(userId, jobId);
        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            return Map.of("saved", false, "jobId", jobId);
        }
        var job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        savedJobRepository.save(SavedJob.builder().userId(userId).job(job).build());
        return Map.of("saved", true, "jobId", jobId);
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getSavedJobs(Long userId) {
        return savedJobRepository.findByUserId(userId)
            .stream().map(s -> JobDTO.from(s.getJob())).toList();
    }

    @Transactional(readOnly = true)
    public List<Long> getSavedJobIds(Long userId) {
        return savedJobRepository.findByUserId(userId)
            .stream().map(s -> s.getJob().getId()).toList();
    }
}
