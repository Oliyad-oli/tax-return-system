# ITAS Backend - Integrated Tax Administration System

## Overview

This is a comprehensive enterprise Spring Boot backend for a Government Tax Administration System, built following the **exact architectural patterns** of the reference project `bs-filing-core-server`.

## What Has Been Created

### ✅ Project Foundation (Complete)
1. **Maven POM** (`pom.xml`)
   - Spring Boot 3.3.0 + Java 21
   - All necessary dependencies: PostgreSQL, Kafka, Redis, MinIO, Elasticsearch, Keycloak, JWT
   - MapStruct for DTO mapping
   - Lombok for boilerplate reduction
   - Resilience4j for circuit breakers
   - Comprehensive testing stack (Testcontainers, ArchUnit, WireMock)

2. **Main Application Class** (`ItasApplication.java`)
   - Standard Spring Boot entry point
   - Async and scheduling enabled

3. **Configuration** (`application.yml`)
   - Complete configuration for all integrations
   - Environment variable support
   - Resilience4j circuit breakers
   - Kafka, Redis, MinIO, Elasticsearch
   - JWT and Keycloak security
   - Scheduling and outbox configuration

4. **Shared Kernel** (Domain Foundation)
   - `AggregateRoot` - Base class for all aggregates with event handling
   - `DomainEvent` - Interface for all domain events (immutable records)
   - `DomainException` - Base exception for business rule violations
   - `ResourceNotFoundException` - 404 exceptions
   - `EngineAdapterException` - External service failures
   - `Money` - Value object for monetary amounts

5. **Global Exception Handler** (`GlobalExceptionHandler.java`)
   - RFC 7807 ProblemDetail responses
   - All exception types handled (validation, domain, security, optimistic locking)
   - Comprehensive logging

6. **Architecture Documentation**
   - `ARCHITECTURE.md` - Complete package structure and patterns
   - `IMPLEMENTATION_PLAN.md` - Detailed 24-phase implementation roadmap

## Architecture Principles (from bs-filing-core-server)

### 1. Hexagonal Architecture
```
api → application → domain ← persistence/engineadapter
```
- **api**: REST controllers, DTOs, WebSocket endpoints
- **application**: Commands, Queries, Handlers, Ports (interfaces)
- **domain**: Aggregates, Value Objects, Domain Services, Events
- **persistence**: JPA entities, repositories, adapters
- **engineadapter**: External system integrations (Kafka, Redis, MinIO, etc.)

### 2. Domain-Driven Design (DDD)
- **Aggregates** as transactional consistency boundaries
- **Value Objects** for immutable concepts
- **Domain Events** for state changes
- **Domain Services** for cross-aggregate logic

### 3. CQRS (Command Query Responsibility Segregation)
- **Commands** in `application/command/` (write operations)
- **Queries** in `application/query/` (read operations)
- **Handlers** process commands and queries

### 4. Event-Driven Architecture
- Domain events recorded in aggregates via `registerEvent()`
- Events pulled after persistence via `pullEvents()`
- Published to Kafka for cross-service communication
- WebSocket for real-time dashboard updates
- Redis Pub/Sub for immediate notifications

### 5. Port/Adapter Pattern
- Application layer defines **Port** interfaces
- Infrastructure layers implement **Adapters**
- Controllers never import from persistence/engineadapter

### 6. Outbox Pattern
- Domain events persist to outbox table
- Background scheduler polls and publishes to Kafka
- Guarantees at-least-once delivery

## Package Structure

```
com.act.itas/
├── api/                          # REST & WebSocket Layer
│   ├── controller/
│   ├── dto/
│   ├── mapper/
│   ├── advice/
│   └── websocket/
├── application/                  # Use Cases & Orchestration
│   ├── command/
│   ├── query/
│   ├── handler/
│   ├── service/
│   ├── port/
│   └── event/
├── domain/                       # Business Logic (DDD)
│   ├── authentication/
│   ├── taxpayer/
│   ├── returnfiling/
│   ├── estimation/
│   ├── assessment/
│   ├── presumptive/
│   ├── invoice/
│   ├── crossmatch/
│   ├── fraud/
│   ├── manual/
│   ├── extension/
│   ├── refund/
│   ├── notification/
│   ├── audit/
│   └── shared/
├── persistence/                  # Data Access
│   ├── entity/
│   ├── repository/
│   ├── adapter/
│   └── converter/
├── engineadapter/                # External Integrations
│   ├── kafka/
│   ├── redis/
│   ├── minio/
│   ├── elasticsearch/
│   ├── email/
│   └── sms/
├── config/                       # Spring Configuration
│   ├── SecurityConfig.java
│   ├── KeycloakConfig.java
│   ├── WebSocketConfig.java
│   ├── KafkaConfig.java
│   └── ...
└── observability/                # Monitoring
    ├── audit/
    └── filter/
```

