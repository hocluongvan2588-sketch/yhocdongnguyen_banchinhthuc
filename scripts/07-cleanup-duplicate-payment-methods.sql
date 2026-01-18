-- Cleanup duplicate Timo payment methods and keep only the latest one with all required fields

-- First, let's see what we have
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
WHERE bank_code = 'VCCB'
ORDER BY created_at DESC;

-- Delete all old payment methods except the latest one that has all required fields
-- Keep the one created at 2026-01-18T01:17:42.889Z which has type, provider, etc.
DELETE FROM payment_methods
WHERE bank_code = 'VCCB'
AND id NOT IN (
  SELECT id 
  FROM payment_methods
  WHERE bank_code = 'VCCB'
  AND type IS NOT NULL
  AND provider IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1
);

-- Verify cleanup - should only have 1 record now
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
WHERE bank_code = 'VCCB'
ORDER BY created_at DESC;
