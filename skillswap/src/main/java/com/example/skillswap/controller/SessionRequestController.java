package com.example.skillswap.controller;

import com.example.skillswap.dto.CompleteSessionRequest;
import com.example.skillswap.dto.SessionRequestDto;
import com.example.skillswap.model.SessionRequest;
import com.example.skillswap.service.SessionRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionRequestController {

    private final SessionRequestService sessionRequestService;

    public SessionRequestController(
            SessionRequestService sessionRequestService) {

        this.sessionRequestService = sessionRequestService;
    }

    // Create a new session request
    @PostMapping
    public ResponseEntity<SessionRequest> createSessionRequest(
            @Valid @RequestBody SessionRequestDto request) {

        SessionRequest sessionRequest =
                sessionRequestService.createSessionRequest(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(sessionRequest);
    }

    // Get session by ID
    @GetMapping("/{id}")
    public ResponseEntity<SessionRequest> getSessionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionRequestService.getSessionById(id)
        );
    }

    // Get all sessions
    @GetMapping
    public ResponseEntity<List<SessionRequest>> getAllSessions() {

        return ResponseEntity.ok(
                sessionRequestService.getAllSessions()
        );
    }

    // Get sessions requested by a member
    @GetMapping("/requester/{requesterId}")
    public ResponseEntity<List<SessionRequest>> getSessionsByRequester(
            @PathVariable Long requesterId) {

        return ResponseEntity.ok(
                sessionRequestService
                        .getSessionsByRequester(requesterId)
        );
    }

    // Get sessions for a provider
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<SessionRequest>> getSessionsByProvider(
            @PathVariable Long providerId) {

        return ResponseEntity.ok(
                sessionRequestService
                        .getSessionsByProvider(providerId)
        );
    }

    // Confirm a session
    @PutMapping("/{id}/confirm/{providerId}")
    public ResponseEntity<SessionRequest> confirmSession(
            @PathVariable Long id,
            @PathVariable Long providerId) {

        return ResponseEntity.ok(
                sessionRequestService.confirmSession(
                        id,
                        providerId
                )
        );
    }

    // Reject a session
    @PutMapping("/{id}/reject/{providerId}")
    public ResponseEntity<SessionRequest> rejectSession(
            @PathVariable Long id,
            @PathVariable Long providerId) {

        return ResponseEntity.ok(
                sessionRequestService.rejectSession(
                        id,
                        providerId
                )
        );
    }

    // Complete a confirmed session
    @PutMapping("/{id}/complete")
    public ResponseEntity<SessionRequest> completeSession(
            @PathVariable Long id,
            @Valid @RequestBody CompleteSessionRequest request) {

        return ResponseEntity.ok(
                sessionRequestService.completeSession(
                        id,
                        request
                )
        );
    }
}