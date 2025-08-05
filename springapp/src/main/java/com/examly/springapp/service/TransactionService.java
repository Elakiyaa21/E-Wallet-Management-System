package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.WalletRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private WalletRepository walletRepository;

    
    public List<Transaction> getTransactionsByWallet(Long walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        return transactionRepository.findBySourceWalletOrDestinationWalletOrderByTimestampDesc(wallet, wallet);
    }

    
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
    }

    
    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        existing.setAmount(updatedTransaction.getAmount());
        existing.setStatus(updatedTransaction.getStatus());
        existing.setTransactionType(updatedTransaction.getTransactionType());
        existing.setTimestamp(updatedTransaction.getTimestamp());
        existing.setSourceWallet(updatedTransaction.getSourceWallet());
        existing.setDestinationWallet(updatedTransaction.getDestinationWallet());

        return transactionRepository.save(existing);
    }

    
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transactionRepository.delete(transaction);
    }
}
