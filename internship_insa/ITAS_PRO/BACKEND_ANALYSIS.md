# ITAS PRO Backend - Analysis & Implementation Plan

## Frontend Analysis Complete

### Existing Frontend Stack
- **React 19** + **TypeScript 5.8**
- **TanStack Router 1.168** - File-based routing
- **TanStack Query 5.83** - Server state management
- **Redux Toolkit 2.12** - Client state (auth, UI)
- **React Hook Form 7.71** + **Zod 3.24** - Forms & validation
- **Tailwind CSS 4.2** + **Shadcn UI** - Styling
- **Recharts 2.15** - Data visualization

### Routes Identified
```
/ (Landing page)
/login (Authentication)
/_app (Protected layout)
  /dashboard
  /taxpayers
  /returns/*
  /estimation
  /presumptive
  /e-invoice
  /cross-match
  /fraud
  /receipts (manual receipt)
  /extensions
  /refunds
  /notifications
  /audit
```

### Auth Structure
- **Storage**: localStorage (`tax.auth`)
- **Token**: JWT-style token (`mock.{userId}.{timestamp}`)
- **User Object**: `{ id, username, fullName, email, tin, roles[] }`
- **Roles**: SUPER_ADMIN, SYSTEM_ADMIN, TAXPAYER, TAX_AGENT, TAX_OFFICER,
  APPROVING_OFFICER, COMPLIANCE_OFFICER, AUDIT_OFFICER, RISK_ANALYST,
  REFUND_OFFICER, REFUND_TEAM_LEADER, INVESTIGATION_OFFICER


### Feature Modules & DTOs Identified

#### 1. **Taxpayers Module**
**Types/DTOs:**
- `Taxpayer`: id, tin, name, tradeName, kind, segment, status, region, branch,
  phone, email, registeredAt, complianceScore, vatRegistered, agents[], documents[]
- `TaxpayerAgent`: id, name, licenseNo, linkedAt
- `TaxpayerDocument`: id, title, kind, uploadedAt
- **Enums**: TaxpayerKind (INDIVIDUAL, COMPANY, NGO, GOVT), 
  TaxpayerSegment (LARGE, MEDIUM, SMALL, PRESUMPTIVE),
  TaxpayerStatus (ACTIVE, SUSPENDED, DEREGISTERED)

**API Operations:**
- `GET /taxpayers` - List with filters (q, segment, status)
- `GET /taxpayers/{id}` - Get by ID
- `POST /taxpayers` - Create
- `PUT /taxpayers/{id}/status` - Update status

#### 2. **Return Filing Module**
**Types/DTOs:**
- `TaxReturn`: id, reference, taxpayerId, taxpayerName, tin, type, period, status,
  totalSales, totalPurchases, vatPayable, penaltyAmount, currency, submittedAt,
  acknowledgedAt, version, attachments[], history[], notes
- `ReturnAttachment`: id, filename, size, uploadedAt
- `ReturnHistoryEntry`: id, at, actor, action, note
- **Enums**: ReturnType (VAT_MONTHLY, DAILY, PRESUMPTIVE, INCOME_TAX),
  ReturnStatus (DRAFT, SUBMITTED, UNDER_REVIEW, ACKNOWLEDGED, REJECTED, AMENDED)

**API Operations:**
- `GET /returns` - List with filters (taxpayerId, status, type)
- `GET /returns/{id}` - Get by ID
- `POST /returns` - Create
- `PUT /returns/{id}/submit` - Submit draft
- `PUT /returns/{id}/acknowledge` - Acknowledge (officer)
- `PUT /returns/{id}/reject` - Reject with reason
- `PUT /returns/{id}/amend` - Amend return


#### 3. **Refunds Module**
**Types/DTOs:**
- `RefundClaim`: id, reference, taxpayerId, taxpayerName, tin, period, totalClaim,
  verifiedAmount, offsetAmount, payableAmount, channel, status, createdAt,
  decidedAt, bankAccount, reviewer, invoices[]
- `RefundInvoiceLine`: id, invoiceNo, supplierTin, netAmount, vatAmount, verified
- **Enums**: RefundChannel (GREEN, RED), RefundStatus (DRAFT, SUBMITTED, 
  VERIFYING, APPROVED, REJECTED, OFFSET, DISBURSED)

