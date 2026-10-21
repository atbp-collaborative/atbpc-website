import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminPeopleSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage team"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'People' }]}
        actions={<Skeleton className="w-32 h-8 rounded-lg" />}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter and Search Bar Skeleton */}
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <Skeleton className="w-full md:w-80 h-10 rounded-lg" />
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="w-56 h-9 rounded-lg" />
              <Skeleton className="w-36 h-9 rounded-lg" />
              <Skeleton className="w-20 h-9 rounded-lg" />
            </div>
          </div>
        </div>

        {/* 6 Member Rows Skeleton */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden divide-y divide-black/5 dark:divide-white/5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center gap-4 min-w-0">
                <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-36 h-5" />
                    <Skeleton className="w-20 h-4 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-28 h-3.5" />
                    <Skeleton className="w-16 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Right: Involvement + Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-16 h-7 rounded" />
                <Skeleton className="w-16 h-6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
