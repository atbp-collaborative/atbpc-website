-- Keep the single project titled "Tiny Living Project 1" (or "Tiny Living 1")
-- and delete every other project. Project media and contributor rows cascade.
-- Run in the Supabase SQL Editor only after reviewing the target project.
-- Supabase Storage objects are not removed by this database transaction.

BEGIN;

-- Prevent projects from changing between the guard and the delete.
LOCK TABLE public.projects IN SHARE ROW EXCLUSIVE MODE;

DO $$
DECLARE
    keep_id uuid;
    deleted_count integer;
BEGIN
    -- STRICT aborts the transaction unless exactly one project matches.
    SELECT id INTO STRICT keep_id
    FROM public.projects
    WHERE lower(btrim(project_title)) IN ('tiny living project 1', 'tiny living 1');

    DELETE FROM public.projects
    WHERE id <> keep_id;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Kept project %, deleted % other projects', keep_id, deleted_count;
END;
$$;

COMMIT;

SELECT id, slug, project_code, project_title
FROM public.projects;
