-- Set specific user as admin
-- Email: hocluongvan88@gmail.com

-- Set admin role for the specified email
UPDATE users 
SET is_admin = true 
WHERE email = 'hocluongvan88@gmail.com';

-- Verify the update
SELECT id, email, is_admin, created_at 
FROM users 
WHERE email = 'hocluongvan88@gmail.com';

COMMIT;
