'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '../lib/theme-context';
import { ROUTES, TAB_TO_ROUTE } from '../lib/routes';
import { AtbpLogo } from './AtbpLogo';
import { CtaButton } from './CtaButton';
import { useActiveNav } from '../hooks/useActiveNav';

import { WORKS_NAV_STRUCTURE, STUDIO_NAV_STRUCTURE, CONTACT_NAV_STRUCTURE } from '../lib/navData';

interface MobileDrawerProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

interface SectionTriggerProps {
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  isDarkMode: boolean;
  uppercase?: boolean;
  onClick: () => void;
}

const SectionTrigger: React.FC<SectionTriggerProps> = ({
  label,
  isActive,
  isExpanded,
  isDarkMode,
  uppercase = true,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between text-left text-caption tracking-widest ${
      uppercase ? 'uppercase' : 'normal-case'
    } py-3 px-4 rounded-none transition-all cursor-pointer ${
      isActive
        ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
    }`}
  >
    <span>{label}</span>
    <motion.span
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      className="ml-2 flex items-center"
    >
      <ChevronDown size={16} />
    </motion.span>
  </button>
);

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { isWorksActive, isStudioActive, isContactActive, currentCategoryFilter: projectFilter } = useActiveNav();
  const isHomeActive = pathname === '/';

  // Accordion expansion state: only one category expanded at a time
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedWorksCategory, setExpandedWorksCategory] = useState<string | null>(null);

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

  const handleNavClick = (tabId: string) => {
    router.push(TAB_TO_ROUTE[tabId] ?? ROUTES.home);
    setIsMobileMenuOpen(false);
  };

  return (
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
              <div className="flex items-center justify-between pb-4 border-b border-space-sparkle/10">
                <AtbpLogo isDarkMode={isDarkMode} className="h-6 w-auto" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left text-caption tracking-widest uppercase py-3 px-4 rounded-none transition-all cursor-pointer ${
                    isHomeActive
                      ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  Homepage | Bungad
                </button>

                {/* Sub-item 2-level dropdown section for Works */}
                <div className="space-y-1">
                  <SectionTrigger
                    label="Works | Gawâ"
                    isActive={isWorksActive}
                    isExpanded={expandedSection === 'works'}
                    isDarkMode={isDarkMode}
                    uppercase={false}
                    onClick={() => {
                      handleNavClick('works');
                      setExpandedSection(prev => prev === 'works' ? null : 'works');
                    }}
                  />

                  <AnimatePresence initial={false}>
                    {expandedSection === 'works' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 flex flex-col space-y-1.5 border-l border-space-sparkle/15 ml-3 pt-1 pb-2">
                          {WORKS_NAV_STRUCTURE.map((group) => {
                            const isGroupExpanded = expandedWorksCategory === group.label;

                            return (
                              <div key={group.id} className="space-y-1">
                                <div
                                  onClick={() => setExpandedWorksCategory(prev => prev === group.label ? null : group.label)}
                                  className="flex items-center justify-between py-1.5 px-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none"
                                >
                                  <span className="text-caption font-bold tracking-widest normal-case text-left">
                                    {group.label}
                                  </span>
                                  <motion.span
                                    animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.6 }}
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
                                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pl-3 flex flex-col space-y-1 border-l border-space-sparkle/20 ml-3 py-1">
                                        {group.subItems.map((sub) => (
                                          <button
                                            key={sub.id}
                                            onClick={() => {
                                              router.push(`${ROUTES.works}/${encodeURIComponent(sub.id)}`);
                                              setIsMobileMenuOpen(false);
                                            }}
                                            className="text-left text-mini tracking-wider py-1.5 px-2.5 rounded-none transition-all cursor-pointer opacity-85 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                                          >
                                            {sub.label}
                                          </button>
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
                    isActive={isStudioActive}
                    isExpanded={expandedSection === 'studio'}
                    isDarkMode={isDarkMode}
                    onClick={() => {
                      handleNavClick('studio');
                      setExpandedSection(prev => prev === 'studio' ? null : 'studio');
                    }}
                  />

                  <AnimatePresence initial={false}>
                    {expandedSection === 'studio' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 flex flex-col space-y-2 border-l border-space-sparkle/15 ml-4 pt-1 pb-2">
                          {STUDIO_NAV_STRUCTURE.map((sec) => (
                            <div key={sec.id} className="space-y-1">
                              <button
                                onClick={() => handleNavClick(sec.id as any)}
                                className="text-left text-caption font-bold tracking-widest py-1 px-2 block w-full hover:bg-black/5 dark:hover:bg-white/5"
                              >
                                {pathname.startsWith(TAB_TO_ROUTE[sec.id as keyof typeof TAB_TO_ROUTE]) ? sec.translation : sec.label}
                              </button>
                              <div className="pl-3 flex flex-col space-y-1 border-l border-space-sparkle/10 ml-2">
                                {sec.subItems.map((item) => {
                                  const itemRoute = TAB_TO_ROUTE[item.id as keyof typeof TAB_TO_ROUTE];
                                  const isSubActive = itemRoute ? pathname === itemRoute : false;

                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => handleNavClick(item.id as any)}
                                      className={`text-left text-mini py-0.5 px-2 block cursor-pointer transition-opacity ${
                                        isSubActive
                                          ? 'font-bold opacity-100'
                                          : 'opacity-80 hover:opacity-100'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
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
                    isActive={isContactActive}
                    isExpanded={expandedSection === 'contact'}
                    isDarkMode={isDarkMode}
                    onClick={() => {
                      handleNavClick('contact');
                      setExpandedSection(prev => prev === 'contact' ? null : 'contact');
                    }}
                  />

                  <AnimatePresence initial={false}>
                    {expandedSection === 'contact' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 flex flex-col space-y-2 border-l border-space-sparkle/15 ml-4 pt-1 pb-2">
                          {CONTACT_NAV_STRUCTURE.map((grp) => (
                            <div key={grp.id} className="space-y-1">
                              <button
                                onClick={() => handleNavClick(grp.id as any)}
                                className={`text-left text-caption font-bold tracking-widest block py-1 px-2 w-full transition-opacity cursor-pointer ${
                                  pathname === TAB_TO_ROUTE[grp.id as keyof typeof TAB_TO_ROUTE] ? 'opacity-100 text-space-sparkle' : 'opacity-90 hover:opacity-100'
                                }`}
                              >
                                {grp.label}
                              </button>
                              <div className="pl-3 flex flex-col space-y-1 border-l border-space-sparkle/10 ml-2">
                                {grp.subItems.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleNavClick(sub.id as any)}
                                    className="text-left text-mini opacity-80 hover:opacity-100 py-0.5 px-2 block"
                                  >
                                    {sub.label}
                                  </button>
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
            <div className="space-y-2.5 pt-6 border-t border-space-sparkle/10">
              <CtaButton
                layout="full"
                variant="solid"
                lines={['Schedule a', 'Discovery Meeting']}
                isDarkMode={isDarkMode}
                onClick={() => handleNavClick('discovery-meeting')}
              />

              <CtaButton
                layout="full"
                variant="outline"
                lines={['Request a', 'Proposal']}
                isDarkMode={isDarkMode}
                onClick={() => handleNavClick('request-for-proposal')}
              />

              <div className="text-caption text-center font-sans opacity-40 pt-2">
                © 2026 ATBP Collaborative
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
