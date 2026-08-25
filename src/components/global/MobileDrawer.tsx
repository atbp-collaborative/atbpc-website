'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown, Sun, Moon, Shield, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { ROUTES } from '@/lib/navigation/routes';
import { AtbpLogo } from '@/components/global/AtbpLogo';
import { CtaButton } from '@/components/global/CtaButton';
import { useActiveNav } from '@/hooks/useActiveNav';

import { WORKS_NAV_STRUCTURE, STUDIO_NAV_STRUCTURE, CONTACT_NAV_STRUCTURE } from '@/lib/navigation/nav-data';

import { InfoModal } from '@/components/modals/InfoModal';
import { legalModalData } from '@/lib/modals/legal';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';

interface MobileDrawerProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isProtectionEnabled?: boolean;
  onToggleProtection?: () => void;
}

interface SectionTriggerProps {
  label: string;
  href: string;
  isActive: boolean;
  isExpanded: boolean;
  isDarkMode: boolean;
  uppercase?: boolean;
  onNavigate: () => void;
  onToggle: () => void;
}

const SectionTrigger: React.FC<SectionTriggerProps> = ({
  label,
  href,
  isActive,
  isExpanded,
  isDarkMode,
  uppercase = true,
  onNavigate,
  onToggle,
}) => (
  <div
    className={`w-full flex items-center justify-between text-left text-caption tracking-widest ${
      uppercase ? 'uppercase' : 'normal-case'
    } rounded-none transition-all ${
      isActive
        ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
    }`}
  >
    <Link href={href} onClick={onNavigate} className="flex-1 py-3 pl-4 pr-2 cursor-pointer">
      {label}
    </Link>
    <button
      onClick={onToggle}
      aria-label={`Toggle ${label} section`}
      className="py-3 pr-4 pl-1 cursor-pointer"
    >
      <motion.span
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 1.5 }}
        className="flex items-center"
      >
        <ChevronDown size={16} />
      </motion.span>
    </button>
  </div>
);

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isProtectionEnabled = false,
  onToggleProtection,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { isWorksActive, isStudioActive, isContactActive, currentCategoryFilter: projectFilter } = useActiveNav();
  const isHomeActive = pathname === '/';

  // Accordion expansion state: only one category expanded at a time
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedWorksCategory, setExpandedWorksCategory] = useState<string | null>(null);

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Sync expanded section with active category when menu is opened or pathname changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      if (isStudioActive) {
        setExpandedSection('studio');
      } else if (isContactActive) {
        setExpandedSection('contact');
      } else if (isWorksActive) {
        setExpandedSection('works');
      } else {
        setExpandedSection(null);
      }

      // Auto expand the Works category that contains the active link
      const activeGroup = WORKS_NAV_STRUCTURE.find((group) =>
        group.subItems.some((sub) => sub.id === projectFilter) || group.label === projectFilter
      );
      if (activeGroup) {
        setExpandedWorksCategory(activeGroup.label);
      }
    }
  }, [isMobileMenuOpen, isStudioActive, isContactActive, isWorksActive, projectFilter]);

  const closeDrawer = () => setIsMobileMenuOpen(false);

  return (
    <>
      <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className={`fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-50 h-full p-6 shadow-2xl flex flex-col justify-between ${
              isDarkMode
                ? 'bg-vintage-charcoal text-bright-gray border-l border-space-sparkle/20'
                : 'bg-bright-gray text-vintage-charcoal border-l border-space-sparkle/10'
            }`}
          >
            <div className="space-y-8">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4">
                <Link
                  href={ROUTES.home}
                  onClick={closeDrawer}
                  className="flex items-center cursor-pointer select-none"
                >
                  <AtbpLogo isDarkMode={isDarkMode} className="h-6 w-auto transition-opacity hover:opacity-90" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3">

                {/* Sub-item 2-level dropdown section for Works */}
                <div className="space-y-1">
                  <SectionTrigger
                    label="Works | Gawâ"
                    href={ROUTES.works}
                    isActive={isWorksActive}
                    isExpanded={expandedSection === 'works'}
                    isDarkMode={isDarkMode}
                    uppercase={false}
                    onNavigate={closeDrawer}
                    onToggle={() => setExpandedSection(prev => prev === 'works' ? null : 'works')}
                  />

                  <AnimatePresence initial={false}>
                    {expandedSection === 'works' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col space-y-1.5 pt-1 pb-2">
                          {WORKS_NAV_STRUCTURE.map((group) => {
                            const isGroupExpanded = expandedWorksCategory === group.label;

                            return (
                              <div key={group.id} className="space-y-1">
                                <div
                                  onClick={() => setExpandedWorksCategory(prev => prev === group.label ? null : group.label)}
                                  className="flex items-center justify-between py-1.5 px-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none"
                                >
                                  <span className="text-caption font-bold tracking-widest normal-case text-left">
                                    {group.label}
                                  </span>
                                  <motion.span
                                    animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                                    transition={{ duration: 1.5 }}
                                  >
                                    <ChevronDown size={14} />
                                  </motion.span>
                                </div>

                                <AnimatePresence initial={false}>
                                  {isGroupExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="flex flex-col space-y-1 py-1">
                                        {group.subItems.map((sub) => (
                                          <Link
                                            key={sub.id}
                                            href={`${ROUTES.works}/${encodeURIComponent(sub.id)}`}
                                            onClick={closeDrawer}
                                            className="block text-left text-mini tracking-wider py-1.5 px-4 rounded-none transition-all cursor-pointer opacity-85 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                                          >
                                            {sub.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sub-item dropdown section for Studio */}
                <div className="space-y-1">
                  <SectionTrigger
                    label="Studio | Kamí"
                    href={ROUTES.studio}
                    isActive={isStudioActive}
                    isExpanded={expandedSection === 'studio'}
                    isDarkMode={isDarkMode}
                    onNavigate={closeDrawer}
                    onToggle={() => setExpandedSection(prev => prev === 'studio' ? null : 'studio')}
                  />

                  <AnimatePresence initial={false}>
                    {expandedSection === 'studio' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col space-y-2 pt-1 pb-2">
                          {STUDIO_NAV_STRUCTURE.map((sec) => (
                            <div key={sec.id} className="space-y-1">
                              <Link
                                href={sec.id}
                                onClick={closeDrawer}
                                className="text-left text-caption font-bold tracking-widest py-1 px-4 block w-full hover:bg-black/5 dark:hover:bg-white/5"
                              >
                                {pathname.startsWith(sec.id) ? sec.translation : sec.label}
                              </Link>
                              <div className="flex flex-col space-y-1">
                                {sec.subItems.map((item) => {
                                  const isSubActive = pathname === item.id;

                                  return (
                                    <Link
                                      key={item.id}
                                      href={item.id}
                                      onClick={closeDrawer}
                                      className={`text-left text-mini py-0.5 px-4 block cursor-pointer transition-opacity ${
                                        isSubActive
                                          ? 'font-bold opacity-100'
                                          : 'opacity-80 hover:opacity-100'
                                      }`}
                                    >
                                      {item.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sub-item dropdown section for Contact */}
                <div className="space-y-1">
                  <SectionTrigger
                    label="Contact | Kumustá"
                    href={ROUTES.contact}
                    isActive={isContactActive}
                    isExpanded={expandedSection === 'contact'}
                    isDarkMode={isDarkMode}
                    onNavigate={closeDrawer}
                    onToggle={() => setExpandedSection(prev => prev === 'contact' ? null : 'contact')}
                  />

                  <AnimatePresence initial={false}>
                    {expandedSection === 'contact' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col space-y-2 pt-1 pb-2">
                          {CONTACT_NAV_STRUCTURE.map((grp) => (
                            <div key={grp.id} className="space-y-1">
                              <Link
                                href={grp.id}
                                onClick={closeDrawer}
                                className={`text-left text-caption font-bold tracking-widest block py-1 px-4 w-full transition-opacity cursor-pointer ${
                                  pathname === grp.id ? 'opacity-100 text-space-sparkle' : 'opacity-90 hover:opacity-100'
                                }`}
                              >
                                {grp.label}
                              </Link>
                              <div className="flex flex-col space-y-1">
                                {grp.subItems.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={item.id}
                                    onClick={closeDrawer}
                                    className={`text-left text-mini block py-0.5 px-4 transition-opacity cursor-pointer ${
                                      pathname === item.id ? 'font-bold opacity-100' : 'opacity-80 hover:opacity-100'
                                    }`}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </div>

            {/* Drawer Footer / CTA Area */}
            <div className="space-y-2.5 pt-6">
              <CtaButton
                layout="full"
                variant="solid"
                lines={['Schedule a', 'Discovery Session']}
                isDarkMode={isDarkMode}
                href={ROUTES.discoverySession}
                onClick={closeDrawer}
              />

              <CtaButton
                layout="full"
                variant="outline"
                lines={['Request a', 'Proposal']}
                isDarkMode={isDarkMode}
                href={ROUTES.requestForProposal}
                onClick={closeDrawer}
              />

              {/* Mobile links and toggles (Legal, Privacy, Protection, Theme) */}
              <div className="flex flex-col items-center justify-center space-y-2 pt-3 border-t border-space-sparkle/10 w-full">
                <div className="flex items-center justify-center gap-2.5 text-[10px] font-sans tracking-wider opacity-90 whitespace-nowrap">
                  <button
                    onClick={() => setIsLegalModalOpen(true)}
                    className="underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer opacity-70 uppercase tracking-widest text-[10px]"
                  >
                    Legal
                  </button>
                  <span className="opacity-40">•</span>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="underline underline-offset-4 hover:opacity-100 transition-opacity cursor-pointer opacity-70 uppercase tracking-widest text-[10px]"
                  >
                    Privacy Policy
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                  {onToggleProtection && (
                    <button
                      type="button"
                      onClick={onToggleProtection}
                      title={isProtectionEnabled ? 'Disable Content Protection' : 'Enable Content Protection'}
                      aria-label={isProtectionEnabled ? 'Disable Content Protection' : 'Enable Content Protection'}
                      className={`p-1.5 rounded-md border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                        isProtectionEnabled
                          ? 'border-space-sparkle/50 text-space-sparkle bg-space-sparkle/10'
                          : isDarkMode
                          ? 'border-bright-gray/20 text-bright-gray/80 hover:text-white hover:border-bright-gray/40'
                          : 'border-vintage-charcoal/20 text-vintage-charcoal/80 hover:text-black hover:border-vintage-charcoal/40'
                      }`}
                    >
                      {isProtectionEnabled ? <Shield size={13} /> : <ShieldOff size={13} />}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={toggleTheme}
                    title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                    aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                    className={`p-1.5 rounded-md border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isDarkMode
                        ? 'border-bright-gray/20 text-bright-gray/80 hover:text-white hover:border-bright-gray/40'
                        : 'border-vintage-charcoal/20 text-vintage-charcoal/80 hover:text-black hover:border-vintage-charcoal/40'
                    }`}
                  >
                    {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
                  </button>
                </div>
              </div>

              <div className="text-caption text-center font-sans opacity-40 pt-2">
                © 2026 ATBP Collaborative
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

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
