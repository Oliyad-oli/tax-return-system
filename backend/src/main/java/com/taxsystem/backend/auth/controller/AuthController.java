package com.taxsystem.backend.auth.controller;

import com.taxsystem.backend.auth.domain.User;
import com.taxsystem.backend.auth.dto.LoginRequest;
import com.taxsystem.backend.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public User signup(
            @RequestBody User user
    ) {

        return authService.signup(user);
    }

    @PostMapping("/login")
    public User login(
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);
    }
}