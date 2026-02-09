-- Fix users table by adding is_admin column if it doesn't exist
-- This script is safe to run multiple times

-- Add is_admin column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
    RAISE NOTICE 'Added is_admin column to users table';
  ELSE
    RAISE NOTICE 'is_admin column already exists in users table';
  END IF;
END $$;

-- Create index for faster admin queries if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

-- Add comment to the column
COMMENT ON COLUMN users.is_admin IS 'Indicates if the user has admin privileges';

COMMIT;
