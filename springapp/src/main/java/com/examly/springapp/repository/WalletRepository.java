package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    // Legacy single-wallet lookup (optional)
    Optional<Wallet> findByUser(User user);

    // Multiple wallets for a user
    List<Wallet> findAllByUser(User user);
    Optional<Wallet> findByUser_UserId(Long userId);

}
