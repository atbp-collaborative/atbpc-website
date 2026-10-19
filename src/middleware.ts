import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname from the request headers or URL
  const hostname = request.headers.get('host') || request.nextUrl.hostname;

  // Determine if maintenance mode is active:
  // 1. If MAINTENANCE_MODE === 'true', enforce maintenance mode.
  // 2. If MAINTENANCE_MODE === 'false', disable maintenance mode completely.
  // 3. If MAINTENANCE_MODE is undefined, preserve default behavior for the official production domain.
  const maintenanceEnv = process.env.MAINTENANCE_MODE?.toLowerCase();
  const isProductionDomain = 
    hostname === 'atbpcollaborative.com' || 
    hostname === 'www.atbpcollaborative.com';

  const isMaintenanceActive = 
    maintenanceEnv === 'true' || 
    (maintenanceEnv !== 'false' && isProductionDomain);

  // Allow preview bypass via URL query (?preview=true) or stored preview cookie
  const previewQuery = request.nextUrl.searchParams.get('preview');
  const hasPreviewCookie = request.cookies.get('preview_access')?.value === 'true';
  const shouldBypass = previewQuery === 'true' || hasPreviewCookie;

  if (isMaintenanceActive && !shouldBypass) {
    // Rewrite all requests to the /under-construction page
    // We check the pathname to avoid infinite rewrite loops
    if (request.nextUrl.pathname !== '/under-construction') {
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
  }

  const response = NextResponse.next();

  // If user navigated with ?preview=true, set cookie so subsequent navigation bypasses maintenance
  if (previewQuery === 'true') {
    response.cookies.set('preview_access', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
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
