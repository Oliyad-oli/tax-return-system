# Module Generator Guide

## Purpose
This guide provides a systematic approach to generating complete business modules for the ITAS backend, ensuring consistency with bs-filing-core-server patterns.

## Module Template Structure

Every module follows this exact structure:

```
com.act.itas/
└── {module}/                                    # e.g., authentication, taxpayer, returnfiling
    ├── domain/{module}/
    │   ├── aggregate/
    │   │   └── {ModuleName}.java                # Main aggregate root
    │   ├── entity/                              # Child entities (if any)
    │   │   └── {ChildEntity}.java
    │   ├── valueobject/
    │   │   ├── {ModuleName}Status.java          # Status enum
    │   │   ├── {ModuleName}Type.java            # Type enum
    │   │   └── {Other}ValueObject.java
    │   ├── service/                             # Domain services
    │   │   └── {ModuleName}DomainService.java
    │   └── event/
    │       ├── {ModuleName}CreatedEvent.java
    │       ├── {ModuleName}UpdatedEvent.java
    │       └── {ModuleName}{Action}Event.java
    │
    ├── application/{module}/
    │   ├── command/
    │   │   ├── Create{ModuleName}Command.java
    │   │   ├── Update{ModuleName}Command.java
    │   │   └── {Action}{ModuleName}Command.java
    │   ├── query/
    │   │   ├── Find{ModuleName}ByIdQuery.java
    │   │   ├── List{ModuleName}Query.java
    │   │   └── Search{ModuleName}Query.java
    │   ├── handler/
    │   │   ├── Create{ModuleName}Handler.java
    │   │   ├── Update{ModuleName}Handler.java
    │   │   └── {Action}{ModuleName}Handler.java
    │   ├── service/
    │   │   └── {ModuleName}ApplicationService.java
    │   └── port/
    │       ├── {ModuleName}RepositoryPort.java
    │       └── {ModuleName}{External}Port.java
    │
    ├── persistence/{module}/
    │   ├── entity/
    │   │   └── {ModuleName}JpaEntity.java
    │   ├── repository/
    │   │   └── {ModuleName}JpaRepository.java
    │   └── adapter/
    │       └── {ModuleName}PersistenceAdapter.java
    │
    └── api/controller/{module}/
        └── {ModuleName}Controller.java
```

## Step-by-Step Module Creation

### Step 1: Domain Aggregate

```java
package com.act.itas.domain.{module}.aggregate;

import com.act.itas.domain.shared.aggregate.AggregateRoot;
import com.act.itas.domain.{module}.event.*;
import com.act.itas.domain.{module}.valueobject.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class {ModuleName} extends AggregateRoot {
    private UUID id;
    private String field1;
    private String field2;
    private {ModuleName}Status status;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
    
    // Private constructor for aggregate reconstruction
    private {ModuleName}(UUID id, String field1, String field2, {ModuleName}Status status,
                         Instant createdAt, Instant updatedAt, String createdBy, String updatedBy) {
        this.id = id;
        this.field1 = field1;
        this.field2 = field2;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }
    
    // Factory method for new aggregate
    public static {ModuleName} create(String field1, String field2, String createdBy) {
        validate(field1, field2);
        
        UUID id = UUID.randomUUID();
        Instant now = Instant.now();
        
        {ModuleName} aggregate = new {ModuleName}(
            id, field1, field2, {ModuleName}Status.DRAFT,
            now, now, createdBy, createdBy
        );
        
        aggregate.registerEvent(new {ModuleName}CreatedEvent(
            UUID.randomUUID(), now, id, field1, field2, createdBy
        ));
        
        return aggregate;
    }
    
    // Business method
    public void performAction(String actorId) {
        validateStateTransition();
        
        this.status = {ModuleName}Status.ACTIVE;
        this.updatedAt = Instant.now();
        this.updatedBy = actorId;
        
        registerEvent(new {ModuleName}ActionPerformedEvent(
            UUID.randomUUID(), Instant.now(), this.id, actorId
        ));
    }
    
    private static void validate(String field1, String field2) {
        if (field1 == null || field1.isBlank()) {
            throw new DomainException("Field1 is required");
        }
        // Add more validation
    }
    
    private void validateStateTransition() {
        if (this.status != {ModuleName}Status.DRAFT) {
            throw new DomainException("Invalid state transition from " + this.status);
        }
    }
    
    @Override
    public UUID getId() {
        return id;
    }
}
```

