-- ==============================================================================
-- ATBP Collaborative - Reset Superadmin Account (Idempotent & Safe)
-- File: supabase/reset_superadmin.sql
-- 
-- Purpose:
-- Safely purges any existing Superadmin accounts from both auth.users and 
-- public.admin_users to allow testing or re-executing the Website Turn-Over 
-- Ceremony (/admin/login/turn-over) from a completely clean state.
--
-- How to run:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard).
-- 2. Navigate to "SQL Editor".
-- 3. Paste the contents of this file and click "Run".
-- ==============================================================================

-- 1. Delete from auth.users (Cascades automatically to public.admin_users via foreign key)
DELETE FROM auth.users
WHERE id IN (
    SELECT id FROM public.admin_users WHERE role = 'superadmin'
);

-- 2. Cleanup any orphaned records in public.admin_users just in case
DELETE FROM public.admin_users
WHERE role = 'superadmin';

-- 3. Invalidate & reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
