-- Remove unused admin functions (admin interface has been removed from the app)
DROP FUNCTION IF EXISTS public.create_admin_user(text, text);
DROP FUNCTION IF EXISTS public.verify_admin_login(text, text);
DROP FUNCTION IF EXISTS public.generate_api_key(text);
DROP FUNCTION IF EXISTS public.get_api_keys();
DROP FUNCTION IF EXISTS public.delete_api_key(uuid);
DROP FUNCTION IF EXISTS public.toggle_api_key(uuid);

-- Remove unused admin tables
DROP TABLE IF EXISTS public.api_keys;
DROP TABLE IF EXISTS public.admin_users;