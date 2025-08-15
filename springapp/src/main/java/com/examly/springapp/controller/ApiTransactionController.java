package com.examly.springapp.controller;

import com.examly.springapp.dto.PagedResponse;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.UserRepository;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class ApiTransactionController {

    private final TransactionRepository txRepo;
    private final UserRepository userRepo;

    @GetMapping
    public PagedResponse<Transaction> myTransactions(
            Authentication auth,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long from,   // epoch millis
            @RequestParam(required = false) Long to,     // epoch millis
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User me = userRepo.findByEmail(auth.getName()).orElseThrow();

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // LEFT JOINs to handle null source/destination wallets (e.g. for top-ups)
            var sourceWalletJoin = root.join("sourceWallet", JoinType.LEFT);
            var destinationWalletJoin = root.join("destinationWallet", JoinType.LEFT);

            var sourceUserJoin = sourceWalletJoin.join("user", JoinType.LEFT);
            var destUserJoin = destinationWalletJoin.join("user", JoinType.LEFT);

            // Include transactions where user is either the sender or receiver
            Predicate userInvolved = cb.or(
                    cb.equal(sourceUserJoin.get("userId"), me.getUserId()),
                    cb.equal(destUserJoin.get("userId"), me.getUserId())
            );

            predicates.add(userInvolved);

            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("transactionType"), Transaction.TransactionType.valueOf(type)));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), Transaction.TransactionStatus.valueOf(status)));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), new Date(from)));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("timestamp"), new Date(to)));
            }

            query.orderBy(cb.desc(root.get("timestamp")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(page, size);
        Page<Transaction> resultPage = txRepo.findAll(spec, pageable);

        return new PagedResponse<>(
                resultPage.getContent(),
                resultPage.getTotalElements(),
                page,
                size,
                resultPage.getTotalPages()
        );
    }
}
