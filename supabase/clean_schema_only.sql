-- ==============================================================================
-- ATBP COLLABORATIVE: COMPLETE CLEAN DATABASE RESET & SCHEMA ONLY (ZERO SEED DATA)
-- ==============================================================================
-- WARNING: This script drops the public schema and recreates everything from scratch.
-- It establishes all reference tables, core entities, RBAC, CMS collections,
-- storage buckets, storage security policies, full table privileges,
-- and RLS policies in ONE single execution.
-- NO seed data (projects, people, CMS content) is inserted.
-- The database will be completely empty and ready for pure Supabase testing or initial admin turnover.
-- ==============================================================================

-- 0. RESET PUBLIC SCHEMA & PURGE STALE AUTH / STORAGE RECORDS
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Purge existing auth accounts to ensure a clean slate for the Superadmin Turnover Ceremony (/admin/login/turn-over)
DO $$
BEGIN
    DELETE FROM auth.users;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping auth.users flush: %', SQLERRM;
END $$;

-- Purge existing portfolio media objects in storage so uploads start fresh
DO $$
BEGIN
    DELETE FROM storage.objects WHERE bucket_id = 'portfolio-media';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping storage.objects flush: %', SQLERRM;
END $$;

-- Grant standard permissions to Supabase roles
GRANT USAGE, CREATE ON SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- ==============================================================================
-- ATBP Collaborative - Supabase PostgreSQL Normalized Schema (schema_new.sql)
-- Complete consolidated schema with RBAC, employment tracking, and form ingestion.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. HELPER FUNCTIONS & TRIGGERS FOR TIMESTAMPS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. MASTER / REFERENCE TABLES (Superadmin Managed)
-- ==============================================================================

