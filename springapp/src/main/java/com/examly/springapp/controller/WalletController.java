package com.examly.springapp.controller;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallets")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("/{userId}")
    public Wallet createWallet(@PathVariable Long userId, @RequestParam String walletName) {
        return walletService.createWallet(userId, walletName);
    }

    @PutMapping("/{walletId}/deposit")
    public Wallet deposit(@PathVariable Long walletId, @RequestParam Double amount) {
        return walletService.deposit(walletId, amount);
    }

    @PostMapping("/{sourceId}/transfer/{destinationId}")
    public Transaction transfer(@PathVariable Long sourceId,
                                 @PathVariable Long destinationId,
                                 @RequestParam Double amount) {
        return walletService.transfer(sourceId, destinationId, amount);
    }
}
