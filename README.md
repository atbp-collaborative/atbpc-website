<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ATBP Collaborative Website

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure credentials in `.env.local` (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
3. Seed the database and images (see [Database Setup & Seeding](#database-setup--seeding)).
4. Run the app:
   ```bash
   npm run dev
   ```

---

## Database Setup & Seeding

The complete database schema, security policies, role permissions, CMS collections, and seed records are consolidated into a single clean SQL file:
[`supabase/clean_database_reset.sql`](supabase/clean_database_reset.sql)

### 1. Seed Database Schema & Data
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Copy and paste the contents of [`supabase/clean_database_reset.sql`](supabase/clean_database_reset.sql) and click **Run**.
4. This drops and recreates the public schema, configures all tables and indexes, establishes storage buckets (`portfolio-media`) and RLS policies, and populates all initial records with zero dependency errors.

### 2. Seed Storage Images & Media
Upload all local seed images (`supabase/seed-images/`) into your Supabase `portfolio-media` storage bucket:
```bash
npm run seed:storage
```