### Step 2: Value Objects

```java
package com.act.itas.domain.{module}.valueobject;

public enum {ModuleName}Status {
    DRAFT,
    ACTIVE,
    COMPLETED,
    CANCELLED
}
```

### Step 3: Domain Events

```java
package com.act.itas.domain.{module}.event;

import com.act.itas.domain.shared.valueobject.DomainEvent;

import java.time.Instant;
import java.util.UUID;

public record {ModuleName}CreatedEvent(
    UUID eventId,
    Instant occurredAt,
    UUID aggregateId,
    String field1,
    String field2,
    String createdBy
) implements DomainEvent {
}
```

### Step 4: Commands

```java
package com.act.itas.application.{module}.command;

public record Create{ModuleName}Command(
    String field1,
    String field2,
    String actorId
) {
}
```

### Step 5: Queries

```java
package com.act.itas.application.{module}.query;

import java.util.UUID;

public record Find{ModuleName}ByIdQuery(UUID id) {
}
```

### Step 6: Repository Port

```java
package com.act.itas.application.{module}.port;

import com.act.itas.domain.{module}.aggregate.{ModuleName};

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface {ModuleName}RepositoryPort {
    {ModuleName} save({ModuleName} aggregate);
    Optional<{ModuleName}> findById(UUID id);
    List<{ModuleName}> findAll();
    void deleteById(UUID id);
}
```

### Step 7: Command Handler

```java
package com.act.itas.application.{module}.handler;

import com.act.itas.application.{module}.command.Create{ModuleName}Command;
import com.act.itas.application.{module}.port.{ModuleName}RepositoryPort;
import com.act.itas.application.port.EventPublisherPort;
import com.act.itas.domain.{module}.aggregate.{ModuleName};
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class Create{ModuleName}Handler {
    private final {ModuleName}RepositoryPort repository;
    private final EventPublisherPort eventPublisher;
    
    @Transactional
    public {ModuleName}Response handle(Create{ModuleName}Command command) {
        log.info("Creating {ModuleName}: field1={}, actorId={}", 
                 command.field1(), command.actorId());
        
        {ModuleName} aggregate = {ModuleName}.create(
            command.field1(),
            command.field2(),
            command.actorId()
        );
        
        {ModuleName} saved = repository.save(aggregate);
        
        eventPublisher.publish(saved.pullEvents());
        
        log.info("{ModuleName} created successfully: id={}", saved.getId());
        
        return {ModuleName}Response.from(saved);
    }
}
```

### Step 8: Query Handler

```java
package com.act.itas.application.{module}.handler;

import com.act.itas.application.{module}.query.Find{ModuleName}ByIdQuery;
import com.act.itas.application.{module}.port.{ModuleName}RepositoryPort;
import com.act.itas.domain.{module}.aggregate.{ModuleName};
import com.act.itas.domain.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class Find{ModuleName}ByIdQueryHandler {
    private final {ModuleName}RepositoryPort repository;
    
    @Transactional(readOnly = true)
    public {ModuleName}Response handle(Find{ModuleName}ByIdQuery query) {
        log.debug("Finding {ModuleName} by id: {}", query.id());
        
        {ModuleName} aggregate = repository.findById(query.id())
            .orElseThrow(() -> new ResourceNotFoundException(
                "{ModuleName} not found: " + query.id()
            ));
        
        return {ModuleName}Response.from(aggregate);
    }
}
```

### Step 9: JPA Entity

```java
package com.act.itas.persistence.{module}.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "{module_table_name}")
@Getter
@Setter
@NoArgsConstructor
public class {ModuleName}JpaEntity {
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;
    
    @Column(name = "field1", nullable = false)
    private String field1;
    
    @Column(name = "field2")
    private String field2;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private String status;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Version
    @Column(name = "version")
    private Long version;
}
```

### Step 10: Spring Data Repository

