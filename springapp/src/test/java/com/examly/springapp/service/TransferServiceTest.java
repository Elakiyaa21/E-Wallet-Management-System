package com.examly.springapp.service;

import com.examly.springapp.model.Wallet;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.BadRequestException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.math.BigDecimal;
import java.util.Optional;
import static org.mockito.Mockito.*;

public class TransferServiceTest {
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
    public void testTransferSuccess() {
        Wallet src = new Wallet();
        src.setWalletId(1L);
        src.setBalance(new BigDecimal("100.00"));
        Wallet dest = new Wallet();
        dest.setWalletId(2L);
        dest.setBalance(BigDecimal.ZERO);
        when(walletRepository.findById(1L)).thenReturn(Optional.of(src));
        when(walletRepository.findById(2L)).thenReturn(Optional.of(dest));
        when(walletRepository.save(any(Wallet.class))).thenReturn(src).thenReturn(dest);
        var tx = walletService.transfer(1L, 2L, new BigDecimal("50.00"));
        Assertions.assertEquals(new BigDecimal("50.00"), src.getBalance());
        Assertions.assertEquals(new BigDecimal("50.00"), dest.getBalance());
        Assertions.assertEquals(2L, tx.getDestinationWallet().getWalletId());
        Assertions.assertEquals(1L, tx.getSourceWallet().getWalletId());
        Assertions.assertEquals(new BigDecimal("50.00"), tx.getAmount());
    }
    @Test
    public void testTransferInsufficientFunds() {
        Wallet src = new Wallet();
        src.setWalletId(1L);
        src.setBalance(new BigDecimal("20.00"));
        Wallet dest = new Wallet();
        dest.setWalletId(2L);
        dest.setBalance(BigDecimal.ZERO);
        when(walletRepository.findById(1L)).thenReturn(Optional.of(src));
        when(walletRepository.findById(2L)).thenReturn(Optional.of(dest));
        Assertions.assertThrows(BadRequestException.class, () -> walletService.transfer(1L, 2L, new BigDecimal("100.00")));
    }
    @Test
    public void testTransferWalletNotFound() {
        when(walletRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResourceNotFoundException.class, () -> walletService.transfer(1L, 2L, new BigDecimal("10.00")));
    }
}
