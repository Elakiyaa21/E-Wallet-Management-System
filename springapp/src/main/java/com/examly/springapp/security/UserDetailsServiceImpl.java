package com.examly.springapp.security;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        String role = u.getRole() == null ? "USER" : u.getRole();
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPassword() == null ? "" : u.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}
