-- Migration: Drop service_packages table and related data
-- Reason: Consolidating to use `solutions` table for all pricing management
-- Date: 2026-02-03

-- Drop policies first
DROP POLICY IF EXISTS "Allow public read access to service packages" ON service_packages;
DROP POLICY IF EXISTS "Allow admin full access to service packages" ON service_packages;

-- Drop the table
DROP TABLE IF EXISTS service_packages CASCADE;

-- Note: The `solutions` table will be the single source of truth for pricing
-- - prescription (Nam Dược): unlock_cost
-- - acupoint (Khai Huyệt): unlock_cost  
-- - symbol_number (Tượng Số): unlock_cost
