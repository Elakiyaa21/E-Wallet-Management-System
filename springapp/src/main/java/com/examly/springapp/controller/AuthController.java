package com.examly.springapp.controller;

import com.examly.springapp.dto.*;
import com.examly.springapp.model.User;
import com.examly.springapp.security.JwtUtil;
import com.examly.springapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        User created = authService.registerUser(req.getName(), req.getEmail(), req.getPassword());
        String token = jwtUtil.generateToken(created.getEmail(), Map.of(
                "role", created.getRole(),
                "userId", created.getUserId()
        ));
        return ResponseEntity.ok(new AuthResponse(token, created.getRole(), created.getUserId(), created.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        var principal = (org.springframework.security.core.userdetails.User) auth.getPrincipal();

        User user = authService.getByEmail(principal.getUsername());

        String token = jwtUtil.generateToken(user.getEmail(),
                Map.of("role", user.getRole(), "userId", user.getUserId()));
        return ResponseEntity.ok(new AuthResponse(token, user.getRole(), user.getUserId(), user.getEmail()));
    }
    @GetMapping("/me")
public ResponseEntity<User> getCurrentUser(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(401).build();
    }

    // authentication.getName() returns the email because of how authentication is set up
    User user = authService.getByEmail(authentication.getName());

    return ResponseEntity.ok(user);
}

}
