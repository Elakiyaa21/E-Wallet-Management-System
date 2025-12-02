// package com.examly.springapp.controller;

// import com.examly.springapp.dto.AdminStats;
// import com.examly.springapp.dto.PagedResponse;
// import com.examly.springapp.model.Transaction;
// import com.examly.springapp.repository.TransactionRepository;
// import com.examly.springapp.repository.UserRepository;
// import com.examly.springapp.repository.WalletRepository;
// import jakarta.persistence.criteria.JoinType;
// import jakarta.persistence.criteria.Predicate;
// import lombok.RequiredArgsConstructor;
// import org.springframework.data.domain.*;
// import org.springframework.data.jpa.domain.Specification;
// import org.springframework.web.bind.annotation.*;

// import java.math.BigDecimal;
// import java.util.*;

// @RestController
// @RequestMapping("/api/admin")
// @RequiredArgsConstructor
// public class AdminController {

//     private final TransactionRepository txRepo;
//     private final UserRepository userRepo;
//     private final WalletRepository walletRepo;

//     // KPIs
//     @GetMapping("/stats")
//     public AdminStats stats() {
//         long totalUsers = userRepo.count();
//         long totalTx = txRepo.count();
//         BigDecimal totalFunds = walletRepo.findAll().stream()
//                 .map(w -> w.getBalance() == null ? BigDecimal.ZERO : w.getBalance())
//                 .reduce(BigDecimal.ZERO, BigDecimal::add);
//         return new AdminStats(totalUsers, totalTx, totalFunds);
//     }

//     // Search + filter transactions (system-wide)
//     @GetMapping("/transactions")
//     public PagedResponse<Transaction> allTx(
//             @RequestParam(required = false) String type,
//             @RequestParam(required = false) String status,
//             @RequestParam(required = false) Long from,
//             @RequestParam(required = false) Long to,
//             @RequestParam(required = false) Long userId, // filter by involved user
//             @RequestParam(defaultValue = "0") int page,
//             @RequestParam(defaultValue = "10") int size) {

//         Specification<Transaction> spec = (root, query, cb) -> {
//             List<Predicate> preds = new ArrayList<>();

//             // Safely join to sourceWallet -> user (LEFT JOIN for nulls)
//             var sourceWalletJoin = root.join("sourceWallet", JoinType.LEFT);
//             var destWalletJoin = root.join("destinationWallet", JoinType.LEFT);
//             var sourceUserJoin = sourceWalletJoin.join("user", JoinType.LEFT);
//             var destUserJoin = destWalletJoin.join("user", JoinType.LEFT);

//             if (type != null && !type.isBlank()) {
//                 preds.add(cb.equal(root.get("transactionType"), Transaction.TransactionType.valueOf(type)));
//             }
//             if (status != null && !status.isBlank()) {
//                 preds.add(cb.equal(root.get("status"), Transaction.TransactionStatus.valueOf(status)));
//             }
//             if (from != null) {
//                 preds.add(cb.greaterThanOrEqualTo(root.get("timestamp"), new Date(from)));
//             }
//             if (to != null) {
//                 preds.add(cb.lessThanOrEqualTo(root.get("timestamp"), new Date(to)));
//             }
//             if (userId != null) {
//                 preds.add(cb.or(
//                         cb.equal(sourceUserJoin.get("userId"), userId),
//                         cb.equal(destUserJoin.get("userId"), userId)
//                 ));
//             }

//             query.orderBy(cb.desc(root.get("timestamp")));
//             return cb.and(preds.toArray(new Predicate[0]));
//         };

//         Pageable pageable = PageRequest.of(page, size);
//         Page<Transaction> p = txRepo.findAll(spec, pageable);
//         return new PagedResponse<>(p.getContent(), p.getTotalElements(), page, size, p.getTotalPages());
//     }

//     // Transaction details
//     @GetMapping("/transactions/{id}")
//     public Transaction get(@PathVariable Long id) {
//         return txRepo.findById(id).orElseThrow();
//     }
//     @GetMapping("/transactions/user/{userId}")
// public PagedResponse<Transaction> getTransactionsByUserId(
//         @PathVariable Long userId,
//         @RequestParam(required = false) String type,
//         @RequestParam(required = false) String status,
//         @RequestParam(required = false) Long from,
//         @RequestParam(required = false) Long to,
//         @RequestParam(defaultValue = "0") int page,
//         @RequestParam(defaultValue = "10") int size) {

//     Specification<Transaction> spec = (root, query, cb) -> {
//         List<Predicate> preds = new ArrayList<>();

//         var sourceWalletJoin = root.join("sourceWallet", JoinType.LEFT);
//         var destWalletJoin = root.join("destinationWallet", JoinType.LEFT);
//         var sourceUserJoin = sourceWalletJoin.join("user", JoinType.LEFT);
//         var destUserJoin = destWalletJoin.join("user", JoinType.LEFT);

//         preds.add(cb.or(
//                 cb.equal(sourceUserJoin.get("userId"), userId),
//                 cb.equal(destUserJoin.get("userId"), userId)
//         ));

