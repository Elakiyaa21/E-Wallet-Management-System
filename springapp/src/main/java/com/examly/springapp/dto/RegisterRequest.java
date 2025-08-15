package com.examly.springapp.dto;

import lombok.Data;

@Data
public class RegisterRequest {
     private String name;     // we map to username
    private String email;
    private String password;
}
