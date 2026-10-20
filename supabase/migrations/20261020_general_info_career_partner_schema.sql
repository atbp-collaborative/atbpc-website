-- ==============================================================================
-- Migration: 20261020_general_info_career_partner_schema.sql
-- Description: Adds career privacy statement and partner general conditions (No RBAC)
-- ==============================================================================

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean standard policies (No RBAC checks)
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
    ON public.site_settings FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON public.site_settings;
CREATE POLICY "Authenticated users can manage site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 2. Seed Default: Grow-With-Us Career Privacy Statement
INSERT INTO public.site_settings (key, content)
VALUES (
    'career_privacy',
    '{
        "title": "Privacy Statement",
        "subtitle": "ATBP Collaborative • Data Privacy",
        "badge": "Republic Act No. 10173",
        "items": [
            "<p>ATBP Collaborative is committed to safeguarding the privacy and personal credentials of all applicants in accordance with <a href=\"https://www.officialgazette.gov.ph/2012/08/15/republic-act-no-10173/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline hover:text-space-sparkle transition-colors\">Republic Act No. 10173</a> (Data Privacy Act of 2012).</p>",
            "<p>Any personal identifiers, contact numbers, links, video intros, or portfolio materials provided through this application portal are collected strictly for talent recruitment, portfolio evaluation, and potential employment assessment.</p>",
            "<p>Your information will remain strictly confidential within our practice management and will never be disclosed to third parties without your explicit consent.</p>"
        ],
        "closeLabel": "Understood"
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET content = EXCLUDED.content, updated_at = NOW();

-- 3. Seed Default: Partner-With-Us General Conditions (Builder, Consultant, Supplier)
INSERT INTO public.site_settings (key, content)
VALUES (
    'partner_conditions',
    '{
        "builder": {
            "title": "General Conditions for Builder Partnership",
            "subtitle": "ATBP Collaborative • Builder Accreditation",
            "badge": "PCAB & Integrity Standards",
            "items": [
                "<p>1. <strong>Licensing & Integrity:</strong> Partner builders must hold valid PCAB licenses and tax registrations (BIR / SEC / DTI) matching their declared scope of work and construction category.</p>",
                "<p>2. <strong>Workmanship Standards:</strong> All construction methods, site safety protocols, and material assemblies must adhere strictly to ATBP Collaborative architectural blueprints and specifications.</p>",
                "<p>3. <strong>Contractual Transparency:</strong> Sample contracts and project execution methodologies are verified for cost-transparency, delay penalties, and warranty guarantees.</p>"
            ]
        },
        "consultant": {
            "title": "General Conditions for Consultant Partnership",
            "subtitle": "ATBP Collaborative • Consultant Accreditation",
            "badge": "PRC / PTR Professional Standards",
            "items": [
                "<p>1. <strong>Professional Licensing:</strong> Partner consultants and specialist firms must hold active PRC/PTR professional licenses or accredited corporate engineering practice permits.</p>",
                "<p>2. <strong>Design Integrity & Calculation Standards:</strong> All technical calculations, BIM models, and structural/MEPFS drawings must align with national codes and studio specifications.</p>",
                "<p>3. <strong>Confidentiality & Peer Review:</strong> Information disclosed through this portal is safeguarded for studio project matching, fee estimations, and inter-practice collaboration.</p>"
            ]
        },
        "supplier": {
            "title": "General Conditions for Product Qualification",
            "subtitle": "ATBP Collaborative • Supplier Accreditation",
            "badge": "Material Quality Verification",
            "items": [
                "<p>1. <strong>Quality Verification:</strong> All submitted material specifications, MSDS documents, and physical catalogs are pre-screened according to strict structural, aesthetic, and environmental sustainability standards prior to studio specification.</p>",
                "<p>2. <strong>Warranty & Lead Times:</strong> Suppliers must provide verified lead times and manufacturer warranty coverage for custom millwork, finishes, and specialized hardware.</p>",
                "<p>3. <strong>Data Confidentiality:</strong> Product documentation provided through this portal will be archived exclusively for internal procurement, mock-up schedules, and client bill-of-quantity estimations.</p>"
            ]
        }
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET content = EXCLUDED.content, updated_at = NOW();