**API Operations:**
- `GET /refunds` - List with filters (status, q)
- `POST /refunds` - Create claim
- `PUT /refunds/{id}/transition` - Change status

#### 4. **Fraud Investigation Module**
**Types/DTOs:**
- `FraudCase`: id, reference, taxpayerId, taxpayerName, tin, suspectedScheme,
  estimatedLoss, priority, status, openedAt, closedAt, lead, sourceFlag,
  evidence[], timeline[]
- `FraudEvidence`: id, title, kind, addedAt
- `FraudEvent`: id, at, actor, action, note
- **Enums**: FraudStatus (INTAKE, INVESTIGATION, EVIDENCE_REVIEW, PENDING_DECISION,
  CLOSED_CONFIRMED, CLOSED_CLEARED), FraudPriority (LOW, MEDIUM, HIGH, URGENT)

**API Operations:**
- `GET /fraud` - List with filters
- `GET /fraud/{id}` - Get by ID
- `POST /fraud` - Create case
- `PUT /fraud/{id}/transition` - Change status with timeline event

#### 5. **Estimation Cases Module**
**Types/DTOs:**
- `EstimationCase`: id, reference, taxpayerId, taxpayerName, tin, sector, region,
  branch, method, observedDailyIncome, recommendedDailyIncome, assessedAnnualIncome,
  presumptiveTax, status, openedAt, closedAt, assignedOfficer, evidence[], timeline[], notes
- `EstimationEvidence`: id, description, kind, capturedAt
- `EstimationTimeline`: id, at, actor, action, note
- **Enums**: EstimationStatus (DRAFT, FIELD_VISIT, COMMITTEE_REVIEW, 
  PENDING_APPROVAL, APPROVED, REJECTED), EstimationMethod (COMMITTEE, FIELD_VISIT)

**API Operations:**
- `GET /estimation` - List with filters
- `POST /estimation` - Create case
- `PUT /estimation/{id}/transition` - Update status


#### 6. **Extensions Module**
**Types/DTOs:**
- `ExtensionRequest`: id, reference, taxpayerId, taxpayerName, tin, kind, period,
  returnType, currentDueDate, requestedDueDate, amountToWaive, reason, status,
  createdAt, decidedAt, reviewedBy, decisionNote
- **Enums**: ExtensionKind (DUE_DATE, PENALTY_WAIVER, INTEREST_WAIVER),
  ExtensionStatus (DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)

**API Operations:**
- `GET /extensions` - List with filters
- `POST /extensions` - Create request
- `PUT /extensions/{id}/transition` - Update status

#### 7. **E-Invoice Module**
**Types/DTOs:**
- `EInvoice`: id, invoiceNo, irn, issuedAt, supplierTin, supplierName, buyerTin,
  buyerName, netAmount, vatAmount, total, status, source, batchId, validationErrors[]
- `InvoiceBatch`: id, receivedAt, source, fileName, totalCount, validCount,
  rejectedCount, status
- **Enums**: InvoiceStatus (VALID, REJECTED, PENDING, CANCELLED),
  InvoiceSource (API, BATCH, MANUAL), BatchStatus (PROCESSING, COMPLETED, FAILED)

**API Operations:**
- `GET /einvoices` - List with filters
- `POST /einvoices` - Submit single invoice
- `POST /einvoices/batch` - Batch import
- `GET /einvoices/batches` - List batches

#### 8. **Cross-Match Module**
**Types/DTOs:**
- `Discrepancy`: id, reference, ruleId, ruleCode, taxpayerId, taxpayerName, tin,
  period, declared, observed, variance, variancePct, riskScore, severity, status,
  detectedAt, assignedTo
- `MatchRule`: id, code, name, description, source, thresholdPct, tolerance, status,
  version, updatedAt
- **Enums**: Severity (LOW, MEDIUM, HIGH, CRITICAL), 
  DiscrepancyStatus (OPEN, UNDER_REVIEW, RESOLVED, ESCALATED),
  RuleStatus (ACTIVE, INACTIVE, DRAFT)

