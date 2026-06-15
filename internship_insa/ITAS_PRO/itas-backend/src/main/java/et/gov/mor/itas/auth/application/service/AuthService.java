package et.gov.mor.itas.auth.application.service;

import et.gov.mor.itas.auth.application.dto.AuthUserDTO;
import et.gov.mor.itas.auth.application.dto.LoginRequest;
import et.gov.mor.itas.auth.application.dto.LoginResponse;
import et.gov.mor.itas.auth.domain.Role;
import et.gov.mor.itas.shared.exception.BusinessException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Authentication service handling login and token generation
 * TODO: Replace mock users with Keycloak integration
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final PasswordEncoder passwordEncoder;

    @Value("${application.jwt.secret}")
    private String jwtSecret;

    @Value("${application.jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${application.jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    // Mock users matching frontend mock data
    private final Map<String, AuthUserDTO> MOCK_USERS = Map.of(
        "taxpayer", new AuthUserDTO(
            UUID.randomUUID(), "taxpayer", "John Taxpayer",
            "john@example.com", "TIN001", List.of(Role.TAXPAYER)
        ),
        "agent", new AuthUserDTO(
            UUID.randomUUID(), "agent", "Jane Agent",
            "jane@example.com", "TIN002", List.of(Role.TAX_AGENT)
        ),
        "officer", new AuthUserDTO(
            UUID.randomUUID(), "officer", "Bob Officer",
            "bob@example.com", "TIN003", List.of(Role.TAX_OFFICER)
        ),
        "approver", new AuthUserDTO(
            UUID.randomUUID(), "approver", "Alice Approver",
            "alice@example.com", "TIN004", List.of(Role.APPROVING_OFFICER)
        ),
        "admin", new AuthUserDTO(
            UUID.randomUUID(), "admin", "System Admin",
            "admin@example.com", "TIN005", List.of(Role.SYSTEM_ADMIN)
        )
    );


    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        
        // Mock authentication - password is always "demo"
        AuthUserDTO user = MOCK_USERS.get(request.getUsername());
        if (user == null || !"demo".equals(request.getPassword())) {
            throw new BusinessException("AUTH_FAILED", "Invalid username or password");
        }

        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);

        log.info("User {} logged in successfully", user.getUsername());
        return new LoginResponse(user, accessToken, refreshToken);
    }

    private String generateAccessToken(AuthUserDTO user) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(accessTokenExpiration);

        return Jwts.builder()
            .subject(user.getId().toString())
            .claim("username", user.getUsername())
            .claim("email", user.getEmail())
            .claim("roles", user.getRoles())
            .claim("tin", user.getTin())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(getSigningKey())
            .compact();
    }

    private String generateRefreshToken(AuthUserDTO user) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(refreshTokenExpiration);

        return Jwts.builder()
            .subject(user.getId().toString())
            .claim("type", "refresh")
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration))
            .signWith(getSigningKey())
            .compact();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
