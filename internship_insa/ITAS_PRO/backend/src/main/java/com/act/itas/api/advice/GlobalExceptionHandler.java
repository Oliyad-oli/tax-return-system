package com.act.itas.api.advice;

import com.act.itas.domain.shared.exception.DomainException;
import com.act.itas.domain.shared.exception.EngineAdapterException;
import com.act.itas.domain.shared.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.net.URI;
import java.time.Instant;
import java.util.stream.Collectors;

/**
 * Translates exceptions to RFC 7807 ProblemDetail responses.
 * Pattern: Extended from bs-filing-core-server GlobalExceptionHandler with security exceptions added.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        p.setTitle("Validation Failed");
        p.setType(URI.create("urn:itas:validation-error"));
        p.setProperty("timestamp", Instant.now());
        p.setProperty("violations", ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid")));
        return p;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        p.setTitle("Resource Not Found");
        p.setType(URI.create("urn:itas:not-found"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail(ex.getMessage());
        return p;
    }

    @ExceptionHandler(DomainException.class)
    public ProblemDetail handleDomain(DomainException ex) {
        log.warn("Domain rule violation: {}", ex.getMessage());

        // Legacy fallback for old-style XxxNotFoundException
        boolean isLegacyNotFound = ex.getMessage() != null
                && ex.getMessage().toLowerCase().contains("not found");
        HttpStatus status = isLegacyNotFound ? HttpStatus.NOT_FOUND : HttpStatus.UNPROCESSABLE_ENTITY;

        ProblemDetail p = ProblemDetail.forStatus(status);
        p.setTitle(isLegacyNotFound ? "Resource Not Found" : "Business Rule Violation");
        p.setType(URI.create(isLegacyNotFound ? "urn:itas:not-found" : "urn:itas:domain-error"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail(ex.getMessage());
        return p;
    }

    @ExceptionHandler({OptimisticLockingFailureException.class, ObjectOptimisticLockingFailureException.class})
    public ProblemDetail handleOptimisticLock(Exception ex) {
        log.warn("Concurrent modification detected: {}", ex.getMessage());
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        p.setTitle("Concurrent Modification");
        p.setType(URI.create("urn:itas:concurrent-modification"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail("This resource was modified by another request. Please reload and retry.");
        return p;
    }

    @ExceptionHandler(EngineAdapterException.class)
    public ProblemDetail handleEngine(EngineAdapterException ex) {
        log.error("Engine adapter error: engine={} op={}", ex.getEngineName(), ex.getOperation(), ex);
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.BAD_GATEWAY);
        p.setTitle("Upstream Service Unavailable");
        p.setType(URI.create("urn:itas:engine-error"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail("A core service is temporarily unavailable. Please retry.");
        return p;
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        log.warn("Authentication failed: bad credentials");
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        p.setTitle("Authentication Failed");
        p.setType(URI.create("urn:itas:authentication-failed"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail("Invalid credentials provided.");
        return p;
    }

    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail handleAuthentication(AuthenticationException ex) {
        log.warn("Authentication error: {}", ex.getMessage());
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        p.setTitle("Authentication Required");
        p.setType(URI.create("urn:itas:authentication-required"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail("Valid authentication is required to access this resource.");
        return p;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        p.setTitle("Access Denied");
        p.setType(URI.create("urn:itas:access-denied"));
        p.setProperty("timestamp", Instant.now());
        p.setDetail("You do not have permission to access this resource.");
        return p;
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ProblemDetail handleNoResource(NoResourceFoundException ex) {
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        p.setTitle("Resource Not Found");
        p.setType(URI.create("urn:itas:not-found"));
        p.setDetail("No endpoint for: " + ex.getResourcePath());
        p.setProperty("timestamp", Instant.now());
        return p;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        ProblemDetail p = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        p.setTitle("Internal Server Error");
        p.setType(URI.create("urn:itas:internal-error"));
        p.setProperty("timestamp", Instant.now());
        return p;
    }
}
