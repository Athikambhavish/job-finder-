package com.jobfinder.service;

import com.jobfinder.dto.JobDTO;
import com.jobfinder.model.Job;
import com.jobfinder.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobService {

    private final JobRepository jobRepository;

    public List<JobDTO> getAllJobs() {
        return jobRepository.findByIsActiveTrueOrderByPostedAtDesc()
            .stream().map(JobDTO::from).toList();
    }

    public JobDTO getJobById(Long id) {
        return jobRepository.findById(id)
            .map(JobDTO::from)
            .orElseThrow(() -> new RuntimeException("Job not found: " + id));
    }

    public List<JobDTO> search(String keyword, String location, String type, Boolean remote) {
        Job.JobType jobType = null;
        if (type != null && !type.isBlank()) {
            try { jobType = Job.JobType.valueOf(type.toUpperCase()); } catch (Exception ignored) {}
        }
        String kw = (keyword != null && !keyword.isBlank()) ? keyword : null;
        String loc = (location != null && !location.isBlank()) ? location : null;

        return jobRepository.search(kw, loc, jobType, remote)
            .stream().map(JobDTO::from).toList();
    }
}
