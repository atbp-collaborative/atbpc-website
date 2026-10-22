import React from 'react';
import { Skeleton } from './Skeleton';

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden select-none bg-black text-white">
      {/* Background shimmer placeholder */}
      <div className="absolute inset-0 bg-neutral-950 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

      {/* Centered Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto space-y-5 sm:space-y-7 pointer-events-none">
        {/* Title placeholder */}
        <div className="min-h-[45px] sm:min-h-[60px] md:min-h-[90px] flex items-center justify-center w-full">
          <Skeleton className="w-3/4 max-w-xl h-10 sm:h-14 md:h-20 bg-white/10" />
        </div>

        {/* Slogan placeholder */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
          <Skeleton className="w-28 sm:w-36 h-4 sm:h-6 bg-white/10" />
          <Skeleton className="w-28 sm:w-36 h-4 sm:h-6 bg-white/10" />
          <Skeleton className="w-28 sm:w-36 h-4 sm:h-6 bg-white/10" />
        </div>

        {/* Subtext placeholder */}
        <div className="flex flex-col items-center space-y-2 w-full max-w-lg mt-2">
          <Skeleton className="w-full h-3 sm:h-4 bg-white/10" />
          <Skeleton className="w-4/5 h-3 sm:h-4 bg-white/10" />
        </div>
      </div>

      {/* Carousel dots placeholder */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 px-3 py-2">
        <Skeleton className="w-6 sm:w-8 h-1.5 sm:h-2 rounded-full bg-white/40" />
        <Skeleton className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/20" />
        <Skeleton className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
