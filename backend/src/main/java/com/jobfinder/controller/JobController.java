package com.jobfinder.controller;

import com.jobfinder.dto.JobDTO;
import com.jobfinder.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    /** GET /api/jobs  — list all active jobs */
    @GetMapping
    public ResponseEntity<List<JobDTO>> listJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    /** GET /api/jobs/{id}  — single job detail */
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    /**
     * GET /api/jobs/search
     *  ?keyword=react&location=remote&type=FULL_TIME&remote=true
     */
    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> search(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Boolean remote
    ) {
        return ResponseEntity.ok(jobService.search(keyword, location, type, remote));
    }
}
