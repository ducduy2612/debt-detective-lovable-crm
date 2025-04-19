-- Create schemas
CREATE SCHEMA IF NOT EXISTS customers;
CREATE SCHEMA IF NOT EXISTS loans;
CREATE SCHEMA IF NOT EXISTS actions;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS logs;
CREATE SCHEMA IF NOT EXISTS reporting;

-- Create ENUM types
CREATE TYPE loan_status AS ENUM ('current', 'overdue', 'default', 'legal_notice', 'closed');
CREATE TYPE product_type AS ENUM ('loan', 'credit_card', 'overdraft');
CREATE TYPE action_type AS ENUM ('call', 'email', 'SMS', 'visit', 'legal_filing');
CREATE TYPE action_outcome AS ENUM ('successful', 'unsuccessful', 'no_answer', 'promise_to_pay', 'dispute', 'cannot_pay');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'check', 'direct_debit', 'credit_card');

-- Customers Schema Tables
CREATE TABLE customers.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    occupation TEXT,
    income DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customers.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers.customers(id),
    phone_number TEXT NOT NULL,
    type TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT true,
    added_by UUID,
    added_on TIMESTAMPTZ DEFAULT now()
);

-- Loans Schema Tables
CREATE TABLE loans.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers.customers(id),
    product_type product_type NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    outstanding_amount DECIMAL(15,2) NOT NULL,
    status loan_status NOT NULL DEFAULT 'current',
    created_on TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE loans.collaterals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans.loans(id),
    type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Actions Schema Tables
CREATE TABLE actions.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans.loans(id),
    customer_id UUID NOT NULL REFERENCES customers.customers(id),
    assigned_to UUID NOT NULL,
    task_type action_type NOT NULL,
    due_date DATE NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE actions.actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans.loans(id),
    customer_id UUID NOT NULL REFERENCES customers.customers(id),
    type action_type NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT now(),
    agent_id UUID NOT NULL,
    agent_name TEXT NOT NULL,
    outcome action_outcome NOT NULL,
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Payments Schema Tables
CREATE TABLE payments.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans.loans(id),
    amount DECIMAL(15,2) NOT NULL,
    principal DECIMAL(15,2) NOT NULL,
    interest DECIMAL(15,2) NOT NULL,
    fines DECIMAL(15,2) DEFAULT 0,
    method payment_method NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Logs Schema Tables
CREATE TABLE logs.audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    changes JSONB,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Create partitions for high-volume tables
-- Payments partitions
CREATE TABLE payments.payments_2024 PARTITION OF payments.payments
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE payments.payments_2025 PARTITION OF payments.payments
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Actions partitions
CREATE TABLE actions.actions_2024 PARTITION OF actions.actions
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE actions.actions_2025 PARTITION OF actions.actions
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Collaterals partitions
CREATE TABLE loans.collaterals_2024 PARTITION OF loans.collaterals
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE loans.collaterals_2025 PARTITION OF loans.collaterals
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Create indexes for better query performance
CREATE INDEX idx_customers_name ON customers.customers(name);
CREATE INDEX idx_contacts_customer_id ON customers.contacts(customer_id);
CREATE INDEX idx_loans_customer_id ON loans.loans(customer_id);
CREATE INDEX idx_loans_status ON loans.loans(status);
CREATE INDEX idx_collaterals_loan_id ON loans.collaterals(loan_id);
CREATE INDEX idx_tasks_assigned_to ON actions.tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON actions.tasks(due_date);
CREATE INDEX idx_actions_customer_id ON actions.actions(customer_id);
CREATE INDEX idx_actions_date ON actions.actions(date);
CREATE INDEX idx_payments_loan_id ON payments.payments(loan_id);
CREATE INDEX idx_payments_payment_date ON payments.payments(payment_date);
CREATE INDEX idx_audit_user_id ON logs.audit(user_id);
CREATE INDEX idx_audit_timestamp ON logs.audit(timestamp);

-- Enable Row Level Security on all tables
ALTER TABLE customers.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans.collaterals ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs.audit ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (we'll refine these later with proper user roles)
CREATE POLICY "Enable read access for authenticated users" ON customers.customers
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON loans.loans
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON payments.payments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Agents can view assigned tasks" ON actions.tasks
    FOR SELECT TO authenticated USING (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();