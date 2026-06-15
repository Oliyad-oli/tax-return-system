package et.gov.mor.itas.shared.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Abstract base class for domain events
 */
@Getter
public abstract class BaseDomainEvent implements DomainEvent {
    
    private final UUID eventId;
    private final Instant occurredAt;
    private final UUID aggregateId;
    
    protected BaseDomainEvent(UUID aggregateId) {
        this.eventId = UUID.randomUUID();
        this.occurredAt = Instant.now();
        this.aggregateId = aggregateId;
    }
    
    @Override
    public String getEventType() {
        return this.getClass().getSimpleName();
    }
}
