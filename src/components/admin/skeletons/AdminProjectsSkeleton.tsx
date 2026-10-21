import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminProjectsSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage projects"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Projects' }]}
        actions={<Skeleton className="w-28 h-8 rounded-lg" />}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter and Search Bar Skeleton */}
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <Skeleton className="w-full md:w-80 h-10 rounded-lg" />
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="w-48 sm:w-64 h-9 rounded-lg" />
              <Skeleton className="w-36 sm:w-44 h-9 rounded-lg" />
            </div>
          </div>
          <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-20 h-7 rounded-lg" />
              <Skeleton className="w-20 h-7 rounded-lg" />
              <Skeleton className="w-24 h-7 rounded-lg" />
              <Skeleton className="w-24 h-7 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-36 h-8 rounded-lg" />
            </div>
          </div>
        </div>

        {/* 6 Projects Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Thumbnail */}
                <div className="aspect-video w-full relative bg-black/10 dark:bg-white/10">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute top-3 left-3">
                    <Skeleton className="w-16 h-5 rounded-md" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Skeleton className="w-20 h-5 rounded-md" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-1/2 h-3.5" />
                    </div>
                    <Skeleton className="w-12 h-4 rounded" />
                  </div>

                  <Skeleton className="w-full h-8 rounded-lg" />

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-16 h-4" />
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="p-4 pt-1 flex items-center justify-between gap-2 border-t border-black/5 dark:border-white/5 mt-2">
                <Skeleton className="w-16 h-7 rounded" />
                <Skeleton className="w-16 h-5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
