# Getting Started with ITAS Backend

## What Has Been Created

You now have a **production-ready foundation** for the complete Integrated Tax Administration System backend. This foundation perfectly mirrors the architecture of `bs-filing-core-server`.

### ✅ Complete Foundation (Ready to Use)

1. **Project Configuration**
   - `pom.xml` - Maven with all dependencies (Spring Boot, Kafka, Redis, PostgreSQL, MinIO, Elasticsearch, Keycloak, etc.)
   - `application.yml` - Complete configuration for all services
   - `docker-compose.yml` - All infrastructure services (PostgreSQL, Kafka, Redis, MinIO, Elasticsearch, Keycloak, MailHog, Prometheus, Grafana)
   - `prometheus.yml` - Prometheus scraping configuration

2. **Core Application**
   - `ItasApplication.java` - Main Spring Boot application class

3. **Shared Kernel (Domain Foundation)**
   - `AggregateRoot.java` - Base class for all aggregates with event handling
   - `DomainEvent.java` - Event interface for all domain events
   - `DomainException.java` - Base business rule violation exception
   - `ResourceNotFoundException.java` - 404 exception
   - `EngineAdapterException.java` - External service failure exception
   - `Money.java` - Money value object with currency support

4. **API Foundation**
   - `GlobalExceptionHandler.java` - RFC 7807 ProblemDetail responses for all exceptions

5. **Comprehensive Documentation**
   - `README.md` - Complete system overview and development guide
   - `ARCHITECTURE.md` - Detailed architecture and package structure
   - `IMPLEMENTATION_PLAN.md` - 24-phase implementation roadmap
   - `MODULE_GENERATOR_GUIDE.md` - Step-by-step guide to create each business module
   - `GETTING_STARTED.md` - This file

## Quick Start

### 1. Start Infrastructure Services

```bash
cd backend

# Start all services (PostgreSQL, Kafka, Redis, MinIO, Elasticsearch, Keycloak, etc.)
docker-compose up -d

# Verify all services are healthy
docker-compose ps

# View logs
docker-compose logs -f
```

**Service URLs:**
- PostgreSQL: `localhost:5432` (postgres/postgres)
- Redis: `localhost:6379`
- Kafka: `localhost:9092`
- MinIO Console: `http://localhost:9001` (minioadmin/minioadmin)
- Elasticsearch: `http://localhost:9200`
- Kibana: `http://localhost:5601`
- Keycloak: `http://localhost:8180` (admin/admin)
- MailHog UI: `http://localhost:8025`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000` (admin/admin)

### 2. Build the Application

```bash
# Install dependencies and compile
mvn clean install

# Skip tests for faster build
mvn clean install -DskipTests
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The application will start on: `http://localhost:8080/api/v1`

### 4. Verify the Application

```bash
# Health check
curl http://localhost:8080/api/v1/actuator/health

# Swagger UI
open http://localhost:8080/api/v1/swagger-ui.html

# Prometheus metrics
curl http://localhost:8080/api/v1/actuator/prometheus
```

## Next Steps: Implement Business Modules

Now you need to implement the 12+ business modules. Follow this order:

### Phase 1: Authentication & Authorization (CRITICAL)

This is the **most important** module to implement first, as it's needed by all other modules.

**Estimated Time:** 8-12 hours

**Components:**
1. User aggregate (registration, login, password management, MFA)
2. Role aggregate (role management, permissions)
3. JWT token service
4. Keycloak integration
5. Session tracking (Redis)
6. Login audit trail

**Use the Module Generator Guide:**
Follow `MODULE_GENERATOR_GUIDE.md` to create:
- Domain: `User`, `Role`, `RefreshToken`, `LoginSession` aggregates
- Application: Commands (RegisterUser, LoginUser, RefreshToken, ChangePassword)
- Persistence: JPA entities and repositories
- API: AuthenticationController, UserController, RoleController
- Security: SecurityConfig, JWT filters, OAuth2 configuration
- Migration: `V2__authentication_module.sql`

