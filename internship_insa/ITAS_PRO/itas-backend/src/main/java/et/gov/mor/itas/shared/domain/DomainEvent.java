package et.gov.mor.itas.shared.domain;

import java.time.Instant;
import java.util.UUID;

/**
 * Base interface for all domain events
 * Domain events represent something that happened in the domain
 */
public interface DomainEvent {
    
    UUID getEventId();
    
    Instant getOccurredAt();
    
    String getEventType();
    
    UUID getAggregateId();
}
