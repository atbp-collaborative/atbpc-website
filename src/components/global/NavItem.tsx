'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Dropdown } from '@/components/global/Dropdown';
import { DropdownGroup } from '@/lib/navigation/nav-data';

interface NavItemProps {
  label: string;
  translation: string;
  isActive: boolean;
  isHeaderTransparent: boolean;
  isDarkMode: boolean;
  navGroups: DropdownGroup[];
  activeId: string | null;
  minWidthClass?: string;
  href: string;
  getDropdownItemHref: (id: string) => string;
  accordionDuration?: number;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  translation,
  isActive,
  isHeaderTransparent,
  isDarkMode,
  navGroups,
  activeId,
  minWidthClass,
  href,
  getDropdownItemHref,
  accordionDuration,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), 200);
  };

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={href}
        onClick={() => setIsHovered(false)}
        className={`block transition-all duration-300 relative py-1 text-center cursor-pointer select-none normal-case ${
          minWidthClass ?? ''
        } ${
          isHeaderTransparent
            ? isActive
              ? 'text-white font-medium'
              : 'text-white/70 hover:text-white'
            : isActive
              ? 'text-space-sparkle font-medium'
              : 'text-inherit hover:text-vintage-charcoal dark:hover:text-bright-gray'
        }`}
      >
        <span className="relative block h-4 overflow-hidden">
          <motion.span
            className="flex flex-col items-center"
            animate={{ y: (isHovered || isActive) ? -16 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block h-4 leading-4 font-light">{label}</span>
            <span
              className={`block h-4 leading-4 ${
                isHeaderTransparent
                  ? isActive ? 'text-white font-medium' : 'text-white'
                  : isActive
                    ? isDarkMode ? 'text-bright-gray font-medium' : 'text-space-sparkle font-medium'
                    : isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
              }`}
            >
              {translation}
            </span>
          </motion.span>
        </span>
        {isActive && (
          <span
            className={`absolute bottom-0 left-[30%] w-[40%] h-[2px] rounded ${
              isHeaderTransparent ? 'bg-white' : 'bg-space-sparkle'
            }`}
          ></span>
        )}
      </Link>

      <AnimatePresence>
        {isHovered && (
          <Dropdown
            isDarkMode={isDarkMode}
            groups={navGroups}
            activeId={activeId}
            getItemHref={getDropdownItemHref}
            onClose={() => setIsHovered(false)}
            accordionDuration={accordionDuration}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
