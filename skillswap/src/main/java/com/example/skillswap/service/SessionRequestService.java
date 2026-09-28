package com.example.skillswap.service;

import com.example.skillswap.dto.CompleteSessionRequest;
import com.example.skillswap.dto.SessionRequestDto;
import com.example.skillswap.enums.SessionStatus;
import com.example.skillswap.exception.InsufficientCreditsException;
import com.example.skillswap.exception.InvalidSessionException;
import com.example.skillswap.exception.ResourceNotFoundException;
import com.example.skillswap.model.Member;
import com.example.skillswap.model.SessionRequest;
import com.example.skillswap.model.SkillOffer;
import com.example.skillswap.repository.MemberRepository;
import com.example.skillswap.repository.SessionRequestRepository;
import com.example.skillswap.repository.SkillOfferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionRequestService {

    private final SessionRequestRepository sessionRequestRepository;
    private final SkillOfferRepository skillOfferRepository;
    private final MemberRepository memberRepository;
    private final CreditLedgerService creditLedgerService;

    public SessionRequestService(
            SessionRequestRepository sessionRequestRepository,
            SkillOfferRepository skillOfferRepository,
            MemberRepository memberRepository,
            CreditLedgerService creditLedgerService) {

        this.sessionRequestRepository = sessionRequestRepository;
        this.skillOfferRepository = skillOfferRepository;
        this.memberRepository = memberRepository;
        this.creditLedgerService = creditLedgerService;
    }

    public SessionRequest createSessionRequest(
            SessionRequestDto request) {

        SkillOffer skillOffer = skillOfferRepository
                .findById(request.getSkillOfferId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill offer not found with id: "
                                        + request.getSkillOfferId()
                        )
                );

        Member requester = memberRepository
                .findById(request.getRequesterId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Requester not found with id: "
                                        + request.getRequesterId()
                        )
                );

        if (skillOffer.getProvider().getId()
                .equals(requester.getId())) {

            throw new InvalidSessionException(
                    "A member cannot request their own skill offer"
            );
        }

        if (request.getRequestedHours()
                > skillOffer.getAvailableHours()) {

            throw new InvalidSessionException(
                    "Requested hours exceed available skill hours"
            );
        }

        if (requester.getCreditBalance()
                < request.getRequestedHours()) {

            throw new InsufficientCreditsException(
                    "Insufficient credits to request this session"
            );
        }

        SessionRequest sessionRequest = new SessionRequest();

        sessionRequest.setSkillOffer(skillOffer);
        sessionRequest.setRequester(requester);
        sessionRequest.setRequestedHours(
                request.getRequestedHours()
        );
        sessionRequest.setStatus(SessionStatus.REQUESTED);

        return sessionRequestRepository.save(sessionRequest);
    }

    public SessionRequest getSessionById(Long id) {

        return sessionRequestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Session request not found with id: "
                                        + id
                        )
                );
    }

    public List<SessionRequest> getAllSessions() {

        return sessionRequestRepository.findAll();
    }

    public List<SessionRequest> getSessionsByRequester(
            Long requesterId) {

        if (!memberRepository.existsById(requesterId)) {
            throw new ResourceNotFoundException(
                    "Requester not found with id: " + requesterId
            );
        }

        return sessionRequestRepository
                .findByRequesterId(requesterId);
    }

    public List<SessionRequest> getSessionsByProvider(
            Long providerId) {

        if (!memberRepository.existsById(providerId)) {
            throw new ResourceNotFoundException(
                    "Provider not found with id: " + providerId
            );
        }

        return sessionRequestRepository
                .findBySkillOfferProviderId(providerId);
    }

    public SessionRequest confirmSession(
            Long sessionId,
            Long providerId) {

        SessionRequest session = getSessionById(sessionId);

        validateProvider(session, providerId);

        if (session.getStatus() != SessionStatus.REQUESTED) {

            throw new InvalidSessionException(
                    "Only requested sessions can be confirmed"
            );
        }

        session.setStatus(SessionStatus.CONFIRMED);

        return sessionRequestRepository.save(session);
    }

    public SessionRequest rejectSession(
            Long sessionId,
            Long providerId) {

        SessionRequest session = getSessionById(sessionId);

        validateProvider(session, providerId);

        if (session.getStatus() != SessionStatus.REQUESTED) {

            throw new InvalidSessionException(
                    "Only requested sessions can be rejected"
            );
        }

        session.setStatus(SessionStatus.REJECTED);

        return sessionRequestRepository.save(session);
    }

    private void validateProvider(
            SessionRequest session,
            Long providerId) {

        Long actualProviderId =
                session.getSkillOffer()
                        .getProvider()
                        .getId();

        if (!actualProviderId.equals(providerId)) {

            throw new InvalidSessionException(
                    "Only the skill provider can confirm or reject this session"
            );
        }
    }

    @Transactional
    public SessionRequest completeSession(
            Long sessionId,
            CompleteSessionRequest request) {

        SessionRequest session = getSessionById(sessionId);

        if (session.getStatus() != SessionStatus.CONFIRMED) {

            throw new InvalidSessionException(
                    "Only confirmed sessions can be completed"
            );
        }

        double actualHours = request.getActualHours();

        if (actualHours > session.getRequestedHours()) {

            throw new InvalidSessionException(
                    "Actual hours cannot exceed requested hours"
            );
        }

        SkillOffer skillOffer = session.getSkillOffer();
        Member requester = session.getRequester();
        Member provider = skillOffer.getProvider();

        if (actualHours > skillOffer.getAvailableHours()) {

            throw new InvalidSessionException(
                    "Actual hours exceed available skill hours"
            );
        }

        if (requester.getCreditBalance() < actualHours) {

            throw new InsufficientCreditsException(
                    "Requester does not have enough credits"
            );
        }

        requester.setCreditBalance(
                requester.getCreditBalance() - actualHours
        );

        provider.setCreditBalance(
                provider.getCreditBalance() + actualHours
        );

        skillOffer.setAvailableHours(
                skillOffer.getAvailableHours() - actualHours
        );

        session.setActualHours(actualHours);
        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());

        memberRepository.save(requester);
        memberRepository.save(provider);
        skillOfferRepository.save(skillOffer);

        creditLedgerService.recordDebit(
                requester,
                session,
                actualHours
        );

        creditLedgerService.recordCredit(
                provider,
                session,
                actualHours
        );

        return sessionRequestRepository.save(session);
    }
}