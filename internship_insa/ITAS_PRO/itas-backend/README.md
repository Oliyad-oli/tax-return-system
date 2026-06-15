# ITAS Tax Administration Backend

Enterprise-grade backend for the Ethiopian Integrated Tax Administration System.

## Architecture

### **Hexagonal Architecture (Ports & Adapters)**
```
┌────────────────────────────────────────────────────────────┐
│                       Adapter Layer                        │
│  (REST Controllers, WebSocket, Event Listeners)            │
└───────────────────┬────────────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────────────┐
│                   Application Layer                        │
│    (Commands, Queries, DTOs, Application Services)        │
└───────────────────┬────────────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────────────┐
│                     Domain Layer                           │
│  (Aggregates, Entities, Value Objects, Domain Events)     │
└───────────────────┬────────────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────────────┐
│                 Infrastructure Layer                       │
│   (JPA, Kafka, Redis, MinIO, Elasticsearch, Keycloak)    │
└────────────────────────────────────────────────────────────┘
```

### **CQRS (Command Query Responsibility Segregation)**
- **Commands**: Modify state (Create, Update, Delete)
- **Queries**: Read state (List, Get, Search)
- Separate models for read and write operations

### **Event-Driven Architecture**
- Domain events for state changes
- Kafka for event streaming
- WebSocket for real-time updates
- Redis pub/sub for dashboard updates


## Technology Stack

| Category | Technology |
|----------|-----------|
| **Language** | Java 21 (LTS with Virtual Threads) |
| **Framework** | Spring Boot 3.3.0 |
| **Security** | Spring Security + OAuth2 + Keycloak |
| **Database** | PostgreSQL 16 |
| **Migration** | Flyway |
| **Messaging** | Apache Kafka |
| **Cache** | Redis |
| **Storage** | MinIO (S3-compatible) |
| **Search** | Elasticsearch |
| **WebSocket** | Spring WebSocket + STOMP |
| **Mapping** | MapStruct |
| **Documentation** | SpringDoc OpenAPI 3 |
| **Build** | Maven |

## Module Structure

```
itas-backend/
├── shared/              # Shared kernel (BaseEntity, DomainEvent, Exceptions)
├── auth/                # Authentication & Authorization
├── taxpayer/            # Taxpayer management
├── returnfiling/        # Tax return filing
├── refund/              # VAT refund processing
├── fraud/               # Fraud investigation
├── estimation/          # Income estimation cases
├── extension/           # Due date extensions
├── einvoice/            # E-invoice integration
├── crossmatch/          # Cross-matching engine
├── audit/               # Audit trail
└── notification/        # Real-time notifications
```

Each module follows hexagonal architecture:
```
module/
├── domain/          # Pure business logic (framework-independent)
│   ├── model/       # Aggregates, Entities, Value Objects
│   ├── event/       # Domain Events
│   ├── repository/  # Repository interfaces (Ports)
│   └── service/     # Domain Services
├── application/     # Use cases (Commands & Queries)
│   ├── command/     # Commands (write operations)
│   ├── query/       # Queries (read operations)
│   ├── dto/         # Data Transfer Objects
│   ├── service/     # Application Services
│   └── mapper/      # DTO <-> Domain mapping
├── infrastructure/  # Technical implementations
│   ├── persistence/ # JPA entities & repositories
│   ├── messaging/   # Kafka producers/consumers
│   └── cache/       # Redis caching
└── adapter/         # External interfaces
    ├── rest/        # REST controllers
    └── event/       # Event listeners
```


## API Endpoints

### Authentication
```
POST   /api/v1/auth/login       # Login with username/password
POST   /api/v1/auth/refresh     # Refresh access token
POST   /api/v1/auth/logout      # Logout user
GET    /api/v1/auth/me          # Get current user
```

### Taxpayers
```
GET    /api/v1/taxpayers                # List taxpayers
GET    /api/v1/taxpayers/{id}           # Get taxpayer by ID
POST   /api/v1/taxpayers                # Create taxpayer
PUT    /api/v1/taxpayers/{id}/status    # Update status
```

### Return Filing
```
GET    /api/v1/returns                  # List returns
GET    /api/v1/returns/{id}             # Get return by ID
POST   /api/v1/returns                  # Create draft return
PUT    /api/v1/returns/{id}/submit      # Submit return
PUT    /api/v1/returns/{id}/acknowledge # Acknowledge (officer)
PUT    /api/v1/returns/{id}/reject      # Reject return
PUT    /api/v1/returns/{id}/amend       # Amend return
POST   /api/v1/returns/{id}/attachments # Upload attachment
```

