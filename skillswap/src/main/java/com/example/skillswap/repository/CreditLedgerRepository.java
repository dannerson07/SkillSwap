package com.example.skillswap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.skillswap.model.CreditLedger;

public interface CreditLedgerRepository extends JpaRepository<CreditLedger, Long> {

    List<CreditLedger> findByMemberId(Long memberId);

    List<CreditLedger> findBySessionRequestId(Long sessionRequestId);
}
