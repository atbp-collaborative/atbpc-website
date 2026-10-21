import React from 'react';
import { Skeleton } from '@/components/primitives/skeletons/Skeleton';
import { AdminHeader } from '@/components/admin/AdminHeader';

export function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="studio overview"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      />

      <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Welcome Banner Skeleton */}
        <div className="p-6 sm:p-8 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
          <div className="space-y-2 max-w-2xl">
            <Skeleton className="w-36 h-3" />
            <Skeleton className="w-72 sm:w-96 h-8" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="w-full max-w-xl h-3.5" />
              <Skeleton className="w-4/5 max-w-lg h-3.5" />
            </div>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <Skeleton className="w-32 h-9 rounded-lg" />
            <Skeleton className="w-32 h-9 rounded-lg" />
            <Skeleton className="w-32 h-9 rounded-lg" />
          </div>
        </div>

        {/* 4 Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-16 h-3" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="w-24 h-3" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="w-16 h-9" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-between gap-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Split Section: Recent Projects & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent projects list (2 cols) */}
          <div className="lg:col-span-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <Skeleton className="w-40 h-5" />
              <Skeleton className="w-20 h-3" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="p-3 rounded-lg border border-black/5 dark:border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Skeleton className="w-14 h-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="w-36 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar status card (1 col) */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 sm:p-6 space-y-4">
            <Skeleton className="w-32 h-5" />
            <div className="space-y-2.5 pt-2">
              <Skeleton className="w-full h-12 rounded-lg" />
              <Skeleton className="w-full h-12 rounded-lg" />
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