//         if (type != null && !type.isBlank()) {
//             preds.add(cb.equal(root.get("transactionType"), Transaction.TransactionType.valueOf(type)));
//         }
//         if (status != null && !status.isBlank()) {
//             preds.add(cb.equal(root.get("status"), Transaction.TransactionStatus.valueOf(status)));
//         }
//         if (from != null) {
//             preds.add(cb.greaterThanOrEqualTo(root.get("timestamp"), new Date(from)));
//         }
//         if (to != null) {
//             preds.add(cb.lessThanOrEqualTo(root.get("timestamp"), new Date(to)));
//         }

//         query.orderBy(cb.desc(root.get("timestamp")));
//         return cb.and(preds.toArray(new Predicate[0]));
//     };

//     Pageable pageable = PageRequest.of(page, size);
//     Page<Transaction> p = txRepo.findAll(spec, pageable);
//     return new PagedResponse<>(p.getContent(), p.getTotalElements(), page, size, p.getTotalPages());
// }

// }


package com.examly.springapp.controller;

import com.examly.springapp.dto.AdminStats;
import com.examly.springapp.dto.PagedResponse;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TransactionRepository txRepo;
    private final UserRepository userRepo;
    private final WalletRepository walletRepo;

    // KPIs
    @GetMapping("/stats")
    public AdminStats stats() {
        long totalUsers = userRepo.count();
        long totalTx = txRepo.count();
        BigDecimal totalFunds = walletRepo.findAll().stream()
                .map(w -> w.getBalance() == null ? BigDecimal.ZERO : w.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new AdminStats(totalUsers, totalTx, totalFunds);
    }

    // Search + filter transactions (system-wide) with server-side sorting & paging
    @GetMapping("/transactions")
    public PagedResponse<Transaction> allTx(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long from,
            @RequestParam(required = false) Long to,
            @RequestParam(required = false) Long userId, // filter by involved user
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            var sourceWalletJoin = root.join("sourceWallet", JoinType.LEFT);
            var destWalletJoin = root.join("destinationWallet", JoinType.LEFT);
            var sourceUserJoin = sourceWalletJoin.join("user", JoinType.LEFT);
            var destUserJoin = destWalletJoin.join("user", JoinType.LEFT);

            if (type != null && !type.isBlank()) {
                preds.add(cb.equal(root.get("transactionType"), Transaction.TransactionType.valueOf(type)));
            }
            if (status != null && !status.isBlank()) {
                preds.add(cb.equal(root.get("status"), Transaction.TransactionStatus.valueOf(status)));
            }
            if (from != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("timestamp"), new Date(from)));
            }
            if (to != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("timestamp"), new Date(to)));
            }
            if (userId != null) {
                preds.add(cb.or(
                        cb.equal(sourceUserJoin.get("userId"), userId),
                        cb.equal(destUserJoin.get("userId"), userId)
                ));
            }

            // Default ordering removed here — we'll rely on Pageable sort;
            // but keep a fallback in case pageable doesn't supply a sort.
            return cb.and(preds.toArray(new Predicate[0]));
        };

        // Build Sort safely: default to timestamp desc if unknown
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort;
        try {
            sort = Sort.by(direction, sortField);
        } catch (Exception ex) {
            // fallback
            sort = Sort.by(Sort.Direction.DESC, "timestamp");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);
        Page<Transaction> p = txRepo.findAll(spec, pageable);

        return new PagedResponse<>(p.getContent(), p.getTotalElements(), p.getNumber(), p.getSize(), p.getTotalPages());
    }

    // Transaction details
    @GetMapping("/transactions/{id}")
    public Transaction get(@PathVariable Long id) {
        return txRepo.findById(id).orElseThrow();
    }

    @GetMapping("/transactions/user/{userId}")
    public PagedResponse<Transaction> getTransactionsByUserId(
            @PathVariable Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long from,
            @RequestParam(required = false) Long to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            var sourceWalletJoin = root.join("sourceWallet", JoinType.LEFT);
            var destWalletJoin = root.join("destinationWallet", JoinType.LEFT);
            var sourceUserJoin = sourceWalletJoin.join("user", JoinType.LEFT);
            var destUserJoin = destWalletJoin.join("user", JoinType.LEFT);

            preds.add(cb.or(
                    cb.equal(sourceUserJoin.get("userId"), userId),
                    cb.equal(destUserJoin.get("userId"), userId)
            ));

            if (type != null && !type.isBlank()) {
                preds.add(cb.equal(root.get("transactionType"), Transaction.TransactionType.valueOf(type)));
            }
            if (status != null && !status.isBlank()) {
                preds.add(cb.equal(root.get("status"), Transaction.TransactionStatus.valueOf(status)));
            }
            if (from != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("timestamp"), new Date(from)));
            }
            if (to != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("timestamp"), new Date(to)));
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort;
        try {
            sort = Sort.by(direction, sortField);
        } catch (Exception ex) {
            sort = Sort.by(Sort.Direction.DESC, "timestamp");
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);
        Page<Transaction> p = txRepo.findAll(spec, pageable);

        return new PagedResponse<>(p.getContent(), p.getTotalElements(), p.getNumber(), p.getSize(), p.getTotalPages());
    }
}
