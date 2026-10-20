-- ==============================================================================
-- ATBP Collaborative - Supabase Schema & Table Permissions Grant
-- Run this in the Supabase SQL Editor to grant table access to anon & authenticated
-- roles so that Row Level Security (RLS) policies can evaluate without
-- "permission denied for table ..." errors.
-- ==============================================================================

-- 1. Grant schema usage
GRANT USAGE, CREATE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Grant table, sequence, and routine privileges on all existing objects in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Configure default privileges for any future tables/sequences/functions created in public
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
