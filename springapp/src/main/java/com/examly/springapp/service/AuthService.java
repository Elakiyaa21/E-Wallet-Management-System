package com.examly.springapp.service;

import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final WalletRepository walletRepo;
    private final PasswordEncoder encoder;

    public User registerUser(String name, String email, String rawPassword) {
        if (userRepo.existsByEmail(email)) {
            throw new BadRequestException("Email already exists");
        }
        User u = new User();
        u.setUsername(name);
        u.setEmail(email);
        u.setPassword(encoder.encode(rawPassword));
        u.setRole("USER");
        User saved = userRepo.save(u);

        // Ensure a wallet gets created for the new user
        // if (walletRepo.findByUser(saved).isEmpty()) {
        //     Wallet w = new Wallet();
        //     w.setWalletName(saved.getUsername() + "'s Wallet");
        //     w.setUser(saved);
        //     w.setBalance(BigDecimal.ZERO);
        //     walletRepo.save(w);
        // }
        return saved;
    }

    public User getByEmail(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