**API Operations:**
- `GET /crossmatch/discrepancies` - List with filters
- `GET /crossmatch/rules` - List rules
- `POST /crossmatch/rules` - Create rule
- `PUT /crossmatch/discrepancies/{id}/assign` - Assign to officer
- `PUT /crossmatch/discrepancies/{id}/resolve` - Mark resolved


#### 9. **Audit Module**
**Types/DTOs:**
- `AuditEntry`: id, at, actor, actorRole, entity, entityId, action, severity, ip,
  channel, detail
- **Enums**: AuditSeverity (INFO, WARN, CRITICAL), 
  AuditChannel (WEB, API, SYSTEM)

**API Operations:**
- `GET /audit` - List with filters (actor, entity, action, from, to)

### Dashboard Statistics Required
The dashboard needs LIVE statistics via WebSocket:
- Total Taxpayers
- Active Returns  
- Submitted Returns
- Pending Approvals
- Refund Requests
- Fraud Cases
- Notifications (unread count)
- Estimated Assessments

---

## Backend Architecture Plan

### Technology Stack
- **Java 21** (LTS with Virtual Threads)
- **Spring Boot 3.5**
- **Spring Security** + **Keycloak** (OAuth2/OIDC)
- **PostgreSQL 16** (JSONB, UUIDs, Partitioning)
- **Flyway** (Schema migrations)
- **Apache Kafka** (Event streaming)
- **Redis** (Caching, pub/sub)
- **MinIO** (S3-compatible file storage)
- **Elasticsearch** (Search & analytics)
- **WebSocket/STOMP** (Real-time notifications)
- **Maven** (Build tool)


### Directory Structure (Hexagonal Architecture)
```
itas-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── et/
│   │   │       └── gov/
│   │   │           └── mor/
│   │   │               └── itas/
│   │   │                   ├── shared/              # Shared kernel
│   │   │                   │   ├── domain/
│   │   │                   │   ├── exception/
│   │   │                   │   └── util/
│   │   │                   ├── taxpayer/            # Module 1
│   │   │                   │   ├── domain/
│   │   │                   │   ├── application/
│   │   │                   │   ├── infrastructure/
│   │   │                   │   └── adapter/
│   │   │                   ├── returnfiling/        # Module 2
│   │   │                   ├── refund/              # Module 3
│   │   │                   ├── fraud/               # Module 4
│   │   │                   ├── estimation/          # Module 5
│   │   │                   ├── extension/           # Module 6
│   │   │                   ├── einvoice/            # Module 7
│   │   │                   ├── crossmatch/          # Module 8
│   │   │                   ├── audit/               # Module 9
│   │   │                   ├── notification/        # Module 10
│   │   │                   └── auth/                # Security
│   │   └── resources/
│   │       ├── db/migration/                        # Flyway
│   │       └── application.yml
│   └── test/
├── docker/
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
├── k8s/
└── pom.xml
```

### Module Structure (Example: Taxpayer)
```
taxpayer/
├── domain/
│   ├── model/
│   │   ├── Taxpayer.java               # Aggregate Root
│   │   ├── TaxpayerId.java             # Value Object
│   │   ├── TIN.java                    # Value Object
│   │   ├── TaxpayerAgent.java          # Entity
│   │   ├── TaxpayerDocument.java       # Entity
│   │   └── TaxpayerStatus.java         # Enum
│   ├── event/
│   │   ├── TaxpayerCreatedEvent.java
│   │   └── TaxpayerStatusChangedEvent.java
│   ├── repository/
│   │   └── TaxpayerRepository.java     # Port (Interface)
│   └── service/
│       └── TaxpayerDomainService.java
├── application/
│   ├── command/
│   │   ├── CreateTaxpayerCommand.java
│   │   └── UpdateTaxpayerStatusCommand.java
│   ├── query/
│   │   ├── GetTaxpayerQuery.java
│   │   └── SearchTaxpayersQuery.java
│   ├── dto/
│   │   ├── TaxpayerDTO.java
│   │   └── TaxpayerFilterDTO.java
│   ├── service/
│   │   ├── TaxpayerCommandService.java
│   │   └── TaxpayerQueryService.java
│   └── mapper/
│       └── TaxpayerMapper.java
├── infrastructure/
│   ├── persistence/
│   │   ├── TaxpayerEntity.java         # JPA Entity
│   │   ├── TaxpayerJpaRepository.java
│   │   └── TaxpayerRepositoryImpl.java # Port Implementation
│   ├── messaging/
│   │   ├── TaxpayerEventPublisher.java
│   │   └── TaxpayerKafkaConfig.java
│   └── cache/
│       └── TaxpayerCacheConfig.java
└── adapter/
    ├── rest/
    │   ├── TaxpayerController.java
    │   └── TaxpayerExceptionHandler.java
    └── event/
        └── TaxpayerEventListener.java
```


