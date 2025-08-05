package com.examly.springapp.service;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private WalletRepository walletRepository;

    public List<Transaction> getTransactionsByWallet(Long walletId) {
        Optional<Wallet> wallet = walletRepository.findById(walletId);
        if (wallet.isEmpty()) return Collections.emptyList();

        return transactionRepository.findBySourceWalletOrDestinationWalletOrderByTimestampDesc(wallet.get(), wallet.get());
    }
}