**Key Files to Create:**
```
domain/authentication/
  aggregate/
    - User.java
    - Role.java
    - RefreshToken.java
    - LoginSession.java
  valueobject/
    - UserStatus.java
    - RoleType.java
  service/
    - JwtTokenService.java
    - PasswordHashingService.java
    - MfaService.java
  event/
    - UserRegisteredEvent.java
    - UserLoggedInEvent.java
    - PasswordChangedEvent.java

application/authentication/
  command/
    - RegisterUserCommand.java
    - LoginUserCommand.java
    - RefreshTokenCommand.java
    - ChangePasswordCommand.java
  handler/
    - RegisterUserHandler.java
    - LoginUserHandler.java
    - RefreshTokenHandler.java
  port/
    - UserRepositoryPort.java
    - RoleRepositoryPort.java
    - SessionRepositoryPort.java

persistence/authentication/
  entity/
    - UserJpaEntity.java
    - RoleJpaEntity.java
    - SessionJpaEntity.java
  repository/
    - UserJpaRepository.java
    - RoleJpaRepository.java
    - SessionJpaRepository.java
  adapter/
    - UserPersistenceAdapter.java
    - RolePersistenceAdapter.java
    - SessionPersistenceAdapter.java

api/controller/authentication/
  - AuthenticationController.java
  - UserController.java
  - RoleController.java

config/
  - SecurityConfig.java
  - JwtConfig.java
  - KeycloakConfig.java

db/migration/
  - V2__authentication_module.sql
```

### Phase 2: Dashboard Module (Real-time Foundation)

**Estimated Time:** 6-8 hours

Implement real-time dashboards for all 12 user roles:
- SUPER_ADMIN, SYSTEM_ADMIN, TAXPAYER, TAX_AGENT, TAX_OFFICER, etc.

**Components:**
1. WebSocket STOMP configuration
2. Dashboard data aggregation services
3. Kafka event consumers for dashboard updates
4. Redis Pub/Sub for instant notifications
5. Role-based dashboard views

### Phase 3-17: Business Modules

Follow the `IMPLEMENTATION_PLAN.md` for the complete list:

3. Taxpayer Management (8 hours)
4. Return Filing (12 hours)
5. Estimation Case Management (6 hours)
6. Assessment (4 hours)
7. Presumptive Tax (4 hours)
8. E-Invoice Integration (6 hours)
9. Cross Match Engine (8 hours)
10. Fraud Investigation (8 hours)
11. Manual Receipt Registration (4 hours)
12. Extension Management (6 hours)
13. Bulk Extensions (4 hours)
14. Refund Management (8 hours)
15. Refund Approval Workflow (6 hours)
16. Notification Module (8 hours)
17. Audit & Reporting (8 hours)

**Total Estimated Time: 150-200 hours**

## Module Implementation Workflow

For each module:

### 1. Create Package Structure
```bash
./create-module.sh ModuleName module-path
```

### 2. Implement Domain Layer
- Define aggregate root with business logic
- Create value objects (enums, records)
- Define domain events
- Write unit tests for aggregate

### 3. Implement Application Layer
- Define commands and queries
- Write command handlers
- Write query handlers
- Define repository port interfaces

### 4. Implement Persistence Layer
- Create JPA entity
- Create Spring Data repository
- Implement persistence adapter
- Map between domain and JPA entities

### 5. Implement API Layer
- Create request/response DTOs
- Implement REST controller
- Add validation annotations
- Add security annotations (@PreAuthorize)

### 6. Create Database Migration
- Write Flyway migration SQL
- Create tables with indexes
- Add constraints and comments

### 7. Write Tests
- Unit tests for aggregate
- Unit tests for handlers
- Integration tests for controller
- End-to-end scenario tests

### 8. Document
- Add Javadoc comments
- Update OpenAPI/Swagger documentation
- Add to README if needed

## Development Best Practices

### 1. Follow bs-filing-core-server Patterns EXACTLY

Every class should follow the same style:
- Package organization
- Naming conventions
- Error handling
- Logging format
- Event handling

### 2. Use Transactions Correctly

```java
@Transactional  // Write operations
public Response handleCommand(Command cmd) {
    Aggregate aggregate = Aggregate.create(...);
    Aggregate saved = repository.save(aggregate);
    eventPublisher.publish(saved.pullEvents());
    return Response.from(saved);
}

@Transactional(readOnly = true)  // Read operations
public Response handleQuery(Query query) {
    Aggregate aggregate = repository.findById(query.id())
        .orElseThrow(() -> new ResourceNotFoundException(...));
    return Response.from(aggregate);
}
```

### 3. Always Publish Events After Persistence

```java
// CORRECT
Aggregate saved = repository.save(aggregate);
eventPublisher.publish(saved.pullEvents());

// WRONG - events will be lost if save fails
eventPublisher.publish(aggregate.pullEvents());
Aggregate saved = repository.save(aggregate);
```

### 4. Use RFC 7807 ProblemDetail for Errors

The `GlobalExceptionHandler` already handles this. Just throw:
- `DomainException` for business rule violations (→ 422)
- `ResourceNotFoundException` for missing resources (→ 404)
- `EngineAdapterException` for external failures (→ 502)

