package com.taxsystem.backend.auth.service;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.dto.LoginRequest;
import com.taxsystem.backend.auth.dto.RegisterRequest;
import com.taxsystem.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email Already Exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("TAXPAYER");

        userRepository.save(user);
        return "Registration Successful";
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return user;
    }
}