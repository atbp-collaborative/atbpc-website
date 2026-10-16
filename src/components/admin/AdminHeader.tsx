/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ChevronRight, ExternalLink } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAdminNav } from '@/context/AdminNavContext';
import { ThemeToggle } from '@/components/global/ThemeToggle';

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  breadcrumbs = [],
  onOpenMobileMenu,
  actions,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openMobileDrawer } = useAdminNav();

  const handleOpenMobile = onOpenMobileMenu ?? openMobileDrawer;

  return (
    <header
      className={`sticky top-0 z-30 px-4 sm:px-8 py-3.5 border-b backdrop-blur-md transition-colors ${
        isDarkMode
          ? 'bg-vintage-charcoal/80 border-white/10 text-bright-gray'
          : 'bg-white/85 border-black/10 text-vintage-charcoal'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-3">
          {handleOpenMobile && (
            <button
              type="button"
              onClick={handleOpenMobile}
              className="lg:hidden p-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>
          )}

          <div>
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-micro opacity-60 mb-0.5 font-mono">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:underline">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                    {idx < breadcrumbs.length - 1 && <ChevronRight size={10} />}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className="text-body sm:text-h2 font-major font-bold tracking-tight lowercase">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Actions, Theme Toggle & quick link */}
        <div className="flex items-center gap-2">
          {actions}
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={toggleTheme}
            className="!w-8 !h-8"
          />
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-mini hover:border-space-sparkle text-space-sparkle transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </header>
  );
};
