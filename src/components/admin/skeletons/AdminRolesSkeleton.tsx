import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminRolesSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage studio roles"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Roles' }]}
        actions={<Skeleton className="w-24 h-8 rounded-lg" />}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 4 Summary Metric Pills Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between"
            >
              <div className="space-y-1">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-12 h-7" />
              </div>
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            </div>
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <Skeleton className="w-full md:w-72 h-10 rounded-lg" />
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="w-20 h-8 rounded-lg" />
              <Skeleton className="w-24 h-8 rounded-lg" />
              <Skeleton className="w-24 h-8 rounded-lg" />
              <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
          </div>
        </div>

        {/* View Tabs Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-28 h-9 rounded-lg" />
          <Skeleton className="w-28 h-9 rounded-lg" />
          <Skeleton className="w-32 h-9 rounded-lg" />
        </div>

        {/* Roles Table Skeleton */}
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden">
          <div className="p-4 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1 w-1/4">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
                <div className="flex items-center gap-1.5 w-1/4">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="w-16 h-3.5" />
                </div>
                <Skeleton className="w-16 h-7 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
