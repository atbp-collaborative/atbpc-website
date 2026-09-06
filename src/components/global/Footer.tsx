'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/navigation/routes';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '@/components/global/ThemeToggle';
import { ProtectionToggle } from '@/components/global/ProtectionToggle';

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
  onOpenLegal?: () => void;
  onOpenPrivacy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isDarkMode,
  onToggleTheme,
  isProtectionEnabled = false,
  onToggleProtection,
  onOpenLegal,
  onOpenPrivacy,
}) => {
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
    }, 4000);
    return () => clearInterval(interval);
  }, [lockedTaglineIndex]);

  return (
    <footer 
      id="main-footer"
      className={`border-t py-2 md:py-3 lg:py-4 mt-auto shrink-0 transition-colors text-mini ${
        isDarkMode 
          ? 'bg-vintage-charcoal border-space-sparkle/20 text-bright-gray/70' 
          : 'bg-bright-gray border-space-sparkle/10 text-vintage-charcoal/70'
      }`}
    >
      <div 
        className={`mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full max-w-none px-4 sm:px-8 ${
          isLandingPage ? 'md:px-12' : ''
        }`}
      >
        {/* Subtext on the left */}
        {/* Desktop view: Side-by-side slogan */}
        <div className="hidden lg:block font-sans font-light tracking-wide text-mini text-left">
          {TAGLINE_PHRASES.map((phrase, index) => {
            const isActive = activeTaglineIndex === index;
            return (
              <span
                key={phrase.verb}
                className="transition-all ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  transitionDuration: '4000ms',
                  opacity: isActive ? 1 : 0.2,
                  transform: isActive ? 'scale(1)' : 'scale(0.98)'
                }}
              >
                <Link href={phrase.href} className="hover:underline underline-offset-4 decoration-[#d4d4d4]">
                  {phrase.verb} with{' '}
                  <span className="font-semibold">{phrase.noun}</span>
                </Link>
                {index < TAGLINE_PHRASES.length - 1 ? ', ' : ''}
              </span>
            );
          })}
        </div>

        {/* Tablet view: One slogan at a time scrolling up */}
        <div className="hidden md:block lg:hidden font-sans font-light tracking-wide text-mini text-left h-5 min-w-45 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTaglineIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center whitespace-nowrap"
            >
              <Link href={TAGLINE_PHRASES[activeTaglineIndex].href} className="hover:underline underline-offset-4 decoration-[#d4d4d4]">
                {TAGLINE_PHRASES[activeTaglineIndex].verb} with{' '}
                <span className="font-semibold">{TAGLINE_PHRASES[activeTaglineIndex].noun}</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Copyright & Links moved to the right */}
        <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-2.5 text-micro font-sans tracking-wider opacity-90 whitespace-nowrap">
          <span className="uppercase tracking-widest opacity-70 text-micro">© 2026 ATBP Collaborative</span>
          
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
            <span className="opacity-40">•</span>
            <button
              onClick={onOpenLegal}
              className="underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer opacity-70 uppercase tracking-widest text-micro"
            >
              Legal
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={onOpenPrivacy}
              className="underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer opacity-70 uppercase tracking-widest text-micro"
            >
              Privacy Policy
            </button>

            {onToggleProtection && (
              <>
                <span className="opacity-40">•</span>
                <ProtectionToggle
                  isProtectionEnabled={isProtectionEnabled}
                  onToggle={onToggleProtection}
                  isDarkMode={isDarkMode}
                  className="p-1"
                />
              </>
            )}

            {onToggleTheme && (
              <>
                <span className="opacity-40">•</span>
                <ThemeToggle
                  isDarkMode={isDarkMode}
                  onToggle={onToggleTheme}
                  className="p-1"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
