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

import java.math.BigDecimal;
import java.math.RoundingMode;
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
        wallet.setBalance(BigDecimal.ZERO.setScale(2));

        return walletRepository.save(wallet);
    }

    // ✅ Deposit
    public Wallet deposit(Long walletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be positive");
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        BigDecimal depositAmount = amount.setScale(2, RoundingMode.HALF_UP);
        wallet.setBalance(wallet.getBalance().add(depositAmount));
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setAmount(depositAmount);
        transaction.setDestinationWallet(wallet);
        transaction.setSourceWallet(null);
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTimestamp(new Date());
        transactionRepository.save(transaction);

        return wallet;
    }

    // ✅ Transfer
    public Transaction transfer(Long sourceId, Long destinationId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer amount must be positive");
        }

        Wallet source = walletRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));

        Wallet destination = walletRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

        BigDecimal transferAmount = amount.setScale(2, RoundingMode.HALF_UP);

        if (source.getBalance().compareTo(transferAmount) < 0) {
            throw new BadRequestException("Insufficient funds");
        }

        source.setBalance(source.getBalance().subtract(transferAmount));
        destination.setBalance(destination.getBalance().add(transferAmount));

        walletRepository.save(source);
        walletRepository.save(destination);

        Transaction transaction = new Transaction();
        transaction.setAmount(transferAmount); // fixed scale to match test
        transaction.setSourceWallet(source);
        transaction.setDestinationWallet(destination);
        transaction.setTransactionType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTimestamp(new Date());

        return transactionRepository.save(transaction);
    }
}
