'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  closeLabel?: string;
  children: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  icon,
  title,
  subtitle,
  closeLabel = 'Close',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-none shadow-2xl border z-10 overflow-hidden ${
              isDarkMode
                ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray'
                : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b sticky top-0 z-20 backdrop-blur-md ${
              isDarkMode
                ? 'bg-vintage-charcoal/95 border-space-sparkle/20'
                : 'bg-white/95 border-space-sparkle/15'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-none ${
                  isDarkMode ? 'bg-white/10 text-bright-gray' : 'bg-vintage-charcoal/10 text-vintage-charcoal'
                }`}>
                  {icon}
                </div>
                <div>
                  <h2 className="text-h2 font-sans font-bold tracking-tight">{title}</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">
                    {subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 transition-colors cursor-pointer rounded-none ${
                  isDarkMode
                    ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white'
                    : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'
                }`}
                aria-label={`Close ${title}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-body font-light leading-relaxed">
              {children}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${
              isDarkMode
                ? 'bg-vintage-charcoal/95 border-space-sparkle/20'
                : 'bg-white/95 border-space-sparkle/15'
            }`}>
              <button
                onClick={onClose}
                className={`px-6 py-2 text-mini font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isDarkMode
                    ? 'bg-white text-vintage-charcoal hover:bg-bright-gray border-white'
                    : 'bg-vintage-charcoal text-white hover:bg-vintage-charcoal/90 border-vintage-charcoal'
                }`}
              >
                {closeLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
