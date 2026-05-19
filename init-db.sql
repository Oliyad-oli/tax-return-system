-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tax_system_db;

-- Connect to database
\c tax_system_db;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_return (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    attachment_name VARCHAR(255),
    submission_date DATE NOT NULL,
    manual_entry BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) NOT NULL,
    notification_message TEXT,
    invoice_validated BOOLEAN DEFAULT TRUE,
    inspection_required BOOLEAN DEFAULT FALSE,
    validation_message TEXT,
    risk_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notification (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message (
    id BIGSERIAL PRIMARY KEY,
    sender_email VARCHAR(255) NOT NULL,
    receiver_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_message_id BIGINT REFERENCES message(id)
);

CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    theme VARCHAR(50) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    session_timeout_minutes INTEGER DEFAULT 30,
    auto_logout BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger (
    id BIGSERIAL PRIMARY KEY,
    amount DECIMAL(15,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Insert default admin user
INSERT INTO users (full_name, email, password, role) 
VALUES ('System Admin', 'admin@tax.gov', 'admin123', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert sample taxpayer
INSERT INTO users (full_name, email, password, role) 
VALUES ('John Doe', 'john@example.com', 'password123', 'TAXPAYER')
ON CONFLICT (email) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_return_user ON daily_return(user_id);
CREATE INDEX IF NOT EXISTS idx_return_status ON daily_return(status);
CREATE INDEX IF NOT EXISTS idx_notification_email ON notification(email);
CREATE INDEX IF NOT EXISTS idx_notification_read ON notification(read);
CREATE INDEX IF NOT EXISTS idx_message_receiver ON message(receiver_email);
CREATE INDEX IF NOT EXISTS idx_message_sender ON message(sender_email);