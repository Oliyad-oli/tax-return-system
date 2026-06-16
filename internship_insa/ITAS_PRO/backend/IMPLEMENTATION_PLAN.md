# ITAS Backend Implementation Plan

## Status: Foundation Created

This document tracks the systematic implementation of the complete ITAS backend following bs-filing-core-server architecture.

## Implementation Progress

### ✅ Phase 0: Project Setup
- [x] Maven POM with all dependencies (Spring Boot 3.3, Java 21, PostgreSQL, Kafka, Redis, MinIO, Elasticsearch)
- [x] Main application class
- [x] Architecture documentation
- [x] Package structure planning

### 🔄 Phase 1: Shared Kernel (IN PROGRESS)
#### Core Domain Components
- [ ] `domain/shared/aggregate/AggregateRoot.java` - Base aggregate root with event handling
- [ ] `domain/shared/entity/BaseEntity.java` - Base entity with UUID identity
- [ ] `domain/shared/entity/AuditEntity.java` - Auditable entity with timestamps
- [ ] `domain/shared/valueobject/DomainEvent.java` - Event interface
- [ ] `domain/shared/valueobject/Money.java` - Money value object
- [ ] `domain/shared/valueobject/Period.java` - Period value object
- [ ] `domain/shared/valueobject/Address.java` - Address value object
- [ ] `domain/shared/exception/DomainException.java` - Base domain exception
- [ ] `domain/shared/exception/ResourceNotFoundException.java` - 404 exception

#### Application Layer Foundation
- [ ] `application/port/EventPublisherPort.java` - Event publishing interface
- [ ] `application/event/SpringEventPublisherAdapter.java` - Spring event adapter
- [ ] `application/service/ClockProvider.java` - Clock abstraction for testing
- [ ] `application/service/UUIDGenerator.java` - UUID generation service
- [ ] `application/service/SecurityContextProvider.java` - Current user access

#### Persistence Foundation
- [ ] `persistence/converter/JsonbConverter.java` - JSONB converter for PostgreSQL
- [ ] `persistence/entity/BaseJpaEntity.java` - Base JPA entity
- [ ] `persistence/entity/AuditableJpaEntity.java` - Auditable JPA entity

#### API Foundation
- [ ] `api/advice/GlobalExceptionHandler.java` - RFC 7807 error handling
- [ ] `api/dto/response/CommonResponse.java` - Standard response wrapper
- [ ] `api/dto/response/ProblemDetails.java` - RFC 7807 problem details

#### Observability
- [ ] `observability/audit/AuditInterceptor.java` - AOP-based audit logging
- [ ] `observability/filter/MdcContextFilter.java` - MDC for correlation IDs
- [ ] `observability/filter/ComponentVersionMdcFilter.java` - Build info in MDC
- [ ] `observability/filter/IdempotencyFilter.java` - Idempotency key handling

#### Configuration
- [ ] `config/CorsConfig.java` - CORS configuration
- [ ] `config/SchedulingConfig.java` - Scheduling configuration
- [ ] `config/ResilienceConfig.java` - Resilience4j configuration

#### Engine Adapters
- [ ] `engineadapter/shared/BaseEngineAdapter.java` - Base adapter with circuit breaker

### Phase 2: Authentication & Authorization Module
#### Domain Layer
- [ ] `domain/authentication/aggregate/User.java`
- [ ] `domain/authentication/aggregate/Role.java`
- [ ] `domain/authentication/aggregate/RefreshToken.java`
- [ ] `domain/authentication/aggregate/LoginSession.java`
- [ ] `domain/authentication/entity/Permission.java`
- [ ] `domain/authentication/valueobject/UserStatus.java`
- [ ] `domain/authentication/valueobject/RoleType.java`
- [ ] `domain/authentication/service/PasswordHashingService.java`
- [ ] `domain/authentication/service/JwtTokenService.java`
- [ ] `domain/authentication/service/MfaService.java`
- [ ] `domain/authentication/event/UserRegisteredEvent.java`
- [ ] `domain/authentication/event/UserLoggedInEvent.java`

#### Application Layer
- [ ] Commands: RegisterUser, LoginUser, RefreshToken, ChangePassword, EnableMfa
- [ ] Queries: GetUserById, GetUserByEmail, ListUsersByRole
- [ ] Handlers for all commands/queries
- [ ] Port interfaces: UserRepositoryPort, RoleRepositoryPort, SessionRepositoryPort

#### Persistence Layer
- [ ] JPA entities mapping domain aggregates
- [ ] Spring Data repositories
- [ ] Adapter implementations

