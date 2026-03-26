package com.jobfinder.dto;

import com.jobfinder.model.Job;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Data
@Builder
public class JobDTO {
    private Long id;
    private String title;
    private String company;
    private String companyLogo;
    private String companyColor;
    private String location;
    private String type;
    private Integer salaryMin;
    private Integer salaryMax;
    private String salaryLabel;
    private Boolean remote;
    private String description;
    private List<String> tags;
    private String url;
    private LocalDateTime postedAt;

    public static JobDTO from(Job job) {
        List<String> tagList = job.getTags() != null
            ? Arrays.asList(job.getTags().split(","))
            : List.of();

        return JobDTO.builder()
            .id(job.getId())
            .title(job.getTitle())
            .company(job.getCompany().getName())
            .companyLogo(job.getCompany().getLogo())
            .companyColor(job.getCompany().getColor())
            .location(job.getLocation())
            .type(job.getType().name())
            .salaryMin(job.getSalaryMin())
            .salaryMax(job.getSalaryMax())
            .salaryLabel(job.getSalaryLabel())
            .remote(job.getRemote())
            .description(job.getDescription())
            .tags(tagList)
            .url(job.getUrl())
            .postedAt(job.getPostedAt())
            .build();
    }
}
