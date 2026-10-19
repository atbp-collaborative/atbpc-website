/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Server-only administrative Supabase client utilizing SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses PostgreSQL Row Level Security (RLS) to perform administrative writes,
 * mutations, and background sync operations.
 *
 * NOTE: This client must ONLY be used on the server (e.g. Next.js Server Actions,
 * API route handlers, or server components). NEVER expose this to client components.
 */
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase administrative credentials: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
