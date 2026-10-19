-- ==============================================================================
-- Migration: Manage People Schema Upgrade & Project Roles Schema
-- Description:
-- 1. Creates `public.licenses` reference table and seeds standard titles.
-- 2. Creates `public.project_roles` reference table and seeds project contribution roles.
-- 3. Extends `public.people` with `address_details`, `external_url`, and `other_role_ids`.
-- 4. Extends `public.project_contributors` with `project_role_ids`.
-- ==============================================================================

-- 1. LICENSES REFERENCE TABLE
CREATE TABLE IF NOT EXISTS public.licenses (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    abbreviation VARCHAR(20),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Standard Licenses
INSERT INTO public.licenses (id, title, abbreviation, sort_order)
VALUES
    ('lic-arch', 'Architect', 'RLA', 10),
    ('lic-int-des', 'Interior Designer', 'IDr', 20),
    ('lic-master-plumb', 'Master Plumber', 'RMP', 30),
    ('lic-master-elec', 'Master Electrician', 'RME', 40),
    ('lic-cpa', 'Accountant', 'CPA', 50),
    ('lic-civil-eng', 'Civil Engineer', 'CE', 60),
    ('lic-struct-eng', 'Structural Engineer', 'SE', 70),
    ('lic-sanitary-eng', 'Sanitary Engineer', 'SanE', 80),
    ('lic-reg-elec-eng', 'Registered Electrical Engineer', 'REE', 90),
    ('lic-prof-elec-eng', 'Professional Electrical Engineer', 'PEE', 100),
    ('lic-mech-eng', 'Mechanical Engineer', 'ME', 110)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    abbreviation = EXCLUDED.abbreviation,
    sort_order = EXCLUDED.sort_order;


-- 2. PROJECT ROLES REFERENCE TABLE (Separate Entity from Studio Roles)
CREATE TABLE IF NOT EXISTS public.project_roles (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed 6 Standard Project Roles
INSERT INTO public.project_roles (id, code, name, description, sort_order)
VALUES
    ('proj-role-arch-design', 'PR-ARCH', 'Architectural Design', 'Spatial programming, schematic concepts, exterior massing, and construction drawings.', 10),
    ('proj-role-cost-est', 'PR-COST', 'Cost Estimates', 'Bill of quantities, cost feasibility, material takeoffs, and procurement budget control.', 20),
    ('proj-role-elec-sys', 'PR-ELEC', 'Electrical Systems', 'Power distribution, lighting fixture layout, auxiliary communication, and solar load calculations.', 30),
    ('proj-role-plumb-sys', 'PR-PLUMB', 'Plumbing Systems', 'Sanitary piping, domestic potable water supply, rainwater catchment, and drainage routing.', 40),
    ('proj-role-bim-lead', 'PR-BIM', 'BIM Lead', 'Building information modeling coordination, 3D clash detection, and parametric Revit/IFC execution.', 50),
    ('proj-role-arch-rend', 'PR-REND', 'Architectural Renderer', 'Photorealistic visual simulation, lighting ambiance studies, material texture mapping, and animations.', 60)
ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;


-- 3. EXTEND PEOPLE TABLE
ALTER TABLE public.people
    ADD COLUMN IF NOT EXISTS address_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS external_url TEXT,
    ADD COLUMN IF NOT EXISTS other_role_ids TEXT[] NOT NULL DEFAULT '{}';


-- 4. EXTEND PROJECT CONTRIBUTORS TABLE
ALTER TABLE public.project_contributors
    ADD COLUMN IF NOT EXISTS project_role_ids TEXT[] NOT NULL DEFAULT '{}';


-- 5. RLS POLICIES FOR NEW TABLES
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for licenses" ON public.licenses
    FOR SELECT USING (true);

CREATE POLICY "Public read access for project_roles" ON public.project_roles
    FOR SELECT USING (true);

-- Allow service role / authenticated admin full access
CREATE POLICY "Admin write access for licenses" ON public.licenses
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admin write access for project_roles" ON public.project_roles
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
