package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
    
}
