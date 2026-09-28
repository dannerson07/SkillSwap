package com.example.skillswap.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
public class CompleteSessionRequest {

    @NotNull(message = "Actual hours are required")
    @Positive(message = "Actual hours must be greater than zero")
    private Double actualHours;
}
