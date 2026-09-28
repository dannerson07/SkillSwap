package com.example.skillswap.service;

import com.example.skillswap.enums.TransactionType;
import com.example.skillswap.exception.ResourceNotFoundException;
import com.example.skillswap.model.CreditLedger;
import com.example.skillswap.model.Member;
import com.example.skillswap.model.SessionRequest;
import com.example.skillswap.repository.CreditLedgerRepository;
import com.example.skillswap.repository.MemberRepository;
import com.example.skillswap.repository.SessionRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditLedgerService {

    private final CreditLedgerRepository creditLedgerRepository;
    private final MemberRepository memberRepository;
    private final SessionRequestRepository sessionRequestRepository;

    public CreditLedgerService(
            CreditLedgerRepository creditLedgerRepository,
            MemberRepository memberRepository,
            SessionRequestRepository sessionRequestRepository) {

        this.creditLedgerRepository = creditLedgerRepository;
        this.memberRepository = memberRepository;
        this.sessionRequestRepository = sessionRequestRepository;
    }

    public CreditLedger recordDebit(
            Member member,
            SessionRequest session,
            double amount) {

        CreditLedger ledger = new CreditLedger();

        ledger.setMember(member);
        ledger.setSessionRequest(session);
        ledger.setAmount(amount);
        ledger.setTransactionType(TransactionType.DEBIT);

        return creditLedgerRepository.save(ledger);
    }

    public CreditLedger recordCredit(
            Member member,
            SessionRequest session,
            double amount) {

        CreditLedger ledger = new CreditLedger();

        ledger.setMember(member);
        ledger.setSessionRequest(session);
        ledger.setAmount(amount);
        ledger.setTransactionType(TransactionType.CREDIT);

        return creditLedgerRepository.save(ledger);
    }

    public List<CreditLedger> getLedgerByMember(
            Long memberId) {

        if (!memberRepository.existsById(memberId)) {

            throw new ResourceNotFoundException(
                    "Member not found with id: " + memberId
            );
        }

        return creditLedgerRepository
                .findByMemberId(memberId);
    }

    public List<CreditLedger> getLedgerBySession(
            Long sessionId) {

        if (!sessionRequestRepository.existsById(sessionId)) {

            throw new ResourceNotFoundException(
                    "Session request not found with id: " + sessionId
            );
        }

        return creditLedgerRepository
                .findBySessionRequestId(sessionId);
    }
}