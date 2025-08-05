package com.examly.springapp.repository;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySourceWalletOrDestinationWalletOrderByTimestampDesc(Wallet source, Wallet destination);
}
