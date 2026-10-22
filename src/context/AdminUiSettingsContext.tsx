/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AdminUiPreferences, DisplayMode } from '@/types';
import { updateAdminUiPreferencesAction } from '@/app/actions/admin-mutations';

interface AdminUiSettingsContextType {
  preferences: AdminUiPreferences;
  getDisplayMode: (page: 'projects' | 'people') => DisplayMode;
  setDisplayMode: (page: 'projects' | 'people', mode: DisplayMode) => void;
  getActiveTab: (page: 'roles' | 'content') => string | undefined;
  setActiveTab: (page: 'roles' | 'content', tab: string) => void;
}

const DEFAULT_PREFERENCES: AdminUiPreferences = {
  theme: 'dark',
  views: {
    projects: 'grid',
    people: 'list',
    roles: 'roles',
  },
};

const STORAGE_KEY = 'atbpc_admin_ui_preferences_v1';

const AdminUiSettingsContext = createContext<AdminUiSettingsContextType | undefined>(undefined);

export const AdminUiSettingsProvider: React.FC<{
  initialPreferences?: AdminUiPreferences;
  children: React.ReactNode;
}> = ({ initialPreferences, children }) => {
  const [preferences, setPreferences] = useState<AdminUiPreferences>(() => {
    if (initialPreferences) return initialPreferences;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
        }
      } catch (err) {
        console.warn('Failed to read admin preferences from localStorage:', err);
      }
    }
    return DEFAULT_PREFERENCES;
  });

  const isInitialMount = useRef(true);

  // Persist to server in background if user is authenticated
  const syncToServer = useCallback(async (updated: AdminUiPreferences) => {
    try {
      await updateAdminUiPreferencesAction(updated);
    } catch {
      // In bypass or unauthenticated dev mode, ignore server sync errors
    }
  }, []);

  // Sync to localStorage and persist to server safely in a passive effect (prevents setState in render)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (err) {
        console.warn('Failed to save admin preferences to localStorage:', err);
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    syncToServer(preferences);
  }, [preferences, syncToServer]);

  const getDisplayMode = useCallback(
    (page: 'projects' | 'people'): DisplayMode => {
      return preferences.views?.[page] || (page === 'projects' ? 'grid' : 'list');
    },
    [preferences]
  );

  const setDisplayMode = useCallback(
    (page: 'projects' | 'people', mode: DisplayMode) => {
      setPreferences((prev) => ({
        ...prev,
        views: {
          ...prev.views,
          [page]: mode,
        },
      }));
    },
    []
  );

  const getActiveTab = useCallback(
    (page: 'roles' | 'content'): string | undefined => {
      return preferences.views?.[page];
    },
    [preferences]
  );

  const setActiveTab = useCallback(
    (page: 'roles' | 'content', tab: string) => {
      setPreferences((prev) => ({
        ...prev,
        views: {
          ...prev.views,
          [page]: tab,
        },
      }));
    },
    []
  );

  return (
    <AdminUiSettingsContext.Provider
      value={{
        preferences,
        getDisplayMode,
        setDisplayMode,
        getActiveTab,
        setActiveTab,
      }}
    >
      {children}
    </AdminUiSettingsContext.Provider>
  );
};

export function useAdminUiSettings(): AdminUiSettingsContextType {
  const ctx = useContext(AdminUiSettingsContext);
  if (!ctx) {
    return {
      preferences: DEFAULT_PREFERENCES,
      getDisplayMode: (page) => (page === 'projects' ? 'grid' : 'list'),
      setDisplayMode: () => {},
      getActiveTab: () => undefined,
      setActiveTab: () => {},
    };
  }
  return ctx;
}
