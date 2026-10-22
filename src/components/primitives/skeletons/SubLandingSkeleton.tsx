import React from 'react';
import { Skeleton } from './Skeleton';

interface SubLandingSkeletonProps {
  isHeaderSticky?: boolean;
  cardCount?: number;
}

export function SubLandingSkeleton({ isHeaderSticky = true, cardCount = 3 }: SubLandingSkeletonProps) {
  return (
    <div
      className={`w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden px-4 sm:px-8 pb-4 ${
        isHeaderSticky ? 'pt-4 sm:pt-6' : 'pt-16 sm:pt-20'
      }`}
    >
      {/* Top Header Placeholder */}
      <div className="mb-4 shrink-0 pb-3 space-y-2">
        <Skeleton className="w-40 sm:w-56 h-8 sm:h-10" />
        <Skeleton className="w-64 sm:w-96 h-4" />
      </div>

      {/* Cards Grid / Column Placeholder */}
      <div className="flex-1 flex flex-col md:flex-row gap-[2px] h-full min-h-0 items-stretch overflow-hidden">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div
            key={idx}
            className="relative flex-1 min-h-[220px] md:min-h-0 rounded-none border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden flex flex-col justify-end p-5 sm:p-6"
          >
            <div className="space-y-2 z-10">
              <Skeleton className="w-2/3 max-w-[200px] h-7 sm:h-9 mb-2" />
              <Skeleton className="w-4/5 max-w-[260px] h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
