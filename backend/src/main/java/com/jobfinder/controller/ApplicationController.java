package com.jobfinder.controller;

import com.jobfinder.config.JwtFilter.AuthUser;
import com.jobfinder.dto.ApplicationDTO;
import com.jobfinder.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationDTO.Response> apply(
        @Valid @RequestBody ApplicationDTO.Request req,
        @AuthenticationPrincipal AuthUser user
    ) {
        return ResponseEntity.ok(applicationService.apply(user.id(), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDTO.Response>> myApplications(
        @AuthenticationPrincipal AuthUser user
    ) {
        return ResponseEntity.ok(applicationService.getMyApplications(user.id()));
    }
}
