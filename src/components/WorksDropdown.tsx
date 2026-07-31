'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface WorkSubcategory {
  name: string;
  id: string;
}

export interface WorkCategoryGroup {
  mainCategory: string;
  subcategories: WorkSubcategory[];
}

export const WORKS_NAV_STRUCTURE: WorkCategoryGroup[] = [
  {
    mainCategory: 'Shelter',
    subcategories: [
      { name: 'Tiny Living', id: 'Tiny Living' },
      { name: 'Urban Living', id: 'Urban Living' },
      { name: 'Multi-Generational', id: 'Multi-Generational' },
      { name: 'Penthouses', id: 'Penthouses' },
      { name: 'Vacation Homes', id: 'Vacation Homes' },
    ],
  },
  {
    mainCategory: 'Livelihood',
    subcategories: [
      { name: 'Build & Sell Homes', id: 'Build & Sell Homes' },
      { name: 'Food & Beverage', id: 'Food & Beverage' },
      { name: 'Retail & Lifestyle', id: 'Retail & Lifestyle' },
      { name: 'Workspaces', id: 'Workspaces' },
    ],
  },
  {
    mainCategory: 'Community',
    subcategories: [
      { name: 'Shared Spaces', id: 'Shared Spaces' },
      { name: 'Shared Places', id: 'Shared Places' },
      { name: 'Sacred Structures', id: 'Sacred Structures' },
    ],
  },
];

interface WorksDropdownProps {
  isDarkMode: boolean;
  onFilterSelect: (filter: string) => void;
  onClose: () => void;
  currentFilter: string;
}

export const WorksDropdown: React.FC<WorksDropdownProps> = ({
  isDarkMode,
  onFilterSelect,
  onClose,
  currentFilter,
}) => {
  const activeGroup = WORKS_NAV_STRUCTURE.find((group) =>
    group.subcategories.some((sub) => sub.id === currentFilter) || group.mainCategory === currentFilter
  );
  const activeCategoryName = activeGroup ? activeGroup.mainCategory : WORKS_NAV_STRUCTURE[0].mainCategory;

  // Track which Level 1 category is expanded (starts with active link's category expanded if present)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(activeCategoryName);

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
        {WORKS_NAV_STRUCTURE.map((group) => {
          const isExpanded = expandedCategory === group.mainCategory;
          const isMainActive = group.subcategories.some((sub) => sub.id === currentFilter);

          return (
            <div 
              key={group.mainCategory} 
              className="space-y-0.5"
              onMouseEnter={() => setExpandedCategory(group.mainCategory)}
            >
              {/* Level 1 Category Header - Expands on hover / toggles on click */}
              <div
                className={`w-full flex items-center justify-between px-5 py-2.5 rounded-none transition-colors cursor-pointer select-none ${
                  isDarkMode
                    ? (isExpanded || isMainActive)
                      ? 'bg-white text-vintage-charcoal font-semibold'
                      : 'text-bright-gray/90 hover:text-white'
                    : (isExpanded || isMainActive)
                      ? 'bg-vintage-charcoal text-white font-semibold'
                      : 'text-vintage-charcoal/90 hover:text-vintage-charcoal'
                }`}
                onClick={() => setExpandedCategory(prev => prev === group.mainCategory ? null : group.mainCategory)}
              >
                <span className="text-caption font-bold normal-case tracking-widest text-left">
                  {group.mainCategory}
                </span>

                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="p-0.5 opacity-80"
                >
                  <ChevronDown size={14} />
                </motion.span>
              </div>

              {/* Level 2 Subcategories */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col space-y-0.5 py-1">
                      {group.subcategories.map((sub) => {
                        const isSubActive = currentFilter === sub.id;

                        return (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onFilterSelect(sub.id);
                              onClose();
                            }}
                            className={`w-full text-left pl-8 pr-5 py-2 text-mini tracking-wider transition-all rounded-none cursor-pointer block normal-case ${
                              isSubActive
                                ? isDarkMode
                                  ? 'bg-white text-vintage-charcoal font-bold'
                                  : 'bg-vintage-charcoal text-white font-bold'
                                : isDarkMode
                                  ? 'text-bright-gray/80 hover:text-vintage-charcoal hover:bg-white font-medium'
                                  : 'text-vintage-charcoal/80 hover:text-white hover:bg-vintage-charcoal font-medium'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
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