### Refunds
```
GET    /api/v1/refunds                  # List refund claims
GET    /api/v1/refunds/{id}             # Get refund by ID
POST   /api/v1/refunds                  # Create claim
PUT    /api/v1/refunds/{id}/transition  # Transition status
POST   /api/v1/refunds/{id}/documents   # Upload document
```

### Fraud Investigation
```
GET    /api/v1/fraud                    # List fraud cases
GET    /api/v1/fraud/{id}               # Get case by ID
POST   /api/v1/fraud                    # Create case
PUT    /api/v1/fraud/{id}/transition    # Transition status
POST   /api/v1/fraud/{id}/evidence      # Add evidence
```

### Estimation
```
GET    /api/v1/estimation               # List estimation cases
GET    /api/v1/estimation/{id}          # Get case by ID
POST   /api/v1/estimation               # Create case
PUT    /api/v1/estimation/{id}/transition # Transition status
POST   /api/v1/estimation/{id}/evidence # Add evidence
```

### Extensions
```
GET    /api/v1/extensions               # List extension requests
GET    /api/v1/extensions/{id}          # Get request by ID
POST   /api/v1/extensions               # Create request
PUT    /api/v1/extensions/{id}/transition # Approve/Reject
```

### E-Invoice
```
GET    /api/v1/einvoices                # List e-invoices
GET    /api/v1/einvoices/{id}           # Get invoice by ID
POST   /api/v1/einvoices                # Submit single invoice
POST   /api/v1/einvoices/batch          # Batch import
GET    /api/v1/einvoices/batches        # List batches
```

### Cross-Match
```
GET    /api/v1/crossmatch/discrepancies # List discrepancies
GET    /api/v1/crossmatch/rules         # List matching rules
POST   /api/v1/crossmatch/rules         # Create rule
PUT    /api/v1/crossmatch/discrepancies/{id}/assign # Assign
PUT    /api/v1/crossmatch/discrepancies/{id}/resolve # Resolve
```

### Audit
```
GET    /api/v1/audit                    # List audit entries
```

### Dashboard
```
GET    /api/v1/dashboard/statistics     # Get dashboard statistics
WebSocket /ws                           # WebSocket connection
  Topic: /topic/dashboard               # Dashboard updates
  Topic: /topic/notifications           # Notifications
```


## Database Schema

### Core Principles
- **UUID Primary Keys** for all tables
- **Audit Fields**: `created_at`, `created_by`, `updated_at`, `updated_by`
- **Soft Delete**: `deleted_at`, `deleted_by`
- **Optimistic Locking**: `version` column
- **JSONB** for flexible data structures
- **Partitioning** for large tables (audit logs, invoices)
- **Indexes** on foreign keys and search fields

### Key Tables
- `taxpayers` - Taxpayer master data
- `tax_returns` - Tax return records
- `return_attachments` - File metadata
- `refund_claims` - VAT refund claims
- `fraud_cases` - Fraud investigation cases
- `estimation_cases` - Income estimation cases
- `extension_requests` - Due date extension requests
- `einvoices` - Electronic invoices
- `discrepancies` - Cross-match discrepancies
- `audit_entries` - System audit trail
- `notifications` - User notifications

## Real-Time Notifications

### WebSocket Channels
```
/topic/dashboard        # Dashboard statistics updates
/topic/notifications    # Global notifications
/topic/returns          # Return filing events
/topic/refunds          # Refund events
/topic/fraud            # Fraud case events
/topic/extensions       # Extension events
```

### Event Flow
```
1. User Action (e.g., Submit Return)
   ↓
2. Domain Event Created (ReturnSubmittedEvent)
   ↓
3. Event Persisted to Database
   ↓
4. Kafka Event Published
   ↓
5. Event Listeners Triggered
   ↓
6. WebSocket Message Broadcast
   ↓
7. Frontend Auto-Updates (No refresh!)
```

### Kafka Topics
- `taxpayer-events`
- `return-events`
- `refund-events`
- `fraud-events`
- `estimation-events`
- `extension-events`
- `einvoice-events`
- `crossmatch-events`
- `notification-events`
- `audit-events`
- `dashboard-events`

