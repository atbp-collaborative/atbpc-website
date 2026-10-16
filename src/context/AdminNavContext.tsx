/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface AdminNavContextType {
  isMobileDrawerOpen: boolean;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
}

const AdminNavContext = createContext<AdminNavContextType | undefined>(undefined);

export const AdminNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const openMobileDrawer = useCallback(() => setIsMobileDrawerOpen(true), []);
  const closeMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);
  const toggleMobileDrawer = useCallback(() => setIsMobileDrawerOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      isMobileDrawerOpen,
      openMobileDrawer,
      closeMobileDrawer,
      toggleMobileDrawer,
    }),
    [isMobileDrawerOpen, openMobileDrawer, closeMobileDrawer, toggleMobileDrawer]
  );

  return <AdminNavContext.Provider value={value}>{children}</AdminNavContext.Provider>;
};

export const useAdminNav = (): AdminNavContextType => {
  const context = useContext(AdminNavContext);
  if (!context) {
    // Provide safe fallback if used outside provider
    return {
      isMobileDrawerOpen: false,
      openMobileDrawer: () => {},
      closeMobileDrawer: () => {},
      toggleMobileDrawer: () => {},
    };
  }
  return context;
};
