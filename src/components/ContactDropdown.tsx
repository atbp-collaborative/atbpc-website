'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ROUTES, TAB_TO_ROUTE } from '../lib/routes';

interface ContactDropdownProps {
  isDarkMode: boolean;
  onNavClick: (tab: string) => void;
  onClose: () => void;
}

interface ContactSubitem {
  name: string;
  tab: string;
}

interface ContactGroup {
  mainCategory: string;
  tab: string;
  href: string;
  subitems: ContactSubitem[];
}

export const CONTACT_NAV_STRUCTURE: ContactGroup[] = [
  {
    mainCategory: 'Case Study House',
    tab: 'case-study-house',
    href: ROUTES.caseStudyHouse,
    subitems: [
      { name: 'Schedule a Discovery Meeting', tab: 'intake' },
      { name: 'Locate & Communicate', tab: 'contact-info' },
    ],
  },
  {
    mainCategory: 'Grow With Us',
    tab: 'grow-with-us',
    href: ROUTES.growWithUs,
    subitems: [
      { name: 'Internship Program', tab: 'career' },
      { name: 'Apprenticeship Program', tab: 'career' },
      { name: 'Licensed Programs', tab: 'career' },
    ],
  },
  {
    mainCategory: 'Partner With Us',
    tab: 'partner-with-us',
    href: ROUTES.partnerWithUs,
    subitems: [
      { name: 'Suppliers', tab: 'supplier' },
      { name: 'Consultants', tab: 'consultant' },
      { name: 'Builders', tab: 'builder' },
    ],
  },
];

export const ContactDropdown: React.FC<ContactDropdownProps> = ({
  isDarkMode,
  onNavClick,
  onClose,
}) => {
  const pathname = usePathname();
  const activeContactObj = CONTACT_NAV_STRUCTURE.find((group) =>
    group.subitems.some((sub) => TAB_TO_ROUTE[sub.tab] === pathname)
  );
  const activeCategoryName = activeContactObj ? activeContactObj.mainCategory : 'Case Study House';

  const [expandedCategory, setExpandedCategory] = useState<string>(activeCategoryName);

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ originY: 0 }}
      onMouseLeave={() => setExpandedCategory(activeCategoryName)}
      className={`absolute left-0 top-full mt-2 w-full py-2 px-0 rounded-none shadow-2xl border text-left z-50 backdrop-blur-md ${
        isDarkMode
          ? 'bg-vintage-charcoal/95 border-space-sparkle/20 text-bright-gray'
          : 'bg-white/95 border-space-sparkle/10 text-vintage-charcoal'
      }`}
    >
      <div className="space-y-0.5">
        {CONTACT_NAV_STRUCTURE.map((group) => {
          const isExpanded = expandedCategory === group.mainCategory;

          return (
            <div
              key={group.mainCategory}
              className="space-y-0.5"
              onMouseEnter={() => setExpandedCategory(group.mainCategory)}
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
                  onNavClick(group.tab);
                  onClose();
                }}
              >
                <span className="text-caption font-bold normal-case tracking-widest text-left">
                  {group.mainCategory}
                </span>

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCategory(isExpanded ? '' : group.mainCategory);
                  }}
                  className="p-1 opacity-80 hover:opacity-100"
                >
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </span>
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
                      {group.subitems.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavClick(sub.tab);
                            onClose();
                          }}
                          className={`w-full text-left py-1.5 text-mini tracking-wider transition-all rounded-none cursor-pointer block normal-case ${
                            isDarkMode
                              ? 'text-bright-gray/80 hover:text-white font-medium'
                              : 'text-vintage-charcoal/80 hover:text-vintage-charcoal font-medium'
                          }`}
                        >
                          {sub.name}
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
