import React from 'react';
import { Skeleton } from './Skeleton';

export function PersonDetailSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 h-full px-4 sm:px-8 py-3 select-none overflow-y-auto lg:overflow-hidden">
      {/* Top back button placeholder */}
      <div className="shrink-0 mb-4 flex items-center">
        <Skeleton className="w-32 h-8 rounded-full" />
      </div>

      {/* Main split profile view */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 sm:gap-8 min-h-0 h-full items-start overflow-hidden">
        {/* Photo Stage */}
        <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 aspect-[3/4] bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 overflow-hidden relative">
          <Skeleton className="w-full h-full absolute inset-0" />
        </div>

        {/* Bio & Details */}
        <div className="flex-1 w-full space-y-4 pt-1">
          <div className="space-y-2">
            <Skeleton className="w-1/2 max-w-sm h-8 sm:h-10" />
            <Skeleton className="w-1/3 max-w-xs h-5" />
          </div>

          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>

          <div className="pt-4 space-y-3">
            <Skeleton className="w-48 h-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="w-full h-16 rounded" />
              <Skeleton className="w-full h-16 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
