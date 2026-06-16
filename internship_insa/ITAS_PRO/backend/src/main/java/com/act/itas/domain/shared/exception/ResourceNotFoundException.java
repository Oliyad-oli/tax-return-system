package com.act.itas.domain.shared.exception;

/**
 * Exception for when a requested resource (aggregate, entity) is not found.
 * Results in HTTP 404.
 * Pattern: Identical to bs-filing-core-server ResourceNotFoundException
 */
public class ResourceNotFoundException extends DomainException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
