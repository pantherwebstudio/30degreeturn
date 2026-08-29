-- 30° Turn Cafe Database Schema
-- Use this schema in your PostgreSQL / Supabase Database

-- 1. Users Table (Role Management & Authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'admin', 'staff', 'customer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_mobile VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'preparing', 'completed', 'cancelled'
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) NOT NULL
);

-- Default Seed: Admin User
-- Email: admin@30degreecafe.com
-- Password: admin123
-- (Bcrypt Hash: $2b$10$YojHF1gmZMrA8fdWmO.SSuTm16uwbJuUi16Lu09djktorLd6wuCFq)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Cafe Admin', 
  'admin@30degreecafe.com', 
  '$2b$10$YojHF1gmZMrA8fdWmO.SSuTm16uwbJuUi16Lu09djktorLd6wuCFq', 
  'admin'
)
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, 
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;
