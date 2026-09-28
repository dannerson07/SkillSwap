package com.example.skillswap.controller;

import com.example.skillswap.dto.SkillOfferRequest;
import com.example.skillswap.model.SkillOffer;
import com.example.skillswap.service.SkillOfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-offers")
public class SkillOfferController {

    private final SkillOfferService skillOfferService;

    public SkillOfferController(SkillOfferService skillOfferService) {
        this.skillOfferService = skillOfferService;
    }

    // Create a new skill offer
    @PostMapping
    public ResponseEntity<SkillOffer> createSkillOffer(
            @Valid @RequestBody SkillOfferRequest request) {

        SkillOffer skillOffer =
                skillOfferService.createSkillOffer(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(skillOffer);
    }

    // Get skill offer by ID
    @GetMapping("/{id}")
    public ResponseEntity<SkillOffer> getSkillOfferById(
            @PathVariable Long id) {

        SkillOffer skillOffer =
                skillOfferService.getSkillOfferById(id);

        return ResponseEntity.ok(skillOffer);
    }

    // Get all skill offers
    @GetMapping
    public ResponseEntity<List<SkillOffer>> getAllSkillOffers() {

        return ResponseEntity.ok(
                skillOfferService.getAllSkillOffers()
        );
    }

    // Get skill offers provided by a member
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<SkillOffer>> getSkillOffersByProvider(
            @PathVariable Long providerId) {

        return ResponseEntity.ok(
                skillOfferService.getSkillOffersByProvider(providerId)
        );
    }

    // Search skill offers by skill name
    @GetMapping("/search")
    public ResponseEntity<List<SkillOffer>> searchSkillOffers(
            @RequestParam String skillName) {

        return ResponseEntity.ok(
                skillOfferService.searchSkillOffers(skillName)
        );
    }

    // Delete a skill offer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillOffer(
            @PathVariable Long id) {

        skillOfferService.deleteSkillOffer(id);

        return ResponseEntity.noContent().build();
    }
}