-- ==============================================================================
-- ATBP Collaborative - Supabase PostgreSQL Schema & Security Policies
-- Matches the dummy data models for members, projects, involvements, and settings
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Members (Our People Directory)
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,                             -- slug e.g. 'marchie-borja'
    name TEXT NOT NULL,                              -- full name
    role TEXT NOT NULL,                              -- e.g. 'Principal Architect & Founder'
    license TEXT,                                    -- e.g. 'RLA License No. 0054827'
    image TEXT NOT NULL,                             -- profile portrait URL
    bio TEXT NOT NULL,                               -- short summary
    full_bio TEXT NOT NULL,                          -- comprehensive narrative
    categories TEXT[] NOT NULL DEFAULT '{}',         -- array: ['designers', 'managers', 'builders']
    affiliations JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ title, description }]
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,         -- publication status
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Projects (Works Portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,                             -- slug e.g. 'urban-living-1'
    title TEXT NOT NULL,
    category TEXT NOT NULL,                          -- e.g. 'Multi-Generational'
    main_category TEXT,                              -- e.g. 'Shelter', 'Livelihood', 'Community'
    subcategory TEXT,
    location TEXT NOT NULL,
    year TEXT NOT NULL,                              -- e.g. '2026'
    client_type TEXT NOT NULL,                       -- 'Mid-Income', 'Mid-High-Income', 'High-Income'
    description TEXT NOT NULL,                       -- short overview
    full_writeup TEXT NOT NULL,                      -- comprehensive case study narrative
    images TEXT[] NOT NULL DEFAULT '{}',             -- gallery URLs
    video TEXT,                                      -- YouTube or direct video URL
    status TEXT NOT NULL DEFAULT 'ongoing',          -- 'completed', 'ongoing', 'schematics'
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,        -- { area, scope, duration, materials: [] }
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,         -- publication status
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bi-Directional Project & Member Involvements (Join Table)
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    role_in_project TEXT NOT NULL,                   -- e.g. 'Lead Principal Architect'
    description TEXT,                                -- specific contribution narrative
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, member_id)
);

-- 5. General Info & Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,                            -- 'contact_info', 'privacy_policy', 'legal_notices', 'studio_writeups'
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_is_draft ON public.members(is_draft);
CREATE INDEX IF NOT EXISTS idx_members_categories ON public.members USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_projects_is_draft ON public.projects(is_draft);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_member ON public.project_members(member_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Public can only READ published rows (is_draft = FALSE)
-- Authenticated studio admin can READ and WRITE all rows (including drafts)
-- ==============================================================================

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Members Policies
CREATE POLICY "Public can view published members"
    ON public.members FOR SELECT
    USING (is_draft = FALSE);

CREATE POLICY "Authenticated admins have full access to members"
    ON public.members FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Projects Policies
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_draft = FALSE);

CREATE POLICY "Authenticated admins have full access to projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Project Members Involvements Policies
CREATE POLICY "Public can view involvements of published projects"
    ON public.project_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE public.projects.id = project_members.project_id
            AND public.projects.is_draft = FALSE
        )
    );

CREATE POLICY "Authenticated admins have full access to project involvements"
    ON public.project_members FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Site Settings Policies
CREATE POLICY "Public can read site settings"
    ON public.site_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated admins have full access to site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- ==============================================================================
-- Storage Bucket Setup for Project and Profile Images
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read portfolio media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated admins can upload portfolio media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media');
