/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, HardHat, ShieldCheck, KeyRound, Lock } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useTheme } from '@/context/ThemeContext';
import { AdminAccountsTab } from '@/components/admin/super-panel/AdminAccountsTab';
import { MaintenanceModeTab } from '@/components/admin/super-panel/MaintenanceModeTab';
import { ContentProtectionTab } from '@/components/admin/super-panel/ContentProtectionTab';

type SuperPanelTab = 'accounts' | 'maintenance' | 'protection';

export function SuperPanelClient() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, isLoading } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<SuperPanelTab>('accounts');

  const isSuperadmin = user?.role === 'superadmin';

  // Guard: Redirect non-superadmins away from this panel
  useEffect(() => {
    if (!isLoading && user && !isSuperadmin) {
      router.replace('/admin/dashboard');
    }
  }, [isLoading, user, isSuperadmin, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader
          title="Super Admin Panel"
          breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Super Admin Panel' }]}
        />
        <div className="p-8 max-w-7xl mx-auto w-full animate-pulse space-y-6">
          <div className="h-12 w-64 bg-black/10 dark:bg-white/10 rounded-lg" />
          <div className="h-96 w-full bg-black/5 dark:bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isSuperadmin) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
          <Lock size={32} />
        </div>
        <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
          restricted superadmin area
        </h2>
        <p className="text-caption opacity-70 max-w-md">
          This governance console is strictly reserved for the website owner and nominated Super Admin.
        </p>
      </div>
    );
  }

  const tabs: {
    key: SuperPanelTab;
    label: string;
    icon: React.ElementType;
    description: string;
  }[] = [
    {
      key: 'accounts',
      label: 'Admin Accounts',
      icon: Users,
      description: 'Provision, supervise, and revoke Admin and Editor accounts',
    },
    {
      key: 'maintenance',
      label: 'Maintenance Mode',
      icon: HardHat,
      description: 'Under construction gate and public visitor routing',
    },
    {
      key: 'protection',
      label: 'Content Protection',
      icon: ShieldCheck,
      description: 'Right-click, dragging, and scraping shields for public media',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Super Admin Panel"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Super Admin Panel' }]}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-caption transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? isDarkMode
                        ? 'bg-vintage-charcoal text-white shadow-sm font-semibold border border-space-sparkle/40'
                        : 'bg-white text-vintage-charcoal shadow-sm font-semibold border border-black/10'
                      : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? 'text-space-sparkle' : 'opacity-70'}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-micro font-mono uppercase tracking-wider opacity-60 self-center hidden md:block">
            {tabs.find((t) => t.key === activeTab)?.description}
          </div>
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'accounts' && <AdminAccountsTab />}
        {activeTab === 'maintenance' && <MaintenanceModeTab />}
        {activeTab === 'protection' && <ContentProtectionTab />}
      </div>
    </div>
  );
}
