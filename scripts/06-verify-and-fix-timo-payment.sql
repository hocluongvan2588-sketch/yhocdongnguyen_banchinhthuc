-- Script để kiểm tra và fix vấn đề payment methods
-- Run this script to verify and fix Timo payment method setup

-- 1. Check if payment_methods table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_methods') THEN
    RAISE EXCEPTION 'Table payment_methods does not exist. Please run script 03 first.';
  END IF;
END $$;

-- 2. Check current payment methods
SELECT 
  id,
  name,
  bank_code,
  account_number,
  account_name,
  is_active,
  created_at
FROM payment_methods
WHERE bank_code = 'VCCB';

-- 3. Delete any existing Timo payment method to start fresh
DELETE FROM payment_methods WHERE bank_code = 'VCCB';

-- 4. Insert Timo payment method with correct data
INSERT INTO payment_methods (
  name, 
  type, 
  provider, 
  account_number, 
  account_name, 
  bank_code,
  fee_percentage,
  fee_fixed,
  is_active
) VALUES (
  'Chuyển khoản Timo',
  'bank_transfer',
  'vietqr',
  '9021032711378',  -- Số tài khoản Timo của bạn
  'LUONG VAN HOC',  -- Tên chủ tài khoản
  'VCCB',           -- Bank code của Timo (Viet Capital Bank)
  0,                -- Không phí %
  0,                -- Không phí cố định
  true              -- Active
);

-- 5. Verify the insert was successful
SELECT 
  id,
  name,
  type,
  provider,
  bank_code,
  account_number,
  account_name,
  fee_percentage,
  fee_fixed,
  is_active,
  created_at
FROM payment_methods
WHERE bank_code = 'VCCB';

-- 6. Check if there are any existing deposits
SELECT COUNT(*) as deposit_count FROM deposits;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Timo payment method has been set up successfully!';
END $$;
