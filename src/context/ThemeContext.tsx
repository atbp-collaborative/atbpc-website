'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Dark mode: 6 PM - 6 AM (evening/night); Light mode: 6 AM - 6 PM (morning/daytime)
function getAutoThemeIsDark(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 6;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Deterministic SSR-safe default (server has no notion of the visitor's local time/timezone)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  // Initial visit local-time detection: runs strictly once on mount.
  // If the user previously switched themes during this visit session, restore that preference.
  // Otherwise, automatically set theme relative to user's local time (light for morning, dark for evening).
  useEffect(() => {
    try {
      const storedTheme = sessionStorage.getItem('atbpc_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setIsDarkMode(storedTheme === 'dark');
        return;
      }
    } catch {
      // sessionStorage unavailable or restricted
    }

    // First time check of the visitor's local time
    setIsDarkMode(getAutoThemeIsDark());
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('atbpc_theme', next ? 'dark' : 'light');
      } catch {
        // sessionStorage unavailable or restricted
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
