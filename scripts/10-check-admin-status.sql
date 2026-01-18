-- Check if hocluongvan88@gmail.com is set as admin
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users
WHERE email = 'hocluongvan88@gmail.com';

-- If no result, show all users with their admin status
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