```java
package com.act.itas.persistence.{module}.repository;

import com.act.itas.persistence.{module}.entity.{ModuleName}JpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface {ModuleName}JpaRepository extends JpaRepository<{ModuleName}JpaEntity, UUID> {
    List<{ModuleName}JpaEntity> findByStatus(String status);
}
```

### Step 11: Persistence Adapter

```java
package com.act.itas.persistence.{module}.adapter;

import com.act.itas.application.{module}.port.{ModuleName}RepositoryPort;
import com.act.itas.domain.{module}.aggregate.{ModuleName};
import com.act.itas.persistence.{module}.entity.{ModuleName}JpaEntity;
import com.act.itas.persistence.{module}.repository.{ModuleName}JpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class {ModuleName}PersistenceAdapter implements {ModuleName}RepositoryPort {
    private final {ModuleName}JpaRepository jpaRepository;
    
    @Override
    public {ModuleName} save({ModuleName} aggregate) {
        {ModuleName}JpaEntity entity = toEntity(aggregate);
        {ModuleName}JpaEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }
    
    @Override
    public Optional<{ModuleName}> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }
    
    @Override
    public List<{ModuleName}> findAll() {
        return jpaRepository.findAll().stream()
            .map(this::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
    
    private {ModuleName}JpaEntity toEntity({ModuleName} aggregate) {
        {ModuleName}JpaEntity entity = new {ModuleName}JpaEntity();
        entity.setId(aggregate.getId());
        entity.setField1(aggregate.getField1());
        entity.setField2(aggregate.getField2());
        entity.setStatus(aggregate.getStatus().name());
        entity.setCreatedAt(aggregate.getCreatedAt());
        entity.setUpdatedAt(aggregate.getUpdatedAt());
        entity.setCreatedBy(aggregate.getCreatedBy());
        entity.setUpdatedBy(aggregate.getUpdatedBy());
        return entity;
    }
    
    private {ModuleName} toDomain({ModuleName}JpaEntity entity) {
        // Use reflection or builder pattern to reconstruct aggregate
        // This requires adding a reconstruction method to the aggregate
        return {ModuleName}.reconstruct(
            entity.getId(),
            entity.getField1(),
            entity.getField2(),
            {ModuleName}Status.valueOf(entity.getStatus()),
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getCreatedBy(),
            entity.getUpdatedBy()
        );
    }
}
```

### Step 12: DTOs

```java
// Request DTO
package com.act.itas.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record Create{ModuleName}Request(
    @NotBlank(message = "Field1 is required")
    String field1,
    
    String field2
) {
}

// Response DTO
package com.act.itas.api.dto.response;

import java.time.Instant;
import java.util.UUID;

public record {ModuleName}Response(
    UUID id,
    String field1,
    String field2,
    String status,
    Instant createdAt,
    Instant updatedAt,
    String createdBy
) {
    public static {ModuleName}Response from({ModuleName} aggregate) {
        return new {ModuleName}Response(
            aggregate.getId(),
            aggregate.getField1(),
            aggregate.getField2(),
            aggregate.getStatus().name(),
            aggregate.getCreatedAt(),
            aggregate.getUpdatedAt(),
            aggregate.getCreatedBy()
        );
    }
}
```

### Step 13: Controller

```java
package com.act.itas.api.controller.{module};

import com.act.itas.api.dto.request.Create{ModuleName}Request;
import com.act.itas.api.dto.response.{ModuleName}Response;
import com.act.itas.application.{module}.command.Create{ModuleName}Command;
import com.act.itas.application.{module}.handler.Create{ModuleName}Handler;
import com.act.itas.application.{module}.handler.Find{ModuleName}ByIdQueryHandler;
import com.act.itas.application.{module}.query.Find{ModuleName}ByIdQuery;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/{module-path}")
@RequiredArgsConstructor
@Validated
@Slf4j
public class {ModuleName}Controller {
    private final Create{ModuleName}Handler createHandler;
    private final Find{ModuleName}ByIdQueryHandler findByIdHandler;
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<{ModuleName}Response> create(
            @Valid @RequestBody Create{ModuleName}Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("Creating {ModuleName}: field1={}, user={}", 
                 request.field1(), userDetails.getUsername());
        
        Create{ModuleName}Command command = new Create{ModuleName}Command(
            request.field1(),
            request.field2(),
            userDetails.getUsername()
        );
        
        {ModuleName}Response response = createHandler.handle(command);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<{ModuleName}Response> findById(@PathVariable UUID id) {
        log.debug("Finding {ModuleName} by id: {}", id);
        
        Find{ModuleName}ByIdQuery query = new Find{ModuleName}ByIdQuery(id);
        {ModuleName}Response response = findByIdHandler.handle(query);
        
        return ResponseEntity.ok(response);
    }
}
```