-- Tracks: Professional & Internship Framework
CREATE TABLE IF NOT EXISTS public.tracks (
    id VARCHAR(50) PRIMARY KEY,                                      -- e.g. 'PROF', 'INTERN_CHED_240', 'APPRENTICE_ALE_3840'
    code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,                                              -- e.g. 'Professional Practice', 'Curriculum-based Internship'
    track_type TEXT NOT NULL CHECK (track_type IN ('professional', 'internship', 'apprenticeship')),
    required_hours INTEGER NULL,                                     -- e.g. 240, 3840, NULL
    governing_body TEXT,                                             -- e.g. 'PRC-BOA', 'CHED', 'TESDA', 'Internal'
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Roles: Studio Positions across Design, Management, & Construction
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(50) PRIMARY KEY,                                      -- e.g. 'role-hrdt-03'
    role_code VARCHAR(50) NOT NULL UNIQUE,                           -- e.g. 'HRDT-03', 'HROA-02', 'APP-ALE'
    role_title TEXT NOT NULL,                                        -- e.g. 'Junior Architect', 'Site Foreman'
    category TEXT NOT NULL CHECK (category IN ('designers', 'managers', 'builders')),
    track_id VARCHAR(50) REFERENCES public.tracks(id) ON DELETE RESTRICT,
    department TEXT NOT NULL,                                        -- e.g. 'Production Team (Design & Technical)'
    role_description TEXT,
    role_visibility TEXT NOT NULL DEFAULT 'public' CHECK (role_visibility IN ('superadmin', 'admin', 'editor', 'public')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Licenses: Professional Licensure Reference Table
CREATE TABLE IF NOT EXISTS public.licenses (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    abbreviation VARCHAR(20),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Roles: Specific Scope Contribution Roles (Separate from Studio Roles)
CREATE TABLE IF NOT EXISTS public.project_roles (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Categories: The 3 Core Pillars
CREATE TABLE IF NOT EXISTS public.project_categories (
    id VARCHAR(50) PRIMARY KEY,                                      -- 'Shelter', 'Livelihood', 'Community'
    name TEXT NOT NULL,                                              -- 'Shelter', 'Livelihood', 'Community'
    tagline TEXT NOT NULL,                                           -- 'for the way you live', etc.
    hero_image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Typologies: Hierarchical Subcategories
CREATE TABLE IF NOT EXISTS public.project_typologies (
    id VARCHAR(50) PRIMARY KEY,                                      -- 'tiny-living', 'multi-generational', etc.
    category_id VARCHAR(50) NOT NULL REFERENCES public.project_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,                                              -- 'Tiny Living', 'Multi-Generational', etc.
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contract Types: Service Scopes & Procurement Models
CREATE TABLE IF NOT EXISTS public.contract_types (
    id VARCHAR(50) PRIMARY KEY,                                      -- 'comprehensive-design', 'piecework', etc.
    code VARCHAR(50) NOT NULL UNIQUE,                                -- 'SCOPE-COMP-01', 'SCOPE-PIECE-01', etc.
    name TEXT NOT NULL,                                              -- 'Comprehensive Design Services', etc.
    service_tier TEXT NOT NULL CHECK (service_tier IN ('comprehensive', 'piecework', 'consultation', 'construction')),
    contract_model TEXT NOT NULL,                                    -- 'Design-Build', 'Design-Bid-Build', 'Retainer', etc.
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. CORE BUSINESS ENTITIES (PEOPLE, PROJECTS, INVOLVEMENTS)
-- ==============================================================================

-- People (Directory, Studio Regulars, Apprentices, and Leadership)
CREATE TABLE IF NOT EXISTS public.people (
    id VARCHAR(100) PRIMARY KEY,                                     -- slug e.g. 'marchie-borja'
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    pseudonym TEXT,
    pronouns TEXT,                                                   -- e.g. 'He/Him', 'She/Her'
    titles TEXT,                                                     -- e.g. 'Arch.', 'Engr.', 'IDr.'
    primary_role_id VARCHAR(50) REFERENCES public.roles(id) ON DELETE SET NULL,
    track_id VARCHAR(50) REFERENCES public.tracks(id) ON DELETE SET NULL,
    categories TEXT[] NOT NULL DEFAULT '{}',                         -- ['designers', 'managers', 'builders']
    professional_license_title TEXT,                                 -- e.g. 'RLA', 'RMP', 'CE'
    license_number TEXT,                                             -- e.g. '0054827'
    personal_email TEXT,
    contact_number TEXT,
    portfolio_url TEXT,
    external_url TEXT,
    address_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    other_role_ids TEXT[] NOT NULL DEFAULT '{}',
    short_bio TEXT NOT NULL,
    full_bio TEXT NOT NULL,
    profile_photo_url TEXT NOT NULL,
    
    -- Employment & Separation Tracking
    date_of_hiring DATE NOT NULL DEFAULT CURRENT_DATE,
    date_of_separation DATE NULL,
    is_currently_hired BOOLEAN NOT NULL DEFAULT TRUE,
    
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credentials / Affiliations (Child table for degrees, affiliations, accreditations)
CREATE TABLE IF NOT EXISTS public.person_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id VARCHAR(100) NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects (Works Portfolio & Case Studies)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,                               -- readable slug e.g. 'urban-living-1'
    project_code VARCHAR(50) NOT NULL UNIQUE,                        -- e.g. 'PRJ-2021-001'
    project_title TEXT NOT NULL,
    year VARCHAR(4) NOT NULL,                                        -- e.g. '2026'
    category_id VARCHAR(50) NOT NULL REFERENCES public.project_categories(id) ON DELETE RESTRICT,
    typology_id VARCHAR(50) NOT NULL REFERENCES public.project_typologies(id) ON DELETE RESTRICT,
    contract_type_id VARCHAR(50) REFERENCES public.contract_types(id) ON DELETE SET NULL,
    client_type TEXT NOT NULL DEFAULT 'Mid-Income' CHECK (client_type IN ('Mid-Income', 'Mid-High-Income', 'High-Income')),
    status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('schematics', 'ongoing', 'completed')),
    location_name TEXT NOT NULL,                                     -- e.g. 'Metro Manila, Philippines'
    address_details JSONB NOT NULL DEFAULT '{}'::jsonb,              -- { regionCode, cityCode, barangayCode, street }
    coordinates JSONB,                                               -- { lat: 14.5, lng: 121.0 }
    floor_area_sqm NUMERIC NULL,                                     -- numeric area in sqm
    property_area_type TEXT NOT NULL DEFAULT 'tua' CHECK (property_area_type IN ('tla', 'tua')),
    duration TEXT,                                                   -- e.g. '9 Months'
    materials TEXT[] NOT NULL DEFAULT '{}',                          -- ['Concrete', 'Wood', 'Steel', 'Glass']
    description TEXT NOT NULL,                                       -- short overview
    full_writeup TEXT NOT NULL,                                      -- detailed case study narrative
    youtube_video_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Media: Gallery Images & Showcase Videos
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    caption TEXT,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Contributors: Bi-Directional Association between Projects and People
CREATE TABLE IF NOT EXISTS public.project_contributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    person_id VARCHAR(100) NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
    role_in_project TEXT NOT NULL,                                   -- e.g. 'Lead Principal Architect'
    project_role_ids TEXT[] NOT NULL DEFAULT '{}',                   -- references public.project_roles(id)
    contribution_narrative TEXT,                                     -- specific contribution description
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, person_id)
);

-- ==============================================================================
-- 5. ADMIN USERS & RBAC (Superadmin, Admin, Editor)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('superadmin', 'admin', 'editor')),
    person_id VARCHAR(100) REFERENCES public.people(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site Settings & General Info
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,                                    -- 'contact_info', 'privacy_policy', 'legal_notices', 'studio_writeups', 'homepage_slogans'
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5B. CONTENT MANAGEMENT SYSTEM (CMS) ENTITIES
-- Pages, Navigation Cards, Services, Process Stage Groups, Process Stages, Slides
-- ==============================================================================

-- 1. Site Pages (Hubs & General Routes with SEO-locked titles/slugs)
CREATE TABLE IF NOT EXISTS public.site_pages (
    id VARCHAR(100) PRIMARY KEY,                                     -- SEO LOCKED: 'services-hub', 'process-hub', 'contact-hub', 'case-study-house', 'grow-with-us', 'partner-with-us', 'works'
    title TEXT NOT NULL,                                             -- SEO LOCKED
    subtitle TEXT NOT NULL,
    hero_image_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Navigation Cards (Hub Grid Cards)
CREATE TABLE IF NOT EXISTS public.navigation_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id VARCHAR(50) NOT NULL,                                     -- 'studio', 'contact', 'case-study-house', 'grow-with-us', 'partner-with-us', 'services', 'process'
    card_key VARCHAR(50) NOT NULL UNIQUE,                            -- 'discovery', 'request-proposal', 'locate-map', 'apprenticeship', etc.
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    subtext TEXT NOT NULL,
    page_subtitle TEXT,
    footer_text TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT NOT NULL,
    target_href TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Service Offerings (Comprehensive, Piecework, Consultation/Retainer)
CREATE TABLE IF NOT EXISTS public.service_offerings (
    id VARCHAR(50) PRIMARY KEY,                                      -- SEO LOCKED: 'comprehensive-services', 'piecework-services', 'consultation-retainer-services'
    title TEXT NOT NULL,                                             -- SEO LOCKED
    section_tag TEXT NOT NULL DEFAULT 'services | kaya',
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    extra_description TEXT,
    image_url TEXT,
    subtext TEXT NOT NULL,
    pillars JSONB NOT NULL DEFAULT '[]'::jsonb,                      -- [{ title, desc }]
    content_columns JSONB NOT NULL DEFAULT '[]'::jsonb,              -- Accordion columns / deliverables
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3B. Service Accordions (Dynamic Modular Deliverables & Subpage Sections)
CREATE TABLE IF NOT EXISTS public.service_accordions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(50) NOT NULL REFERENCES public.service_offerings(id) ON DELETE CASCADE,
    column_index INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link_text TEXT,
    link_href TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Process Philosophies (Values, Integrity, Culture)
CREATE TABLE IF NOT EXISTS public.process_philosophies (
    id VARCHAR(50) PRIMARY KEY,                                      -- SEO LOCKED: 'designing-with-values', 'managing-with-integrity', 'building-with-culture'
    title TEXT NOT NULL,                                             -- SEO LOCKED
    section_tag TEXT NOT NULL DEFAULT 'process | paraán',
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    extra_description TEXT,
    image_url TEXT,
    subtext TEXT NOT NULL,
    pillars JSONB NOT NULL DEFAULT '[]'::jsonb,                      -- [{ title, desc }]
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Stage Groups (Dynamic Categories per Process Page)
CREATE TABLE IF NOT EXISTS public.stage_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_page_id VARCHAR(50) NOT NULL REFERENCES public.process_philosophies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                                              -- 'guidance', 'experiential', 'presence', etc.
    col_span INTEGER NOT NULL DEFAULT 4,                             -- Grid column span (e.g. 4 for 3-group row, 6 for 2-group row, 12 for 1-group)
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Process Stages (Dynamic Stages per Process Page and Group)
CREATE TABLE IF NOT EXISTS public.process_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_page_id VARCHAR(50) NOT NULL REFERENCES public.process_philosophies(id) ON DELETE CASCADE,
    stage_group_id UUID REFERENCES public.stage_groups(id) ON DELETE SET NULL,
    step_number VARCHAR(10) NOT NULL,                                -- '01', '02', '03', ..., '07'
    title TEXT NOT NULL,                                             -- e.g. 'Discovery Session'
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    duration TEXT NOT NULL,                                          -- '1 - 2 Weeks', '15 Years', etc.
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Home Slides (Splash Carousel)
CREATE TABLE IF NOT EXISTS public.home_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,                                             -- 'Your Home', 'Your Business', 'Your Office'
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. INBOUND SUBMISSIONS (Form Ingestion)
-- ==============================================================================

-- Grow With Us: Career & Internship Applications
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_type TEXT NOT NULL CHECK (program_type IN ('internship', 'apprenticeship', 'studioRegulars')),
    department TEXT NOT NULL,
    role_applied_id VARCHAR(50) REFERENCES public.roles(id) ON DELETE SET NULL,
    role_applied_title TEXT NOT NULL,
    first_name TEXT NOT NULL,
    pseudonym TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    pronouns TEXT NOT NULL,
    titles TEXT,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    facebook_url TEXT,
    instagram_url TEXT,
    portfolio_link TEXT,
    cover_video_link TEXT,
    resume_file_url TEXT,
    emergency_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
    academic_contacts JSONB NOT NULL DEFAULT '{}'::jsonb,
    attached_documents JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'shortlisted', 'accepted', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partner With Us: Builder, Consultant, and Supplier Inquiries
CREATE TABLE IF NOT EXISTS public.partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant TEXT NOT NULL CHECK (variant IN ('builder', 'consultant', 'supplier')),
    company_name TEXT NOT NULL,
    category_or_specialty TEXT,
    intent_message TEXT NOT NULL,
    representative_first_name TEXT NOT NULL,
    representative_pseudonym TEXT NOT NULL,
    representative_middle_name TEXT,
    representative_last_name TEXT NOT NULL,
    representative_pronouns TEXT NOT NULL,
    representative_titles TEXT,
    addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
    contacts JSONB NOT NULL DEFAULT '[]'::jsonb,
    emails JSONB NOT NULL DEFAULT '[]'::jsonb,
    website_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    profile_link TEXT,
    map_link TEXT,
    license_link TEXT,
    registration_documents JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Discovery Session Bookings
CREATE TABLE IF NOT EXISTS public.discovery_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    client_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    project_site_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    project_category VARCHAR(50) REFERENCES public.project_categories(id) ON DELETE SET NULL,
    project_typology VARCHAR(50) REFERENCES public.project_typologies(id) ON DELETE SET NULL,
    project_type TEXT,
    meeting_type TEXT NOT NULL CHECK (meeting_type IN ('meet-up', 'online')),
    venue TEXT,
    coordinates JSONB,
    cal_booking_id TEXT,
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'conducted', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Request a Proposal Inquiries
CREATE TABLE IF NOT EXISTS public.project_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_entity TEXT NOT NULL,
    business_name TEXT,
    client_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    landline TEXT,
    principal_decision_makers JSONB NOT NULL DEFAULT '[]'::jsonb,
    authorized_representatives JSONB NOT NULL DEFAULT '[]'::jsonb,
    category_id VARCHAR(50) REFERENCES public.project_categories(id) ON DELETE SET NULL,
    typology_id VARCHAR(50) REFERENCES public.project_typologies(id) ON DELETE SET NULL,
    project_type TEXT NOT NULL,
    services TEXT NOT NULL,
    scope TEXT NOT NULL,
    property_area_type TEXT NOT NULL DEFAULT 'tla' CHECK (property_area_type IN ('tla', 'tua')),
    property_area_size TEXT NOT NULL,
    project_site_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    coordinates JSONB,
    construction_budget TEXT NOT NULL,
    target_date DATE,
    superstitions TEXT,
    has_project_manager TEXT,
    additional_info TEXT,
    documents JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'proposal_sent', 'contract_signed', 'declined', 'closed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ==============================================================================

CREATE TRIGGER trg_tracks_updated_at BEFORE UPDATE ON public.tracks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_project_categories_updated_at BEFORE UPDATE ON public.project_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_project_typologies_updated_at BEFORE UPDATE ON public.project_typologies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_contract_types_updated_at BEFORE UPDATE ON public.contract_types FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_people_updated_at BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_career_applications_updated_at BEFORE UPDATE ON public.career_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_partner_applications_updated_at BEFORE UPDATE ON public.partner_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_discovery_sessions_updated_at BEFORE UPDATE ON public.discovery_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_project_proposals_updated_at BEFORE UPDATE ON public.project_proposals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_site_pages_updated_at BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_navigation_cards_updated_at BEFORE UPDATE ON public.navigation_cards FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_service_offerings_updated_at BEFORE UPDATE ON public.service_offerings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_service_accordions_updated_at ON public.service_accordions;
CREATE TRIGGER trg_service_accordions_updated_at
BEFORE UPDATE ON public.service_accordions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_process_philosophies_updated_at BEFORE UPDATE ON public.process_philosophies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_stage_groups_updated_at BEFORE UPDATE ON public.stage_groups FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_process_stages_updated_at BEFORE UPDATE ON public.process_stages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_home_slides_updated_at BEFORE UPDATE ON public.home_slides FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_people_is_draft ON public.people(is_draft);
CREATE INDEX IF NOT EXISTS idx_people_is_currently_hired ON public.people(is_currently_hired);
CREATE INDEX IF NOT EXISTS idx_people_categories ON public.people USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_people_primary_role ON public.people(primary_role_id);
CREATE INDEX IF NOT EXISTS idx_people_track ON public.people(track_id);

CREATE INDEX IF NOT EXISTS idx_projects_is_draft ON public.projects(is_draft);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_typology ON public.projects(typology_id);
CREATE INDEX IF NOT EXISTS idx_projects_contract_type ON public.projects(contract_type_id);

CREATE INDEX IF NOT EXISTS idx_project_contributors_project ON public.project_contributors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_contributors_person ON public.project_contributors(person_id);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON public.project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_person_credentials_person ON public.person_credentials(person_id);

CREATE INDEX IF NOT EXISTS idx_career_applications_status ON public.career_applications(status);
CREATE INDEX IF NOT EXISTS idx_partner_applications_status ON public.partner_applications(status);
CREATE INDEX IF NOT EXISTS idx_discovery_sessions_status ON public.discovery_sessions(status);
CREATE INDEX IF NOT EXISTS idx_project_proposals_status ON public.project_proposals(status);

-- CMS Indexes
CREATE INDEX IF NOT EXISTS idx_site_pages_is_draft ON public.site_pages(is_draft);
CREATE INDEX IF NOT EXISTS idx_navigation_cards_hub ON public.navigation_cards(hub_id, is_draft, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_offerings_is_draft ON public.service_offerings(is_draft, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_accordions_service_id ON public.service_accordions(service_id);
CREATE INDEX IF NOT EXISTS idx_service_accordions_col_sort ON public.service_accordions(service_id, column_index, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_accordions_is_draft ON public.service_accordions(is_draft);

CREATE INDEX IF NOT EXISTS idx_process_philosophies_is_draft ON public.process_philosophies(is_draft, sort_order);
CREATE INDEX IF NOT EXISTS idx_stage_groups_page ON public.stage_groups(process_page_id, is_draft, sort_order);
CREATE INDEX IF NOT EXISTS idx_process_stages_page ON public.process_stages(process_page_id, stage_group_id, is_draft, sort_order);
CREATE INDEX IF NOT EXISTS idx_home_slides_order ON public.home_slides(is_draft, sort_order);

-- ==============================================================================
-- 9. RBAC HELPER FUNCTIONS
-- ==============================================================================

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

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================


ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_accordions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for licenses" ON public.licenses
    FOR SELECT USING (true);
CREATE POLICY "Admin write access for licenses" ON public.licenses
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Public read access for project_roles" ON public.project_roles
    FOR SELECT USING (true);
CREATE POLICY "Admin write access for project_roles" ON public.project_roles
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Public can view published service accordions"
    ON public.service_accordions FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can manage service accordions"
    ON public.service_accordions FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_typologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_philosophies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_slides ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. Master Reference Tables (tracks, roles, categories, typologies, contract_types)
-- Public can READ. Superadmin can CRUD.
-- ------------------------------------------------------------------------------

-- Tracks
CREATE POLICY "Public can view tracks" ON public.tracks FOR SELECT USING (TRUE);
CREATE POLICY "Superadmin can manage tracks" ON public.tracks FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- Roles
CREATE POLICY "Public can view active roles" ON public.roles FOR SELECT USING (TRUE);
CREATE POLICY "Superadmin can manage roles" ON public.roles FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- Project Categories
CREATE POLICY "Public can view project categories" ON public.project_categories FOR SELECT USING (TRUE);
CREATE POLICY "Superadmin can manage project categories" ON public.project_categories FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- Project Typologies
CREATE POLICY "Public can view project typologies" ON public.project_typologies FOR SELECT USING (TRUE);
CREATE POLICY "Superadmin can manage project typologies" ON public.project_typologies FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- Contract Types
CREATE POLICY "Public can view contract types" ON public.contract_types FOR SELECT USING (TRUE);
CREATE POLICY "Superadmin can manage contract types" ON public.contract_types FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- ------------------------------------------------------------------------------
-- B. People & Credentials
-- Public: SELECT published (is_draft = FALSE)
-- Superadmin: Full CRUD
-- Admin: CRU (Create, Read, Update)
-- Editor: Read-only
-- ------------------------------------------------------------------------------

-- People
CREATE POLICY "Public can view published people"
    ON public.people FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can create people"
    ON public.people FOR INSERT
    TO authenticated
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Admin and Superadmin can update people"
    ON public.people FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Only Superadmin can delete people"
    ON public.people FOR DELETE
    TO authenticated
    USING (public.is_superadmin());

-- Person Credentials
CREATE POLICY "Public can view credentials of published people"
    ON public.person_credentials FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.people
            WHERE public.people.id = person_credentials.person_id
            AND (public.people.is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
        )
    );

CREATE POLICY "Admin and Superadmin can manage credentials"
    ON public.person_credentials FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- ------------------------------------------------------------------------------
-- C. Projects & Media
-- Public: SELECT published (is_draft = FALSE)
-- Superadmin: Full CRUD
-- Admin: CRU (Create, Read, Update)
-- Editor: CRU (Create, Read, Update)
-- ------------------------------------------------------------------------------

-- Projects
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Superadmin, Admin, and Editor can create projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Superadmin, Admin, and Editor can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Only Superadmin can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (public.is_superadmin());

-- Project Media
CREATE POLICY "Public can view media of published projects"
    ON public.project_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE public.projects.id = project_media.project_id
            AND (public.projects.is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
        )
    );

CREATE POLICY "Superadmin, Admin, and Editor can manage project media"
    ON public.project_media FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

-- ------------------------------------------------------------------------------
-- D. Project Contributors (Join Table)
-- Public: SELECT involvements for published projects
-- Superadmin: Full CRUD
-- Admin: CRU
-- Editor: CRU (assigning existing people to projects)
-- ------------------------------------------------------------------------------

CREATE POLICY "Public can view contributors of published projects"
    ON public.project_contributors FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE public.projects.id = project_contributors.project_id
            AND (public.projects.is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
        )
    );

CREATE POLICY "Superadmin, Admin, and Editor can create project involvements"
    ON public.project_contributors FOR INSERT
    TO authenticated
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Superadmin, Admin, and Editor can update project involvements"
    ON public.project_contributors FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Superadmin and Admin can remove project involvements"
    ON public.project_contributors FOR DELETE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- ------------------------------------------------------------------------------
-- E. Site Settings (General Info)
-- Public: SELECT
-- Superadmin: Full CRUD
-- Admin: Read, Update
-- Editor: Read-only
-- ------------------------------------------------------------------------------

CREATE POLICY "Public can read site settings"
    ON public.site_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Admin and Superadmin can update site settings"
    ON public.site_settings FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Superadmin can manage site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (public.is_superadmin())
    WITH CHECK (public.is_superadmin());

-- ------------------------------------------------------------------------------
-- E2. Content Management System (CMS) Tables
-- Public: SELECT published (is_draft = FALSE)
-- Superadmin: Full CRUD
-- Admin: CRU on Pages & Philosophies (SEO-locked), CRUD on Stage Groups, Stages, Cards, Slides
-- Editor: Read-only (including drafts)
-- ------------------------------------------------------------------------------

-- Site Pages
CREATE POLICY "Public can view published site pages"
    ON public.site_pages FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can update site pages"
    ON public.site_pages FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Superadmin can manage site pages"
    ON public.site_pages FOR ALL
    TO authenticated
    USING (public.is_superadmin())
    WITH CHECK (public.is_superadmin());

-- Navigation Cards
CREATE POLICY "Public can view published navigation cards"
    ON public.navigation_cards FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can manage navigation cards"
    ON public.navigation_cards FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Superadmin can delete navigation cards"
    ON public.navigation_cards FOR DELETE
    TO authenticated
    USING (public.is_superadmin());

-- Service Offerings
CREATE POLICY "Public can view published service offerings"
    ON public.service_offerings FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can update service offerings"
    ON public.service_offerings FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Superadmin can manage service offerings"
    ON public.service_offerings FOR ALL
    TO authenticated
    USING (public.is_superadmin())
    WITH CHECK (public.is_superadmin());

-- Process Philosophies
CREATE POLICY "Public can view published process philosophies"
    ON public.process_philosophies FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can update process philosophies"
    ON public.process_philosophies FOR UPDATE
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Superadmin can manage process philosophies"
    ON public.process_philosophies FOR ALL
    TO authenticated
    USING (public.is_superadmin())
    WITH CHECK (public.is_superadmin());

-- Stage Groups (Dynamic Categories per Process Page)
CREATE POLICY "Public can view published stage groups"
    ON public.stage_groups FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can manage stage groups"
    ON public.stage_groups FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- Process Stages (Dynamic Stages per Page)
CREATE POLICY "Public can view published process stages"
    ON public.process_stages FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can manage process stages"
    ON public.process_stages FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- Home Slides (Splash Carousel)
CREATE POLICY "Public can view published home slides"
    ON public.home_slides FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can manage home slides"
    ON public.home_slides FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- ------------------------------------------------------------------------------
-- F. Inbound Form Submissions
-- Public: INSERT (submit forms)
-- Admin & Superadmin: SELECT, UPDATE (review and process)
-- Superadmin: DELETE
-- ------------------------------------------------------------------------------

-- Career Applications
CREATE POLICY "Public can submit career applications" ON public.career_applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin and Superadmin can view career applications" ON public.career_applications FOR SELECT TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Admin and Superadmin can update career applications" ON public.career_applications FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can delete career applications" ON public.career_applications FOR DELETE TO authenticated USING (public.is_superadmin());

-- Partner Applications
CREATE POLICY "Public can submit partner applications" ON public.partner_applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin and Superadmin can view partner applications" ON public.partner_applications FOR SELECT TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Admin and Superadmin can update partner applications" ON public.partner_applications FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can delete partner applications" ON public.partner_applications FOR DELETE TO authenticated USING (public.is_superadmin());

-- Discovery Sessions
CREATE POLICY "Public can schedule discovery sessions" ON public.discovery_sessions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin and Superadmin can view discovery sessions" ON public.discovery_sessions FOR SELECT TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Admin and Superadmin can update discovery sessions" ON public.discovery_sessions FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can delete discovery sessions" ON public.discovery_sessions FOR DELETE TO authenticated USING (public.is_superadmin());

-- Project Proposals
CREATE POLICY "Public can submit project proposals" ON public.project_proposals FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin and Superadmin can view project proposals" ON public.project_proposals FOR SELECT TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Admin and Superadmin can update project proposals" ON public.project_proposals FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can delete project proposals" ON public.project_proposals FOR DELETE TO authenticated USING (public.is_superadmin());

-- ------------------------------------------------------------------------------
-- G. Admin Users (Account Roles)
-- Superadmin only for management. Admin users can view their own profile.
-- ------------------------------------------------------------------------------

CREATE POLICY "Users can read own admin profile"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_superadmin());

CREATE POLICY "Superadmin has full control over admin users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.is_superadmin())
    WITH CHECK (public.is_superadmin());

-- ==============================================================================
-- 11. STORAGE BUCKETS SETUP & SECURITY POLICIES
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES
    ('portfolio-media', 'portfolio-media', TRUE),
    ('career-documents', 'career-documents', FALSE),
    ('partner-documents', 'partner-documents', FALSE),
    ('proposal-documents', 'proposal-documents', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Public bucket: portfolio-media
DROP POLICY IF EXISTS "Public can read portfolio media" ON storage.objects;
CREATE POLICY "Public can read portfolio media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Admins and Editors can upload portfolio media" ON storage.objects;
CREATE POLICY "Admins and Editors can upload portfolio media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media' AND public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Admins and Editors can update portfolio media" ON storage.objects;
CREATE POLICY "Admins and Editors can update portfolio media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

DROP POLICY IF EXISTS "Only Superadmin can delete portfolio media" ON storage.objects;
CREATE POLICY "Only Superadmin can delete portfolio media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND public.is_superadmin());

-- Private Intake Buckets: Public can upload during form submissions, Admins can read
DROP POLICY IF EXISTS "Public can upload career documents" ON storage.objects;
CREATE POLICY "Public can upload career documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'career-documents');

DROP POLICY IF EXISTS "Admins can view career documents" ON storage.objects;
CREATE POLICY "Admins can view career documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'career-documents' AND public.get_current_admin_role() IN ('superadmin', 'admin'));

DROP POLICY IF EXISTS "Public can upload partner documents" ON storage.objects;
CREATE POLICY "Public can upload partner documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'partner-documents');

DROP POLICY IF EXISTS "Admins can view partner documents" ON storage.objects;
CREATE POLICY "Admins can view partner documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'partner-documents' AND public.get_current_admin_role() IN ('superadmin', 'admin'));

DROP POLICY IF EXISTS "Public can upload proposal documents" ON storage.objects;
CREATE POLICY "Public can upload proposal documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'proposal-documents');

DROP POLICY IF EXISTS "Admins can view proposal documents" ON storage.objects;
CREATE POLICY "Admins can view proposal documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'proposal-documents' AND public.get_current_admin_role() IN ('superadmin', 'admin'));

-- ==============================================================================
-- 12. ROLE PRIVILEGES & PERMISSIONS (Crucial for Supabase API access)
-- ==============================================================================
GRANT USAGE, CREATE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;


