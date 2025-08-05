package com.examly.springapp.service;

import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Wallet createWallet(Long userId, String walletName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Wallet wallet = new Wallet();
        wallet.setWalletName(walletName);
        wallet.setBalance(0.0);
        wallet.setUser(user);
        return walletRepository.save(wallet);
    }

    public Wallet deposit(Long walletId, double amount) {
        if (amount <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setTimestamp(LocalDateTime.now());
        tx.setType(Transaction.TransactionType.DEPOSIT);
        tx.setStatus(Transaction.TransactionStatus.SUCCESS);
        tx.setDestinationWallet(wallet);
        transactionRepository.save(tx);

        return wallet;
    }

    public Transaction transfer(Long sourceId, Long destinationId, double amount) {
        if (amount <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }

        Wallet source = walletRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));

        Wallet destination = walletRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

        if (source.getBalance() < amount) {
            throw new BadRequestException("Insufficient funds");
        }

        source.setBalance(source.getBalance() - amount);
        destination.setBalance(destination.getBalance() + amount);
        walletRepository.save(source);
        walletRepository.save(destination);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setTimestamp(LocalDateTime.now());
        tx.setType(Transaction.TransactionType.TRANSFER);
        tx.setStatus(Transaction.TransactionStatus.SUCCESS);
        tx.setSourceWallet(source);
        tx.setDestinationWallet(destination);

        return transactionRepository.save(tx);
    }
}
