/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Layers,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useAdminNav } from '@/context/AdminNavContext';
import { AtbpLogo } from '@/components/global/AtbpLogo';
import { ThemeToggle } from '@/components/global/ThemeToggle';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Manage People',
    href: '/admin/people',
    icon: Users,
    subtitle: 'our-people/ directory',
  },
  {
    name: 'Manage Roles',
    href: '/admin/roles',
    icon: ShieldCheck,
    subtitle: 'roles, tracks & assignments',
  },
  {
    name: 'Manage Projects',
    href: '/admin/projects',
    icon: FolderKanban,
    subtitle: 'works/ portfolio',
  },
  {
    name: 'Manage Content',
    href: '/admin/content',
    icon: Layers,
    subtitle: 'pages, stages, services & CMS',
  },
  {
    name: 'Manage General Info',
    href: '/admin/general-info',
    icon: FileText,
    subtitle: 'legal, privacy, contacts',
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAdminAuth();
  const adminNav = useAdminNav();

  const activeIsOpen = isOpen ?? adminNav.isMobileDrawerOpen;
  const activeOnClose = onClose ?? adminNav.closeMobileDrawer;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Branding & Nav */}
      <div className="space-y-6">
        {/* Brand header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <Link href="/admin/dashboard" className="group block space-y-1.5" onClick={activeOnClose}>
            <AtbpLogo isDarkMode={isDarkMode} className="h-6 w-auto" />
            <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle block font-medium">
              Admin Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} className="!w-8 !h-8" />
            {activeOnClose && (
              <button
                onClick={activeOnClose}
                className="p-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={activeOnClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-caption font-medium transition-all group ${
                  isActive
                    ? 'bg-space-sparkle text-white font-semibold shadow-xs'
                    : isDarkMode
                      ? 'text-bright-gray/70 hover:text-white hover:bg-white/5'
                      : 'text-vintage-charcoal/70 hover:text-black hover:bg-black/5'
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-space-sparkle'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="block truncate">{item.name}</span>
                  {item.subtitle && (
                    <span
                      className={`block text-micro truncate font-mono ${
                        isActive ? 'text-white/80' : 'opacity-40'
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: user profile, sign out */}
      <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
        {/* User Card */}
        <div
          className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
            isDarkMode
              ? 'bg-vintage-charcoal/60 border-white/10'
              : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-space-sparkle/20 text-space-sparkle flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold truncate leading-none mb-1">
                {user?.name || 'Studio Administrator'}
              </p>
              <p className="text-micro opacity-50 truncate font-mono">
                {user?.email || 'admin@atbp.ph'}
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out Action */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-mini rounded-md text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed & non-scrollable sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-64 shrink-0 p-5 border-r h-screen sticky top-0 overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-vintage-charcoal/95 border-white/10 text-bright-gray'
            : 'bg-white border-black/10 text-vintage-charcoal'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer sidebar */}
      <AnimatePresence>
        {activeIsOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={activeOnClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={`fixed inset-y-0 left-0 w-72 p-5 z-10 flex flex-col shadow-2xl transition-colors ${
                isDarkMode
                  ? 'bg-vintage-charcoal border-r border-white/10 text-bright-gray'
                  : 'bg-white border-r border-black/10 text-vintage-charcoal'
              }`}
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
