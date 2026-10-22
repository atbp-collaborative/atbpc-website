'use client';

import { Suspense, useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SitePagesProvider } from '@/context/SitePagesContext';
import { useContentProtection } from '@/hooks/useContentProtection';
import { markNavigated } from '@/lib/navigation/nav-history';
import { Header } from '@/components/global/Header';
import { Footer } from '@/components/global/Footer';
import { MobileDrawer } from '@/components/global/MobileDrawer';
import { LegalPrivacyModals } from '@/components/modals/LegalPrivacyModals';
import { Toaster } from 'sonner';
import { SitePage } from '@/types';

// Paths that keep the ordinary scrollable min-h-screen layout instead of the
// locked full-viewport h-screen treatment used by the marketing/landing pages.
const SCROLLABLE_PATHS = [
  '/our-services',
  '/launching-soon',
  '/under-maintenance',
  '/under-construction',
];

function AppShellInner({
  children,
  isUnderConstruction,
  sitePages,
}: {
  children: ReactNode;
  isUnderConstruction?: boolean;
  sitePages?: SitePage[];
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);

  const isAdmin = pathname.startsWith('/admin');
  const { isShielded } = useContentProtection(!isAdmin && isProtectionEnabled);

  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Sync content protection from cookie
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/site_content_protection=(true|false)/);
      if (match) {
        setIsProtectionEnabled(match[1] === 'true');
      }
    }
  }, [pathname]);

  // Marks that an in-app client-side route change has happened, so
  // MemberDetail's back button can tell a real in-app history from a
  // direct/refreshed link and only use router.back() in the former case.
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      markNavigated();
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  const isStatusPath =
    pathname === '/launching-soon' ||
    pathname === '/under-maintenance' ||
    pathname === '/under-construction';

  const isFullScreenLanding =
    !SCROLLABLE_PATHS.includes(pathname) &&
    !isStatusPath &&
    !isUnderConstruction &&
    !isAdmin;

  const isOurPeople =
    pathname.startsWith('/studio/our-people') ||
    pathname.startsWith('/our-people');

  const hideHeader = isStatusPath || isUnderConstruction || isAdmin;
  const hideFooter =
    pathname === '/' || isStatusPath || isUnderConstruction || isAdmin;

  return (
    <div
      id="app-root"
      className={`${
        isFullScreenLanding && !isOurPeople
          ? 'h-screen overflow-hidden flex flex-col'
          : isOurPeople
            ? 'min-h-dvh md:h-screen md:overflow-hidden flex flex-col'
            : 'min-h-screen'
      } font-sans transition-colors duration-500 ease-in-out ${
        isDarkMode ? 'bg-vintage-charcoal text-bright-gray' : 'bg-bright-gray text-vintage-charcoal'
      }`}
    >
      {!hideHeader && (
        <Suspense fallback={null}>
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            sitePages={sitePages}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <MobileDrawer 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          sitePages={sitePages}
          isProtectionEnabled={isProtectionEnabled}
          onToggleProtection={() => setIsProtectionEnabled((prev) => !prev)}
          onOpenLegal={() => setIsLegalModalOpen(true)}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      </Suspense>

      {children}

      {!hideFooter && (
        <Footer
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          isProtectionEnabled={isProtectionEnabled}
          onToggleProtection={() => setIsProtectionEnabled((prev) => !prev)}
          onOpenLegal={() => setIsLegalModalOpen(true)}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        />
      )}

      {isShielded && !isAdmin && (
        <div className="fixed inset-0 backdrop-blur-3xl z-999999 pointer-events-none transition-all duration-300" />
      )}

      <LegalPrivacyModals
        isDarkMode={isDarkMode}
        isLegalOpen={isLegalModalOpen}
        onLegalClose={() => setIsLegalModalOpen(false)}
        isPrivacyOpen={isPrivacyModalOpen}
        onPrivacyClose={() => setIsPrivacyModalOpen(false)}
      />
      <Toaster position="bottom-right" theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
}

export function AppShell({
  children,
  isUnderConstruction,
  sitePages,
}: {
  children: ReactNode;
  isUnderConstruction?: boolean;
  sitePages?: SitePage[];
}) {
  return (
    <ThemeProvider>
      <SitePagesProvider sitePages={sitePages}>
        <AppShellInner isUnderConstruction={isUnderConstruction} sitePages={sitePages}>
          {children}
        </AppShellInner>
      </SitePagesProvider>
    </ThemeProvider>
  );
}
