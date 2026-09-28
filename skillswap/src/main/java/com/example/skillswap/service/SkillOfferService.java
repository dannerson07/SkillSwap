package com.example.skillswap.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.skillswap.dto.SkillOfferRequest;
import com.example.skillswap.exception.ResourceNotFoundException;
import com.example.skillswap.model.Member;
import com.example.skillswap.model.SkillOffer;
import com.example.skillswap.repository.MemberRepository;
import com.example.skillswap.repository.SkillOfferRepository;

@Service 
public class SkillOfferService {
    
    private final SkillOfferRepository skillOfferRepository;
    private final MemberRepository memberRepository;

    public SkillOfferService(SkillOfferRepository skillOfferRepository, MemberRepository memberRepository) {

        this.skillOfferRepository = skillOfferRepository;
        this.memberRepository = memberRepository;
    }

    public SkillOffer createSkillOffer(SkillOfferRequest request) {

        Member provider = memberRepository.findById(request.getProviderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Provider not found with id: "
                                        + request.getProviderId()
                        )
                );

        SkillOffer skillOffer = new SkillOffer();

        skillOffer.setSkillName(request.getSkillName());
        skillOffer.setDescription(request.getDescription());
        skillOffer.setAvailableHours(request.getAvailableHours());
        skillOffer.setProvider(provider);

        return skillOfferRepository.save(skillOffer);
    }

    public SkillOffer getSkillOfferById(Long id) {

        return skillOfferRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill offer not found with id: " + id
                        )
                );
    }

    public List<SkillOffer> getAllSkillOffers() {

        return skillOfferRepository.findAll();
    }

    public List<SkillOffer> getSkillOffersByProvider(Long providerId) {

        if (!memberRepository.existsById(providerId)) {
            throw new ResourceNotFoundException(
                    "Provider not found with id: " + providerId
            );
        }

        return skillOfferRepository.findByProviderId(providerId);
    }

    public List<SkillOffer> searchSkillOffers(String skillName) {

        return skillOfferRepository
                .findBySkillNameContainingIgnoreCase(skillName);
    }

    public void deleteSkillOffer(Long id) {

        SkillOffer skillOffer = getSkillOfferById(id);

        skillOfferRepository.delete(skillOffer);
    }
}
