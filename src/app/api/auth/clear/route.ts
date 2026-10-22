/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Route handler to completely purge all admin tokens, Supabase sessions,
 * cookies, and browser storage for localhost:3000.
 */
export async function GET(request: Request) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    try {
      await supabase.auth.signOut();
    } catch {}
  }

  // Delete all existing cookies
  for (const c of allCookies) {
    cookieStore.delete(c.name);
  }

  // Return HTML that executes client-side storage clearance and redirects
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Clearing Session...</title>
  </head>
  <body style="font-family: system-ui, sans-serif; background: #121212; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
    <div style="text-align: center;">
      <p style="font-size: 1.1rem; opacity: 0.85;">Clearing tokens and admin sessions...</p>
    </div>
    <script>
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      window.location.replace('/admin/login');
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Clear-Site-Data': '"cache", "cookies", "storage"',
    },
  });
}
