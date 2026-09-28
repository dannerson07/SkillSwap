package com.example.skillswap.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.skillswap.dto.MemberRequest;
import com.example.skillswap.exception.ResourceNotFoundException;
import com.example.skillswap.model.Member;
import com.example.skillswap.repository.MemberRepository;

@Service 
public class MemberService {
    
    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member createMember(MemberRequest request) {

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Member with this email already exists"
            );
        }

        Member member = new Member();

        member.setName(request.getName());
        member.setEmail(request.getEmail());

        // Every new member starts with initial credits.
        member.setCreditBalance(5.0);

        return memberRepository.save(member);
    }

    public Member getMemberById(Long id) {

        return memberRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    public List<Member> getAllMembers() {

        return memberRepository.findAll();
    }

    public double getCreditBalance(Long memberId) {

        Member member = getMemberById(memberId);

        return member.getCreditBalance();
    }
}
