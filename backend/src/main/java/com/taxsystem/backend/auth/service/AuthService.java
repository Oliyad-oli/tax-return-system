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

    public String register(
            RegisterRequest request
    ) {

        if (
                userRepository.findByEmail(
                        request.getEmail()
                ).isPresent()
        ) {

            throw new RuntimeException(
                    "Email Already Exists"
            );
        }

        User user = User.builder()

                .fullName(
                        request.getFullName()
                )

                .email(
                        request.getEmail()
                )

                .password(
                        request.getPassword()
                )

                .role("TAXPAYER")

                .build();

        userRepository.save(user);

        return "Registration Successful";
    }

    public User login(
            LoginRequest request
    ) {

        User user = userRepository.findByEmail(
                request.getEmail()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Invalid Email"
                )
        );

        if (
                !user.getPassword().equals(
                        request.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        return user;
    }
}