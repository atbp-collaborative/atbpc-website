import React from 'react';
import { Skeleton } from './Skeleton';

export function ProcessSubpageSkeleton() {
  return (
    <div className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1 relative animate-pulse">
      {/* Top Header Placeholder */}
      <div className="shrink-0 text-left pt-1 sm:pt-2 pb-2 space-y-2">
        <Skeleton className="w-48 sm:w-64 md:w-80 h-7 sm:h-9 md:h-11 rounded-none" />
        <Skeleton className="w-36 sm:w-48 h-3.5 sm:h-4 rounded-none opacity-80" />
      </div>

      {/* Desktop Description Placeholder */}
      <div className="hidden lg:block space-y-2 max-w-3xl pt-0.5 shrink-0 mb-6 lg:mb-0">
        <Skeleton className="w-full h-3.5 rounded-none opacity-70" />
        <Skeleton className="w-4/5 h-3.5 rounded-none opacity-70" />
      </div>

      {/* Center Section: Responsive matching ProcessStage (desktop) & ProcessAccordion (mobile) */}
      <div className="flex-1 flex flex-col justify-start items-center w-full min-h-0 py-1 overflow-hidden">
        {/* Desktop Timeline Layout */}
        <div className="hidden lg:flex flex-col w-full my-auto space-y-6">
          {/* Category Headers Row */}
          <div className="w-full grid grid-cols-4 gap-4 px-2">
            {[1, 2, 3, 4].map((col) => (
              <div key={col} className="flex flex-col items-center space-y-1">
                <Skeleton className="w-24 h-4 rounded-none" />
                <div className="w-3/4 h-[1px] bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>

          {/* Dotted Guide & Circular Stage Nodes */}
          <div className="relative w-full flex items-center justify-between py-4">
            {/* Connecting horizontal line */}
            <div
              className="absolute left-4 right-4 top-1/2 -translate-y-1/2 z-0 opacity-40"
              style={{
                height: '2px',
                backgroundImage: 'radial-gradient(circle, rgba(128, 128, 128, 0.6) 2px, transparent 2px)',
                backgroundSize: '16px 2px',
                backgroundRepeat: 'repeat-x',
              }}
            />

            {/* 7 Circular Nodes */}
            <div className="relative z-10 w-full grid grid-cols-7 gap-3 items-center">
              {Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} className="flex justify-center w-full">
                  <div className="rounded-full aspect-square w-12 sm:w-16 md:w-20 lg:w-24 border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center p-2 space-y-1 shadow-sm">
                    <Skeleton className="w-8 sm:w-12 h-2.5 sm:h-3 rounded-full" />
                    <Skeleton className="w-6 sm:w-8 h-2 sm:h-2.5 rounded-full opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="flex lg:hidden flex-col w-full pb-8 space-y-3">
          {/* Mobile Description */}
          <div className="space-y-1.5 pb-2">
            <Skeleton className="w-full h-3 rounded-none opacity-70" />
            <Skeleton className="w-5/6 h-3 rounded-none opacity-70" />
          </div>

          {/* Accordion Item Rows */}
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-14 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between px-4"
            >
              <div className="space-y-1.5 flex-1">
                <Skeleton className="w-20 h-3 rounded-none opacity-60" />
                <Skeleton className="w-40 sm:w-56 h-4 rounded-none" />
              </div>
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-4 lg:mt-1 pb-4 lg:pb-0 flex justify-center">
        <Skeleton className="w-64 sm:w-96 h-3 rounded-none opacity-70" />
      </div>
    </div>
  );
}
