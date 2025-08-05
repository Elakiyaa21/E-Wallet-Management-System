package com.examly.springapp.controller;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/wallet/{walletId}")
    public List<Transaction> getTransactionsByWallet(@PathVariable Long walletId) {
        return transactionService.getTransactionsByWallet(walletId);
    }
}
