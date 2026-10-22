import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';

  const rawHost = 
    request.headers.get('x-forwarded-host') || 
    request.headers.get('host') || 
    request.nextUrl.hostname;
  const hostname = rawHost.split(':')[0].toLowerCase();

  const isProductionDomain = 
    hostname === 'atbpcollaborative.com' || 
    hostname === 'www.atbpcollaborative.com';

  const isMaintenanceExempt =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/under-maintenance';

  const isPreLaunchExempt =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/launching-soon' ||
    pathname === '/under-maintenance';

  // 1. Determine if Site-Wide Maintenance Mode is active (Highest Priority)
  const maintenanceCookie = request.cookies.get('site_maintenance')?.value;
  const maintenanceEnv = process.env.MAINTENANCE_MODE?.toLowerCase();
  const simulateMaintenance = request.nextUrl.searchParams.get('simulate_maintenance');

  const isMaintenanceActive =
    maintenanceCookie === 'true' ||
    maintenanceEnv === 'true' ||
    simulateMaintenance === 'true';

  if (isMaintenanceActive && !isMaintenanceExempt) {
    const url = request.nextUrl.clone();
    url.pathname = '/under-maintenance';
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-under-maintenance', 'true');
    requestHeaders.set('x-maintenance-mode', 'site-wide');
    
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Pre-Launch Gate (Launching Soon)
  // On the official production domain (atbpcollaborative.com), rewrite visitors to /launching-soon
  // unless bypassed via ?preview=true, a preview_access cookie, or if NEXT_PUBLIC_SITE_LAUNCHED === 'true'.
  // On localhost and atbpc-website.vercel.app (staging/preview), this gate is skipped to allow full team review.
  const previewQuery = request.nextUrl.searchParams.get('preview');
  const hasPreviewCookie = request.cookies.get('preview_access')?.value === 'true';
  const shouldBypassPreLaunch = previewQuery === 'true' || hasPreviewCookie;
  const isSiteLaunched = process.env.NEXT_PUBLIC_SITE_LAUNCHED === 'true';

  const shouldShowLaunchingSoon = isProductionDomain && !isSiteLaunched && !shouldBypassPreLaunch;

  if (shouldShowLaunchingSoon && !isPreLaunchExempt) {
    const url = request.nextUrl.clone();
    url.pathname = '/launching-soon';
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-launching-soon', 'true');
    
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 3. Status URLs Reroute Guard
  // When live (not under maintenance and not launching soon) and gate pass is false,
  // manual navigation to status URLs must be rerouted to the homepage (/).
  if (!isGatePassActive && !isMaintenanceActive && !shouldShowLaunchingSoon) {
    if (
      pathname === '/under-maintenance' ||
      pathname === '/launching-soon' ||
      pathname === '/under-construction'
    ) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
  }

  // 4. Prepare Base Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // If visitor navigated with ?preview=true on production, set cookie for ongoing session bypass
  if (previewQuery === 'true') {
    response.cookies.set('preview_access', 'true', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  // 5. Admin Authentication & Gate Pass Evaluation
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
