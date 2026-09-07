'use client';

import { Suspense, useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useContentProtection } from '@/hooks/useContentProtection';
import { markNavigated } from '@/lib/navigation/nav-history';
import { Header } from '@/components/global/Header';
import { Footer } from '@/components/global/Footer';
import { MobileDrawer } from '@/components/global/MobileDrawer';
import { LegalPrivacyModals } from '@/components/modals/LegalPrivacyModals';

// Paths that keep the ordinary scrollable min-h-screen layout instead of the
// locked full-viewport h-screen treatment used by the marketing/landing pages.
const SCROLLABLE_PATHS = ['/our-services', '/under-construction'];

function AppShellInner({ children, isUnderConstruction }: { children: ReactNode, isUnderConstruction?: boolean }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const { isShielded } = useContentProtection(isProtectionEnabled);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

  const isFullScreenLanding = !SCROLLABLE_PATHS.includes(pathname) && !isUnderConstruction;
  const isOurPeople = pathname.startsWith('/studio/our-people') || pathname.startsWith('/our-people');
  const hideHeader = pathname === '/under-construction' || isUnderConstruction;
  const hideFooter = pathname === '/' || pathname === '/under-construction' || isUnderConstruction;

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
          <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <MobileDrawer 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
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

      {isShielded && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-999999 flex flex-col items-center justify-center text-white select-none pointer-events-none p-6 text-center space-y-3">
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

      <LegalPrivacyModals
        isDarkMode={isDarkMode}
        isLegalOpen={isLegalModalOpen}
        onLegalClose={() => setIsLegalModalOpen(false)}
        isPrivacyOpen={isPrivacyModalOpen}
        onPrivacyClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export function AppShell({ children, isUnderConstruction }: { children: ReactNode, isUnderConstruction?: boolean }) {
  return (
    <ThemeProvider>
      <AppShellInner isUnderConstruction={isUnderConstruction}>{children}</AppShellInner>
    </ThemeProvider>
  );
}
