import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminContentSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage content"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'CMS Content' }]}
        actions={<Skeleton className="w-24 h-8 rounded-lg" />}
      />

      <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top Tab Bar Skeleton */}
        <div className="p-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center gap-2 overflow-x-auto">
          <Skeleton className="w-36 h-10 rounded-lg" />
          <Skeleton className="w-36 h-10 rounded-lg" />
          <Skeleton className="w-32 h-10 rounded-lg" />
          <Skeleton className="w-32 h-10 rounded-lg" />
        </div>

        {/* Section 1: Hero Carousel Slides Skeleton */}
        <div className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
            <div className="space-y-1">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-72 h-3.5" />
            </div>
            <Skeleton className="w-28 h-8 rounded-lg" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-black/5 dark:border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Skeleton className="w-4 h-6" />
                  <Skeleton className="w-20 h-12 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1 max-w-md">
                    <Skeleton className="w-full h-8 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Cards Grid Skeleton */}
        <div className="p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
          <div className="space-y-1">
            <Skeleton className="w-40 h-5" />
            <Skeleton className="w-64 h-3.5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-xl border border-black/5 dark:border-white/5 p-4 space-y-3"
              >
                <Skeleton className="w-full aspect-video rounded-lg" />
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-full h-3.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