## Business Modules to Implement

Following the implementation plan in `IMPLEMENTATION_PLAN.md`:

1. **Authentication & Authorization** - User, Role, Permission, JWT, OAuth2, MFA
2. **Dashboard** - Role-based dashboards with real-time updates
3. **Taxpayer Management** - Registration, profile, documents (MinIO)
4. **Return Filing** - Tax return lifecycle, schedules, line items
5. **Estimation Case Management** - Income estimation for non-filers
6. **Estimated Daily Income Assessment** - Assessment from estimates
7. **Presumptive Tax Determination** - Simplified tax for small businesses
8. **E-Invoice Integration** - Invoice receipt and validation
9. **Cross Match Engine** - Buyer-seller matching, discrepancy detection
10. **Fraud Investigation** - Risk scoring, investigation workflow
11. **Manual Receipt Registration** - Manual entry and batch upload
12. **Due Date Extension Management** - Extension requests and approvals
13. **Government Bulk Extensions** - Mass extensions for emergencies
14. **VAT Refund Management** - Refund requests and processing
15. **Refund Approval Workflow** - Multi-level approval chain
16. **Notification Module** - Multi-channel (Email, SMS, In-App, Portal)
17. **Audit and Reporting** - Comprehensive audit trail, Elasticsearch search

## How to Implement Each Module

Each business module follows this structure:

### Domain Layer (`domain/{module}/`)
```java
// 1. Aggregate Root
public class ModuleAggregate extends AggregateRoot {
    @Getter private UUID id;
    // fields, validation logic, business methods
    
    // Constructor
    private ModuleAggregate(...) {
        this.id = UUID.randomUUID();
        registerEvent(new ModuleCreatedEvent(...));
    }
    
    // Factory method
    public static ModuleAggregate create(...) {
        validate(...);
        return new ModuleAggregate(...);
    }
    
    // Business methods
    public void performAction(...) {
        validateStateTransition(...);
        // update state
        registerEvent(new ModuleActionPerformedEvent(...));
    }
}

// 2. Value Objects (enums, records)
public enum ModuleStatus { ... }

// 3. Domain Events (Java records)
public record ModuleCreatedEvent(UUID eventId, Instant occurredAt, UUID aggregateId, ...) 
    implements DomainEvent {
}

// 4. Domain Services (cross-aggregate logic)
@Service
public class ModuleDomainService {
    public SomeResult performComplexLogic(...) {
        // cross-aggregate business logic
    }
}
```

### Application Layer (`application/{module}/`)
```java
// 1. Command
public record CreateModuleCommand(String param1, String param2, ...) {}

// 2. Query
public record FindModuleByIdQuery(UUID id) {}

// 3. Command Handler
@Service
@RequiredArgsConstructor
@Slf4j
public class CreateModuleHandler {
    private final ModuleRepositoryPort repository;
    private final EventPublisherPort eventPublisher;
    
    @Transactional
    public ModuleResponse handle(CreateModuleCommand command) {
        ModuleAggregate aggregate = ModuleAggregate.create(...);
        ModuleAggregate saved = repository.save(aggregate);
        eventPublisher.publish(saved.pullEvents());
        return ModuleResponse.from(saved);
    }
}

// 4. Query Handler
@Service
@RequiredArgsConstructor
public class FindModuleByIdQueryHandler {
    private final ModuleRepositoryPort repository;
    
    @Transactional(readOnly = true)
    public ModuleResponse handle(FindModuleByIdQuery query) {
        ModuleAggregate aggregate = repository.findById(query.id())
            .orElseThrow(() -> new ResourceNotFoundException("Module not found: " + query.id()));
        return ModuleResponse.from(aggregate);
    }
}

// 5. Port Interface
public interface ModuleRepositoryPort {
    ModuleAggregate save(ModuleAggregate aggregate);
    Optional<ModuleAggregate> findById(UUID id);
    List<ModuleAggregate> findAll();
}
```

