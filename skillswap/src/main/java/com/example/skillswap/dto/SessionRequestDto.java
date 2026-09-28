package com.example.skillswap.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor 
public class SessionRequestDto {

    @NotNull(message = "Skill offer ID is required")
    private Long skillOfferId;

    @NotNull(message = "Requester ID is required")
    private Long requesterId;

    @NotNull(message = "Requested hours are required")
    @Positive(message = "Requested hours must be greater than zero")
    private Double requestedHours;
}
