package com.examly.springapp.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private String email;

    public AuthResponse(String token, String role, Long userId, String email) {
        this.token = token; this.role = role; this.userId = userId; this.email = email;
    }
}