### Persistence Layer (`persistence/{module}/`)
```java
// 1. JPA Entity
@Entity
@Table(name = "module_table")
@Getter @Setter @NoArgsConstructor
public class ModuleJpaEntity {
    @Id private UUID id;
    @Column(name = "field1") private String field1;
    @Version private Long version;  // Optimistic locking
    private Instant createdAt;
    private Instant updatedAt;
}

// 2. Spring Data Repository
public interface ModuleJpaRepository extends JpaRepository<ModuleJpaEntity, UUID> {
    // Custom queries
    List<ModuleJpaEntity> findByStatus(String status);
}

// 3. Persistence Adapter (implements Port)
@Component
@RequiredArgsConstructor
public class ModulePersistenceAdapter implements ModuleRepositoryPort {
    private final ModuleJpaRepository jpaRepository;
    private final ModuleMapper mapper;
    
    @Override
    public ModuleAggregate save(ModuleAggregate aggregate) {
        ModuleJpaEntity entity = mapper.toEntity(aggregate);
        ModuleJpaEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public Optional<ModuleAggregate> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
}
```

### API Layer (`api/controller/{module}/`)
```java
@RestController
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
@Validated
public class ModuleController {
    private final CreateModuleHandler createHandler;
    private final FindModuleByIdQueryHandler findByIdHandler;
    
    @PostMapping
    public ResponseEntity<ModuleResponse> create(@Valid @RequestBody CreateModuleRequest request) {
        CreateModuleCommand command = new CreateModuleCommand(request.param1(), request.param2());
        ModuleResponse response = createHandler.handle(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ModuleResponse> findById(@PathVariable UUID id) {
        FindModuleByIdQuery query = new FindModuleByIdQuery(id);
        ModuleResponse response = findByIdHandler.handle(query);
        return ResponseEntity.ok(response);
    }
}
```

### Database Migration (`src/main/resources/db/migration/`)
```sql
-- V{number}__{description}.sql
-- Example: V2__authentication_module.sql

CREATE TABLE IF NOT EXISTS module_table (
    id UUID PRIMARY KEY,
    field1 VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_module_table_status ON module_table(status);
CREATE INDEX idx_module_table_created_at ON module_table(created_at);
```

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.3.0 |
| Database | PostgreSQL | 16+ |
| Message Broker | Apache Kafka | Latest |
| Cache | Redis | Latest |
| Object Storage | MinIO | Latest |
| Search | Elasticsearch | Latest |
| Auth | Keycloak | 24.0.1 |
| JWT | JJWT | 0.12.5 |
| Migrations | Flyway | Latest |
| Mapping | MapStruct | 1.5.5 |
| Boilerplate | Lombok | 1.18.46 |
| Resilience | Resilience4j | 2.1.0 |
| API Docs | Springdoc OpenAPI | 2.0.4 |
| Testing | JUnit 5, Testcontainers | Latest |
| Observability | Prometheus, Micrometer | Latest |

## Development Workflow

### 1. Prerequisites
```bash
# Install Java 21
java -version  # Should show 21.x

# Install Maven
mvn -version

# Start infrastructure (Docker)
docker-compose up -d  # PostgreSQL, Kafka, Redis, MinIO, Elasticsearch, Keycloak
```

### 2. Build
```bash
cd backend
mvn clean install
```

### 3. Run
```bash
mvn spring-boot:run
```

### 4. Access
- **API**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **Actuator**: http://localhost:8080/api/v1/actuator
- **Prometheus**: http://localhost:8080/api/v1/actuator/prometheus

## Testing Strategy

### 1. Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class CreateModuleHandlerTest {
    @Mock private ModuleRepositoryPort repository;
    @Mock private EventPublisherPort eventPublisher;
    @InjectMocks private CreateModuleHandler handler;
    
    @Test
    void shouldCreateModule() {
        // Given
        CreateModuleCommand command = new CreateModuleCommand(...);
        
        // When
        ModuleResponse response = handler.handle(command);
        
        // Then
        assertThat(response.id()).isNotNull();
        verify(repository).save(any());
        verify(eventPublisher).publish(anyList());
    }
}
```

### 2. Integration Tests (Testcontainers)
```java
@SpringBootTest
@Testcontainers
class ModuleIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
    
    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:latest"));
    
    @Autowired private ModuleController controller;
    
    @Test
    void shouldCreateAndRetrieveModule() {
        // End-to-end test
    }
}
```

### 3. Architecture Tests (ArchUnit)
```java
@AnalyzeClasses(packages = "com.act.itas")
class ArchitectureTest {
    @ArchTest
    static final ArchRule controllers_should_not_depend_on_persistence =
        noClasses().that().resideInAPackage("..api..")
            .should().dependOnClassesThat().resideInAPackage("..persistence..");
    
