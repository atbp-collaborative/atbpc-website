-- ==============================================================================
-- Migration: Services Schema Upgrade & Relational Accordions
-- Description:
-- 1. Creates `public.service_accordions` relational table for service subpage contents.
-- 2. Ensures `public.service_offerings` has fields for page headers, descriptions, and footer subtext.
-- 3. Enables Row Level Security (RLS) and sets up standard policies for `service_accordions`.
-- 4. Creates updated_at trigger and performance indexes.
-- 5. Seeds `public.navigation_cards` with the 3 dedicated cards for `hub_id = 'services'`.
-- 6. Seeds `public.service_accordions` with initial items for comprehensive, piecework, and consultation/retainer.
-- ==============================================================================

-- 1. CREATE SERVICE ACCORDIONS TABLE
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

-- 2. TRIGGER FOR UPDATED_AT
DROP TRIGGER IF EXISTS trg_service_accordions_updated_at ON public.service_accordions;
CREATE TRIGGER trg_service_accordions_updated_at
BEFORE UPDATE ON public.service_accordions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_service_accordions_service_id ON public.service_accordions(service_id);
CREATE INDEX IF NOT EXISTS idx_service_accordions_col_sort ON public.service_accordions(service_id, column_index, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_accordions_is_draft ON public.service_accordions(is_draft);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.service_accordions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published service accordions"
    ON public.service_accordions FOR SELECT
    USING (is_draft = FALSE OR public.get_current_admin_role() IN ('superadmin', 'admin', 'editor'));

CREATE POLICY "Admin and Superadmin can manage service accordions"
    ON public.service_accordions FOR ALL
    TO authenticated
    USING (public.get_current_admin_role() IN ('superadmin', 'admin'))
    WITH CHECK (public.get_current_admin_role() IN ('superadmin', 'admin'));

-- 5. SEED SERVICE NAVIGATION CARDS IN LANDING PAGES (hub_id = 'services')
INSERT INTO public.navigation_cards (hub_id, card_key, title, tagline, subtext, tags, image_url, target_href, sort_order, is_draft)
VALUES
(
    'services',
    'comprehensive-services',
    'comprehensive design',
    'full-lifecycle architectural design, technical engineering, & turnkey delivery',
    'Full-envelope design solutions encompassing conceptual planning, structural, MEPFS documents, BIM modeling, and permitting support.',
    ARRAY['Full Architecture', 'Turnkey Build', 'Masterplanning'],
    'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/hero_modern_villa_1783495183350.jpg',
    '/studio/our-services/comprehensive-services',
    10,
    FALSE
),
(
    'services',
    'piecework-services',
    'piecework services',
    'modular technical detailing, targeted consulting & specialized scopes',
    'Targeted architectural detailing, modular kitchen/bath designs, single spaces, or individual drawing sets billed per deliverable.',
    ARRAY['Modular Drafting', 'Permitting Support', 'Facade Detailing'],
    'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/kiosk_coffee_bar_1783495252161.jpg',
    '/studio/our-services/piecework-services',
    20,
    FALSE
),
(
    'services',
    'consultation-retainer-services',
    'consultation & retainer',
    'ongoing architectural guidance, strategic advisory & long-term partnerships',
    'Continuous, expert architectural advice designed for ongoing developments, portfolio management, or phased projects that require strategic oversight.',
    ARRAY['Strategic Advisory', 'Portfolio Retainer', 'Technical Audits'],
    'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_services_img_1785469964556.jpg',
    '/studio/our-services/consultation-retainer-services',
    30,
    FALSE
)
ON CONFLICT (card_key) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    subtext = EXCLUDED.subtext,
    tags = EXCLUDED.tags,
    image_url = EXCLUDED.image_url,
    target_href = EXCLUDED.target_href,
    sort_order = EXCLUDED.sort_order,
    is_draft = EXCLUDED.is_draft,
    updated_at = NOW();

-- 6. SEED SERVICE ACCORDIONS
-- A. Comprehensive Services (3 columns with links)
INSERT INTO public.service_accordions (id, service_id, column_index, title, content, link_text, link_href, sort_order, is_draft)
VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'comprehensive-services',
    0,
    'Comprehensive Design Services',
    'Our design process is rooted in a deep understanding of your vision, lifestyle, and the unique characteristics of your site.

We integrate architectural planning, interior design, and engineering to create cohesive spaces that are both beautiful and functional.

As a design-build studio, we prioritize constructability and material intelligence from the very beginning, ensuring that every design decision aligns with your budget and timeline.

We navigate the complexities of local zoning, building codes, and environmental regulations, streamlining the path to construction.',
    'Learn more about our process in designing',
    '/studio/our-process/designing-with-values',
    10,
    FALSE
),
(
    'a1000000-0000-0000-0000-000000000002',
    'comprehensive-services',
    1,
    'Comprehensive Management Services',
    'Effective project management is the bridge between a great design and a successful build.

We oversee every phase of the project, from initial cost estimation and value engineering to procurement and scheduling.

Our team acts as your single point of contact, coordinating with specialized consultants, suppliers, and local authorities to keep the project on track.

By maintaining rigorous quality control and transparent communication, we mitigate risks and ensure that the final result exceeds expectations.',
    'Understand how we manage projects',
    '/studio/our-process/managing-with-integrity',
    20,
    FALSE
),
(
    'a1000000-0000-0000-0000-000000000003',
    'comprehensive-services',
    2,
    'Building Construction Services',
    'Construction is where our designs come to life. We bring decades of hands-on experience and a network of trusted craftsmen to every project.

Our build teams work in tandem with our designers, fostering a collaborative environment that quickly resolves on-site challenges without compromising the design intent.

We employ advanced construction methodologies and sustainable practices to deliver structures of enduring quality and performance.

From groundbreaking to final handover, we are committed to safety, efficiency, and unparalleled craftsmanship in every detail.',
    'Validate our capabilities as Builder',
    '/studio/our-process/building-with-culture',
    30,
    FALSE
),

