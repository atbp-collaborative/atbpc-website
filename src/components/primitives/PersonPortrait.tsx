'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FALLBACK_AVATAR_PORTRAIT } from '@/lib/constants/avatars';
import { isUnsplashUrl, unsplashLoader } from '@/lib/imageLoaders';
import { DEFAULT_SHIMMER_BLUR_DATA_URL } from '@/lib/images/image-placeholders';

export interface PersonPortraitProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * High-performance portrait photo component for team members.
 * Automatically switches to the architectural portrait fallback avatar
 * when an image is missing, empty, or fails to load.
 */
export function PersonPortrait({
  src,
  alt,
  fill = true,
  sizes = '400px',
  priority = false,
  className = '',
  onLoad,
}: PersonPortraitProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedSrc = !src || src.trim() === '' || hasError ? FALLBACK_AVATAR_PORTRAIT : src;
  const isFallback = resolvedSrc === FALLBACK_AVATAR_PORTRAIT;

  return (
    <Image
      src={resolvedSrc}
      alt={alt || 'Team Member Portrait'}
      fill={fill}
      sizes={sizes}
      priority={priority}
      placeholder={isFallback ? undefined : 'blur'}
      blurDataURL={isFallback ? undefined : DEFAULT_SHIMMER_BLUR_DATA_URL}
      loader={typeof resolvedSrc === 'string' && isUnsplashUrl(resolvedSrc) ? unsplashLoader : undefined}
      className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-95'} ${className}`}
      onLoad={(e) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
      }}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
