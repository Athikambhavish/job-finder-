package com.jobfinder.controller;

import com.jobfinder.config.JwtFilter.AuthUser;
import com.jobfinder.dto.AuthDTO;
import com.jobfinder.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/register")
    public ResponseEntity<AuthDTO.AuthResponse> register(@Valid @RequestBody AuthDTO.RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.AuthResponse> login(@Valid @RequestBody AuthDTO.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDTO.AuthResponse> me(@AuthenticationPrincipal AuthUser user) {
        return ResponseEntity.ok(authService.getProfile(user.id()));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthDTO.AuthResponse> updateProfile(
        @AuthenticationPrincipal AuthUser user,
        @RequestBody Map<String, Object> updates
    ) {
        return ResponseEntity.ok(authService.updateProfile(user.id(), updates));
    }

    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
        @AuthenticationPrincipal AuthUser user,
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String filename = "resume_" + user.id() + "_" + UUID.randomUUID()
            + getExtension(file.getOriginalFilename());
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String url = "/api/uploads/" + filename;
        authService.updateProfile(user.id(), Map.of("resumeUrl", url));
        return ResponseEntity.ok(Map.of("url", url, "filename", file.getOriginalFilename()));
    }

    private String getExtension(String name) {
        if (name == null) return "";
        int dot = name.lastIndexOf('.');
        return dot >= 0 ? name.substring(dot) : "";
    }
}
