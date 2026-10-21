-- ==============================================================================
-- ATBP Collaborative: Link Storage URLs Script (link_storage_urls.sql)
-- Replaces old Supabase Storage URL hostnames with your active project URL
-- Run this in the Supabase SQL Editor if you manually upload files or after seeding.
-- ==============================================================================

DO $$
DECLARE
    TARGET_BASE_URL TEXT := 'https://kobptyhaxwpgujipwvbk.supabase.co';
BEGIN
    RAISE NOTICE 'Updating storage URLs to % ...', TARGET_BASE_URL;

    -- 1. Project Categories
    UPDATE public.project_categories
    SET hero_image_url = REGEXP_REPLACE(hero_image_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE hero_image_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 2. People
    UPDATE public.people
    SET profile_photo_url = REGEXP_REPLACE(profile_photo_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE profile_photo_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 3. Project Media
    UPDATE public.project_media
    SET url = REGEXP_REPLACE(url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL)
    WHERE media_type = 'image' AND url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 4. Site Pages
    UPDATE public.site_pages
    SET hero_image_url = REGEXP_REPLACE(hero_image_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE hero_image_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 5. Navigation Cards
    UPDATE public.navigation_cards
    SET image_url = REGEXP_REPLACE(image_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE image_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 6. Service Offerings
    UPDATE public.service_offerings
    SET image_url = REGEXP_REPLACE(image_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE image_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 7. Process Philosophies
    UPDATE public.process_philosophies
    SET image_url = REGEXP_REPLACE(image_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE image_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    -- 8. Home Slides
    UPDATE public.home_slides
    SET image_url = REGEXP_REPLACE(image_url, '^https://[a-zA-Z0-9-]+\.supabase\.co', TARGET_BASE_URL),
        updated_at = NOW()
    WHERE image_url ~ '^https://[a-zA-Z0-9-]+\.supabase\.co';

    RAISE NOTICE 'Successfully updated all storage image URLs to %', TARGET_BASE_URL;
END $$;
