package com.jobfinder.service;

import com.jobfinder.config.JwtUtil;
import com.jobfinder.dto.AuthDTO;
import com.jobfinder.model.User;
import com.jobfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalStateException("Email already registered");

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .location(req.getLocation())
            .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return toResponse(user, token);
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return toResponse(user, token);
    }

    @Transactional(readOnly = true)
    public AuthDTO.AuthResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user, null);
    }

    @Transactional
    public AuthDTO.AuthResponse updateProfile(Long userId, java.util.Map<String, Object> updates) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("bio"))             user.setBio((String) updates.get("bio"));
        if (updates.containsKey("location"))        user.setLocation((String) updates.get("location"));
        if (updates.containsKey("skills"))          user.setSkills((String) updates.get("skills"));
        if (updates.containsKey("experienceLevel")) user.setExperienceLevel((String) updates.get("experienceLevel"));
        if (updates.containsKey("desiredSalary"))   user.setDesiredSalary((String) updates.get("desiredSalary"));
        if (updates.containsKey("preferredRemote")) user.setPreferredRemote((Boolean) updates.get("preferredRemote"));
        if (updates.containsKey("resumeUrl"))       user.setResumeUrl((String) updates.get("resumeUrl"));

        user = userRepository.save(user);
        return toResponse(user, null);
    }

    private AuthDTO.AuthResponse toResponse(User user, String token) {
        return AuthDTO.AuthResponse.builder()
            .token(token)
            .userId(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .location(user.getLocation())
            .bio(user.getBio())
            .skills(user.getSkills())
            .experienceLevel(user.getExperienceLevel())
            .desiredSalary(user.getDesiredSalary())
            .preferredRemote(user.getPreferredRemote())
            .resumeUrl(user.getResumeUrl())
            .build();
    }
}
