package com.examly.springapp.repository;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findBySourceWalletOrDestinationWalletOrderByTimestampDesc(Wallet source, Wallet dest);

    // For current user history
    List<Transaction> findBySourceWallet_User_UserIdOrDestinationWallet_User_UserIdOrderByTimestampDesc(Long srcUserId, Long dstUserId);
}
