import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host') || request.nextUrl.hostname;

  // 1. Determine if maintenance mode is active:
  const maintenanceCookie = request.cookies.get('site_maintenance')?.value;
  const maintenanceEnv = process.env.MAINTENANCE_MODE?.toLowerCase();
  const isProductionDomain = 
    hostname === 'atbpcollaborative.com' || 
    hostname === 'www.atbpcollaborative.com';

  const isMaintenanceActive = 
    maintenanceCookie === 'true' ||
    (maintenanceCookie !== 'false' && (maintenanceEnv === 'true' || (maintenanceEnv !== 'false' && isProductionDomain)));

  const isAdminOrApi =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next');

  if (isMaintenanceActive && !isAdminOrApi && pathname !== '/under-construction') {
    const url = request.nextUrl.clone();
    url.pathname = '/under-construction';
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-under-construction', 'true');
    
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Prepare Base Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 3. Admin Authentication & Gate Pass Evaluation
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';

  // If Gate Pass is active, skip all admin auth checks for friction-free dev/testing
  if (isGatePassActive) {
    return response;
  }

  // If request is within /admin/*
  if (pathname.startsWith('/admin')) {
    // Exempt /admin/login and /admin/login/turn-over
    const isExempt =
      pathname === '/admin/login' ||
      pathname === '/admin/login/turn-over';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If unauthenticated and trying to access protected /admin/* routes
    if (!user && !isExempt) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated and visiting /admin/login, redirect to /admin/dashboard
    if (user && pathname === '/admin/login') {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = '/admin/dashboard';
      return NextResponse.redirect(dashUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets like images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp|.*\\.gif).*)',
  ],
};
