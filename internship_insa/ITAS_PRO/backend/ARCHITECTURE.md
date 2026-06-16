# ITAS Backend Architecture

## Overview
Complete Integrated Tax Administration System backend following bs-filing-core-server architecture patterns.

## Package Structure

```
com.act.itas/
├── ItasApplication.java                        # Main Spring Boot application
│
├── api/                                         # REST Controllers & DTOs
│   ├── controller/
│   │   ├── authentication/                      # Auth & Session Management
│   │   ├── taxpayer/                            # Taxpayer CRUD & Management
│   │   ├── returnfiling/                        # Return Filing Operations
│   │   ├── estimation/                          # Income Estimation
│   │   ├── assessment/                          # Assessment Operations
│   │   ├── presumptive/                         # Presumptive Tax
│   │   ├── invoice/                             # E-Invoice Integration
│   │   ├── crossmatch/                          # Cross-Match Engine
│   │   ├── fraud/                               # Fraud Investigation
│   │   ├── manual/                              # Manual Receipt Registration
│   │   ├── extension/                           # Extension Management
│   │   ├── refund/                              # Refund Operations
│   │   ├── notification/                        # Notification Management
│   │   ├── audit/                               # Audit & Reporting
│   │   └── dashboard/                           # Role-Based Dashboards
│   ├── dto/
│   │   ├── request/                             # All request DTOs
│   │   └── response/                            # All response DTOs
│   ├── advice/
│   │   └── GlobalExceptionHandler.java          # RFC 7807 Error Handler
│   ├── mapper/                                  # DTO ↔ Domain Mappers (MapStruct)
│   └── websocket/                               # WebSocket STOMP Controllers
│
├── application/                                 # Use Cases & Orchestration
│   ├── command/                                 # CQRS Commands
│   │   ├── authentication/
│   │   ├── taxpayer/
│   │   ├── returnfiling/
│   │   ├── estimation/
│   │   ├── assessment/
│   │   ├── presumptive/
│   │   ├── invoice/
│   │   ├── crossmatch/
│   │   ├── fraud/
│   │   ├── manual/
│   │   ├── extension/
│   │   ├── refund/
│   │   ├── notification/
│   │   └── audit/
│   ├── query/                                   # CQRS Queries
│   │   ├── authentication/
│   │   ├── taxpayer/
│   │   ├── returnfiling/
│   │   ├── dashboard/
│   │   └── audit/
│   ├── handler/                                 # Command/Query Handlers
│   ├── service/                                 # Application Services (orchestration)
│   ├── dto/                                     # Internal DTOs (not exposed via API)
│   ├── port/                                    # Hexagonal Port Interfaces
│   │   ├── repository/                          # Repository Ports
│   │   ├── messaging/                           # Kafka Ports
│   │   └── external/                            # External System Ports
│   └── event/                                   # Event Handlers & Publishers
│       ├── handler/
│       └── SpringEventPublisherAdapter.java
│
├── domain/                                      # Business Logic (DDD)
│   ├── authentication/
│   │   ├── aggregate/
│   │   │   ├── User.java                        # User Aggregate Root
│   │   │   ├── Role.java                        # Role Aggregate Root
│   │   │   ├── RefreshToken.java                # Refresh Token Aggregate
│   │   │   └── LoginSession.java                # Login Session Aggregate
│   │   ├── entity/
│   │   │   └── Permission.java                  # Permission Entity
│   │   ├── valueobject/
│   │   │   ├── UserStatus.java
│   │   │   ├── RoleType.java
│   │   │   └── AuthenticationMethod.java
│   │   ├── service/
│   │   │   ├── PasswordHashingService.java
│   │   │   ├── JwtTokenService.java
│   │   │   └── MfaService.java
│   │   └── event/
│   │       ├── UserRegisteredEvent.java
│   │       ├── UserLoggedInEvent.java
│   │       └── PasswordChangedEvent.java
│   │
│   ├── taxpayer/                                # Taxpayer Management
│   │   ├── aggregate/
│   │   │   └── Taxpayer.java
│   │   ├── entity/
│   │   │   ├── TaxpayerAddress.java
│   │   │   └── TaxpayerDocument.java
│   │   ├── valueobject/
│   │   │   ├── TIN.java
│   │   │   ├── TaxpayerType.java
│   │   │   └── TaxpayerStatus.java
│   │   └── event/
│   │       ├── TaxpayerRegisteredEvent.java
│   │       └── TaxpayerUpdatedEvent.java
│   │
│   ├── returnfiling/                            # Tax Return Filing
│   │   ├── aggregate/
│   │   │   ├── TaxReturn.java
│   │   │   └── ReturnPeriod.java
│   │   ├── entity/
│   │   │   ├── ReturnSchedule.java
│   │   │   └── ReturnLineItem.java
│   │   ├── valueobject/
│   │   │   ├── ReturnStatus.java
│   │   │   ├── ReturnType.java
│   │   │   └── FilingMethod.java
│   │   ├── service/
│   │   │   └── ReturnCalculationService.java
│   │   └── event/
│   │       ├── ReturnSubmittedEvent.java
│   │       └── ReturnApprovedEvent.java
│   │
│   ├── estimation/                              # Income Estimation
│   │   ├── aggregate/
│   │   │   ├── EstimationCase.java
│   │   │   └── DailyIncomeEstimate.java
│   │   ├── valueobject/
│   │   │   ├── EstimationMethod.java
│   │   │   └── EstimationStatus.java
│   │   └── event/
│   │       ├── EstimationCaseCreatedEvent.java
│   │       └── EstimationCompletedEvent.java
│   │
│   ├── assessment/                              # Tax Assessment
│   │   ├── aggregate/
│   │   │   └── Assessment.java
│   │   ├── valueobject/
│   │   │   ├── AssessmentType.java
│   │   │   └── AssessmentStatus.java
│   │   └── event/
│   │       └── AssessmentIssuedEvent.java
│   │
│   ├── presumptive/                             # Presumptive Tax
│   │   ├── aggregate/
│   │   │   └── PresumptiveTaxDetermination.java
│   │   ├── valueobject/
│   │   │   └── PresumptiveTaxCategory.java
│   │   └── event/
│   │       └── PresumptiveTaxDeterminedEvent.java
│   │
│   ├── invoice/                                 # E-Invoice
│   │   ├── aggregate/
│   │   │   └── EInvoice.java
│   │   ├── valueobject/
│   │   │   ├── InvoiceType.java
│   │   │   └── InvoiceStatus.java
│   │   └── event/
│   │       └── InvoiceReceivedEvent.java
│   │
│   ├── crossmatch/                              # Cross-Match Engine
│   │   ├── aggregate/
│   │   │   └── CrossMatchCase.java
│   │   ├── valueobject/
│   │   │   ├── MatchType.java
│   │   │   └── MatchStatus.java
│   │   └── event/
│   │       └── CrossMatchCompletedEvent.java
│   │
│   ├── fraud/                                   # Fraud Investigation
│   │   ├── aggregate/
│   │   │   └── FraudCase.java
│   │   ├── valueobject/
│   │   │   ├── FraudIndicator.java
│   │   │   └── InvestigationStatus.java
│   │   └── event/
│   │       ├── FraudCaseCreatedEvent.java
│   │       └── FraudConfirmedEvent.java
│   │
│   ├── manual/                                  # Manual Receipt Registration
│   │   ├── aggregate/
│   │   │   └── ManualReceipt.java
│   │   ├── valueobject/
│   │   │   └── ReceiptType.java
│   │   └── event/
│   │       └── ReceiptRegisteredEvent.java
│   │
│   ├── extension/                               # Extension Management
│   │   ├── aggregate/
│   │   │   ├── ExtensionRequest.java
│   │   │   └── BulkExtension.java
│   │   ├── valueobject/
│   │   │   ├── ExtensionReason.java
│   │   │   └── ExtensionStatus.java
│   │   └── event/
│   │       ├── ExtensionRequestedEvent.java
│   │       └── ExtensionApprovedEvent.java
│   │
│   ├── refund/                                  # Refund Management
│   │   ├── aggregate/
│   │   │   └── RefundRequest.java
│   │   ├── valueobject/
│   │   │   ├── RefundType.java
│   │   │   └── RefundStatus.java
│   │   ├── service/
│   │   │   └── RefundApprovalWorkflowService.java
│   │   └── event/
│   │       ├── RefundRequestedEvent.java
│   │       └── RefundApprovedEvent.java
│   │
│   ├── notification/                            # Notifications
│   │   ├── aggregate/
│   │   │   └── Notification.java
│   │   ├── valueobject/
│   │   │   ├── NotificationType.java
│   │   │   ├── NotificationChannel.java
│   │   │   └── NotificationStatus.java
│   │   └── event/
│   │       └── NotificationCreatedEvent.java
│   │
│   ├── audit/                                   # Audit & Reporting
│   │   ├── aggregate/
│   │   │   └── AuditLog.java
│   │   ├── valueobject/
│   │   │   ├── AuditAction.java
│   │   │   └── AuditEntityType.java
│   │   └── event/
│   │       └── AuditLogCreatedEvent.java
│   │
│   └── shared/                                  # Shared Domain Concepts
│       ├── aggregate/
│       │   └── AggregateRoot.java               # Base Aggregate Root
│       ├── entity/
│       │   ├── BaseEntity.java
│       │   └── AuditEntity.java
│       ├── valueobject/
│       │   ├── Money.java
│       │   ├── Period.java
│       │   ├── Address.java
│       │   ├── ContactInfo.java
│       │   └── DomainEvent.java
│       └── exception/
│           ├── DomainException.java
│           └── ResourceNotFoundException.java
│
├── persistence/                                 # Data Access Layer
│   ├── entity/                                  # JPA Entities
│   │   ├── authentication/
│   │   ├── taxpayer/
│   │   ├── returnfiling/
│   │   ├── estimation/
│   │   ├── assessment/
│   │   ├── presumptive/
│   │   ├── invoice/
│   │   ├── crossmatch/
│   │   ├── fraud/
│   │   ├── manual/
│   │   ├── extension/
│   │   ├── refund/
│   │   ├── notification/
│   │   └── audit/
│   ├── repository/                              # Spring Data JPA Repositories
│   │   ├── authentication/
│   │   ├── taxpayer/
│   │   ├── returnfiling/
│   │   └── ...
│   ├── adapter/                                 # Repository Port Implementations
│   │   ├── authentication/
│   │   ├── taxpayer/
│   │   └── ...
│   └── converter/                               # JPA Converters (JSONB, etc.)
│       └── JsonbConverter.java
│
├── engineadapter/                               # External Integrations
│   ├── kafka/
│   │   ├── producer/
│   │   │   └── KafkaEventPublisher.java
│   │   └── consumer/
│   │       └── KafkaEventConsumer.java
│   ├── redis/
│   │   ├── RedisCacheAdapter.java
│   │   └── RedisPubSubAdapter.java
│   ├── minio/
│   │   └── MinioStorageAdapter.java
│   ├── elasticsearch/
│   │   └── ElasticsearchAdapter.java
│   ├── email/
│   │   └── EmailServiceAdapter.java
│   ├── sms/
│   │   └── SmsServiceAdapter.java
│   └── shared/
│       └── BaseEngineAdapter.java
│
├── config/                                      # Spring Configuration
│   ├── SecurityConfig.java                      # Spring Security + JWT
│   ├── KeycloakConfig.java                      # Keycloak Integration
│   ├── WebSocketConfig.java                     # WebSocket STOMP
│   ├── KafkaConfig.java                         # Kafka Producer/Consumer
│   ├── RedisConfig.java                         # Redis Configuration
│   ├── MinioConfig.java                         # MinIO Configuration
│   ├── ElasticsearchConfig.java                 # Elasticsearch Configuration
│   ├── MailConfig.java                          # Email Configuration
│   ├── CorsConfig.java                          # CORS Configuration
│   ├── SchedulingConfig.java                    # Scheduled Tasks
│   └── ResilienceConfig.java                    # Circuit Breakers, Retries
│
└── observability/                               # Monitoring & Audit
    ├── audit/
    │   └── AuditInterceptor.java                # AOP-based Audit
    └── filter/
        ├── MdcContextFilter.java                # MDC for Correlation IDs
        ├── ComponentVersionMdcFilter.java       # Build Info in MDC
        └── IdempotencyFilter.java               # Idempotency Key Handling
```

