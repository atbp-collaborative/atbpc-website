-- ==============================================================================
-- ATBP Collaborative: Link Storage URLs Script (link_storage_urls.sql)
-- Replaces old Supabase Storage URL hostnames with your active project URL
-- Run this in the Supabase SQL Editor if you manually upload files or after seeding.
-- ==============================================================================

-- Change the TARGET_URL variable below if your project URL is different:
-- Default is set to the project configured in .env.local
DO $$
DECLARE
    OLD_BASE_URL TEXT := 'https://kobptyhaxwpgujipwvbk.supabase.co';
    NEW_BASE_URL TEXT := 'https://ajfdhefowtmabjtfzwdq.supabase.co';
BEGIN
    RAISE NOTICE 'Updating storage URLs from % to % ...', OLD_BASE_URL, NEW_BASE_URL;

    -- 1. Project Categories
    UPDATE public.project_categories
    SET hero_image_url = REPLACE(hero_image_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE hero_image_url LIKE OLD_BASE_URL || '%';

    -- 2. People
    UPDATE public.people
    SET profile_photo_url = REPLACE(profile_photo_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE profile_photo_url LIKE OLD_BASE_URL || '%';

    -- 3. Project Media
    UPDATE public.project_media
    SET url = REPLACE(url, OLD_BASE_URL, NEW_BASE_URL)
    WHERE media_type = 'image' AND url LIKE OLD_BASE_URL || '%';

    -- 4. Site Pages
    UPDATE public.site_pages
    SET hero_image_url = REPLACE(hero_image_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE hero_image_url LIKE OLD_BASE_URL || '%';

    -- 5. Navigation Cards
    UPDATE public.navigation_cards
    SET image_url = REPLACE(image_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE image_url LIKE OLD_BASE_URL || '%';

    -- 6. Service Offerings
    UPDATE public.service_offerings
    SET image_url = REPLACE(image_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE image_url LIKE OLD_BASE_URL || '%';

    -- 7. Process Philosophies
    UPDATE public.process_philosophies
    SET image_url = REPLACE(image_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE image_url LIKE OLD_BASE_URL || '%';

    -- 8. Home Slides
    UPDATE public.home_slides
    SET image_url = REPLACE(image_url, OLD_BASE_URL, NEW_BASE_URL),
        updated_at = NOW()
    WHERE image_url LIKE OLD_BASE_URL || '%';

    RAISE NOTICE 'Successfully updated all storage image URLs to %', NEW_BASE_URL;
END $$;
