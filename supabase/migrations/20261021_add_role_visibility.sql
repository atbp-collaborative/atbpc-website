-- ==============================================================================
-- Migration: Add role_visibility column and drop is_active from public.roles
-- ==============================================================================

ALTER TABLE public.roles 
ADD COLUMN IF NOT EXISTS role_visibility TEXT NOT NULL DEFAULT 'public' 
CHECK (role_visibility IN ('superadmin', 'admin', 'editor', 'public'));

-- Remove obsolete role status column
ALTER TABLE public.roles 
DROP COLUMN IF EXISTS is_active;

-- Ensure Principal Architect & Founder default visibility is superadmin
UPDATE public.roles
SET role_visibility = 'superadmin'
WHERE id = 'role-stu-01' OR role_title ILIKE '%Principal Architect%';

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