#### API Layer
- [ ] AuthenticationController (login, register, refresh, logout)
- [ ] UserController (CRUD operations)
- [ ] RoleController (role management)
- [ ] DTO mappings

#### Configuration
- [ ] `config/SecurityConfig.java` - Spring Security + JWT
- [ ] `config/KeycloakConfig.java` - Keycloak integration

### Phase 3: Dashboard Module (All Roles)
- [ ] SUPER_ADMIN dashboard (system-wide metrics)
- [ ] SYSTEM_ADMIN dashboard (configuration management)
- [ ] TAXPAYER dashboard (filing status, payments, notifications)
- [ ] TAX_AGENT dashboard (client filings, pending actions)
- [ ] TAX_OFFICER dashboard (review queue, assessments)
- [ ] APPROVING_OFFICER dashboard (approval queue)
- [ ] COMPLIANCE_OFFICER dashboard (compliance cases)
- [ ] AUDIT_OFFICER dashboard (audit queue)
- [ ] RISK_ANALYST dashboard (risk indicators)
- [ ] REFUND_OFFICER dashboard (refund queue)
- [ ] REFUND_TEAM_LEADER dashboard (team workload)
- [ ] INVESTIGATION_OFFICER dashboard (investigation cases)

#### Real-time Updates
- [ ] WebSocket STOMP configuration
- [ ] Kafka event consumers for dashboard updates
- [ ] Redis Pub/Sub for live notifications
- [ ] Dashboard event aggregation service

### Phase 4: Taxpayer Management Module
- [ ] Taxpayer aggregate with registration, profile, documents
- [ ] Taxpayer registration use case
- [ ] Taxpayer search and listing
- [ ] Document upload (MinIO integration)
- [ ] Address and contact management
- [ ] TIN generation and validation

### Phase 5: Return Filing Module
- [ ] TaxReturn aggregate
- [ ] ReturnPeriod management
- [ ] Schedule and line item handling
- [ ] Calculation engine integration
- [ ] Filing submission workflow
- [ ] Amendment handling
- [ ] Certificate generation

### Phase 6: Estimation Case Management Module
- [ ] EstimationCase aggregate
- [ ] Daily income estimation
- [ ] Estimation method selection (indirect methods)
- [ ] Officer assignment and workflow
- [ ] Estimation approval

### Phase 7: Estimated Daily Income Assessment Module
- [ ] Assessment calculation based on estimation
- [ ] Assessment issuance
- [ ] Payment integration
- [ ] Appeal handling

### Phase 8: Presumptive Tax Determination Module
- [ ] PresumptiveTaxDetermination aggregate
- [ ] Category-based tax calculation
- [ ] Simplified filing for small businesses
- [ ] Presumptive tax assessment

### Phase 9: E-Invoice Integration Module
- [ ] EInvoice aggregate
- [ ] Invoice receipt from external system
- [ ] Invoice validation
- [ ] Cross-reference with returns
- [ ] Discrepancy detection

### Phase 10: Cross Match Engine Module
- [ ] CrossMatchCase aggregate
- [ ] Buyer-seller matching
- [ ] WHT vs VAT reconciliation
- [ ] Discrepancy reporting
- [ ] Resolution workflow

### Phase 11: Fraud Investigation Module
- [ ] FraudCase aggregate
- [ ] Risk scoring and indicators
- [ ] Investigation workflow
- [ ] Evidence collection
- [ ] Case resolution
- [ ] Fraud reporting

### Phase 12: Manual Receipt Registration Module
- [ ] ManualReceipt aggregate
- [ ] Receipt entry interface
- [ ] Validation and verification
- [ ] Batch upload support
- [ ] Receipt tracking

### Phase 13: Due Date Extension Management Module
- [ ] ExtensionRequest aggregate
- [ ] Request submission and tracking
- [ ] Approval workflow
- [ ] Extension granting
- [ ] Notification to taxpayer

### Phase 14: Government Bulk Extensions Module
- [ ] BulkExtension aggregate
- [ ] Mass extension for disasters/emergencies
- [ ] Criteria-based taxpayer selection
- [ ] Bulk processing
- [ ] Audit trail

### Phase 15: VAT Refund Management Module
- [ ] RefundRequest aggregate
- [ ] Refund submission
- [ ] Risk assessment
- [ ] Verification workflow
- [ ] Approval chain (multi-level)
- [ ] Payment processing
- [ ] Refund tracking

