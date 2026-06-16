package com.act.itas.domain.shared.valueobject;

import java.time.Instant;
import java.util.UUID;

/**
 * Marker interface for all domain events. Implementations are Java records.
 * Pattern: Identical to bs-filing-core-server DomainEvent
 */
public interface DomainEvent {
    UUID eventId();
    Instant occurredAt();
}