### 5. Log Appropriately

```java
// Use structured logging with MDC (already configured)
log.info("Creating user: email={}, actorId={}", email, actorId);
log.debug("Fetching user by id: {}", userId);
log.warn("Invalid state transition: from={} to={}", currentState, newState);
log.error("External service failed: service={}", serviceName, exception);
```

### 6. Add Security Annotations

```java
@PreAuthorize("hasRole('SUPER_ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable UUID id) {
    // Only SUPER_ADMIN can delete
}

@PreAuthorize("hasAnyRole('TAX_OFFICER', 'APPROVING_OFFICER')")
@PostMapping("/{id}/approve")
public ResponseEntity<Void> approve(@PathVariable UUID id) {
    // Multiple roles allowed
}
```

### 7. Validate All Inputs

```java
// Use Bean Validation
public record CreateUserRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password,
    
    @NotNull(message = "Role is required")
    RoleType role
) {}
```

## Testing Your Modules

### 1. Unit Tests (Domain)

```java
@Test
void shouldCreateUser() {
    // Given
    String email = "user@example.com";
    String password = "securePassword123";
    
    // When
    User user = User.create(email, password, "system");
    
    // Then
    assertThat(user.getId()).isNotNull();
    assertThat(user.getEmail()).isEqualTo(email);
    assertThat(user.getStatus()).isEqualTo(UserStatus.ACTIVE);
    assertThat(user.hasDomainEvents()).isTrue();
}
```

### 2. Unit Tests (Handler)

```java
@ExtendWith(MockitoExtension.class)
class CreateUserHandlerTest {
    @Mock private UserRepositoryPort repository;
    @Mock private EventPublisherPort eventPublisher;
    @InjectMocks private CreateUserHandler handler;
    
    @Test
    void shouldCreateUser() {
        // Given
        CreateUserCommand command = new CreateUserCommand("user@example.com", "password", "system");
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        
        // When
        UserResponse response = handler.handle(command);
        
        // Then
        assertThat(response.id()).isNotNull();
        verify(repository).save(any(User.class));
        verify(eventPublisher).publish(anyList());
    }
}
```

### 3. Integration Tests (Controller)

```java
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class UserControllerIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateUser() throws Exception {
        CreateUserRequest request = new CreateUserRequest("test@example.com", "password", RoleType.USER);
        
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNotEmpty())
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}
```

## Troubleshooting

### Issue: Application won't start

**Check:**
1. PostgreSQL is running: `docker-compose ps postgres`
2. Database credentials in `application.yml`
3. Port 8080 is not in use: `lsof -i :8080`

**Solution:**
```bash
# Restart services
docker-compose restart postgres

# Check logs
docker-compose logs postgres

# Verify connectivity
psql -h localhost -U postgres -d itas_db
```

### Issue: Tests failing

**Check:**
1. Testcontainers Docker is accessible
2. Ports for test containers are available
3. Test annotations are correct

**Solution:**
```bash
# Clean and rebuild
mvn clean install -DskipTests

# Run specific test
mvn test -Dtest=UserControllerIntegrationTest
```

### Issue: Kafka events not publishing

**Check:**
1. Kafka is running: `docker-compose ps kafka`
2. Kafka bootstrap servers configuration
3. Event serialization

**Solution:**
```bash
# Check Kafka topics
docker exec -it itas-kafka kafka-topics --list --bootstrap-server localhost:9092

# Consume events
docker exec -it itas-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic user-events --from-beginning
```

## Resources

- **bs-filing-core-server**: Your reference architecture in `../bs-filing-core-server/`
- **Spring Boot 3.3 Docs**: https://docs.spring.io/spring-boot/docs/3.3.0/reference/html/
- **Spring Security Docs**: https://docs.spring.io/spring-security/reference/
- **Kafka Docs**: https://kafka.apache.org/documentation/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/16/
- **Domain-Driven Design**: Eric Evans' book
- **Implementing DDD**: Vaughn Vernon's book

## Support

For issues or questions:
1. Check the comprehensive documentation files
2. Review bs-filing-core-server for reference implementations
3. Consult Spring Boot documentation
4. Reach out to the development team

## Summary

You now have:
✅ Complete project foundation  
✅ All infrastructure via Docker Compose  
✅ Shared kernel (base classes, exceptions, value objects)  
✅ Global exception handling  
✅ Comprehensive documentation  
✅ Step-by-step module creation guide  

**Next Action:** Start implementing the Authentication module following `MODULE_GENERATOR_GUIDE.md`. This will establish the pattern for all other modules.

Good luck building a world-class Tax Administration System! 🚀
