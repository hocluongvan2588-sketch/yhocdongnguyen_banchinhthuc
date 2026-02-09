-- Sync authenticated users from auth.users to public.users table
-- This ensures all authenticated users have a record in the users table

-- Insert any missing users from auth.users into public.users
INSERT INTO public.users (id, email, full_name, is_admin, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  false as is_admin,
  NOW() as updated_at
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Log the result
DO $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  RAISE NOTICE 'Total users in public.users table: %', user_count;
END $$;

COMMIT;
