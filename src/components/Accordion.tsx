'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

interface AccordionProps {
  title: string;
  isDarkMode: boolean;
  size?: 'sm' | 'md';
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  isDarkMode,
  size = 'md',
  defaultOpen = false,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const titleSize = size === 'sm' ? 'text-mini' : 'text-body';
  const buttonPadding = size === 'sm' ? 'py-1.5' : 'py-2';

  return (
    <div className={`overflow-hidden border-t border-space-sparkle/10 pt-2 ${className}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full ${buttonPadding} flex items-center text-left focus:outline-none group cursor-pointer`}
      >
        <span className={`${isDarkMode ? 'text-white' : 'text-vintage-charcoal'} mr-3.5 shrink-0 flex items-center justify-center`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
        <h4 className={`font-sans ${titleSize} font-semibold tracking-wide uppercase ${isDarkMode ? 'text-white' : 'text-vintage-charcoal'} group-hover:opacity-80 transition-opacity`}>
          {title}
        </h4>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
