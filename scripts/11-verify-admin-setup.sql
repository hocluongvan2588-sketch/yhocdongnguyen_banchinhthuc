-- Verify admin setup for hocluongvan88@gmail.com
-- This script checks if is_admin column exists and user is set as admin

-- First, check if is_admin column exists in users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'is_admin';

-- Check all users with their admin status (if column exists)
SELECT 
  id,
  email,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_admin'
    ) THEN is_admin::text
    ELSE 'column_not_exists'
  END as admin_status,
  coin_balance,
  created_at
FROM users
ORDER BY created_at DESC;
