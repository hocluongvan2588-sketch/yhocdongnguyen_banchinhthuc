-- Fix RLS policies for users table to allow reading is_admin field
-- Users should be able to read their own is_admin status

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Create policy that allows users to read their own data including is_admin
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Verify the policy
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'users';
