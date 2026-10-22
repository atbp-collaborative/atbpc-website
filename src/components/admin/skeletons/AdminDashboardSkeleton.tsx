import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="studio overview"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      />

      <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Welcome Banner Skeleton — gradient border matches actual banner */}
        <div className="p-6 sm:p-8 rounded-xl border border-space-sparkle/20 dark:border-space-sparkle/30 bg-space-sparkle/5 dark:bg-space-sparkle/10 space-y-4">
          <div className="space-y-2 max-w-2xl">
            <Skeleton className="w-44 h-3" />
            <Skeleton className="w-72 sm:w-[420px] h-8" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="w-full max-w-xl h-3.5" />
              <Skeleton className="w-3/4 max-w-lg h-3.5" />
            </div>
          </div>
          <div className="pt-1 flex flex-wrap gap-3">
            <Skeleton className="w-36 h-8 rounded-lg" />
            <Skeleton className="w-32 h-8 rounded-lg" />
            <Skeleton className="w-36 h-8 rounded-lg" />
          </div>
        </div>

        {/* 3 Metric Cards Skeleton — matches actual lg:grid-cols-3 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-vintage-charcoal/70 space-y-4"
            >
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-20 h-3" />
              </div>
              <div className="space-y-1 mb-2">
                <Skeleton className="w-28 h-3" />
                <div className="flex items-baseline gap-3 pt-0.5">
                  <Skeleton className="w-14 h-10" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-between gap-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Split Section: Recent Projects & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent projects list (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-vintage-charcoal/70 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-24 h-3" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="p-3 rounded-lg border border-black/5 dark:border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Skeleton className="w-12 h-10 rounded-md shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="w-40 h-4" />
                      <Skeleton className="w-28 h-3" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Skeleton className="w-16 h-5 rounded" />
                    <Skeleton className="w-12 h-5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: System Status + Public Preview */}
          <div className="space-y-5">
            {/* System Status card */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-vintage-charcoal/70 p-5 sm:p-6 space-y-4">
              <div className="pb-2 border-b border-black/5 dark:border-white/10">
                <Skeleton className="w-32 h-5" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex items-center justify-between">
                    <Skeleton className="w-36 h-3.5" />
                    <Skeleton className="w-20 h-3.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Public Preview card */}
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-vintage-charcoal/70 p-5 sm:p-6 space-y-4">
              <div className="pb-2 border-b border-black/5 dark:border-white/10">
                <Skeleton className="w-32 h-5" />
              </div>
              <Skeleton className="w-full h-3.5" />
              <Skeleton className="w-3/4 h-3.5" />
              <div className="space-y-2 pt-1">
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-full h-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
