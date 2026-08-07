'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { DropdownGroup } from '../lib/navData';

interface DropdownProps {
  isDarkMode: boolean;
  groups: DropdownGroup[];
  activeId: string | null; // The ID of the active group or sub-item
  getItemHref: (id: string) => string;
  onClose: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isDarkMode,
  groups,
  activeId,
  getItemHref,
  onClose,
}) => {
  // Find which group should be initially expanded based on activeId
  const initialActiveGroup = groups.find(
    (group) => group.id === activeId || group.subItems.some((sub) => sub.id === activeId)
  );

  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    initialActiveGroup ? initialActiveGroup.id : groups[0]?.id || null
  );

  // Update expanded category if activeId changes from outside while dropdown is open
  useEffect(() => {
    if (activeId) {
      const group = groups.find(
        (g) => g.id === activeId || g.subItems.some((s) => s.id === activeId)
      );
      if (group) setExpandedCategory(group.id);
    }
  }, [activeId, groups]);

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ originY: 0 }}
      className={`absolute left-0 top-full mt-2 w-full py-2 px-0 rounded-none shadow-2xl border text-left z-50 backdrop-blur-md ${
        isDarkMode
          ? 'bg-vintage-charcoal/95 border-space-sparkle/20 text-bright-gray'
          : 'bg-white/95 border-space-sparkle/10 text-vintage-charcoal'
      }`}
    >
      <div className="space-y-0.5">
        {groups.map((group) => {
          const isExpanded = expandedCategory === group.id;
          const isMainActive = group.id === activeId || group.subItems.some((sub) => sub.id === activeId);

          return (
            <div key={group.id} className="space-y-0.5">
              {/* Level 1 Category Header - Expands on hover / Navigates on click */}
              <Link
                href={getItemHref(group.id)}
                className={`w-full flex items-center justify-between px-5 py-2.5 rounded-none transition-colors cursor-pointer select-none ${
                  isDarkMode
                    ? isExpanded || isMainActive
                      ? 'bg-white text-vintage-charcoal font-semibold'
                      : 'text-bright-gray/90 hover:text-white'
                    : isExpanded || isMainActive
                      ? 'bg-vintage-charcoal text-white font-semibold'
                      : 'text-vintage-charcoal/90 hover:text-vintage-charcoal'
                }`}
                onMouseEnter={() => setExpandedCategory(group.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <span className="relative block h-5 overflow-hidden">
                  <motion.span
                    className="flex flex-col items-start"
                    animate={{ y: group.translation && (isExpanded || isMainActive) ? -20 : 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                  >
                    <span className="block h-5 leading-5 text-caption font-bold normal-case tracking-widest text-left">
                      {group.label}
                    </span>
                    {group.translation && (
                      <span className="block h-5 leading-5 text-caption font-bold normal-case tracking-widest text-left">
                        {group.translation}
                      </span>
                    )}
                  </motion.span>
                </span>

                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="p-0.5 opacity-80"
                >
                  <ChevronDown size={14} />
                </motion.span>
              </Link>

              {/* Level 2 Sub-items */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col space-y-0.5 py-1">
                      {group.subItems.map((sub) => {
                        const isSubActive = activeId === sub.id;

                        return (
                          <Link
                            key={sub.id}
                            href={getItemHref(sub.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                            }}
                            className={`w-full flex items-center justify-between pl-8 pr-5 py-2 text-mini tracking-wider transition-all rounded-none cursor-pointer group normal-case ${
                              isSubActive
                                ? isDarkMode
                                  ? 'bg-white text-vintage-charcoal font-bold'
                                  : 'bg-vintage-charcoal text-white font-bold'
                                : isDarkMode
                                  ? 'text-bright-gray/80 hover:text-vintage-charcoal hover:bg-white font-medium'
                                  : 'text-vintage-charcoal/80 hover:text-white hover:bg-vintage-charcoal font-medium'
                            }`}
                          >
                            <span>{sub.label}</span>
                            <ArrowUpRight
                              size={12}
                              className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                            />
                          </Link>
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
