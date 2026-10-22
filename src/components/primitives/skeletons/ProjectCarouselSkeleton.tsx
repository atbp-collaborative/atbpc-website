import React from 'react';
import { Skeleton } from './Skeleton';

export function ProjectCarouselSkeleton() {
  return (
    <div className="w-full px-4 sm:px-8 select-none flex flex-col flex-1 min-h-0 h-full py-2 sm:py-3 overflow-hidden justify-between space-y-3">
      <div className="flex-1 flex flex-col min-h-0 h-full justify-between space-y-3 sm:space-y-4 w-full overflow-hidden">
        {/* Top Header Placeholder */}
        <div className="shrink-0 pb-2 border-b border-black/10 dark:border-white/10 flex flex-row items-center justify-between w-full gap-4">
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-2 min-w-0 flex-1">
            <Skeleton className="w-36 h-8 sm:h-9" />
            <Skeleton className="w-48 h-4 hidden lg:inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Filter Badges Placeholder */}
        <div className="flex items-center gap-2 overflow-hidden py-1">
          <Skeleton className="w-16 h-7 rounded-full" />
          <Skeleton className="w-24 h-7 rounded-full" />
          <Skeleton className="w-28 h-7 rounded-full" />
          <Skeleton className="w-20 h-7 rounded-full" />
        </div>

        {/* Carousel Cards Placeholder */}
        <div className="relative w-full flex-1 min-h-0 flex flex-col md:flex-row gap-[2px] items-stretch py-1 overflow-hidden">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4 aspect-[3/2] 3xl:aspect-[9/16] 3xl:max-h-[85vh] overflow-hidden rounded-none border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col justify-end p-4 sm:p-5"
            >
              <Skeleton className="w-3/4 h-5 mb-2" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
