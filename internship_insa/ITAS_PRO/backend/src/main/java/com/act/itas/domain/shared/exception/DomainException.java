package com.act.itas.domain.shared.exception;

/**
 * Base exception for all domain-level business rule violations.
 * Pattern: Identical to bs-filing-core-server DomainException
 */
public class DomainException extends RuntimeException {
    public DomainException(String message) {
        super(message);
    }

    public DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}
