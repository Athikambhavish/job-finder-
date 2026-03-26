package com.jobfinder.dto;

import com.jobfinder.model.Application;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

public class ApplicationDTO {

    @Data
    public static class Request {
        @NotNull
        private Long jobId;

        @NotBlank
        private String applicantName;

        @NotBlank @Email
        private String applicantEmail;

        private String coverNote;
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String company;
        private String applicantName;
        private String applicantEmail;
        private String coverNote;
        private String status;
        private LocalDateTime appliedAt;

        public static Response from(Application app) {
            return Response.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .company(app.getJob().getCompany().getName())
                .applicantName(app.getApplicantName())
                .applicantEmail(app.getApplicantEmail())
                .coverNote(app.getCoverNote())
                .status(app.getStatus().name())
                .appliedAt(app.getAppliedAt())
                .build();
        }
    }
}
