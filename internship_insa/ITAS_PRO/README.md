# ITAS - Integrated Tax Administration System

## Project Overview

Complete enterprise-grade tax administration system for the Ethiopian Ministry of Revenue, consisting of a Spring Boot backend following Domain-Driven Design (DDD) and Hexagonal Architecture patterns.

## Repository Structure

```
ITAS_PRO/
├── backend/                    # Spring Boot backend (Java 21)
│   ├── src/                   # Source code
│   ├── pom.xml                # Maven configuration
│   ├── README.md              # Complete backend documentation
│   └── ...                    # Documentation and configuration files
│
├── bs-filing-core-server/     # Reference architecture
│   └── ...                    # Filing service reference implementation
│
└── civiltax-engine/           # Tax calculation engine
    └── ...                    # Node.js calculation service
```

## Backend Architecture

The backend follows the **exact patterns** of `bs-filing-core-server`:

- **Framework**: Spring Boot 3.3.0
- **Language**: Java 21
- **Architecture**: DDD + CQRS + Event-Driven + Hexagonal
- **Database**: H2 (development) / PostgreSQL (production)
- **Build Tool**: Maven

### Package Structure

```
com.act.itas/
├── api/                    # REST Controllers & DTOs
├── application/            # Commands, Queries, Handlers, Ports
├── domain/                 # Aggregates, Value Objects, Events
├── persistence/            # JPA Entities, Repositories, Adapters
├── engineadapter/          # External System Integrations
├── config/                 # Spring Configuration
└── observability/          # Monitoring & Audit
```

## Quick Start

### Prerequisites

- Java 21 (JDK 21)
- Maven 3.9+
- Git

### Running the Backend

```bash
# Clone the repository
git clone <repository-url>
cd ITAS_PRO/backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api/v1`

### Access Points

- **API Base**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **H2 Console**: http://localhost:8080/api/v1/h2-console
- **Health Check**: http://localhost:8080/api/v1/actuator/health
- **Metrics**: http://localhost:8080/api/v1/actuator/prometheus

## Documentation

Comprehensive documentation is available in the `backend/` directory:

- **[README.md](backend/README.md)** - Complete system documentation (1,200+ lines)
- **[ARCHITECTURE.md](backend/ARCHITECTURE.md)** - Architecture patterns and package structure
- **[IMPLEMENTATION_PLAN.md](backend/IMPLEMENTATION_PLAN.md)** - 24-phase implementation roadmap
- **[MODULE_GENERATOR_GUIDE.md](backend/MODULE_GENERATOR_GUIDE.md)** - Step-by-step module creation guide
- **[GETTING_STARTED.md](backend/GETTING_STARTED.md)** - Quick start and best practices
- **[PROJECT_SUMMARY.md](backend/PROJECT_SUMMARY.md)** - Executive summary

## Current Status

### ✅ Completed

1. **Project Foundation**
   - Maven POM with all dependencies
   - Spring Boot application structure
   - H2 in-memory database configured
   - Application configuration (development mode)

2. **Shared Kernel** (Domain Foundation)
   - `AggregateRoot` - Base class for all aggregates
   - `DomainEvent` - Interface for domain events
   - `Money` - Money value object
   - Exception hierarchy (DomainException, ResourceNotFoundException, EngineAdapterException)

3. **API Foundation**
   - `GlobalExceptionHandler` - RFC 7807 ProblemDetail error handling

4. **Event Publishing**
   - `EventPublisherPort` - Event publisher interface
   - `SpringEventPublisherAdapter` - Spring event adapter implementation

5. **Comprehensive Documentation**
   - 10,000+ lines of documentation
   - Complete implementation guides
   - Code generation tools

### 🔄 In Progress

- Authentication & Authorization module
- Dashboard module
- Business modules (17 modules planned)

## Business Modules

The system will include 17 business modules:

1. Authentication & Authorization
2. Dashboard (12 role-based dashboards)
3. Taxpayer Management
4. Return Filing
5. Estimation Case Management
6. Estimated Daily Income Assessment
7. Presumptive Tax Determination
8. E-Invoice Integration
9. Cross Match Engine
10. Fraud Investigation
11. Manual Receipt Registration
12. Due Date Extension Management
13. Government Bulk Extensions
14. VAT Refund Management
15. Refund Approval Workflow
16. Notification Module
17. Audit and Reporting

## Development

### Creating a New Module

Use the provided module generator:

```bash
cd backend
./create-module.sh ModuleName module-path
```

Then follow the step-by-step guide in `MODULE_GENERATOR_GUIDE.md`.

### Architecture Patterns

Every module follows these patterns from `bs-filing-core-server`:

1. **Domain Layer** - Aggregates, Value Objects, Events, Domain Services
2. **Application Layer** - Commands, Queries, Handlers, Ports
3. **Persistence Layer** - JPA Entities, Repositories, Adapters
4. **API Layer** - Controllers, DTOs, Mappers

### Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=ClassNameTest

# Run with coverage
mvn verify
```

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Language | Java | 21 |
| Framework | Spring Boot | 3.3.0 |
| Build Tool | Maven | 3.9+ |
| Database (Dev) | H2 | In-memory |
| Database (Prod) | PostgreSQL | 16+ |
| Mapping | MapStruct | 1.5.5 |
| Boilerplate | Lombok | 1.18.46 |
| Resilience | Resilience4j | 2.1.0 |
| API Docs | Springdoc OpenAPI | 2.0.4 |
| Testing | JUnit 5, Testcontainers | Latest |
| Observability | Prometheus, Micrometer | Latest |

## Contributing

This is an enterprise government project. Follow these guidelines:

1. **Architecture Compliance**: All code must follow bs-filing-core-server patterns
2. **Code Quality**: Maintain test coverage above 80%
3. **Documentation**: Document all public APIs and business logic
4. **Commit Messages**: Use conventional commits (feat:, fix:, docs:, etc.)

## License

Internal Government Project - All Rights Reserved

## Contact

For questions or support, contact the development team.

---

**Status**: Foundation Complete ✅  
**Last Updated**: June 16, 2026  
**Version**: 1.0.0-SNAPSHOT