    @ArchTest
    static final ArchRule domain_should_not_depend_on_infrastructure =
        noClasses().that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAnyPackage("..persistence..", "..engineadapter..");
}
```

## Security Implementation

### JWT Authentication
1. User logs in → Receives JWT access token + refresh token
2. Access token valid for 1 hour
3. Refresh token valid for 7 days
4. Tokens stored in Redis for session tracking
5. MFA support for sensitive operations

### Role-Based Access Control (RBAC)
```java
@PreAuthorize("hasRole('TAX_OFFICER')")
@PostMapping("/approve")
public ResponseEntity<Void> approve(@PathVariable UUID id) {
    // Only TAX_OFFICER can approve
}

@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SYSTEM_ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable UUID id) {
    // Only admins can delete
}
```

### Roles in System
- `SUPER_ADMIN` - Full system access
- `SYSTEM_ADMIN` - Configuration management
- `TAXPAYER` - Filing and payment operations
- `TAX_AGENT` - File on behalf of clients
- `TAX_OFFICER` - Review and assess
- `APPROVING_OFFICER` - Approve assessments
- `COMPLIANCE_OFFICER` - Compliance enforcement
- `AUDIT_OFFICER` - Audit taxpayers
- `RISK_ANALYST` - Risk analysis
- `REFUND_OFFICER` - Process refunds
- `REFUND_TEAM_LEADER` - Approve refunds
- `INVESTIGATION_OFFICER` - Fraud investigation

## Event-Driven Flow

```
1. User Action
   ↓
2. Controller receives request
   ↓
3. Handler executes command/query
   ↓
4. Aggregate performs business logic
   ↓
5. Aggregate registers domain event
   ↓
6. Repository saves aggregate
   ↓
7. Handler pulls events from aggregate
   ↓
8. EventPublisher publishes to Kafka
   ↓
9. Kafka consumers receive event
   ↓
10. WebSocket pushes to dashboard (real-time)
    ↓
11. Email/SMS sent (async)
    ↓
12. Audit log created
```

## Dashboard Real-Time Updates

### WebSocket STOMP
```javascript
// Frontend subscribes to user-specific topic
stompClient.subscribe('/user/queue/dashboard', (message) => {
    updateDashboard(JSON.parse(message.body));
});
```

### Backend pushes updates
```java
@Service
@RequiredArgsConstructor
public class DashboardNotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    
    @EventListener
    public void onTaxReturnSubmitted(ReturnSubmittedEvent event) {
        DashboardUpdate update = buildUpdate(event);
        messagingTemplate.convertAndSendToUser(
            event.actorId(), 
            "/queue/dashboard", 
            update
        );
    }
}
```

## Observability

### Metrics (Prometheus)
- HTTP request duration
- Database connection pool stats
- Kafka producer/consumer metrics
- Circuit breaker states
- Custom business metrics

### Logging (Structured JSON)
```json
{
  "timestamp": "2026-06-16T10:30:45.123Z",
  "level": "INFO",
  "logger": "com.act.itas.application.authentication.LoginHandler",
  "message": "User logged in successfully",
  "traceId": "abc123",
  "correlationId": "xyz789",
  "actorId": "user@example.com",
  "duration": 245
}
```

### Audit Trail
Every use case execution is logged via `AuditInterceptor`:
- Who performed the action
- What action was performed
- When it was performed
- How long it took
- Success or failure

## Next Steps

1. **Implement Authentication Module** (Phase 2) - This will serve as the reference for all other modules
2. **Create Database Migrations** for authentication tables
3. **Build Dashboard Module** (Phase 3) - Real-time updates foundation
4. **Implement remaining business modules** (Phases 4-18) following the authentication pattern
5. **Integration Testing** with full stack (PostgreSQL, Kafka, Redis, MinIO, Elasticsearch)
6. **Performance Testing** and optimization
7. **Security Audit** and penetration testing
8. **Documentation** and deployment guide

## Resources

- **bs-filing-core-server**: Reference architecture in `../bs-filing-core-server/`
- **Architecture**: `ARCHITECTURE.md`
- **Implementation Plan**: `IMPLEMENTATION_PLAN.md`
- **Spring Boot Docs**: https://docs.spring.io/spring-boot/docs/3.3.0/reference/html/
- **DDD Reference**: Eric Evans' "Domain-Driven Design"
- **Hexagonal Architecture**: Alistair Cockburn's ports and adapters

## License

Internal Government Project - All Rights Reserved

## Contact

For questions or support, contact the development team.
