package com.example.skillswap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.skillswap.model.SkillOffer;

public interface SkillOfferRepository extends JpaRepository<SkillOffer, Long> {

    List<SkillOffer> findByProviderId(Long providerId);

    List<SkillOffer> findBySkillNameContainingIgnoreCase(String skillName);
}
