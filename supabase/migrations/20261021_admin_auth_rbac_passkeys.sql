-- ==============================================================================
-- Migration: 20261021_admin_auth_rbac_passkeys.sql
-- Enforces Tiered RBAC, Admin UI Preferences, and Passkey Integration
-- ==============================================================================

-- 1. Ensure public.admin_users has ui_preferences
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'admin_users' 
          AND column_name = 'ui_preferences'
    ) THEN 
        ALTER TABLE public.admin_users 
        ADD COLUMN ui_preferences JSONB NOT NULL DEFAULT '{"theme":"dark","views":{"projects":"grid","people":"list","roles":"roles"}}'::jsonb;
    END IF;
END $$;

-- 2. Enhanced RBAC Helper Functions
CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.admin_users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role = 'superadmin'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    );
$$;

-- 3. Update Projects RLS Policies to strictly match Tiered RBAC:
-- Superadmin: CRUD
-- Admin: CRU (No Delete)
-- Editor: RU (No Create, No Delete)

DROP POLICY IF EXISTS "Superadmin, Admin, and Editor can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admin and Superadmin can create projects" ON public.projects;
CREATE POLICY "Admin and Superadmin can create projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_superadmin());

DROP POLICY IF EXISTS "Superadmin, Admin, and Editor can update projects" ON public.projects;
CREATE POLICY "Superadmin, Admin, and Editor can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Only Superadmin can delete projects" ON public.projects;
CREATE POLICY "Only Superadmin can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (public.is_superadmin());

-- 4. Update People RLS Policies:
-- Superadmin: CRUD
-- Admin: CRU (No Delete)
-- Editor: Blocked

DROP POLICY IF EXISTS "Admin and Superadmin can create people" ON public.people;
CREATE POLICY "Admin and Superadmin can create people"
    ON public.people FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_superadmin());

DROP POLICY IF EXISTS "Admin and Superadmin can update people" ON public.people;
CREATE POLICY "Admin and Superadmin can update people"
    ON public.people FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_superadmin())
    WITH CHECK (public.is_admin_or_superadmin());

DROP POLICY IF EXISTS "Only Superadmin can delete people" ON public.people;
CREATE POLICY "Only Superadmin can delete people"
    ON public.people FOR DELETE
    TO authenticated
    USING (public.is_superadmin());

-- 5. Admin Users Policies: Only Superadmin can create/modify admin accounts
DROP POLICY IF EXISTS "Users can read own admin profile" ON public.admin_users;
CREATE POLICY "Users can read own admin profile"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin has full control over admin users" ON public.admin_users;
CREATE POLICY "Superadmin has full control over admin users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.is_superadmin())
    WITH CHECK (public.is_superadmin());
