package com.act.itas.application.port;

import com.act.itas.domain.shared.valueobject.DomainEvent;

import java.util.List;

/**
 * Port for publishing domain events.
 * Pattern: Identical to bs-filing-core-server EventPublisherPort
 */
public interface EventPublisherPort {
    void publish(List<DomainEvent> events);
    void publish(DomainEvent event);
}
