# ITAS - Ethiopian Tax Administration System

**Enterprise-grade tax administration platform for the Ethiopian Ministry of Revenue**

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## 🏛️ Overview

ITAS is a comprehensive tax administration system providing:

- **Taxpayer Management** - Registration, profiling, compliance tracking
- **Return Filing** - VAT, income tax, daily and presumptive tax returns
- **Refund Processing** - Green/Red channel VAT refund workflow
- **Fraud Investigation** - Case management with evidence tracking
- **Estimation Cases** - Daily income estimation for small businesses
- **E-Invoice Integration** - Real-time invoice ingestion and validation
- **Cross-Match Engine** - Data reconciliation and discrepancy detection
- **Extension Management** - Due date and penalty waiver requests
- **Real-Time Notifications** - WebSocket-based live updates
- **Comprehensive Audit Trail** - Full activity logging and reporting

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                     │
│  TanStack Router • TanStack Query • Redux • WebSocket      │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/REST + WebSocket
┌────────────────▼────────────────────────────────────────────┐
│               Backend (Spring Boot 3.3)                     │
│  Hexagonal Architecture • DDD • CQRS • Event-Driven        │
└────┬────────┬────────┬────────┬────────┬────────┬──────────┘
     │        │        │        │        │        │
     ▼        ▼        ▼        ▼        ▼        ▼
  ┌────┐  ┌─────┐  ┌──────┐ ┌─────┐  ┌────┐  ┌──────┐
  │ PG │  │Redis│  │Kafka │ │MinIO│  │ ES │  │Keyclk│
  └────┘  └─────┘  └──────┘ └─────┘  └────┘  └──────┘
```

### Backend Architecture (Hexagonal)
```
module/
├── domain/              # Business Logic (Pure Java)
│   ├── model/           # Aggregates, Entities, Value Objects
│   ├── event/           # Domain Events
│   ├── repository/      # Repository Interfaces (Ports)
│   └── service/         # Domain Services
├── application/         # Use Cases (CQRS)
│   ├── command/         # Write Operations
│   ├── query/           # Read Operations
│   ├── dto/             # Data Transfer Objects
│   └── service/         # Application Services
├── infrastructure/      # Technical Implementation
│   ├── persistence/     # JPA Repositories
│   ├── messaging/       # Kafka Integration
│   └── cache/           # Redis Caching
└── adapter/             # External Interfaces
    ├── rest/            # REST Controllers
    └── event/           # Event Listeners
```


---

## 🚀 Quick Start

### Prerequisites
- **Java 21** (Eclipse Temurin or Oracle JDK)
- **Maven 3.9+**
- **Node.js 20+**
- **Docker** & **Docker Compose**
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/ethiopian-mor/itas-pro.git
cd itas-pro
```

### 2. Start Infrastructure
```bash
cd itas-backend
docker-compose up -d
```

Wait for all services to be healthy (~30 seconds).

### 3. Start Backend
```bash
mvn clean install
mvn spring-boot:run
```

Backend running at: http://localhost:8080/api

### 4. Start Frontend
```bash
cd ../civiltax-engine
npm install
npm run dev
```

Frontend running at: http://localhost:3000

### 5. Login
Open http://localhost:3000 and login with:

| Role | Username | Password |
|------|----------|----------|
| Taxpayer | `taxpayer` | `demo` |
| Tax Agent | `agent` | `demo` |
| Tax Officer | `officer` | `demo` |
| Approving Officer | `approver` | `demo` |
| System Admin | `admin` | `demo` |

---

## 📁 Project Structure

