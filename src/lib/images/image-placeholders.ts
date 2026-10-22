/**
 * Lightweight SVG shimmer blur data URL generator.
 * Provides instant pulsing shimmer placeholders for Next.js Image components,
 * eliminating blank white/black flashes and Cumulative Layout Shift (CLS).
 */

const shimmerSvg = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="shimmer-grad">
      <stop stop-color="#18181b" offset="20%" />
      <stop stop-color="#27272a" offset="50%" />
      <stop stop-color="#18181b" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#18181b" />
  <rect id="shimmer-rect" width="${w}" height="${h}" fill="url(#shimmer-grad)" />
  <animate xlink:href="#shimmer-rect" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string): string => {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
};

/**
 * Returns a base64 encoded SVG data URL representing a dark shimmer pulse.
 */
export function getShimmerBlurDataUrl(w = 700, h = 475): string {
  return `data:image/svg+xml;base64,${toBase64(shimmerSvg(w, h))}`;
}

export const DEFAULT_SHIMMER_BLUR_DATA_URL = getShimmerBlurDataUrl(700, 475);
