/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronRight, ExternalLink, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAdminNav } from '@/context/AdminNavContext';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { ThemeToggle } from '@/components/global/ThemeToggle';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

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
  const { logout } = useAdminAuth();

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleOpenMobile = onOpenMobileMenu ?? openMobileDrawer;

  return (
    <>
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

          {/* Right: Actions, Theme Toggle, Live Site & Sign Out */}
          <div className="flex items-center gap-2">
            {actions}
            <div className="hidden lg:flex items-center">
              <ThemeToggle
                isDarkMode={isDarkMode}
                onToggle={toggleTheme}
                className="!w-8 !h-8"
              />
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 text-mini hover:border-space-sparkle text-space-sparkle transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink size={12} />
            </Link>

            {/* Header Sign Out Action (Icon-only) */}
            <button
              type="button"
              onClick={() => setIsSignOutModalOpen(true)}
              className="p-1.5 sm:p-2 rounded-md border border-black/10 dark:border-white/10 hover:border-red-500/40 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out of Dashboard"
              aria-label="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        isOpen={isSignOutModalOpen}
        title="Sign Out of Dashboard"
        description="Are you sure you want to end your administration session? You will need to log in again to access the studio console."
        confirmLabel="Sign Out"
        isDestructive={true}
        onConfirm={() => {
          setIsSignOutModalOpen(false);
          logout();
        }}
        onCancel={() => setIsSignOutModalOpen(false)}
      />
    </>
  );
};
