package et.gov.mor.itas.auth.adapter.rest;

import et.gov.mor.itas.auth.application.dto.LoginRequest;
import et.gov.mor.itas.auth.application.dto.LoginResponse;
import et.gov.mor.itas.auth.application.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST Controller
 * Endpoints matching frontend auth service
 */
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT tokens")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Refresh access token using refresh token")
    public ResponseEntity<Void> refresh(@RequestBody Map<String, String> request) {
        // TODO: Implement refresh token logic
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalidate user session")
    public ResponseEntity<Void> logout() {
        // TODO: Implement logout logic (blacklist token if needed)
        return ResponseEntity.ok().build();
    }
}
