-- Add admin role to users table
-- Run this script to enable admin functionality

-- Add is_admin column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

-- Add comment
COMMENT ON COLUMN users.is_admin IS 'Indicates if the user has admin privileges for payment management';

COMMIT;
