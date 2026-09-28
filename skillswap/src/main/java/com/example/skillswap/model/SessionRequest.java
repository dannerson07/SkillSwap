package com.example.skillswap.model;

import java.time.LocalDateTime;

import com.example.skillswap.enums.SessionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table (name = "session_requests")
@Getter 
@Setter 
@NoArgsConstructor 
public class SessionRequest {
    
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn (name = "skill_offer_id", nullable = false)
    private SkillOffer skillOffer;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Member requester;

    @Column (nullable = false)
    private double requestedHours;

    private double actualHours;

    @Enumerated (EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

     @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime completedAt;

    @PrePersist 
    protected void onCreate() {
        requestedAt = LocalDateTime.now();

        if (status == null) {
            status = SessionStatus.REQUESTED;
        }
    }
}
