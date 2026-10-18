import React from 'react';
import { Skeleton } from './Skeleton';

export function ProjectCardSkeleton() {
  return (
    <div className="w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center w-full min-h-0 h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-[2px] flex-1 h-full min-h-0 items-stretch">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="relative flex-1 min-h-0 w-full overflow-hidden bg-black/5 dark:bg-white/5 flex flex-col justify-end p-6 sm:p-8 md:p-10"
            >
              <Skeleton className="w-1/2 h-8 mb-3" />
              <Skeleton className="w-3/4 h-4 mb-2" />
              <Skeleton className="w-1/3 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
