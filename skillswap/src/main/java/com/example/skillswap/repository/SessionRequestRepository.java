package com.example.skillswap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.skillswap.enums.SessionStatus;
import com.example.skillswap.model.SessionRequest;

public interface SessionRequestRepository extends JpaRepository<SessionRequest, Long>{

    List<SessionRequest> findByRequesterId(Long requesterId);

    List<SessionRequest> findBySkillOfferProviderId(Long providerId);

    List<SessionRequest> findByStatus(SessionStatus status);
}
