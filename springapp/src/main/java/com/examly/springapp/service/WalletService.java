package com.examly.springapp.service;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.model.Transaction.TransactionStatus;
import com.examly.springapp.model.Transaction.TransactionType;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Wallet createWallet(Long userId, String walletName) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) return null;

        Wallet wallet = new Wallet();
        wallet.setUser(user.get());
        wallet.setWalletName(walletName);
        wallet.setBalance(BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    public Wallet deposit(Long walletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) return null;

        Optional<Wallet> optionalWallet = walletRepository.findById(walletId);
        if (optionalWallet.isEmpty()) return null;

        Wallet wallet = optionalWallet.get();
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setType(TransactionType.DEPOSIT);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setTimestamp(LocalDateTime.now());
        tx.setDestinationWallet(wallet);
        transactionRepository.save(tx);

        return wallet;
    }

    public Transaction transfer(Long sourceId, Long destId, BigDecimal amount) {
        Optional<Wallet> srcOpt = walletRepository.findById(sourceId);
        Optional<Wallet> destOpt = walletRepository.findById(destId);
        if (srcOpt.isEmpty() || destOpt.isEmpty()) return null;

        Wallet src = srcOpt.get();
        Wallet dest = destOpt.get();

        if (src.getBalance().compareTo(amount) < 0 || amount.compareTo(BigDecimal.ZERO) <= 0) return null;

        src.setBalance(src.getBalance().subtract(amount));
        dest.setBalance(dest.getBalance().add(amount));
        walletRepository.save(src);
        walletRepository.save(dest);

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setSourceWallet(src);
        tx.setDestinationWallet(dest);
        tx.setTimestamp(LocalDateTime.now());
        tx.setType(TransactionType.TRANSFER);
        tx.setStatus(TransactionStatus.SUCCESS);
        return transactionRepository.save(tx);
    }
}