```
ITAS_PRO/
├── civiltax-engine/           # Frontend (React 19)
│   ├── src/
│   │   ├── features/          # 12 Business Modules
│   │   ├── routes/            # TanStack Router Pages
│   │   ├── components/        # UI Components
│   │   └── store/             # Redux State
│   └── package.json
│
├── itas-backend/              # Backend (Spring Boot 3.3)
│   ├── src/main/java/et/gov/mor/itas/
│   │   ├── shared/            # Shared Kernel
│   │   ├── auth/              # Authentication
│   │   ├── taxpayer/          # Taxpayer Module
│   │   ├── returnfiling/      # Return Filing
│   │   ├── refund/            # Refund Processing
│   │   ├── fraud/             # Fraud Investigation
│   │   ├── estimation/        # Estimation Cases
│   │   ├── extension/         # Extensions
│   │   ├── einvoice/          # E-Invoice
│   │   ├── crossmatch/        # Cross-Matching
│   │   ├── audit/             # Audit Trail
│   │   └── notification/      # Notifications
│   ├── src/main/resources/
│   │   ├── application.yml    # Configuration
│   │   └── db/migration/      # Flyway SQL Scripts
│   ├── docker-compose.yml     # Infrastructure
│   └── pom.xml                # Maven Dependencies
│
├── BACKEND_ANALYSIS.md        # Frontend Analysis
├── IMPLEMENTATION_GUIDE.md    # Development Guide
├── PROJECT_STATUS.md          # Current Status
└── README.md                  # This File
```

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest concurrent features
- **TypeScript 5.8** - Type safety
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Redux Toolkit** - Client state
- **React Hook Form + Zod** - Forms & validation
- **Tailwind CSS 4** - Styling
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **WebSocket** - Real-time updates

### Backend
- **Java 21** - LTS with Virtual Threads
- **Spring Boot 3.3** - Framework
- **Spring Security** - Authentication & Authorization
- **OAuth2 + Keycloak** - Identity Management
- **PostgreSQL 16** - Primary database
- **Flyway** - Database migrations
- **Apache Kafka** - Event streaming
- **Redis** - Caching & pub/sub
- **MinIO** - Object storage (S3-compatible)
- **Elasticsearch 8** - Search & analytics
- **MapStruct** - DTO mapping
- **Lombok** - Boilerplate reduction
- **SpringDoc OpenAPI** - API documentation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Kubernetes** - Production orchestration
- **Prometheus + Grafana** - Monitoring
- **ELK Stack** - Logging
- **GitHub Actions** - CI/CD


---

## 🔐 Security

### Authentication Flow
1. User logs in with username/password
2. Backend validates credentials
3. JWT access token + refresh token issued
4. Frontend stores tokens in localStorage
5. All requests include `Authorization: Bearer <token>`
6. Tokens expire after 15 minutes (access) / 7 days (refresh)

### Authorization (RBAC)
- **SUPER_ADMIN** - Full system access
- **SYSTEM_ADMIN** - System configuration
- **TAXPAYER** - File returns, view statements
- **TAX_AGENT** - File on behalf of taxpayers
- **TAX_OFFICER** - Process returns, review cases
- **APPROVING_OFFICER** - Approve assessments
- **COMPLIANCE_OFFICER** - Monitor compliance
- **AUDIT_OFFICER** - Conduct audits
- **RISK_ANALYST** - Risk assessment
- **REFUND_OFFICER** - Process refunds
- **REFUND_TEAM_LEADER** - Approve refunds
- **INVESTIGATION_OFFICER** - Fraud investigation

### Security Features
- ✅ JWT-based stateless authentication
- ✅ OAuth2 with Keycloak integration
- ✅ Role-based access control (RBAC)
- ✅ Method-level security (@PreAuthorize)
- ✅ CORS configuration
- ✅ CSRF protection
- ✅ SQL injection prevention (JPA)
- ✅ XSS protection (React built-in)
- ✅ Password hashing (BCrypt)
- ✅ Secure file uploads
- ✅ Audit logging of all actions

---

## 📊 Database Design

### Principles
- **UUID Primary Keys** for distributed systems
- **Audit Fields** on all tables (created_at, created_by, updated_at, updated_by)
- **Soft Delete** (deleted_at, deleted_by) - data never truly deleted
- **Optimistic Locking** (version column) - prevents concurrent update conflicts
- **JSONB columns** for flexible schemas
- **Partitioning** for large tables (audit, invoices)
- **Strategic Indexes** on foreign keys and search fields

