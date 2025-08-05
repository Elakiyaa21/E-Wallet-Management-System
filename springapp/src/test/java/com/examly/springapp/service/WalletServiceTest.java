package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
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

public class WalletServiceTest {
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
    public void testCreateWalletSuccess() {
        User user = new User();
        user.setUserId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(i -> i.getArguments()[0]);
        Wallet wallet = walletService.createWallet(1L, "Primary Wallet");
        Assertions.assertEquals("Primary Wallet", wallet.getWalletName());
        Assertions.assertEquals(user, wallet.getUser());
        Assertions.assertEquals(BigDecimal.ZERO, wallet.getBalance());
    }
    @Test
    public void testCreateWalletUserNotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResourceNotFoundException.class, () -> walletService.createWallet(2L, "Test Wallet"));
    }
}
