'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AccordionProps {
  title: string;
  isDarkMode: boolean;
  size?: 'sm' | 'md';
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  autoOpenOn1440?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  isDarkMode,
  size = 'md',
  defaultOpen = false,
  className = '',
  children,
  isOpen: controlledIsOpen,
  onToggle,
  autoOpenOn1440 = false,
}) => {
  const is1440 = useMediaQuery('(min-width: 1440px)');
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  
  const isControlled = controlledIsOpen !== undefined;
  const rawIsOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const isEffectiveOpen = (autoOpenOn1440 && is1440) || rawIsOpen;

  const handleToggle = () => {
    if (autoOpenOn1440 && is1440) return;
    if (onToggle) {
      onToggle();
    }
    if (!isControlled) {
      setUncontrolledIsOpen((prev) => !prev);
    }
  };

  const titleSize = size === 'sm' ? 'text-mini' : 'text-body';
  const buttonPadding = size === 'sm' ? 'py-1.5' : 'py-2';

  return (
    <div className={`overflow-hidden border-t border-space-sparkle/10 pt-2 ${className}`}>
      <button
        onClick={autoOpenOn1440 && is1440 ? undefined : handleToggle}
        className={`w-full ${buttonPadding} flex items-center text-left focus:outline-none group ${
          autoOpenOn1440 ? 'cursor-pointer min-[1440px]:cursor-default' : 'cursor-pointer'
        }`}
      >
        <span className={`${isDarkMode ? 'text-white' : 'text-vintage-charcoal'} mr-3.5 shrink-0 flex items-center justify-center ${
          autoOpenOn1440 ? 'min-[1440px]:hidden' : ''
        }`}>
          {isEffectiveOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
        <h4 className={`font-sans ${titleSize} font-semibold tracking-wide uppercase ${isDarkMode ? 'text-white' : 'text-vintage-charcoal'} group-hover:opacity-80 transition-opacity`}>
          {title}
        </h4>
      </button>

      <AnimatePresence initial={false}>
        {isEffectiveOpen && (
          <motion.div
            initial={autoOpenOn1440 && is1440 ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={autoOpenOn1440 && is1440 ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`overflow-hidden ${autoOpenOn1440 ? 'min-[1440px]:!block min-[1440px]:!h-auto min-[1440px]:!opacity-100' : ''}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
