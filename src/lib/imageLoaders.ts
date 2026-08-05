import type { ImageLoaderProps } from 'next/image';

// Unsplash's CDN already resizes on the fly via query params, so remote
// photos are pointed straight at it instead of proxying through Next's own
// image optimizer (which would otherwise re-fetch + re-encode via sharp).
export function isUnsplashUrl(src: string): boolean {
  return src.startsWith('https://images.unsplash.com/');
}

export function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  return url.toString();
}
