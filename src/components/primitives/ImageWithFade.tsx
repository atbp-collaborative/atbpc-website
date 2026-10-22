'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { isUnsplashUrl, unsplashLoader } from '@/lib/imageLoaders';
import { DEFAULT_SHIMMER_BLUR_DATA_URL } from '@/lib/images/image-placeholders';

// Drop-in replacement for the old <img> tags: fills its (already positioned)
// parent and shows a shimmer placeholder until the image finishes loading,
// eliminating blank white/black flashes while next/image fetches it.
export function ImageWithFade({
  className = '',
  onLoad,
  src,
  placeholder,
  blurDataURL,
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      src={src}
      placeholder={placeholder ?? 'blur'}
      blurDataURL={blurDataURL ?? DEFAULT_SHIMMER_BLUR_DATA_URL}
      loader={typeof src === 'string' && isUnsplashUrl(src) ? unsplashLoader : undefined}
      className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-95'}`}
      onLoad={(e) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
      }}
    />
  );
}
