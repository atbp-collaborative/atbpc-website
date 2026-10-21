-- ==============================================================================
-- Migration: 20261021_navigation_cards_and_settings.sql
-- Description: Adds page_subtitle and footer_text columns to navigation_cards,
--              and seeds our_people_footer in site_settings.
-- ==============================================================================

-- 1. Add page_subtitle and footer_text columns to navigation_cards
ALTER TABLE public.navigation_cards 
ADD COLUMN IF NOT EXISTS page_subtitle TEXT;

ALTER TABLE public.navigation_cards 
ADD COLUMN IF NOT EXISTS footer_text TEXT;

-- 2. Seed Default: Our People page footer subtext
INSERT INTO public.site_settings (key, content)
VALUES (
    'our_people_footer',
    '{
        "footerText": "we are a licensed, registered collaborative trained and experienced to provide you services ... architecture, engineering, building construction industry, nationwide."
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 3. Seed initial page_subtitle values for studio and contact hub cards
UPDATE public.navigation_cards
SET page_subtitle = 'discover our flexible contract types and comprehensive architectural capabilities tailored to your project scale and scope.'
WHERE card_key = 'services' AND (page_subtitle IS NULL OR page_subtitle = '');

UPDATE public.navigation_cards
SET page_subtitle = 'purpose-built responses for one-of-a-kind briefs'
WHERE card_key = 'process' AND (page_subtitle IS NULL OR page_subtitle = '');

UPDATE public.navigation_cards
SET page_subtitle = 'our multidisciplinary team of designers, managers, and builders'
WHERE card_key = 'people' AND (page_subtitle IS NULL OR page_subtitle = '');

UPDATE public.navigation_cards
SET page_subtitle = 'explore case study house project types and collaborative offerings'
WHERE card_key = 'contact-case-study-house' AND (page_subtitle IS NULL OR page_subtitle = '');

UPDATE public.navigation_cards
SET page_subtitle = 'career and mentorship opportunities at ATBP Collaborative'
WHERE card_key = 'contact-grow-with-us' AND (page_subtitle IS NULL OR page_subtitle = '');

UPDATE public.navigation_cards
SET page_subtitle = 'collaborate with us as a supplier, builder, or consultant'
WHERE card_key = 'contact-partner-with-us' AND (page_subtitle IS NULL OR page_subtitle = '');
