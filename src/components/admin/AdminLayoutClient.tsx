/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavProvider, useAdminNav } from '@/context/AdminNavContext';
import { AdminUiSettingsProvider } from '@/context/AdminUiSettingsContext';
import { DevRoleSwitcher } from '@/components/admin/dev/DevRoleSwitcher';
import { useTheme } from '@/context/ThemeContext';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

const AdminLayoutContent: React.FC<AdminLayoutClientProps> = ({ children }) => {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();
  const { isMobileDrawerOpen, closeMobileDrawer } = useAdminNav();

  useEffect(() => {
    document.title = 'ATBPC Admin Dashboard';
  }, [pathname]);

  // If on login page or handover ceremony page, render full-bleed centered without sidebar
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/login/turn-over';

  if (isAuthPage) {
    return (
      <main
        className={`h-screen w-full overflow-hidden flex items-center justify-center p-4 transition-colors ${
          isDarkMode ? 'bg-vintage-charcoal text-bright-gray' : 'bg-bright-gray text-vintage-charcoal'
        }`}
      >
        {children}
        <DevRoleSwitcher />
      </main>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row transition-colors ${
        isDarkMode ? 'bg-vintage-charcoal text-bright-gray' : 'bg-[#F5F6F6] text-vintage-charcoal'
      }`}
    >
      <AdminSidebar
        isOpen={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 flex flex-col">{children}</main>
      </div>

      <DevRoleSwitcher />
    </div>
  );
};

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) => {
  return (
    <AdminNavProvider>
      <AdminUiSettingsProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminUiSettingsProvider>
    </AdminNavProvider>
  );
};
