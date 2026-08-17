'use client';

import Image, { ImageProps } from 'next/image';
import { isUnsplashUrl, unsplashLoader } from '@/lib/imageLoaders';

// Drop-in replacement for the old <img> tags: fills its (already positioned)
// parent and shows a shimmer placeholder until the image finishes loading,
// instead of a blank flash while next/image fetches it.
export function ImageWithFade({ className = '', onLoad, src, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      src={src}
      loader={typeof src === 'string' && isUnsplashUrl(src) ? unsplashLoader : undefined}
      className={className}
      onLoad={onLoad}
    />
  );
}
