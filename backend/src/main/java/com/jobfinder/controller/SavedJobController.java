package com.jobfinder.controller;

import com.jobfinder.config.JwtFilter.AuthUser;
import com.jobfinder.dto.JobDTO;
import com.jobfinder.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    public ResponseEntity<Map<String, Object>> toggle(
        @PathVariable Long jobId,
        @AuthenticationPrincipal AuthUser user
    ) {
        return ResponseEntity.ok(savedJobService.toggleSave(user.id(), jobId));
    }

    @GetMapping
    public ResponseEntity<List<JobDTO>> getSaved(@AuthenticationPrincipal AuthUser user) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(user.id()));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getSavedIds(@AuthenticationPrincipal AuthUser user) {
        return ResponseEntity.ok(savedJobService.getSavedJobIds(user.id()));
    }
}
