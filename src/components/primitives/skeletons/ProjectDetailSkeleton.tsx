import React from 'react';
import { Skeleton } from './Skeleton';

export function ProjectDetailSkeleton() {
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 h-full px-4 sm:px-8 py-3 select-none overflow-y-auto lg:overflow-hidden">
      {/* Top back button placeholder */}
      <div className="shrink-0 mb-3 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-full" />
        <Skeleton className="w-24 h-6 rounded" />
      </div>

      {/* Main split view */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 h-full items-stretch overflow-hidden">
        {/* Media Gallery Stage */}
        <div className="flex-1 min-h-[300px] lg:min-h-0 bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 flex flex-col justify-end p-6 relative overflow-hidden">
          <Skeleton className="w-full h-full absolute inset-0" />
        </div>

        {/* Sidebar Info Stage */}
        <div className="w-full lg:w-[380px] xl:w-[440px] shrink-0 flex flex-col space-y-4 overflow-y-auto pr-1">
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-8" />
            <Skeleton className="w-1/2 h-4" />
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-black/10 dark:border-white/10">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>

          {/* Narrative accordion */}
          <div className="space-y-3 pt-2">
            <Skeleton className="w-full h-12 rounded" />
            <Skeleton className="w-full h-12 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
