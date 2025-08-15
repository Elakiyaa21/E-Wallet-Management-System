package com.examly.springapp.controller;

import com.examly.springapp.dto.TopUpRequest;
import com.examly.springapp.dto.TransferRequest;
import com.examly.springapp.dto.WalletCreateRequest;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class ApiWalletController {

    private final WalletService walletService;
    private final UserRepository userRepo;
    private final WalletRepository walletRepo;

    // Return all wallets for the authenticated user
    @GetMapping("/me")
    public List<Wallet> myWallets(Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return walletService.getWalletsByUser(user); // returns List<Wallet>
    }

    @PostMapping("/top-up")
    public ResponseEntity<Transaction> topUp(Authentication auth, @RequestBody TopUpRequest req) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // pick first wallet for top-up
        Wallet wallet = walletRepo.findAllByUser(user).stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        Transaction tx = walletService.topUp(wallet.getWalletId(), req.getAmount());
        return ResponseEntity.ok(tx);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(Authentication auth, @RequestBody TransferRequest req) {
        String email = auth.getName();
        User sender = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        walletService.transferByEmail(sender.getUserId(), req.getRecipientEmail(), req.getAmount());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{walletId}/balance")
    public ResponseEntity<BigDecimal> getWalletBalance(@PathVariable Long walletId, Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Wallet wallet = walletRepo.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        if (!wallet.getUser().getUserId().equals(user.getUserId()))
            return ResponseEntity.status(403).build(); // Forbidden

        return ResponseEntity.ok(wallet.getBalance());
    }

    @PostMapping("/create")
    public Wallet createWallet(@RequestBody WalletCreateRequest request, Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return walletService.createWallet(user.getUserId(), request.getWalletName());
    }
// @PostMapping("/create")
    // public ResponseEntity<Wallet> createWallet(Authentication auth, @RequestParam String walletName) {
    //     String email = auth.getName();
    //     User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

    //     Wallet wallet = walletService.createWallet(user.getUserId(), walletName);
    //     return ResponseEntity.ok(wallet);
    // }
}