### API Contract Summary

#### Authentication APIs
```
POST   /api/v1/auth/login              # Login
POST   /api/v1/auth/refresh            # Refresh token
POST   /api/v1/auth/logout             # Logout
GET    /api/v1/auth/me                 # Current user
```

#### Taxpayer APIs
```
GET    /api/v1/taxpayers               # List (q, segment, status)
GET    /api/v1/taxpayers/{id}          # Get by ID
POST   /api/v1/taxpayers               # Create
PUT    /api/v1/taxpayers/{id}/status   # Update status
```

#### Return Filing APIs
```
GET    /api/v1/returns                 # List (taxpayerId, status, type)
GET    /api/v1/returns/{id}            # Get by ID
POST   /api/v1/returns                 # Create draft
PUT    /api/v1/returns/{id}/submit     # Submit
PUT    /api/v1/returns/{id}/acknowledge # Acknowledge
PUT    /api/v1/returns/{id}/reject     # Reject
PUT    /api/v1/returns/{id}/amend      # Amend
POST   /api/v1/returns/{id}/attachments # Upload attachment
```

#### Refund APIs
```
GET    /api/v1/refunds                 # List (status, q)
GET    /api/v1/refunds/{id}            # Get by ID
POST   /api/v1/refunds                 # Create claim
PUT    /api/v1/refunds/{id}/transition # Transition status
POST   /api/v1/refunds/{id}/documents  # Upload document
```

#### Fraud Investigation APIs
```
GET    /api/v1/fraud                   # List (status, q)
GET    /api/v1/fraud/{id}              # Get by ID
POST   /api/v1/fraud                   # Create case
PUT    /api/v1/fraud/{id}/transition   # Transition status
POST   /api/v1/fraud/{id}/evidence     # Add evidence
```

#### Estimation APIs
```
GET    /api/v1/estimation              # List (status, q)
GET    /api/v1/estimation/{id}         # Get by ID
POST   /api/v1/estimation              # Create case
PUT    /api/v1/estimation/{id}/transition # Transition
POST   /api/v1/estimation/{id}/evidence # Add evidence
```

#### Extension APIs
```
GET    /api/v1/extensions              # List (status, kind)
GET    /api/v1/extensions/{id}         # Get by ID
POST   /api/v1/extensions              # Create request
PUT    /api/v1/extensions/{id}/transition # Decide
```

#### E-Invoice APIs
```
GET    /api/v1/einvoices               # List (status, supplier, buyer)
GET    /api/v1/einvoices/{id}          # Get by ID
POST   /api/v1/einvoices               # Submit single
POST   /api/v1/einvoices/batch         # Batch import
GET    /api/v1/einvoices/batches       # List batches
```

#### Cross-Match APIs
```
GET    /api/v1/crossmatch/discrepancies # List discrepancies
GET    /api/v1/crossmatch/rules         # List rules
POST   /api/v1/crossmatch/rules         # Create rule
PUT    /api/v1/crossmatch/discrepancies/{id}/assign # Assign
PUT    /api/v1/crossmatch/discrepancies/{id}/resolve # Resolve
```

#### Audit APIs
```
GET    /api/v1/audit                   # List (actor, entity, action, from, to)
```

#### Dashboard APIs
```
GET    /api/v1/dashboard/statistics    # Get all statistics
WebSocket /ws/dashboard                # Live updates
```

#### Notification APIs
```
GET    /api/v1/notifications           # List
PUT    /api/v1/notifications/{id}/read # Mark as read
WebSocket /ws/notifications            # Live notifications
```

