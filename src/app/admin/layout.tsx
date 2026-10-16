/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useTheme } from '@/context/ThemeContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on login page, render full-bleed centered without sidebar
  if (pathname === '/admin/login') {
    return (
      <main
        className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
          isDarkMode ? 'bg-vintage-charcoal text-bright-gray' : 'bg-bright-gray text-vintage-charcoal'
        }`}
      >
        {children}
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
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Pass down mobile toggle capability */}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
