package com.example.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
public class SkillOfferRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName;

    private String description;

    @NotNull(message = "Available hours are required")
    @Positive(message = "Available hours must be greater than zero")
    private Double availableHours;

    @NotNull(message = "Provider ID is required")
    private Long providerId;
}
