'use client';

import { Suspense, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '../lib/theme-context';
import { useContentProtection } from '../hooks/useContentProtection';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileDrawer } from './MobileDrawer';

// Paths that keep the ordinary scrollable min-h-screen layout instead of the
// locked full-viewport h-screen treatment used by the marketing/landing pages.
const SCROLLABLE_PATHS = ['/our-services', '/contact/discovery-meeting'];

function isMemberDetailPath(pathname: string): boolean {
  return /^\/(studio\/)?our-people\/[^/]+$/.test(pathname);
}

function AppShellInner({ children }: { children: ReactNode }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const { isShielded } = useContentProtection(isProtectionEnabled);

  const isFullScreenLanding = !SCROLLABLE_PATHS.includes(pathname);
  const hideFooter = pathname === '/';

  return (
    <div
      id="app-root"
      className={`${
        isFullScreenLanding ? 'h-screen overflow-hidden flex flex-col' : 'min-h-screen'
      } font-sans transition-colors duration-500 ease-in-out ${
        isDarkMode ? 'bg-vintage-charcoal text-bright-gray' : 'bg-bright-gray text-vintage-charcoal'
      }`}
    >
      <Suspense fallback={null}>
        <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </Suspense>

      <Suspense fallback={null}>
        <MobileDrawer isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </Suspense>

      {children}

      {!hideFooter && (
        <Footer
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          isProtectionEnabled={isProtectionEnabled}
          onToggleProtection={() => setIsProtectionEnabled((prev) => !prev)}
        />
      )}

      {isShielded && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[999999] flex flex-col items-center justify-center text-white select-none pointer-events-none p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-60">
            <span className="text-xl font-mono">🔒</span>
          </div>
          <p className="text-caption sm:text-body font-bold tracking-widest uppercase opacity-90">
            Protected Content
          </p>
          <p className="text-mini font-light opacity-60 max-w-sm">
            ATBP Collaborative digital content protection enabled
          </p>
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppShellInner>{children}</AppShellInner>
    </ThemeProvider>
  );
}