-- B. Piecework Services (3 columns of modular deliverables)
(
    'b1000000-0000-0000-0000-000000000001',
    'piecework-services',
    0,
    'Architectural Interiors',
    'Custom interior spatial design focusing on finishes, millwork detailing, ceiling layout, and built-in furniture coordination. We bridge shell design with internal tactility.',
    NULL,
    NULL,
    10,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000002',
    'piecework-services',
    0,
    'Lighting Design',
    'Fixture specification, reflected ceiling plans, lux level calculations, and circuit zoning. Crafted to amplify space utility, mood, and material textures.',
    NULL,
    NULL,
    20,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000003',
    'piecework-services',
    0,
    'Site Planning',
    'Analyzing solar pathing, typography setbacks, accessibility routing, and easement compliance to optimize building footprint placement on your specific land.',
    NULL,
    NULL,
    30,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000004',
    'piecework-services',
    1,
    'Document & Assessment',
    'Comprehensive auditing of existing blueprints, structural condition reports, spatial efficiency analysis, and code compliance assessments for pre-construction.',
    NULL,
    NULL,
    10,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000005',
    'piecework-services',
    1,
    'Code Compliance',
    'Rigorous validation of design plans against building codes, zoning regulations, fire safety policies, and local city ordinances to guarantee permit approvals.',
    NULL,
    NULL,
    20,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000006',
    'piecework-services',
    1,
    'Permit Processing',
    'End-to-end administration of governmental approvals, environmental clearances, utility permits, and barangay/city hall certifications.',
    NULL,
    NULL,
    30,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000007',
    'piecework-services',
    2,
    'Masonry',
    'Detailed specifications for stone cladding, brick bonding, retaining wall structures, load-bearing concrete blocks, and external masonry finishes.',
    NULL,
    NULL,
    10,
    FALSE
),
(
    'b1000000-0000-0000-0000-000000000008',
    'piecework-services',
    2,
    'Paint Jobs',
    'Specification of coating schedules, primer selections, anti-microbial interior paints, weatherproofing exterior paint systems, and custom color swatches.',
    NULL,
    NULL,
    20,
    FALSE
),

-- C. Consultation & Retainer Services (2 columns)
(
    'c1000000-0000-0000-0000-000000000001',
    'consultation-retainer-services',
    0,
    'Consultation',
    'Flexible, on-demand advisory sessions covering project feasibility, site evaluations, budget estimation, layout advice, and design critiques. Perfect for resolving specific design crossroads without long-term commitments.',
    NULL,
    NULL,
    10,
    FALSE
),
(
    'c1000000-0000-0000-0000-000000000002',
    'consultation-retainer-services',
    1,
    'Retainer',
    'Continuous architectural partner support for phased developments, multi-property portfolios, and long-term asset management. Ensures ongoing design control, contractor alignment, and quality supervision over extended timelines.',
    NULL,
    NULL,
    20,
    FALSE
)
ON CONFLICT (id) DO UPDATE SET
    service_id = EXCLUDED.service_id,
    column_index = EXCLUDED.column_index,
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    link_text = EXCLUDED.link_text,
    link_href = EXCLUDED.link_href,
    sort_order = EXCLUDED.sort_order,
    is_draft = EXCLUDED.is_draft,
    updated_at = NOW();
