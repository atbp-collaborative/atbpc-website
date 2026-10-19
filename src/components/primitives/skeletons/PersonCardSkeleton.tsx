import React from 'react';
import { Skeleton } from './Skeleton';

export function PersonCardSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col justify-between md:overflow-hidden select-none">
      {/* Filter bar placeholder */}
      <div className="flex items-center gap-3 pb-2.5 mb-2">
        <Skeleton className="w-12 h-5" />
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-16 h-5" />
      </div>

      {/* Cards row placeholder */}
      <div className="flex-1 relative w-full md:overflow-hidden">
        <div className="flex flex-col md:flex-row gap-[2px] h-full items-stretch">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="relative flex-1 min-w-[240px] h-[50vh] md:h-full bg-black/5 dark:bg-white/5 flex flex-col justify-end p-5"
            >
              <Skeleton className="w-2/3 h-6 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
