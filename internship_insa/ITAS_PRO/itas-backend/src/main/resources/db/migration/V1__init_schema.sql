-- ITAS Tax Administration System - Initial Schema
-- PostgreSQL 16 with UUID, JSONB, Partitioning, Soft Delete

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TAXPAYER MODULE
-- ============================================================================

CREATE TABLE taxpayers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tin VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    kind VARCHAR(20) NOT NULL CHECK (kind IN ('INDIVIDUAL', 'COMPANY', 'NGO', 'GOVT')),
    segment VARCHAR(20) NOT NULL CHECK (segment IN ('LARGE', 'MEDIUM', 'SMALL', 'PRESUMPTIVE')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DEREGISTERED')),
    region VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    compliance_score INTEGER DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
    vat_registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_taxpayers_tin ON taxpayers(tin) WHERE deleted_at IS NULL;
CREATE INDEX idx_taxpayers_status ON taxpayers(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_taxpayers_segment ON taxpayers(segment) WHERE deleted_at IS NULL;
CREATE INDEX idx_taxpayers_name ON taxpayers(name) WHERE deleted_at IS NULL;


CREATE TABLE taxpayer_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    taxpayer_id UUID NOT NULL REFERENCES taxpayers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    license_no VARCHAR(50) NOT NULL,
    linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_taxpayer_agents_taxpayer ON taxpayer_agents(taxpayer_id) WHERE deleted_at IS NULL;

CREATE TABLE taxpayer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    taxpayer_id UUID NOT NULL REFERENCES taxpayers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    kind VARCHAR(20) NOT NULL CHECK (kind IN ('TIN_CERT', 'TRADE_LICENSE', 'VAT_CERT', 'ID', 'OTHER')),
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_taxpayer_documents_taxpayer ON taxpayer_documents(taxpayer_id) WHERE deleted_at IS NULL;

-- ============================================================================
-- RETURN FILING MODULE
-- ============================================================================

CREATE TABLE tax_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(50) UNIQUE NOT NULL,
    taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
    taxpayer_name VARCHAR(255) NOT NULL,
    tin VARCHAR(20) NOT NULL,
    return_type VARCHAR(20) NOT NULL CHECK (return_type IN ('VAT_MONTHLY', 'DAILY', 'PRESUMPTIVE', 'INCOME_TAX')),
    period VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACKNOWLEDGED', 'REJECTED', 'AMENDED')),
    total_sales DECIMAL(18,2) DEFAULT 0,
    total_purchases DECIMAL(18,2) DEFAULT 0,
    vat_payable DECIMAL(18,2) DEFAULT 0,
    penalty_amount DECIMAL(18,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'ETB',
    submitted_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_tax_returns_taxpayer ON tax_returns(taxpayer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tax_returns_status ON tax_returns(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tax_returns_type ON tax_returns(return_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_tax_returns_period ON tax_returns(period) WHERE deleted_at IS NULL;
CREATE INDEX idx_tax_returns_reference ON tax_returns(reference) WHERE deleted_at IS NULL;


CREATE TABLE return_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id UUID NOT NULL REFERENCES tax_returns(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_return_attachments_return ON return_attachments(return_id) WHERE deleted_at IS NULL;

CREATE TABLE return_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id UUID NOT NULL REFERENCES tax_returns(id) ON DELETE CASCADE,
    actor VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    note TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL
);

CREATE INDEX idx_return_history_return ON return_history(return_id);
CREATE INDEX idx_return_history_occurred_at ON return_history(occurred_at DESC);

-- ============================================================================
-- REFUND MODULE
-- ============================================================================

CREATE TABLE refund_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(50) UNIQUE NOT NULL,
    taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
    taxpayer_name VARCHAR(255) NOT NULL,
    tin VARCHAR(20) NOT NULL,
    period VARCHAR(20) NOT NULL,
    total_claim DECIMAL(18,2) NOT NULL,
    verified_amount DECIMAL(18,2) DEFAULT 0,
    offset_amount DECIMAL(18,2) DEFAULT 0,
    payable_amount DECIMAL(18,2) DEFAULT 0,
    channel VARCHAR(10) NOT NULL CHECK (channel IN ('GREEN', 'RED')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT', 'SUBMITTED', 'VERIFYING', 'APPROVED', 'REJECTED', 'OFFSET', 'DISBURSED')),
    bank_account VARCHAR(50),
    reviewer VARCHAR(100),
    decided_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_refund_claims_taxpayer ON refund_claims(taxpayer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_refund_claims_status ON refund_claims(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_refund_claims_channel ON refund_claims(channel) WHERE deleted_at IS NULL;


CREATE TABLE refund_invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refund_claim_id UUID NOT NULL REFERENCES refund_claims(id) ON DELETE CASCADE,
    invoice_no VARCHAR(50) NOT NULL,
    supplier_tin VARCHAR(20) NOT NULL,
    net_amount DECIMAL(18,2) NOT NULL,
    vat_amount DECIMAL(18,2) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100)
);

CREATE INDEX idx_refund_invoices_claim ON refund_invoice_lines(refund_claim_id);

-- ============================================================================
-- FRAUD INVESTIGATION MODULE
-- ============================================================================

CREATE TABLE fraud_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(50) UNIQUE NOT NULL,
    taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
    taxpayer_name VARCHAR(255) NOT NULL,
    tin VARCHAR(20) NOT NULL,
    suspected_scheme VARCHAR(500) NOT NULL,
    estimated_loss DECIMAL(18,2) DEFAULT 0,
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('INTAKE', 'INVESTIGATION', 'EVIDENCE_REVIEW', 'PENDING_DECISION', 'CLOSED_CONFIRMED', 'CLOSED_CLEARED')),
    lead VARCHAR(100) NOT NULL,
    source_flag VARCHAR(100),
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_fraud_cases_taxpayer ON fraud_cases(taxpayer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_fraud_cases_status ON fraud_cases(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_fraud_cases_priority ON fraud_cases(priority) WHERE deleted_at IS NULL;

CREATE TABLE fraud_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_case_id UUID NOT NULL REFERENCES fraud_cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    kind VARCHAR(20) NOT NULL CHECK (kind IN ('DOCUMENT', 'BANK_RECORD', 'WITNESS', 'DATA_EXTRACT')),
    file_path VARCHAR(500),
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL
);

CREATE INDEX idx_fraud_evidence_case ON fraud_evidence(fraud_case_id);

CREATE TABLE fraud_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_case_id UUID NOT NULL REFERENCES fraud_cases(id) ON DELETE CASCADE,
    actor VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    note TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL
);

CREATE INDEX idx_fraud_timeline_case ON fraud_timeline(fraud_case_id);
CREATE INDEX idx_fraud_timeline_occurred_at ON fraud_timeline(occurred_at DESC);

