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
        wallet.setBalance(BigDecimal.ZERO);

        return walletRepository.save(wallet);
    }

    // ✅ Deposit
    public Wallet deposit(Long walletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be positive");
        }

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDestinationWallet(wallet);
        transaction.setSourceWallet(null);
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTimestamp(new Date());
        transactionRepository.save(transaction);

        return wallet;
    }

    // ✅ Transfer
    // ✅ Transfer
public Transaction transfer(Long sourceId, Long destinationId, BigDecimal amount) {
    if (amount.compareTo(BigDecimal.ZERO) <= 0) {
        throw new BadRequestException("Transfer amount must be positive");
    }

    Wallet source = walletRepository.findById(sourceId)
            .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));

    Wallet destination = walletRepository.findById(destinationId)
            .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

    if (source.getBalance().compareTo(amount) < 0) {
        throw new BadRequestException("Insufficient funds");
    }

    // Update balances
    source.setBalance(source.getBalance().subtract(amount));
    destination.setBalance(destination.getBalance().add(amount));

    walletRepository.save(source);
    walletRepository.save(destination);

    // ✅ Fix: Ensure scale = 2 for amount
    BigDecimal finalAmount = amount.setScale(2);

    Transaction transaction = new Transaction();
    transaction.setAmount(finalAmount); // Important!
    transaction.setSourceWallet(source);
    transaction.setDestinationWallet(destination);
    transaction.setTransactionType(TransactionType.TRANSFER);
    transaction.setStatus(TransactionStatus.SUCCESS);
    transaction.setTimestamp(new Date());

    return transactionRepository.save(transaction);
}

}
