package com.examly.springapp.controller;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;

    
    @PostMapping
    public Wallet createWallet(@RequestParam Long userId, @RequestParam String walletName) {
        return walletService.createWallet(userId, walletName);
    }

    
    @PostMapping("/{walletId}/deposit")
    public Wallet deposit(@PathVariable Long walletId, @RequestParam BigDecimal amount) {
        return walletService.deposit(walletId, amount);
    }

    
    @PostMapping("/transfer")
    public Transaction transfer(@RequestParam Long sourceId,
                                @RequestParam Long destinationId,
                                @RequestParam BigDecimal amount) {
        return walletService.transfer(sourceId, destinationId, amount);
    }

    
    @GetMapping("/{walletId}")
    public Wallet getWalletById(@PathVariable Long walletId) {
        return walletService.getWalletById(walletId);
    }

    
    @GetMapping
    public List<Wallet> getAllWallets() {
        return walletService.getAllWallets();
    }

    
    @PutMapping("/{walletId}")
    public Wallet updateWallet(@PathVariable Long walletId, @RequestParam String name) {
        return walletService.updateWalletName(walletId, name);
    }

    
    @DeleteMapping("/{walletId}")
    public void deleteWallet(@PathVariable Long walletId) {
        walletService.deleteWallet(walletId);
    }
}
