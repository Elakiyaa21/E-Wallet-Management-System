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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // Create new wallet
    public Wallet createWallet(Long userId, String walletName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Wallet wallet = new Wallet();
        wallet.setWalletName(walletName);
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);

        return walletRepository.save(wallet);
    }

    // Deposit / top-up
    public Wallet deposit(Long walletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BadRequestException("Deposit amount must be positive");

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
        Transaction savedTx = transactionRepository.save(transaction);
        if (savedTx == null) {
            // still persist in mockless scenario
            savedTx = transaction;
        }

        return wallet;
    }

    // Transfer between wallets
    public Transaction transfer(Long sourceId, Long destinationId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BadRequestException("Transfer amount must be positive");

        Wallet source = walletRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));

        Wallet destination = walletRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

        if (source.getBalance().compareTo(amount) < 0)
            throw new BadRequestException("Insufficient funds");

        source.setBalance(source.getBalance().subtract(amount));
        destination.setBalance(destination.getBalance().add(amount));

        walletRepository.save(source);
        walletRepository.save(destination);

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setSourceWallet(source);
        transaction.setDestinationWallet(destination);
        transaction.setTransactionType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTimestamp(new Date());

        Transaction savedTx = transactionRepository.save(transaction);
        return savedTx != null ? savedTx : transaction;
    }

    // Get all wallets
    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    // Get all wallets for a user
    public List<Wallet> getWalletsByUser(User user) {
        return walletRepository.findAllByUser(user);
    }

    public Wallet getWalletById(Long id) {
        return walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
    }

    public Wallet updateWalletName(Long id, String newName) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        wallet.setWalletName(newName);
        return walletRepository.save(wallet);
    }

    public void deleteWallet(Long id) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        walletRepository.delete(wallet);
    }

    // ===== SRS-compliant top-up =====
    @Transactional
    public Transaction topUp(Long walletId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BadRequestException("Top-up amount must be positive");

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setTransactionType(TransactionType.TOP_UP);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setTimestamp(new Date());
        tx.setDestinationWallet(wallet);

        return transactionRepository.save(tx);
    }

    // ===== Transfer by email =====
    @Transactional
    public void transferByEmail(Long sourceUserId, String recipientEmail, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0)
            throw new BadRequestException("Transfer amount must be positive");

        User sender = userRepository.findById(sourceUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User recipient = userRepository.findByEmail(recipientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        // Pick first wallet for sender & recipient (or modify to allow choosing wallet)
        Wallet source = walletRepository.findAllByUser(sender).stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Sender wallet not found"));

        Wallet destination = walletRepository.findAllByUser(recipient).stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Recipient wallet not found"));

        if (source.getBalance().compareTo(amount) < 0)
            throw new BadRequestException("Insufficient funds");

        source.setBalance(source.getBalance().subtract(amount));
        destination.setBalance(destination.getBalance().add(amount));
        walletRepository.save(source);
        walletRepository.save(destination);

        Date now = new Date();

        // Debit transaction
        Transaction debit = new Transaction();
        debit.setAmount(amount);
        debit.setTransactionType(TransactionType.TRANSFER_SENT);
        debit.setStatus(TransactionStatus.SUCCESS);
        debit.setTimestamp(now);
        debit.setSourceWallet(source);
        debit.setDestinationWallet(destination);
        transactionRepository.save(debit);

        // Credit transaction
        Transaction credit = new Transaction();
        credit.setAmount(amount);
        credit.setTransactionType(TransactionType.TRANSFER_RECEIVED);
        credit.setStatus(TransactionStatus.SUCCESS);
        credit.setTimestamp(now);
        credit.setSourceWallet(source);
        credit.setDestinationWallet(destination);
        transactionRepository.save(credit);
    }
}
