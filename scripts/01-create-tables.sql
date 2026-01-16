-- Y Dịch Đồng Nguyên Database Schema
-- Run this script to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table: Store user information and coin balance
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  coin_balance INTEGER NOT NULL DEFAULT 100, -- Starting balance: 100 coins
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultations table: Store hexagram divination history
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consultation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Input data
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  day INTEGER NOT NULL,
  hour INTEGER NOT NULL,
  
  -- Hexagram results
  upper_trigram INTEGER NOT NULL CHECK (upper_trigram BETWEEN 1 AND 8),
  lower_trigram INTEGER NOT NULL CHECK (lower_trigram BETWEEN 1 AND 8),
  moving_line INTEGER NOT NULL CHECK (moving_line BETWEEN 1 AND 6),
  hexagram_name TEXT NOT NULL,
  
  -- Diagnosis result
  diagnosis_text TEXT,
  pathology_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solutions table: Store treatment methods (3 types)
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hexagram_key TEXT NOT NULL, -- Format: "upper_lower_moving" e.g., "6_3_2"
  solution_type TEXT NOT NULL CHECK (solution_type IN ('acupoint', 'prescription', 'symbol_number')),
  
  -- Common fields
  title TEXT NOT NULL,
  description TEXT,
  unlock_cost INTEGER NOT NULL DEFAULT 50, -- Cost in coins to unlock
  
  -- Acupoint specific fields
  acupoint_name TEXT,
  acupoint_location TEXT,
  acupoint_image_url TEXT,
  acupoint_guide_pdf_url TEXT,
  
  -- Prescription specific fields
  herb_name TEXT,
  meridian_pathway TEXT,
  preparation_method TEXT,
  
  -- Symbol number specific fields
  number_sequence TEXT,
  chanting_instructions TEXT,
  
  -- References
  reference_source TEXT DEFAULT 'Nam Dược Thần Hiệu, Lý Ngọc Sơn',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User access table: Track which solutions users have unlocked
CREATE TABLE IF NOT EXISTS user_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate unlocks
  UNIQUE(user_id, solution_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(consultation_date DESC);
CREATE INDEX IF NOT EXISTS idx_solutions_hexagram_key ON solutions(hexagram_key);
CREATE INDEX IF NOT EXISTS idx_user_access_user_id ON user_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_access_solution_id ON user_access(solution_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solutions_updated_at
  BEFORE UPDATE ON solutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'Stores user accounts and coin balances for unlocking solutions';
COMMENT ON TABLE consultations IS 'Stores hexagram divination history and diagnosis results';
COMMENT ON TABLE solutions IS 'Stores all treatment solutions: acupoints, prescriptions, and symbol numbers';
COMMENT ON TABLE user_access IS 'Tracks which solutions each user has unlocked (purchased)';
