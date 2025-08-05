package com.examly.springapp.service;

import com.examly.springapp.exception.BadRequestException;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import java.util.Collections;
import java.util.List;
import static org.mockito.Mockito.*;

public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    public void testCreateUserSuccess() {
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@ex.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        User user = userService.createUser("john", "john@ex.com");
        Assertions.assertEquals("john", user.getUsername());
        Assertions.assertEquals("john@ex.com", user.getEmail());
    }
    @Test
    public void testCreateUserDuplicateUsername() {
        when(userRepository.existsByUsername("john")).thenReturn(true);
        Assertions.assertThrows(BadRequestException.class, () -> userService.createUser("john", "other@ex.com"));
    }
    @Test
    public void testCreateUserDuplicateEmail() {
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@ex.com")).thenReturn(true);
        Assertions.assertThrows(BadRequestException.class, () -> userService.createUser("john", "john@ex.com"));
    }
    @Test
    public void testGetAllUsers() {
        List<User> dummy = Collections.singletonList(new User());
        when(userRepository.findAll()).thenReturn(dummy);
        Assertions.assertEquals(1, userService.getAllUsers().size());
    }
}
