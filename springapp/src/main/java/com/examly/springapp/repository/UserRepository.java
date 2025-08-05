package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username); // ✅ match test case
    boolean existsByEmail(String email);
}
