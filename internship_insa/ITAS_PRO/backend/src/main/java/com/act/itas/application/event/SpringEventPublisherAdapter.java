package com.act.itas.application.event;

import com.act.itas.application.port.EventPublisherPort;
import com.act.itas.domain.shared.valueobject.DomainEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Adapter for publishing domain events via Spring's ApplicationEventPublisher.
 * Pattern: Identical to bs-filing-core-server SpringEventPublisherAdapter
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SpringEventPublisherAdapter implements EventPublisherPort {
    private final ApplicationEventPublisher applicationEventPublisher;
    
    @Override
    public void publish(List<DomainEvent> events) {
        events.forEach(this::publish);
    }
    
    @Override
    public void publish(DomainEvent event) {
        log.debug("Publishing domain event: {}", event.getClass().getSimpleName());
        applicationEventPublisher.publishEvent(event);
    }
}
