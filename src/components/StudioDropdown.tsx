'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '../lib/routes';

interface StudioDropdownProps {
  isDarkMode: boolean;
  onNavClick: (tab: string) => void;
  onClose: () => void;
}

export interface StudioNavItem {
  name: string;
  tab: string;
  href: string;
}

export interface StudioNavSection {
  mainSection: string;
  translation: string;
  tab: string;
  href: string;
  items: StudioNavItem[];
}

export const STUDIO_NAV_STRUCTURE: StudioNavSection[] = [
  {
    mainSection: 'Services',
    translation: 'Kaya',
    tab: 'our-services',
    href: ROUTES.ourServices,
    items: [
      { name: 'Comprehensive Services', tab: 'comprehensive-services', href: ROUTES.comprehensiveServices },
      { name: 'Piecework Services', tab: 'piecework-services', href: ROUTES.pieceworkServices },
    ],
  },
  {
    mainSection: 'Process',
    translation: 'Paraán',
    tab: 'services',
    href: ROUTES.services,
    items: [
      { name: 'Designing with Values', tab: 'designing-with-values', href: ROUTES.designingWithValues },
      { name: 'Managing with Integrity', tab: 'managing-with-integrity', href: ROUTES.managingWithIntegrity },
      { name: 'Building with Culture', tab: 'building-with-culture', href: ROUTES.buildingWithCulture },
    ],
  },
  {
    mainSection: 'People',
    translation: 'Haligi',
    tab: 'our-people',
    href: ROUTES.ourPeople,
    items: [
      { name: 'Designers', tab: 'our-people-designers', href: `${ROUTES.ourPeople}?filter=designers` },
      { name: 'Managers', tab: 'our-people-managers', href: `${ROUTES.ourPeople}?filter=managers` },
      { name: 'Builders', tab: 'our-people-builders', href: `${ROUTES.ourPeople}?filter=builders` },
    ],
  },
];

export const StudioDropdown: React.FC<StudioDropdownProps> = ({
  isDarkMode,
  onNavClick,
  onClose,
}) => {
  const pathname = usePathname();
  const activeSectionObj = STUDIO_NAV_STRUCTURE.find((s) => pathname.startsWith(s.href));
  const activeSectionName = activeSectionObj ? activeSectionObj.mainSection : 'Services';

  const [expandedSection, setExpandedSection] = useState<string>(activeSectionName);

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ originY: 0 }}
      onMouseLeave={() => setExpandedSection(activeSectionName)}
      className={`absolute left-0 top-full mt-2 w-full py-2 px-0 rounded-none shadow-2xl border text-left z-50 backdrop-blur-md ${
        isDarkMode
          ? 'bg-vintage-charcoal/95 border-space-sparkle/20 text-bright-gray'
          : 'bg-white/95 border-space-sparkle/10 text-vintage-charcoal'
      }`}
    >
      <div className="space-y-0.5">
        {STUDIO_NAV_STRUCTURE.map((section) => {
          const isExpanded = expandedSection === section.mainSection;
          const isPageActive = pathname.startsWith(section.href);
          const isSectionActive = isPageActive;

          return (
            <div
              key={section.mainSection}
              className="space-y-0.5"
              onMouseEnter={() => setExpandedSection(section.mainSection)}
            >
              {/* Level 1 Category Header */}
              <div
                className={`w-full flex items-center justify-between px-5 py-2.5 rounded-none transition-colors cursor-pointer select-none ${
                  isDarkMode
                    ? isExpanded
                      ? 'bg-white text-vintage-charcoal font-semibold'
                      : 'text-bright-gray/90 hover:text-white'
                    : isExpanded
                      ? 'bg-vintage-charcoal text-white font-semibold'
                      : 'text-vintage-charcoal/90 hover:text-vintage-charcoal'
                }`}
                onClick={() => {
                  onNavClick(section.tab);
                  onClose();
                }}
              >
                <span className="relative block h-5 overflow-hidden">
                  <motion.span
                    className="flex flex-col items-start"
                    animate={{ y: isSectionActive ? -20 : 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block h-5 leading-5 text-caption font-bold normal-case tracking-widest text-left">
                      {section.mainSection}
                    </span>
                    <span className="block h-5 leading-5 text-caption font-bold normal-case tracking-widest text-left">
                      {section.translation}
                    </span>
                  </motion.span>
                </span>

                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="p-0.5 opacity-80"
                >
                  <ChevronDown size={14} />
                </motion.span>
              </div>

              {/* Level 2 Sub-items */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col space-y-0.5 pl-8 pr-5 py-1">
                      {section.items.map((item) => (
                        <button
                          key={item.tab}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavClick(item.tab);
                            onClose();
                          }}
                          className={`w-full text-left py-1.5 text-mini tracking-wider transition-all rounded-none cursor-pointer block normal-case ${
                            pathname === item.href.split('?')[0]
                              ? isDarkMode
                                ? 'text-white font-bold'
                                : 'text-vintage-charcoal font-bold'
                              : isDarkMode
                                ? 'text-bright-gray/80 hover:text-white font-medium'
                                : 'text-vintage-charcoal/80 hover:text-vintage-charcoal font-medium'
                          }`}
                        >
                          {item.name}
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
  );
};
