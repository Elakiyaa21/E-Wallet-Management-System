package com.examly.springapp.config;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final WalletRepository walletRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Admin
        if (userRepo.findByEmail("admin@ewallet.local").isEmpty()) {
            User admin = new User();
            admin.setUsername("Admin");
            admin.setEmail("admin@ewallet.local");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin = userRepo.save(admin);

            // Wallet w = new Wallet();
            // w.setUser(admin);
            // w.setWalletName("Admin Wallet");
            // w.setBalance(new BigDecimal("100000.0000"));
            // walletRepo.save(w);
        }
    }
}
