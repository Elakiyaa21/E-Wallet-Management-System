package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Example JPQL (optional usage)
    @Query("SELECT u FROM User u WHERE u.username = ?1")
    User findByUsernameJPQL(String username);
}
