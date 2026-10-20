-- Migration: Remove sort_order from project_roles table completely
ALTER TABLE public.project_roles DROP COLUMN IF EXISTS sort_order;
