package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Transaction.TransactionType;
import com.examly.springapp.model.Transaction.TransactionStatus;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.math.BigDecimal;
import java.util.Optional;
import static org.mockito.Mockito.*;

public class DepositServiceTest {
    @Mock
    private WalletRepository walletRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @InjectMocks
    private WalletService walletService;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    public void testDepositSuccess() {
        Wallet wallet = new Wallet();
        wallet.setWalletId(1L);
        wallet.setBalance(BigDecimal.ZERO);
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenReturn(wallet);
        Wallet result = walletService.deposit(1L, new BigDecimal("100.00"));
        Assertions.assertEquals(new BigDecimal("100.00"), result.getBalance());
    }
    @Test
    public void testDepositNegativeAmount() {
        Assertions.assertThrows(BadRequestException.class, () -> walletService.deposit(1L, new BigDecimal("-10.0")));
    }
    @Test
    public void testDepositWalletNotFound() {
        when(walletRepository.findById(2L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResourceNotFoundException.class, () -> walletService.deposit(2L, new BigDecimal("100.00")));
    }
}
