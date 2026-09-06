'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Dark mode: 6 PM - 6 AM; Light mode: 6 AM - 6 PM
function getAutoThemeIsDark(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 6;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Deterministic SSR-safe default (server has no notion of the visitor's
  // local time/timezone); corrected to the real value immediately on mount
  // below, same as the auto-refresh interval that follows it.
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  // Check local time every minute to switch theme dynamically; also fires
  // once immediately on mount to correct the SSR-safe default above.
  useEffect(() => {
    const checkTheme = () => setIsDarkMode(getAutoThemeIsDark());
    checkTheme();
    const interval = setInterval(checkTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

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