## Key Patterns from bs-filing-core-server

### 1. Aggregate Root Pattern
- Extends `AggregateRoot` base class
- Uses UUID for identity
- Records domain events via `registerEvent()`
- Events are pulled after save via `pullEvents()`

### 2. Domain Events
- All events are Java records
- Implement `DomainEvent` interface (eventId, occurredAt)
- Immutable and versioned
- Published after persistence (never inside aggregates)

### 3. Port/Adapter Pattern
- Application layer defines Port interfaces
- Persistence & engineadapter layers implement them
- Controllers never import from persistence/engineadapter

### 4. CQRS
- Commands in `application/command/`
- Queries in `application/query/`
- Handlers in `application/handler/`

### 5. Event-Driven Architecture
- Domain events persist to outbox
- Kafka publishes events
- WebSocket pushes real-time updates
- Redis Pub/Sub for dashboard updates

### 6. Exception Handling
- RFC 7807 ProblemDetail responses
- `GlobalExceptionHandler` with `@RestControllerAdvice`
- `DomainException`, `ResourceNotFoundException`
- `EngineAdapterException` for external failures

### 7. Observability
- `AuditInterceptor` logs all use case executions
- MDC captures correlationId, actorId, traceId
- Prometheus metrics
- Structured JSON logging (Logstash encoder)

### 8. Security
- OAuth2 + JWT + Keycloak
- Role-Based Access Control (RBAC)
- Method-level security with `@PreAuthorize`
- Session tracking via Redis

### 9. Resilience
- Circuit breakers for all external calls
- Retry with exponential backoff
- Timeout configuration per adapter

### 10. Database
- PostgreSQL with Flyway migrations
- JSONB for polymorphic data
- Optimistic locking with `@Version`
- Audit columns (createdAt, updatedAt, createdBy, updatedBy)
