package com.example.skillswap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.example.skillswap.dto.MemberRequest;
import com.example.skillswap.model.Member;
import com.example.skillswap.service.MemberService;

@RestController 
@RequestMapping ("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping 
    public ResponseEntity<Member> createMember(
            @Valid @RequestBody MemberRequest request) {

        Member member = memberService.createMember(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(member);
    }

    @GetMapping ("/{id}")
    public ResponseEntity<Member> getMemberById(
            @PathVariable Long id) {

        Member member = memberService.getMemberById(id);

        return ResponseEntity.ok(member);
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {

        return ResponseEntity.ok(
                memberService.getAllMembers()
        );
    }

    @GetMapping("/{id}/credits")
    public ResponseEntity<Double> getCreditBalance(
            @PathVariable Long id) {

        double balance = memberService.getCreditBalance(id);

        return ResponseEntity.ok(balance);
    }
}

