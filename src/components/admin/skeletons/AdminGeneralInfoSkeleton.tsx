import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminGeneralInfoSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage general info"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'General Info' }]}
        actions={
          <div className="flex items-center gap-2">
            <Skeleton className="w-24 h-7" />
            <Skeleton className="w-32 h-8 rounded-lg" />
          </div>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        {/* Tab Selection Row Skeleton */}
        <div className="p-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center gap-2 overflow-x-auto">
          <Skeleton className="w-36 h-9 rounded-lg" />
          <Skeleton className="w-32 h-9 rounded-lg" />
          <Skeleton className="w-40 h-9 rounded-lg" />
          <Skeleton className="w-36 h-9 rounded-lg" />
          <Skeleton className="w-36 h-9 rounded-lg" />
        </div>

        {/* Form Card Skeleton */}
        <div className="p-6 sm:p-8 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-6">
          <div className="border-b border-black/5 dark:border-white/5 pb-4 space-y-1.5">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-96 max-w-full h-3.5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <Skeleton className="w-40 h-3" />
              <Skeleton className="w-full h-20 rounded-lg" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="w-32 h-3" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="w-32 h-3" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="w-32 h-3" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="w-32 h-3" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Skeleton className="w-36 h-3" />
              <Skeleton className="w-full h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
