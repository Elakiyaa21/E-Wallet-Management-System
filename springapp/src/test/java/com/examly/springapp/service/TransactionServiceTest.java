package com.examly.springapp.service;

import com.examly.springapp.model.Wallet;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;

public class TransactionServiceTest {
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private WalletRepository walletRepository;
    @InjectMocks
    private TransactionService transactionService;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    public void testGetTransactionsByWallet() {
        Wallet wallet = new Wallet();
        wallet.setWalletId(1L);
        List<Transaction> txList = new ArrayList<>();
        Transaction t1 = new Transaction();
        Transaction t2 = new Transaction();
        txList.add(t1); txList.add(t2);
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findBySourceWalletOrDestinationWalletOrderByTimestampDesc(wallet, wallet)).thenReturn(txList);
        List<Transaction> result = transactionService.getTransactionsByWallet(1L);
        Assertions.assertEquals(2, result.size());
    }
    @Test
    public void testGetTransactionsWalletNotFound() {
        when(walletRepository.findById(2L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResourceNotFoundException.class, () -> transactionService.getTransactionsByWallet(2L));
    }
}
