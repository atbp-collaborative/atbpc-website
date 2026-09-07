import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname from the request headers or URL
  const hostname = request.headers.get('host') || request.nextUrl.hostname;

  // Define the domains that should see the under construction page
  const isProtectedDomain = 
    hostname === 'atbpcollaborative.com' || 
    hostname === 'www.atbpcollaborative.com';

  if (isProtectedDomain) {
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

  // Allow other domains (like atbpc-website.vercel.app or localhost) to work normally
  return NextResponse.next();
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
