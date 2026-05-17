package com.taxsystem.backend.auth.service;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.dto.LoginRequest;
import com.taxsystem.backend.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User signup(User user) {

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(
                request.getEmail()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        if (!user.getPassword().equals(
                request.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        return user;
    }
}