'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { isUnsplashUrl, unsplashLoader } from '@/lib/imageLoaders';

// Drop-in replacement for the old <img> tags: fills its (already positioned)
// parent and shows a shimmer placeholder until the image finishes loading,
// instead of a blank flash while next/image fetches it.
export function ImageWithFade({ className = '', onLoad, src, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden
        className={`absolute inset-0 bg-neutral-400/20 animate-pulse transition-opacity duration-300 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <Image
        {...props}
        src={src}
        loader={typeof src === 'string' && isUnsplashUrl(src) ? unsplashLoader : undefined}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
