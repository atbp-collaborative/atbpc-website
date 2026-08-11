'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Shield, ShieldOff } from 'lucide-react';
import { InfoModal } from '@/components/modals/InfoModal';
import { legalModalData } from '@/lib/modals/legal';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/navigation/routes';

const TAGLINE_PHRASES = [
  { verb: 'designing', noun: 'values', href: ROUTES.designingWithValues },
  { verb: 'managing', noun: 'integrity', href: ROUTES.managingWithIntegrity },
  { verb: 'building', noun: 'culture', href: ROUTES.buildingWithCulture },
] as const;

const TAGLINE_LOCK_ROUTES: Record<string, number> = {
  [ROUTES.designingWithValues]: 0,
  [ROUTES.managingWithIntegrity]: 1,
  [ROUTES.buildingWithCulture]: 2,
};

interface FooterProps {
  isDarkMode: boolean;
  onToggleTheme?: () => void;
  isProtectionEnabled?: boolean;
  onToggleProtection?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isDarkMode,
  onToggleTheme,
  isProtectionEnabled = false,
  onToggleProtection,
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const pathname = usePathname();

  const isWorksLanding = pathname === '/works';
  const isStudioLanding = pathname === '/' || pathname === '/studio';
  const isContactLanding = pathname === '/contact';
  const isLandingPage = isStudioLanding || isWorksLanding || isContactLanding;

  const lockedTaglineIndex = pathname !== null && pathname in TAGLINE_LOCK_ROUTES
    ? TAGLINE_LOCK_ROUTES[pathname]
    : null;
  const [activeTaglineIndex, setActiveTaglineIndex] = useState(0);

  useEffect(() => {
    if (lockedTaglineIndex !== null) {
      setActiveTaglineIndex(lockedTaglineIndex);
      return;
    }
    setActiveTaglineIndex(0);
    const interval = setInterval(() => {
      setActiveTaglineIndex((prev) => (prev + 1) % TAGLINE_PHRASES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [lockedTaglineIndex]);

  return (
    <>
      <footer 
        id="main-footer"
        className={`border-t py-4 mt-auto shrink-0 transition-colors text-mini ${
          isDarkMode 
            ? 'bg-vintage-charcoal border-space-sparkle/20 text-bright-gray/70' 
            : 'bg-bright-gray border-space-sparkle/10 text-vintage-charcoal/70'
        }`}
      >
        <div 
          className={`mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full ${
            isLandingPage ? 'max-w-7xl px-4 sm:px-6' : 'max-w-[100vw] px-4 sm:px-8'
          }`}
        >
          {/* Subtext on the left */}
          <div className="font-sans font-light tracking-wide text-mini text-center md:text-left">
            {TAGLINE_PHRASES.map((phrase, index) => {
              const isActive = activeTaglineIndex === index;
              return (
                <span
                  key={phrase.verb}
                  className="transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: isActive ? 1 : 0.3 }}
                >
                  <Link href={phrase.href} className="hover:underline underline-offset-4 decoration-[#d4d4d4]">
                    {phrase.verb} with{' '}
                    <span className={isActive ? 'font-semibold' : 'font-light'}>{phrase.noun}</span>
                  </Link>
                  {index < TAGLINE_PHRASES.length - 1 ? ', ' : ''}
                </span>
              );
            })}
          </div>

          {/* Copyright & Links moved to the right */}
          <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-2.5 text-mini font-sans tracking-wider opacity-90 whitespace-nowrap">
            <span className="uppercase tracking-widest opacity-70 text-micro sm:text-mini">© 2026 ATBP Collaborative</span>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setIsLegalModalOpen(true)}
              className={`underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer font-medium ${
                isDarkMode ? 'text-bright-gray hover:text-white' : 'text-vintage-charcoal hover:text-black'
              }`}
            >
              Legal
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className={`underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer font-medium ${
                isDarkMode ? 'text-bright-gray hover:text-white' : 'text-vintage-charcoal hover:text-black'
              }`}
            >
              Privacy Policy
            </button>

            {onToggleProtection && (
              <>
                <span className="opacity-40">•</span>
                <button
                  type="button"
                  onClick={onToggleProtection}
                  title={isProtectionEnabled ? 'Disable Content Protection' : 'Enable Content Protection'}
                  aria-label={isProtectionEnabled ? 'Disable Content Protection' : 'Enable Content Protection'}
                  className={`p-1 rounded-md border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    isProtectionEnabled
                      ? 'border-space-sparkle/50 text-space-sparkle bg-space-sparkle/10'
                      : isDarkMode
                      ? 'border-bright-gray/20 text-bright-gray/80 hover:text-white hover:border-bright-gray/40'
                      : 'border-vintage-charcoal/20 text-vintage-charcoal/80 hover:text-black hover:border-vintage-charcoal/40'
                  }`}
                >
                  {isProtectionEnabled ? <Shield size={13} /> : <ShieldOff size={13} />}
                </button>
              </>
            )}

            {onToggleTheme && (
              <>
                <span className="opacity-40">•</span>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                  aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                  className={`p-1 rounded-md border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    isDarkMode
                      ? 'border-bright-gray/20 text-bright-gray/80 hover:text-white hover:border-bright-gray/40'
                      : 'border-vintage-charcoal/20 text-vintage-charcoal/80 hover:text-black hover:border-vintage-charcoal/40'
                  }`}
                >
                  {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Dedicated Legal Modal */}
      <InfoModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        isDarkMode={isDarkMode}
        data={legalModalData.contents}
      />

      {/* Dedicated Privacy Policy Modal */}
      <InfoModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        isDarkMode={isDarkMode}
        data={privacyPolicyModalData.contents}
      />
    </>
  );
};