### Step 14: Flyway Migration

```sql
-- V{number}__{module_name}.sql
-- Example: V2__authentication_module.sql

CREATE TABLE IF NOT EXISTS {module_table_name} (
    id UUID PRIMARY KEY,
    field1 VARCHAR(255) NOT NULL,
    field2 VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT NOT NULL DEFAULT 0,
    
    CONSTRAINT {module}_status_check CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'))
);

CREATE INDEX idx_{module}_status ON {module_table_name}(status);
CREATE INDEX idx_{module}_created_at ON {module_table_name}(created_at);
CREATE INDEX idx_{module}_updated_at ON {module_table_name}(updated_at);

COMMENT ON TABLE {module_table_name} IS 'Stores {ModuleName} aggregates';
COMMENT ON COLUMN {module_table_name}.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN {module_table_name}.version IS 'Optimistic locking version';
```

## Checklist for Each Module

- [ ] Domain Aggregate with business logic
- [ ] Value Objects (enums, records)
- [ ] Domain Events (all state changes)
- [ ] Commands (write operations)
- [ ] Queries (read operations)
- [ ] Command Handlers
- [ ] Query Handlers
- [ ] Repository Port interface
- [ ] JPA Entity
- [ ] Spring Data Repository
- [ ] Persistence Adapter
- [ ] Request DTOs with validation
- [ ] Response DTOs
- [ ] REST Controller
- [ ] Flyway migration script
- [ ] Unit tests for aggregate
- [ ] Unit tests for handlers
- [ ] Integration test for controller

## Module Generation Automation

To speed up module creation, consider using:
1. **IDE Templates** (IntelliJ Live Templates, VS Code Snippets)
2. **Yeoman Generator** for full module scaffolding
3. **Shell Script** to create directory structure and boilerplate
4. **Maven Archetype** for module template

## Example: Complete Module Creation Script

```bash
#!/bin/bash

MODULE=$1
MODULE_PATH=$2  # e.g., taxpayer, return-filing

if [ -z "$MODULE" ] || [ -z "$MODULE_PATH" ]; then
    echo "Usage: ./create-module.sh ModuleName module-path"
    exit 1
fi

BASE_PKG="src/main/java/com/act/itas"

# Create domain structure
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/aggregate"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/entity"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/valueobject"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/service"
mkdir -p "$BASE_PKG/domain/$MODULE_PATH/event"

# Create application structure
mkdir -p "$BASE_PKG/application/$MODULE_PATH/command"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/query"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/handler"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/service"
mkdir -p "$BASE_PKG/application/$MODULE_PATH/port"

# Create persistence structure
mkdir -p "$BASE_PKG/persistence/$MODULE_PATH/entity"
mkdir -p "$BASE_PKG/persistence/$MODULE_PATH/repository"
mkdir -p "$BASE_PKG/persistence/$MODULE_PATH/adapter"

# Create API structure
mkdir -p "$BASE_PKG/api/controller/$MODULE_PATH"
mkdir -p "$BASE_PKG/api/dto/request"
mkdir -p "$BASE_PKG/api/dto/response"

echo "Module structure created for: $MODULE ($MODULE_PATH)"
echo "Now generate the classes using this guide as reference"
```

Save this as `create-module.sh`, make executable with `chmod +x create-module.sh`, then run:

```bash
./create-module.sh Taxpayer taxpayer
```

This creates the entire directory structure. Then use this guide to populate each file.

## Summary

Following this template ensures:
1. **Consistency** across all modules
2. **Maintainability** with clear separation of concerns
3. **Testability** with isolated layers
4. **Scalability** with proper architectural boundaries
5. **Compliance** with bs-filing-core-server patterns

Every module should feel like a natural extension of the system, following the exact same patterns and conventions.
