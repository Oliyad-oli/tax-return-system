package com.act.itas.domain.shared.exception;

import lombok.Getter;

/**
 * Exception for external engine/adapter failures.
 * Results in HTTP 502 (Bad Gateway).
 * Pattern: Identical to bs-filing-core-server EngineAdapterException
 */
@Getter
public class EngineAdapterException extends RuntimeException {
    private final String engineName;
    private final String operation;

    public EngineAdapterException(String engineName, String operation, String message) {
        super(message);
        this.engineName = engineName;
        this.operation = operation;
    }

    public EngineAdapterException(String engineName, String operation, String message, Throwable cause) {
        super(message, cause);
        this.engineName = engineName;
        this.operation = operation;
    }
}
