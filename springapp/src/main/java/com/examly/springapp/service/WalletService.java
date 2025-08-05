package com.examly.springapp.service;

import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Transaction.TransactionStatus;
import com.examly.springapp.model.Transaction.TransactionType;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create Wallet
    public Wallet createWallet(Long userId, String walletName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Wallet wallet = new Wallet();
        wallet.setWalletName(walletName);
        wallet.setUser(user);
        wallet.setBalance(0.0);

        return walletRepository.save(wallet);
    }

    // ✅ Deposit into Wallet
    public Wallet deposit(Long walletId, double amount) {
        if (amount <= 0) {
            throw new BadRequestException("Deposit amount must be positive");
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setSourceWallet(null);
        tx.setDestinationWallet(wallet);
        tx.setTransactionType(TransactionType.DEPOSIT);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setTimestamp(new Date());

        transactionRepository.save(tx);

        return wallet;
    }

    // ✅ Transfer Money
    public Transaction transfer(Long sourceId, Long destinationId, double amount) {
        Wallet source = walletRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));
        Wallet destination = walletRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

        if (amount <= 0) {
            throw new BadRequestException("Amount must be positive");
        }

        if (source.getBalance() < amount) {
            throw new BadRequestException("Insufficient funds");
        }

        source.setBalance(source.getBalance() - amount);
        destination.setBalance(destination.getBalance() + amount);

        walletRepository.save(source);
        walletRepository.save(destination);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setSourceWallet(source);
        tx.setDestinationWallet(destination);
        tx.setTransactionType(TransactionType.TRANSFER);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setTimestamp(new Date());

        return transactionRepository.save(tx);
    }
}
