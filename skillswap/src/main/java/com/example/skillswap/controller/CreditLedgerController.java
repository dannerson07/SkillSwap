package com.example.skillswap.controller;

import com.example.skillswap.model.CreditLedger;
import com.example.skillswap.service.CreditLedgerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ledger")
public class CreditLedgerController {

    private final CreditLedgerService creditLedgerService;

    public CreditLedgerController(
            CreditLedgerService creditLedgerService) {

        this.creditLedgerService = creditLedgerService;
    }

    // Get credit transactions for a member
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<CreditLedger>> getLedgerByMember(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(
                creditLedgerService.getLedgerByMember(memberId)
        );
    }

    // Get credit transactions for a session
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<CreditLedger>> getLedgerBySession(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                creditLedgerService.getLedgerBySession(sessionId)
        );
    }
}