### Phase 16: Refund Approval Workflow Module
- [ ] Workflow state machine
- [ ] Approval levels configuration
- [ ] Officer assignment
- [ ] Escalation rules
- [ ] Decision recording

### Phase 17: Notification Module
- [ ] Notification aggregate
- [ ] Multi-channel delivery (Email, SMS, In-App, Portal)
- [ ] Template management
- [ ] Scheduling and batching
- [ ] Delivery tracking
- [ ] Kafka integration for event-driven notifications

### Phase 18: Audit and Reporting Module
- [ ] AuditLog aggregate
- [ ] Comprehensive audit trail
- [ ] Report generation
- [ ] Elasticsearch integration for search
- [ ] Export capabilities
- [ ] Dashboard reporting

### Phase 19: Kafka Event-Driven Integration
- [ ] Kafka producer for all domain events
- [ ] Event serialization
- [ ] Topic configuration
- [ ] Consumer groups
- [ ] Dead letter queue handling
- [ ] Event replay capabilities

### Phase 20: WebSocket Real-Time Updates
- [ ] STOMP configuration
- [ ] User-specific subscriptions
- [ ] Dashboard live updates
- [ ] Notification push
- [ ] Session management

### Phase 21: Database Schema & Migrations
- [ ] Flyway migration scripts for all modules
- [ ] V1__initial_schema.sql (shared tables)
- [ ] V2__authentication.sql
- [ ] V3__taxpayer.sql
- [ ] V4__return_filing.sql
- [ ] V5__estimation.sql
- [ ] V6__assessment.sql
- [ ] V7__presumptive.sql
- [ ] V8__invoice.sql
- [ ] V9__crossmatch.sql
- [ ] V10__fraud.sql
- [ ] V11__manual_receipt.sql
- [ ] V12__extension.sql
- [ ] V13__refund.sql
- [ ] V14__notification.sql
- [ ] V15__audit.sql
- [ ] Indexes and constraints
- [ ] JSONB columns for polymorphic data

### Phase 22: Configuration Files
- [ ] `application.yml` - Main configuration
- [ ] `application-dev.yml` - Development profile
- [ ] `application-prod.yml` - Production profile
- [ ] Kafka topics configuration
- [ ] Redis configuration
- [ ] MinIO bucket configuration
- [ ] Elasticsearch index configuration
- [ ] Email templates
- [ ] SMS gateway configuration

### Phase 23: Integration Testing
- [ ] Testcontainers setup (PostgreSQL, Kafka, Redis)
- [ ] End-to-end scenario tests
- [ ] Performance tests
- [ ] Load tests

### Phase 24: Documentation
- [ ] OpenAPI/Swagger documentation
- [ ] API usage examples
- [ ] Deployment guide
- [ ] Operations manual

## Key Architecture Decisions

### Following bs-filing-core-server Patterns:
1. **Hexagonal Architecture**: api → application → domain ← persistence/engineadapter
2. **DDD Aggregates**: Each module has clear aggregate boundaries
3. **CQRS**: Separate command and query models
4. **Event-Driven**: All state changes publish domain events
5. **Outbox Pattern**: Events persist before publishing to Kafka
6. **Port/Adapter**: Application layer defines ports, infrastructure implements
7. **No Security in Core**: Security is gateway + Keycloak (like bs-filing-core-server comment: "Intentionally absent")
8. **Resilience4j**: Circuit breakers and retries for all external calls
9. **Optimistic Locking**: `@Version` on all aggregates
10. **Audit Everything**: AOP interceptor logs all use case executions

### Technology Stack Alignment:
- Spring Boot 3.3 + Java 21 (matching bs-filing-core-server)
- PostgreSQL 16 with JSONB
- Flyway migrations
- Kafka for events
- Redis for caching and pub/sub
- MinIO for document storage
- Elasticsearch for search and analytics
- Prometheus + Micrometer for metrics
- Logstash JSON encoder for structured logging

## Estimated Lines of Code: ~150,000 LOC

## Development Time Estimate:
- With AI assistance: 40-60 hours
- Manual development: 400-600 hours

## Next Steps:
1. Complete Phase 1 (Shared Kernel)
2. Implement Phase 2 (Authentication) as reference module
3. Generate remaining modules following the authentication pattern
4. Create Flyway migrations
5. Write integration tests
6. Deploy and verify

---

**NOTE**: This system is designed to be a production-ready Government Tax Administration System.
All patterns, error handling, security, and observability are enterprise-grade following
the proven architecture of bs-filing-core-server.