### Key Tables
- `taxpayers` - Master taxpayer registry
- `tax_returns` - Tax return records with history
- `refund_claims` - VAT refund requests
- `fraud_cases` - Fraud investigation cases
- `estimation_cases` - Income estimation workflows
- `extension_requests` - Due date extensions
- `einvoices` - Electronic invoices
- `discrepancies` - Cross-match findings
- `audit_entries` - Complete audit trail
- `notifications` - User notifications

---

## ⚡ Real-Time Features

### WebSocket Channels
```
/topic/dashboard        # Dashboard statistics
/topic/notifications    # User notifications
/topic/returns          # Return filing events
/topic/refunds          # Refund status updates
/topic/fraud            # Fraud case updates
/topic/extensions       # Extension decisions
```

### Event Flow
```
User Action (e.g., Submit Return)
  ↓
Domain Event Created (ReturnSubmittedEvent)
  ↓
Event Persisted to Database
  ↓
Kafka Event Published
  ↓
Event Listeners Triggered
  ↓
WebSocket Message Broadcast
  ↓
Frontend Auto-Updates (No Refresh!)
```

### Kafka Topics
- `taxpayer-events` - Taxpayer lifecycle events
- `return-events` - Return filing events
- `refund-events` - Refund workflow events
- `fraud-events` - Fraud investigation events
- `estimation-events` - Estimation case events
- `extension-events` - Extension request events
- `einvoice-events` - Invoice ingestion events
- `crossmatch-events` - Discrepancy detection events
- `notification-events` - Notification delivery events
- `audit-events` - Audit trail events
- `dashboard-events` - Dashboard update events

---

## 📚 API Documentation

### Swagger UI
Once the backend is running, access interactive API documentation at:

**http://localhost:8080/api/swagger-ui.html**

### Sample Endpoints

#### Authentication
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "taxpayer",
  "password": "demo"
}

Response:
{
  "user": {
    "id": "uuid",
    "username": "taxpayer",
    "fullName": "John Taxpayer",
    "email": "john@example.com",
    "tin": "TIN001",
    "roles": ["TAXPAYER"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

#### List Taxpayers
```http
GET /api/v1/taxpayers?segment=LARGE&status=ACTIVE
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "tin": "TIN001",
    "name": "ABC Corporation",
    "kind": "COMPANY",
    "segment": "LARGE",
    "status": "ACTIVE",
    ...
  }
]
```

#### Submit Tax Return
```http
PUT /api/v1/returns/{id}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "actor": "taxpayer"
}

Response: 204 No Content
```

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests only
mvn test

# Unit + Integration tests
mvn verify

# With coverage report
mvn clean test jacoco:report
```

### Test Coverage
Target: **80%+**

View coverage report: `target/site/jacoco/index.html`

### Test Types
- **Unit Tests** - Business logic, domain models
- **Integration Tests** - Database, Kafka, Redis (with Testcontainers)
- **Contract Tests** - API contracts
- **E2E Tests** - Full user workflows

---

## 🚢 Deployment

### Local Development
```bash
./start-dev.sh
```

### Docker Production Build
```bash
docker build -t itas-backend:1.0.0 .
docker run -p 8080:8080 itas-backend:1.0.0
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

---

## 📈 Monitoring

### Health Check
```http
GET /api/actuator/health
```

### Metrics
```http
GET /api/actuator/metrics
GET /api/actuator/prometheus
```

### Grafana Dashboards
- Application Performance
- Database Metrics
- Kafka Throughput
- Cache Hit Rates
- Error Rates

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📄 License

**Proprietary** - Ethiopian Ministry of Revenue

All rights reserved. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

- **Email:** support@mor.gov.et
- **Documentation:** https://docs.itas.gov.et
- **Issues:** https://github.com/ethiopian-mor/itas-pro/issues

---

**Built with ❤️ for the Ethiopian Ministry of Revenue**

