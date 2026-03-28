-- PostgreSQL Schema for Office Task Logging and Management System (OTLMS)

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- Admin, Officer, Employee
    description TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- Support, eOffice, Video Conferencing, Event Support
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE self_logged_tasks (
    id SERIAL PRIMARY KEY,
    task_type_id INTEGER REFERENCES task_types(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    time_spent_hours NUMERIC(5, 2) NOT NULL,
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assigned_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assigned_to INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE task_time_logs (
    id SERIAL PRIMARY KEY,
    assigned_task_id INTEGER REFERENCES assigned_tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    time_spent_hours NUMERIC(5, 2) NOT NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE custom_fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- Text, Date, Dropdown, Multi select, File upload, User picker
    task_type_id INTEGER REFERENCES task_types(id) ON DELETE CASCADE,
    options JSONB, -- For dropdown choices
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE custom_field_values (
    id SERIAL PRIMARY KEY,
    custom_field_id INTEGER REFERENCES custom_fields(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'self_logged_task' or 'assigned_task'
    entity_id INTEGER NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- created, edited, completed, assigned, etc.
    entity_type VARCHAR(100) NOT NULL, -- Task, AssignedTask, User, etc.
    entity_id INTEGER NOT NULL,
    changes JSONB, -- The modified fields
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Indexes for performance
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_self_logged_tasks_created_by ON self_logged_tasks(created_by);
CREATE INDEX idx_self_logged_tasks_task_date ON self_logged_tasks(task_date);
CREATE INDEX idx_assigned_tasks_assigned_to ON assigned_tasks(assigned_to);
CREATE INDEX idx_assigned_tasks_assigned_by ON assigned_tasks(assigned_by);
CREATE INDEX idx_assigned_tasks_status ON assigned_tasks(status);
CREATE INDEX idx_task_time_logs_assigned_task_id ON task_time_logs(assigned_task_id);
CREATE INDEX idx_custom_field_values_entity ON custom_field_values(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
