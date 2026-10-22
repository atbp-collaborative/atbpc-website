'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FALLBACK_AVATAR_CIRCLE } from '@/lib/constants/avatars';
import { isUnsplashUrl, unsplashLoader } from '@/lib/imageLoaders';

export type CircleAvatarSize = 'xs' | 'sm' | 'base' | 'md' | 'lg';

export interface PersonCircleAvatarProps {
  src?: string | null;
  name?: string;
  size?: CircleAvatarSize | number;
  className?: string;
  border?: boolean;
}

const SIZE_MAP: Record<CircleAvatarSize, { dimensionClass: string; pixelSize: number }> = {
  xs: { dimensionClass: 'w-4 h-4', pixelSize: 16 },
  sm: { dimensionClass: 'w-8 h-8', pixelSize: 32 },
  base: { dimensionClass: 'w-10 h-10', pixelSize: 40 },
  md: { dimensionClass: 'w-12 h-12', pixelSize: 48 },
  lg: { dimensionClass: 'w-16 h-16', pixelSize: 64 },
};

/**
 * Standard circular avatar for team members across admin panels, tables, and modals.
 * Automatically displays the architectural circle avatar fallback when the image
 * is missing, empty, or fails to load.
 */
export function PersonCircleAvatar({
  src,
  name = 'Team Member',
  size = 'md',
  className = '',
  border = true,
}: PersonCircleAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizeConfig = typeof size === 'string' ? SIZE_MAP[size] || SIZE_MAP.md : null;
  const dimensionClass = sizeConfig ? sizeConfig.dimensionClass : '';
  const pixelSize = sizeConfig ? sizeConfig.pixelSize : typeof size === 'number' ? size : 48;
  const inlineStyle = !sizeConfig && typeof size === 'number' ? { width: size, height: size } : undefined;

  const resolvedSrc = !src || src.trim() === '' || hasError ? FALLBACK_AVATAR_CIRCLE : src;

  return (
    <div
      style={inlineStyle}
      className={`relative rounded-full overflow-hidden shrink-0 ${dimensionClass} ${
        border ? 'border border-black/10 dark:border-white/10' : ''
      } ${className}`}
    >
      <Image
        src={resolvedSrc}
        alt={name}
        fill
        sizes={`${pixelSize}px`}
        loader={typeof resolvedSrc === 'string' && isUnsplashUrl(resolvedSrc) ? unsplashLoader : undefined}
        className="object-cover"
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
      />
    </div>
  );
}
