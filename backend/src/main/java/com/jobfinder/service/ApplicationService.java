package com.jobfinder.service;

import com.jobfinder.dto.ApplicationDTO;
import com.jobfinder.model.Application;
import com.jobfinder.model.Job;
import com.jobfinder.repository.ApplicationRepository;
import com.jobfinder.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationDTO.Response apply(Long userId, ApplicationDTO.Request req) {
        if (applicationRepository.existsByUserIdAndJobId(userId, req.getJobId())) {
            throw new IllegalStateException("Already applied to this job");
        }
        Job job = jobRepository.findById(req.getJobId())
            .orElseThrow(() -> new RuntimeException("Job not found"));

        Application app = Application.builder()
            .userId(userId)
            .job(job)
            .applicantName(req.getApplicantName())
            .applicantEmail(req.getApplicantEmail())
            .coverNote(req.getCoverNote())
            .status(Application.Status.APPLIED)
            .build();

        return ApplicationDTO.Response.from(applicationRepository.save(app));
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO.Response> getMyApplications(Long userId) {
        return applicationRepository.findByUserId(userId)
            .stream().map(ApplicationDTO.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public boolean hasApplied(Long userId, Long jobId) {
        return applicationRepository.existsByUserIdAndJobId(userId, jobId);
    }
}
