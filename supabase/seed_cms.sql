-- ==============================================================================
-- ATBP Collaborative - CMS Content Schema & Seed Data (seed_cms.sql)
-- Standalone script: creates CMS tables, sets up RLS & triggers, and seeds all
-- pages, navigation cards, services, process stage groups, stages, and slides.
-- Run this in the Supabase SQL Editor to initialize or re-seed only the CMS items.
-- ==============================================================================

-- 1. CREATE CMS TABLES (IF NOT ALREADY CREATED)
-- ------------------------------------------------------------------------------

-- Site Pages (Hubs & General Routes with SEO-locked titles/slugs)
CREATE TABLE IF NOT EXISTS public.site_pages (
    id VARCHAR(100) PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    hero_image_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Navigation Cards (Hub Grid Cards)
CREATE TABLE IF NOT EXISTS public.navigation_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id VARCHAR(50) NOT NULL,
    card_key VARCHAR(50) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    subtext TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT NOT NULL,
    target_href TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Service Offerings (Comprehensive, Piecework, Consultation/Retainer)
CREATE TABLE IF NOT EXISTS public.service_offerings (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    section_tag TEXT NOT NULL DEFAULT 'services | kaya',
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    extra_description TEXT,
    image_url TEXT,
    subtext TEXT NOT NULL,
    pillars JSONB NOT NULL DEFAULT '[]'::jsonb,
    content_columns JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Process Philosophies (Values, Integrity, Culture)
CREATE TABLE IF NOT EXISTS public.process_philosophies (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    section_tag TEXT NOT NULL DEFAULT 'process | paraán',
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    extra_description TEXT,
    image_url TEXT,
    subtext TEXT NOT NULL,
    pillars JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stage Groups (Dynamic Categories per Process Page)
CREATE TABLE IF NOT EXISTS public.stage_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_page_id VARCHAR(50) NOT NULL REFERENCES public.process_philosophies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    col_span INTEGER NOT NULL DEFAULT 4,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Process Stages (Dynamic Stages per Process Page and Group)
CREATE TABLE IF NOT EXISTS public.process_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_page_id VARCHAR(50) NOT NULL REFERENCES public.process_philosophies(id) ON DELETE CASCADE,
    stage_group_id UUID REFERENCES public.stage_groups(id) ON DELETE SET NULL,
    step_number VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    duration TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Home Slides (Splash Carousel)
CREATE TABLE IF NOT EXISTS public.home_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENABLE RLS & CREATE POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_philosophies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_slides ENABLE ROW LEVEL SECURITY;

-- Drop existing CMS policies if any to prevent conflict on re-run
DROP POLICY IF EXISTS "Public can view published site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admin and Superadmin can update site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Superadmin can manage site pages" ON public.site_pages;

DROP POLICY IF EXISTS "Public can view published navigation cards" ON public.navigation_cards;
DROP POLICY IF EXISTS "Admin and Superadmin can manage navigation cards" ON public.navigation_cards;
DROP POLICY IF EXISTS "Superadmin can delete navigation cards" ON public.navigation_cards;

DROP POLICY IF EXISTS "Public can view published service offerings" ON public.service_offerings;
DROP POLICY IF EXISTS "Admin and Superadmin can update service offerings" ON public.service_offerings;
DROP POLICY IF EXISTS "Superadmin can manage service offerings" ON public.service_offerings;

DROP POLICY IF EXISTS "Public can view published process philosophies" ON public.process_philosophies;
DROP POLICY IF EXISTS "Admin and Superadmin can update process philosophies" ON public.process_philosophies;
DROP POLICY IF EXISTS "Superadmin can manage process philosophies" ON public.process_philosophies;

DROP POLICY IF EXISTS "Public can view published stage groups" ON public.stage_groups;
DROP POLICY IF EXISTS "Admin and Superadmin can manage stage groups" ON public.stage_groups;

DROP POLICY IF EXISTS "Public can view published process stages" ON public.process_stages;
DROP POLICY IF EXISTS "Admin and Superadmin can manage process stages" ON public.process_stages;

DROP POLICY IF EXISTS "Public can view published home slides" ON public.home_slides;
DROP POLICY IF EXISTS "Admin and Superadmin can manage home slides" ON public.home_slides;

-- Create CMS Policies
CREATE POLICY "Public can view published site pages" ON public.site_pages FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can update site pages" ON public.site_pages FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can manage site pages" ON public.site_pages FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

CREATE POLICY "Public can view published navigation cards" ON public.navigation_cards FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can manage navigation cards" ON public.navigation_cards FOR ALL TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can delete navigation cards" ON public.navigation_cards FOR DELETE TO authenticated USING (public.is_superadmin());

CREATE POLICY "Public can view published service offerings" ON public.service_offerings FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can update service offerings" ON public.service_offerings FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can manage service offerings" ON public.service_offerings FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

CREATE POLICY "Public can view published process philosophies" ON public.process_philosophies FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can update process philosophies" ON public.process_philosophies FOR UPDATE TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));
CREATE POLICY "Superadmin can manage process philosophies" ON public.process_philosophies FOR ALL TO authenticated USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

CREATE POLICY "Public can view published stage groups" ON public.stage_groups FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can manage stage groups" ON public.stage_groups FOR ALL TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Public can view published process stages" ON public.process_stages FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can manage process stages" ON public.process_stages FOR ALL TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

CREATE POLICY "Public can view published home slides" ON public.home_slides FOR SELECT USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));
CREATE POLICY "Admin and Superadmin can manage home slides" ON public.home_slides FOR ALL TO authenticated USING (public.get_current_admin_role() IN ('superadmin', 'admin')) WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- 3. SEED CMS DATA (IDEMPOTENT INSERTS WITH ON CONFLICT DO UPDATE)
-- ------------------------------------------------------------------------------

-- Slogans & Subtext
INSERT INTO public.site_settings (key, content) VALUES
('homepage_slogans', '{"slogans":["designed with values.","managed with integrity.","built with culture."],"heroSubtext":["ATBP Collaborative delivers bespoke architectural design, master planning, and structural craft.","Bridging visionary spatial concepts with honest Philippines building execution across all scales."]}'::jsonb)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- Site Pages
INSERT INTO public.site_pages (id, title, subtitle, hero_image_url, is_draft) VALUES
('services-hub', 'our services', 'Discover our flexible contract types and comprehensive architectural capabilities tailored to your project scale and scope.', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_services_img_1785469964556.jpg', FALSE),
('process-hub', 'our process', 'Purpose-built responses for one-of-a-kind briefs', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_process_img_1785469980353.jpg', FALSE),
('contact-hub', 'contact & channels', 'Inquiries, physical visits, collaborations and careers', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg', FALSE),
('case-study-house', 'the case study house', 'explore case study house project types and collaborative offerings', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_case_study_house_img_1785469986420.jpg', FALSE),
('grow-with-us', 'grow with us', 'careers, apprenticeships & internships', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_people_img_1785469993286.jpg', FALSE),
('partner-with-us', 'partner with us', 'trade contractors, engineering specialists & material suppliers', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg', FALSE),
('works', 'gawâ', 'a curated portfolio of shelter, livelihood, and community architecture across the Philippines.', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/hero_modern_villa_1783495183350.jpg', FALSE)
ON CONFLICT (id) DO UPDATE SET 
    subtitle = EXCLUDED.subtitle, hero_image_url = EXCLUDED.hero_image_url, is_draft = EXCLUDED.is_draft, updated_at = NOW();

-- Navigation Cards
INSERT INTO public.navigation_cards (hub_id, card_key, title, tagline, subtext, tags, image_url, target_href, sort_order, is_draft) VALUES
('case-study-house', 'discovery', 'schedule a discovery session', 'intake, spatial goals & consultation', 'for project intake, site feasibility & spatial planning consultations', ARRAY['Project Intake', 'Design Brief', 'Spatial Requirements'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_services_img_1785469964556.jpg', '/contact/case-study-house/discovery-session', 10, FALSE),
('case-study-house', 'request-proposal', 'request a proposal', 'project scoping & preliminary quotations', 'for official cost estimates and formal project proposals', ARRAY['Quotations', 'Project Scoping', 'Proposals'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg', '/contact/case-study-house/request-for-proposal', 20, FALSE),
('case-study-house', 'locate-map', 'studio hours & location', 'headquarters, address & contact channels', 'for physical visits, interactive map & contact coordinates', ARRAY['Parañaque City', 'Interactive Map', 'Viber & Email'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg', '/contact/contact-info', 30, FALSE),
('grow-with-us', 'apprenticeship', 'apprenticeship programs', 'for on-the-job training requirements', 'for on-the-job training requirements', ARRAY['Junior Architect', 'Licensure Support', 'Site Experience'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_people_img_1785469993286.jpg', '/contact/grow-with-us/apprenticeship-programs', 10, FALSE),
('grow-with-us', 'studio-regulars', 'regular programs', 'for professionals', 'for professionals', ARRAY['Registered Architect', 'Project Director', 'Design Lead'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg', '/contact/grow-with-us/regular-programs', 20, FALSE),
('partner-with-us', 'suppliers', 'suppliers', 'for material suppliers & trade product specs', 'for material suppliers & trade product specs', ARRAY['Finish Materials', 'Structural Supplies', 'Fixtures'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/kiosk_coffee_bar_1783495252161.jpg', '/contact/partner-with-us/supplier', 10, FALSE),
('partner-with-us', 'consultants', 'consultants', 'for engineering & specialty consultants', 'for engineering & specialty consultants', ARRAY['Structural Engineers', 'MEPFS Designers', 'Environmental'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg', '/contact/partner-with-us/consultant', 20, FALSE),
('partner-with-us', 'builders', 'builders', 'for trade contractors & specialty builders', 'for trade contractors & specialty builders', ARRAY['General Contractors', 'Millwork Specialists', 'Metal Fabricators'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_process_img_1785469980353.jpg', '/contact/partner-with-us/builder', 30, FALSE),
('process', 'designing-with-values', 'designing with values', 'purpose-driven spatial concepts anchored in environmental & social context', 'designing spaces that respect context, microclimate, and the human experience.', ARRAY['Microclimate', 'Human-Centric', 'Vernacular'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_case_study_house_img_1785469986420.jpg', '/studio/our-process/designing-with-values', 10, FALSE),
('process', 'managing-with-integrity', 'managing with integrity', 'uncompromising fiscal clarity, transparent procurement & rigorous oversight', 'ensuring project success through transparent procurement and uncompromising oversight.', ARRAY['Open-Book Budget', 'Transparent Bids', 'Milestones'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg', '/studio/our-process/managing-with-integrity', 20, FALSE),
('process', 'building-with-culture', 'building with culture', 'synthesizing regional craftsmanship with modern architectural technology', 'honoring regional craftsmanship by integrating traditional artisan techniques with modern standards.', ARRAY['Artisan Guilds', 'Regional Materials', 'Craftsmanship'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_process_img_1785469980353.jpg', '/studio/our-process/building-with-culture', 30, FALSE),
('studio', 'services', 'services', 'comprehensive & piecework services', 'explore our flexible contract types and architectural scopes', ARRAY['Full Architecture', 'Engineering', 'Modular Detailing'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-services-card.jpg', '/studio/our-services', 10, FALSE),
('studio', 'process', 'process', 'design, manage, build with integrity', 'learn how we design, manage, and build with purpose', ARRAY['Double Diamond', 'Values', 'Culture'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-process-card.jpg', '/studio/our-process', 20, FALSE),
('studio', 'people', 'people', 'our designers, managers & builders', 'meet the multidisciplinary team behind ATBP Collaborative', ARRAY['Designers', 'Managers', 'Builders'], 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-people-card.jpg', '/studio/our-people', 30, FALSE)
ON CONFLICT (card_key) DO UPDATE SET 
    title = EXCLUDED.title, tagline = EXCLUDED.tagline, subtext = EXCLUDED.subtext, tags = EXCLUDED.tags, image_url = EXCLUDED.image_url, target_href = EXCLUDED.target_href, sort_order = EXCLUDED.sort_order, is_draft = EXCLUDED.is_draft, updated_at = NOW();

-- Service Offerings
INSERT INTO public.service_offerings (id, title, section_tag, tagline, description, extra_description, image_url, subtext, pillars, content_columns, sort_order, is_draft) VALUES
('comprehensive-services', 'comprehensive services', 'services | kaya', 'full-lifecycle architectural design, technical engineering, & turnkey delivery', 'End-to-end design and building management from initial site evaluation, conceptual design, regulatory approvals, through technical detailing, construction oversight, and final project handover.', NULL, 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/hero_modern_villa_1783495183350.jpg', 'From concept to turnkey delivery, we guide every detail of your vision to reality.', '[{"title":"Full Architectural Masterplanning","desc":"Integrated spatial design, exterior form development, and interior zoning tailored to site topology and lifestyle."},{"title":"Engineering & MEPFS Integration","desc":"Comprehensive structural calculation, electrical, plumbing, mechanical, and fire protection coordination."},{"title":"Permitting & Bureaucratic Approvals","desc":"Full regulatory compliance, local government approvals, and environmental clearance documentation."},{"title":"Turnkey Construction Supervision","desc":"On-site quality audits, material inspection, schedule tracking, and seamless contractor direction."}]'::jsonb, '[{"title":"Comprehensive Design Services","paragraphs":["Our design process is rooted in a deep understanding of your vision, lifestyle, and the unique characteristics of your site.","We integrate architectural planning, interior design, and engineering to create cohesive spaces that are both beautiful and functional.","As a design-build studio, we prioritize constructability and material intelligence from the very beginning, ensuring that every design decision aligns with your budget and timeline.","We navigate the complexities of local zoning, building codes, and environmental regulations, streamlining the path to construction."],"linkText":"Learn more about our process in designing","href":"/studio/our-process/designing-with-values"},{"title":"Comprehensive Management Services","paragraphs":["Effective project management is the bridge between a great design and a successful build.","We oversee every phase of the project, from initial cost estimation and value engineering to procurement and scheduling.","Our team acts as your single point of contact, coordinating with specialized consultants, suppliers, and local authorities to keep the project on track.","By maintaining rigorous quality control and transparent communication, we mitigate risks and ensure that the final result exceeds expectations."],"linkText":"Understand how we manage projects","href":"/studio/our-process/managing-with-integrity"},{"title":"Building Construction Services","paragraphs":["Construction is where our designs come to life. We bring decades of hands-on experience and a network of trusted craftsmen to every project.","Our build teams work in tandem with our designers, fostering a collaborative environment that quickly resolves on-site challenges without compromising the design intent.","We employ advanced construction methodologies and sustainable practices to deliver structures of enduring quality and performance.","From groundbreaking to final handover, we are committed to safety, efficiency, and unparalleled craftsmanship in every detail."],"linkText":"Validate our capabilities as Builder","href":"/studio/our-process/building-with-culture"}]'::jsonb, 10, FALSE),

('piecework-services', 'piecework services', 'services | kaya', 'modular technical detailing, targeted consulting & specialized scopes', 'Flexible, specialized engagements designed to resolve critical project bottlenecks, refine complex architectural detailing, or provide expert peer reviews without full turnkey commitments.', NULL, 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/kiosk_coffee_bar_1783495252161.jpg', 'Targeted architectural solutions and independent technical reviews for bespoke requirements.', '[{"title":"Architectural Working Drawings","desc":"High-precision technical drafting, construction details, and construction-ready drawing packages."},{"title":"Joinery & Facade Detailing","desc":"Bespoke architectural metalwork, millwork, custom fenestration, and enclosure assemblies."},{"title":"Peer Review & Value Engineering","desc":"Independent auditing of third-party blueprints to optimize costs, constructability, and code compliance."},{"title":"Material Specification Audits","desc":"Specialized procurement advisory, finish schedules, and performance material sourcing."}]'::jsonb, '[{"items":[{"title":"Architectural Interiors","content":"Custom interior spatial design focusing on finishes, millwork detailing, ceiling layout, and built-in furniture coordination. We bridge shell design with internal tactility."},{"title":"Lighting Design","content":"Fixture specification, reflected ceiling plans, lux level calculations, and circuit zoning. Crafted to amplify space utility, mood, and material textures."},{"title":"Site Planning","content":"Analyzing solar pathing, typography setbacks, accessibility routing, and easement compliance to optimize building footprint placement on your specific land."}]},{"items":[{"title":"Document & Assessment","content":"Comprehensive auditing of existing blueprints, structural condition reports, spatial efficiency analysis, and code compliance assessments for pre-construction."},{"title":"Code Compliance","content":"Rigorous validation of design plans against building codes, zoning regulations, fire safety policies, and local city ordinances to guarantee permit approvals."},{"title":"Permit Processing","content":"End-to-end administration of governmental approvals, environmental clearances, utility permits, and barangay/city hall certifications."}]},{"items":[{"title":"Masonry","content":"Detailed specifications for stone cladding, brick bonding, retaining wall structures, load-bearing concrete blocks, and external masonry finishes."},{"title":"Paint Jobs","content":"Specification of coating schedules, primer selections, anti-microbial interior paints, weatherproofing exterior paint systems, and custom color swatches."}]}]'::jsonb, 20, FALSE),

('consultation-retainer-services', 'consultation & retainer services', 'services | kaya', 'ongoing architectural guidance, strategic advisory & long-term partnerships', 'Continuous, expert architectural advice designed for ongoing developments, portfolio management, or phased projects that require strategic oversight and flexible, on-demand consultation.', NULL, 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_services_img_1785469964556.jpg', 'Strategic architectural guidance and design governance for complex, phased projects.', '[{"title":"Strategic Project Advisory","desc":"High-level architectural consulting to evaluate masterplans, spatial viability, and long-term asset value."},{"title":"Feasibility & Zoning Audits","desc":"Preliminary site assessments, land use compliance checks, and regulatory risk analysis before capital commitment."},{"title":"Design Direction Retainers","desc":"Ongoing architectural stewardship for brands and developers requiring continuous design oversight."},{"title":"Independent Technical Auditing","desc":"Objective quality reviews, contractor milestone verification, and material compliance inspections."}]'::jsonb, '[{"title":"Consultation","content":"Flexible, on-demand advisory sessions covering project feasibility, site evaluations, budget estimation, layout advice, and design critiques. Perfect for resolving specific design crossroads without long-term commitments."},{"title":"Retainer","content":"Continuous architectural partner support for phased developments, multi-property portfolios, and long-term asset management. Ensures ongoing design control, contractor alignment, and quality supervision over extended timelines."}]'::jsonb, 30, FALSE)
ON CONFLICT (id) DO UPDATE SET 
    tagline = EXCLUDED.tagline, description = EXCLUDED.description, extra_description = EXCLUDED.extra_description, image_url = EXCLUDED.image_url, subtext = EXCLUDED.subtext, pillars = EXCLUDED.pillars, content_columns = EXCLUDED.content_columns, sort_order = EXCLUDED.sort_order, is_draft = EXCLUDED.is_draft, updated_at = NOW();

-- Process Philosophies
INSERT INTO public.process_philosophies (id, title, section_tag, tagline, description, extra_description, image_url, subtext, pillars, sort_order, is_draft) VALUES
('designing-with-values', 'designing with values', 'process | paraán', 'purpose-driven spatial concepts anchored in environmental & social context', 'Our design methodology begins with deep contextual listening—ensuring every spatial form respects microclimates, community heritage, resource stewardship, and long-term utility.', 'Every decision we make in the design phase is guided by a commitment to environmental stewardship and human-centric ergonomics. We strive to build enduring structures that act as positive forces within their respective ecologies and communities.', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_case_study_house_img_1785469986420.jpg', 'Designing spaces that respect context, microclimate, and the human experience.', '[{"title":"Passive Environmental Response","desc":"Optimizing natural light, cross-ventilation, and solar orientation to minimize operational energy loads."},{"title":"Material Integrity & Circularity","desc":"Prioritizing non-toxic, locally harvested, and enduring building materials that age with grace."},{"title":"Human-Centric Spatial Ergonomics","desc":"Crafting spaces that nurture emotional wellbeing, intuitive navigation, and multi-generational adaptability."},{"title":"Vernacular & Cultural Adaptation","desc":"Harmonizing contemporary spatial minimalism with regional architectural heritage and micro-histories."}]'::jsonb, 10, FALSE),

('managing-with-integrity', 'managing with integrity', 'process | paraán', 'uncompromising fiscal clarity, transparent procurement & rigorous oversight', 'A discipline of project stewardship built on open-book budgeting, transparent contractor bidding, strict schedule milestones, and zero hidden markups.', 'We champion full transparency throughout the lifecycle of every project. By enforcing open-book budgeting and uncompromised quality standards, we protect our clients'' investments and deliver spaces exactly as envisioned, without hidden surprises.', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg', 'Ensuring project success through transparent procurement and uncompromising oversight.', '[{"title":"Open-Book Financial Reporting","desc":"Real-time cost tracking and transparent line-item breakdowns with complete client visibility."},{"title":"Competitive Vendor Bidding","desc":"Unbiased contractor evaluation and transparent bid comparisons to protect project capital."},{"title":"Milestone Verification","desc":"Strict payment releases tied directly to verified site completion and quality benchmarks."},{"title":"Proactive Risk Mitigation","desc":"Pre-emptive issue resolution, delay tracking, and safety compliance protocols."}]'::jsonb, 20, FALSE),

('building-with-culture', 'building with culture', 'process | paraán', 'synthesizing regional craftsmanship with modern architectural technology', 'Bridging time-honored local artisan techniques with modern structural standards to craft buildings deeply rooted in place, character, and tactile permanence.', 'We believe that true sustainability involves preserving cultural heritage and empowering local artisans. By integrating time-honored building techniques with contemporary standards, we create spaces that resonate with history while serving modern needs.', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_process_img_1785469980353.jpg', 'Honoring regional craftsmanship by integrating traditional artisan techniques with modern standards.', '[{"title":"Artisan & Guild Collaboration","desc":"Partnering directly with local woodcarvers, stonemasons, weavers, and metal fabricators."},{"title":"Regional Material Sourcing","desc":"Utilizing indigenous timbers, volcanic stone, bamboo composites, and local aggregates."},{"title":"Hybrid Construction Technology","desc":"Pairing modern engineered steel and concrete with hand-crafted natural finishes."},{"title":"Community Skill Empowerment","desc":"Investing in local labor force training and supporting traditional building guilds."}]'::jsonb, 30, FALSE)
ON CONFLICT (id) DO UPDATE SET 
    tagline = EXCLUDED.tagline, description = EXCLUDED.description, extra_description = EXCLUDED.extra_description, image_url = EXCLUDED.image_url, subtext = EXCLUDED.subtext, pillars = EXCLUDED.pillars, sort_order = EXCLUDED.sort_order, is_draft = EXCLUDED.is_draft, updated_at = NOW();

-- Stage Groups (Dynamic Category Groups per Process Page)
INSERT INTO public.stage_groups (id, process_page_id, name, col_span, sort_order, is_draft) VALUES
-- Designing with Values
('a0000001-0000-0000-0000-000000000001', 'designing-with-values', 'guidance', 4, 10, FALSE),
('a0000001-0000-0000-0000-000000000002', 'designing-with-values', 'experiential', 4, 20, FALSE),
('a0000001-0000-0000-0000-000000000003', 'designing-with-values', 'presence', 4, 30, FALSE),

-- Managing with Integrity
('a0000002-0000-0000-0000-000000000001', 'managing-with-integrity', 'guidance', 4, 10, FALSE),
('a0000002-0000-0000-0000-000000000002', 'managing-with-integrity', 'experiential', 4, 20, FALSE),
('a0000002-0000-0000-0000-000000000003', 'managing-with-integrity', 'presence', 4, 30, FALSE),

-- Building with Culture
('a0000003-0000-0000-0000-000000000001', 'building-with-culture', 'guidance', 4, 10, FALSE),
('a0000003-0000-0000-0000-000000000002', 'building-with-culture', 'experiential', 4, 20, FALSE),
('a0000003-0000-0000-0000-000000000003', 'building-with-culture', 'presence', 4, 30, FALSE)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, col_span = EXCLUDED.col_span, sort_order = EXCLUDED.sort_order, is_draft = EXCLUDED.is_draft, updated_at = NOW();

-- Process Stages (Dynamic Stages per Page & Group)
INSERT INTO public.process_stages (id, process_page_id, stage_group_id, step_number, title, subtitle, description, deliverables, duration, sort_order, is_draft) VALUES
-- Designing with Values
('b0000001-0000-0000-0000-000000000001', 'designing-with-values', 'a0000001-0000-0000-0000-000000000001', '01', 'Discovery Session', 'Initial Consultation & Strategic Alignment', 'An initial casual 2-hour online consultation or in-person session where we align on project scale, site context, vision, and target budget bounds with zero commitment required.', ARRAY['Client Brief & Vision Definition', 'Site & Zoning Feasibility Assessment', 'Budget & Timeline Expectations Alignment', 'Non-Binding Pre-Design Roadmap'], '1 - 2 Weeks', 10, FALSE),
('b0000001-0000-0000-0000-000000000002', 'designing-with-values', 'a0000001-0000-0000-0000-000000000001', '02', 'Proposal Review', 'Tailored Scope of Services & Commercial Alignment', 'We submit a comprehensive, transparent design-build proposal outlining project scope, deliverables, team structure, and milestone payment schedules for client alignment.', ARRAY['Detailed Scope of Architectural Services', 'Phase-by-Phase Deliverables Checklist', 'Transparent Fee Structure & Payment Terms', 'Project Master Schedule'], '1 - 2 Weeks', 20, FALSE),
('b0000001-0000-0000-0000-000000000003', 'designing-with-values', 'a0000001-0000-0000-0000-000000000001', '03', 'Contract Review', 'Formalizing Service Agreements & Governance', 'We draft and finalize notarized service agreements mapping out precise legal responsibilities, project milestones, quality guarantees, and progressive payment stages.', ARRAY['Notarized Architectural Service Agreement', 'Defined Progressive Payment Schedule', 'Legal & Regulatory Compliance Framework', 'Milestone Verification Protocols'], '1 Week', 30, FALSE),
('b0000001-0000-0000-0000-000000000004', 'designing-with-values', 'a0000001-0000-0000-0000-000000000002', '04', 'Design Stage', 'Spatial Programming & Conceptual Massing', 'Guided by the Double Diamond design framework, we analyze site orientation, solar diagnostics, and spatial requirements to synthesize schematic floor layouts and 3D architectural massing.', ARRAY['Solar & Environmental Diagnostics', 'Spatial Programming Matrix', 'Schematic Architectural Floor Plans', '3D Volumetric Concept Models'], '4 - 8 Weeks', 40, FALSE),
('b0000001-0000-0000-0000-000000000005', 'designing-with-values', 'a0000001-0000-0000-0000-000000000002', '05', 'Technical Stage', 'BIM Engineering & Permit-Ready Blueprints', 'We refine conceptual designs into high-resolution technical BIM models, integrating structural engineering, MEPFS systems, finish schedules, and construction drawing packages.', ARRAY['High-Resolution Technical BIM Models', 'Integrated Structural & MEPFS Systems', 'Permit-Ready Construction Drawings', 'Material Specifications & Schedules'], '6 - 10 Weeks', 50, FALSE),
('b0000001-0000-0000-0000-000000000006', 'designing-with-values', 'a0000001-0000-0000-0000-000000000002', '06', 'Construction Stage', 'On-Site Execution & Quality Supervision', 'From contractor bidding and procurement to continuous on-site architectural oversight and quality assurance inspections, we safeguard the design intent through turnkey completion.', ARRAY['Contractor Bidding & Procurement Support', 'Continuous On-Site Quality Inspections', 'Material Compliance & Verification', 'Turnkey Handover & Final Sign-Off'], '6 - 18 Months', 60, FALSE),
('b0000001-0000-0000-0000-000000000007', 'designing-with-values', 'a0000001-0000-0000-0000-000000000003', '07', '15-Year Project Support', 'Long-Term Stewardship & Warranty Care', 'Our engagement continues far past move-in day. We provide a 15-year structural and maintenance support protocol to guarantee enduring building performance and client peace of mind.', ARRAY['15-Year Structural Integrity Guarantee', 'Scheduled Post-Occupancy Audits', 'Building Maintenance & Renovation Advice', 'Dedicated Lifetime Client Support Line'], '15 Years', 70, FALSE),

-- Managing with Integrity
('b0000002-0000-0000-0000-000000000001', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000001', '01', 'Discovery Session', 'Initial Consultation & Strategic Alignment', 'An initial casual 2-hour online consultation or in-person session where we align on project scale, site context, vision, and target budget bounds with zero commitment required.', ARRAY['Client Brief & Vision Definition', 'Site & Zoning Feasibility Assessment', 'Budget & Timeline Expectations Alignment', 'Non-Binding Pre-Design Roadmap'], '1 - 2 Weeks', 10, FALSE),
('b0000002-0000-0000-0000-000000000002', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000001', '02', 'Proposal Review', 'Tailored Scope of Services & Commercial Alignment', 'We submit a comprehensive, transparent design-build proposal outlining project scope, deliverables, team structure, and milestone payment schedules for client alignment.', ARRAY['Detailed Scope of Architectural Services', 'Phase-by-Phase Deliverables Checklist', 'Transparent Fee Structure & Payment Terms', 'Project Master Schedule'], '1 - 2 Weeks', 20, FALSE),
('b0000002-0000-0000-0000-000000000003', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000001', '03', 'Contract Review', 'Formalizing Service Agreements & Governance', 'We draft and finalize notarized service agreements mapping out precise legal responsibilities, project milestones, quality guarantees, and progressive payment stages.', ARRAY['Notarized Architectural Service Agreement', 'Defined Progressive Payment Schedule', 'Legal & Regulatory Compliance Framework', 'Milestone Verification Protocols'], '1 Week', 30, FALSE),
('b0000002-0000-0000-0000-000000000004', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000002', '04', 'Design Stage', 'Spatial Programming & Conceptual Massing', 'Guided by the Double Diamond design framework, we analyze site orientation, solar diagnostics, and spatial requirements to synthesize schematic floor layouts and 3D architectural massing.', ARRAY['Solar & Environmental Diagnostics', 'Spatial Programming Matrix', 'Schematic Architectural Floor Plans', '3D Volumetric Concept Models'], '4 - 8 Weeks', 40, FALSE),
('b0000002-0000-0000-0000-000000000005', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000002', '05', 'Technical Stage', 'BIM Engineering & Permit-Ready Blueprints', 'We refine conceptual designs into high-resolution technical BIM models, integrating structural engineering, MEPFS systems, finish schedules, and construction drawing packages.', ARRAY['High-Resolution Technical BIM Models', 'Integrated Structural & MEPFS Systems', 'Permit-Ready Construction Drawings', 'Material Specifications & Schedules'], '6 - 10 Weeks', 50, FALSE),
('b0000002-0000-0000-0000-000000000006', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000002', '06', 'Construction Stage', 'On-Site Execution & Quality Supervision', 'From contractor bidding and procurement to continuous on-site architectural oversight and quality assurance inspections, we safeguard the design intent through turnkey completion.', ARRAY['Contractor Bidding & Procurement Support', 'Continuous On-Site Quality Inspections', 'Material Compliance & Verification', 'Turnkey Handover & Final Sign-Off'], '6 - 18 Months', 60, FALSE),
('b0000002-0000-0000-0000-000000000007', 'managing-with-integrity', 'a0000002-0000-0000-0000-000000000003', '07', '15-Year Project Support', 'Long-Term Stewardship & Warranty Care', 'Our engagement continues far past move-in day. We provide a 15-year structural and maintenance support protocol to guarantee enduring building performance and client peace of mind.', ARRAY['15-Year Structural Integrity Guarantee', 'Scheduled Post-Occupancy Audits', 'Building Maintenance & Renovation Advice', 'Dedicated Lifetime Client Support Line'], '15 Years', 70, FALSE),

-- Building with Culture
('b0000003-0000-0000-0000-000000000001', 'building-with-culture', 'a0000003-0000-0000-0000-000000000001', '01', 'Discovery Session', 'Initial Consultation & Strategic Alignment', 'An initial casual 2-hour online consultation or in-person session where we align on project scale, site context, vision, and target budget bounds with zero commitment required.', ARRAY['Client Brief & Vision Definition', 'Site & Zoning Feasibility Assessment', 'Budget & Timeline Expectations Alignment', 'Non-Binding Pre-Design Roadmap'], '1 - 2 Weeks', 10, FALSE),
('b0000003-0000-0000-0000-000000000002', 'building-with-culture', 'a0000003-0000-0000-0000-000000000001', '02', 'Proposal Review', 'Tailored Scope of Services & Commercial Alignment', 'We submit a comprehensive, transparent design-build proposal outlining project scope, deliverables, team structure, and milestone payment schedules for client alignment.', ARRAY['Detailed Scope of Architectural Services', 'Phase-by-Phase Deliverables Checklist', 'Transparent Fee Structure & Payment Terms', 'Project Master Schedule'], '1 - 2 Weeks', 20, FALSE),
('b0000003-0000-0000-0000-000000000003', 'building-with-culture', 'a0000003-0000-0000-0000-000000000001', '03', 'Contract Review', 'Formalizing Service Agreements & Governance', 'We draft and finalize notarized service agreements mapping out precise legal responsibilities, project milestones, quality guarantees, and progressive payment stages.', ARRAY['Notarized Architectural Service Agreement', 'Defined Progressive Payment Schedule', 'Legal & Regulatory Compliance Framework', 'Milestone Verification Protocols'], '1 Week', 30, FALSE),
('b0000003-0000-0000-0000-000000000004', 'building-with-culture', 'a0000003-0000-0000-0000-000000000002', '04', 'Design Stage', 'Spatial Programming & Conceptual Massing', 'Guided by the Double Diamond design framework, we analyze site orientation, solar diagnostics, and spatial requirements to synthesize schematic floor layouts and 3D architectural massing.', ARRAY['Solar & Environmental Diagnostics', 'Spatial Programming Matrix', 'Schematic Architectural Floor Plans', '3D Volumetric Concept Models'], '4 - 8 Weeks', 40, FALSE),
('b0000003-0000-0000-0000-000000000005', 'building-with-culture', 'a0000003-0000-0000-0000-000000000002', '05', 'Technical Stage', 'BIM Engineering & Permit-Ready Blueprints', 'We refine conceptual designs into high-resolution technical BIM models, integrating structural engineering, MEPFS systems, finish schedules, and construction drawing packages.', ARRAY['High-Resolution Technical BIM Models', 'Integrated Structural & MEPFS Systems', 'Permit-Ready Construction Drawings', 'Material Specifications & Schedules'], '6 - 10 Weeks', 50, FALSE),
('b0000003-0000-0000-0000-000000000006', 'building-with-culture', 'a0000003-0000-0000-0000-000000000002', '06', 'Construction Stage', 'On-Site Execution & Quality Supervision', 'From contractor bidding and procurement to continuous on-site architectural oversight and quality assurance inspections, we safeguard the design intent through turnkey completion.', ARRAY['Contractor Bidding & Procurement Support', 'Continuous On-Site Quality Inspections', 'Material Compliance & Verification', 'Turnkey Handover & Final Sign-Off'], '6 - 18 Months', 60, FALSE),
('b0000003-0000-0000-0000-000000000007', 'building-with-culture', 'a0000003-0000-0000-0000-000000000003', '07', '15-Year Project Support', 'Long-Term Stewardship & Warranty Care', 'Our engagement continues far past move-in day. We provide a 15-year structural and maintenance support protocol to guarantee enduring building performance and client peace of mind.', ARRAY['15-Year Structural Integrity Guarantee', 'Scheduled Post-Occupancy Audits', 'Building Maintenance & Renovation Advice', 'Dedicated Lifetime Client Support Line'], '15 Years', 70, FALSE)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, deliverables = EXCLUDED.deliverables, duration = EXCLUDED.duration, sort_order = EXCLUDED.sort_order, is_draft = EXCLUDED.is_draft, updated_at = NOW();

-- Home Slides
INSERT INTO public.home_slides (id, title, image_url, sort_order, is_draft) VALUES
('c0000001-0000-0000-0000-000000000001', 'Your Home', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/hero_modern_villa_1783495183350.jpg', 10, FALSE),
('c0000001-0000-0000-0000-000000000002', 'Your Business', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/condo_fitout_interior_1783495200802.jpg', 20, FALSE),
('c0000001-0000-0000-0000-000000000003', 'Your Office', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg', 30, FALSE),
('c0000001-0000-0000-0000-000000000004', 'Your Home', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/retail_boutique_1783495217375.jpg', 40, FALSE),
('c0000001-0000-0000-0000-000000000005', 'Your Business', 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/kiosk_coffee_bar_1783495252161.jpg', 50, FALSE)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title, image_url = EXCLUDED.image_url, sort_order = EXCLUDED.sort_order, is_draft = EXCLUDED.is_draft, updated_at = NOW();
