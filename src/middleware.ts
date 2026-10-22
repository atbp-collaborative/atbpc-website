import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// In-memory module cache for edge worker to avoid querying Supabase on every single request
let cachedSettings: {
  siteLaunched?: boolean;
  maintenance?: boolean;
  expiresAt: number;
} | null = null;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';

  const rawHost = 
    request.headers.get('x-forwarded-host') || 
    request.headers.get('host') || 
    request.nextUrl.hostname;

  // Development simulation hooks for easy local testing (?simulate_host=... & ?simulate_launch=...)
  const simulateHost = 
    process.env.NODE_ENV !== 'production' 
      ? request.nextUrl.searchParams.get('simulate_host') 
      : null;
  const simulateLaunch = 
    process.env.NODE_ENV !== 'production' 
      ? request.nextUrl.searchParams.get('simulate_launch') 
      : null;
  const simulateMaintenance = 
    process.env.NODE_ENV !== 'production' 
      ? request.nextUrl.searchParams.get('simulate_maintenance') 
      : null;

  const hostname = (simulateHost || rawHost).split(':')[0].toLowerCase();

  const isProductionDomain = 
    hostname === 'atbpcollaborative.com' || 
    hostname === 'www.atbpcollaborative.com' ||
    (process.env.NODE_ENV !== 'production' && hostname === 'atbpcollaborative.local');

  const isVercelStagingDomain =
    hostname === 'atbpc-website.vercel.app' ||
    (process.env.NODE_ENV !== 'production' && hostname === 'atbpc-website.vercel.local');

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

  // Determine Launch Mode and Maintenance Mode
  const launchCookie = request.cookies.get('site_launched')?.value;
  const maintenanceCookie = request.cookies.get('site_maintenance')?.value;
  const launchEnv = process.env.NEXT_PUBLIC_SITE_LAUNCHED?.toLowerCase();
  const maintenanceEnv = process.env.MAINTENANCE_MODE?.toLowerCase();

  let isSiteLaunched: boolean;
  let isMaintenanceActive: boolean;

  if (simulateLaunch !== null) {
    isSiteLaunched = simulateLaunch === 'true';
  } else if (launchCookie !== undefined) {
    isSiteLaunched = launchCookie === 'true';
  } else if (cachedSettings && Date.now() < cachedSettings.expiresAt && cachedSettings.siteLaunched !== undefined) {
    isSiteLaunched = cachedSettings.siteLaunched;
  } else {
    isSiteLaunched = launchEnv === 'true';
  }

  if (simulateMaintenance !== null) {
    isMaintenanceActive = simulateMaintenance === 'true';
  } else if (maintenanceCookie !== undefined) {
    isMaintenanceActive = maintenanceCookie === 'true';
  } else if (cachedSettings && Date.now() < cachedSettings.expiresAt && cachedSettings.maintenance !== undefined) {
    isMaintenanceActive = cachedSettings.maintenance;
  } else {
    isMaintenanceActive = maintenanceEnv === 'true';
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    supabaseUrl &&
    supabaseKey &&
    (!cachedSettings || Date.now() >= cachedSettings.expiresAt) &&
    simulateLaunch === null &&
    simulateMaintenance === null
  ) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });

      const { data } = await supabase
        .from('site_settings')
        .select('key, content')
        .in('key', ['launch_mode', 'maintenance_mode']);

      if (data) {
        let dbLaunched: boolean | undefined = undefined;
        let dbMaintenance: boolean | undefined = undefined;

        for (const row of data) {
          if (row.key === 'launch_mode') {
            dbLaunched = Boolean((row.content as any)?.enabled);
          }
          if (row.key === 'maintenance_mode') {
            dbMaintenance = Boolean((row.content as any)?.enabled);
          }
        }

        cachedSettings = {
          siteLaunched: dbLaunched ?? (launchEnv === 'true'),
          maintenance: dbMaintenance ?? (maintenanceEnv === 'true'),
          expiresAt: Date.now() + 15000, // 15 seconds TTL
        };

        if (launchCookie === undefined && dbLaunched !== undefined) {
          isSiteLaunched = dbLaunched;
        }
        if (maintenanceCookie === undefined && dbMaintenance !== undefined) {
          isMaintenanceActive = dbMaintenance;
        }
      }
    } catch {
      // Keep existing fallbacks if DB fetch fails
    }
  }

  // 1. Determine if Site-Wide Maintenance Mode is active (Highest Priority)
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

  // 2. Vercel Domain Rerouting Guard (When site is launched)
  // When launch mode is active, all routes on atbpc-website.vercel.app are rerouted to https://www.atbpcollaborative.com
  if (isSiteLaunched && isVercelStagingDomain) {
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://www.atbpcollaborative.com');
    return NextResponse.redirect(targetUrl, 307);
  }

  // 3. Pre-Launch Gate (Launching Soon)
  // On the official production domain (atbpcollaborative.com), rewrite visitors to /launching-soon
  // unless bypassed via ?preview=true, a preview_access cookie, or if isSiteLaunched is true.
  // On localhost and atbpc-website.vercel.app (staging/preview when not launched), this gate is skipped to allow full team review.
  const previewQuery = request.nextUrl.searchParams.get('preview');
  const hasPreviewCookie = request.cookies.get('preview_access')?.value === 'true';
  const shouldBypassPreLaunch = previewQuery === 'true' || hasPreviewCookie;

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

  // 4. Status URLs Reroute Guard
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

  // 5. Prepare Base Response
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

  // 6. Admin Authentication & Gate Pass Evaluation
  if (isGatePassActive) {
    return response;
  }

  // If request is within /admin/*
  if (pathname.startsWith('/admin')) {
    const isExempt =
      pathname === '/admin/login' ||
      pathname === '/admin/login/turn-over';

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
