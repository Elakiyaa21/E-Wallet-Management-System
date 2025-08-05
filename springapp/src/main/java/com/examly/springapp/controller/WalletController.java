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

    // ✅ Create a new wallet for a user
    @PostMapping
    public Wallet createWallet(@RequestParam Long userId, @RequestParam String walletName) {
        return walletService.createWallet(userId, walletName);
    }

    // ✅ Deposit money into wallet
    @PostMapping("/{walletId}/deposit")
    public Wallet deposit(@PathVariable Long walletId, @RequestParam double amount) {
        return walletService.deposit(walletId, amount);
    }

    // ✅ Transfer money from one wallet to another
    @PostMapping("/transfer")
    public Transaction transfer(@RequestParam Long sourceId,
                                 @RequestParam Long destinationId,
                                 @RequestParam double amount) {
        return walletService.transfer(sourceId, destinationId, amount);
    }
}
