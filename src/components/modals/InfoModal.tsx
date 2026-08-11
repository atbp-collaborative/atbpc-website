'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { ModalData } from '@/lib/modals/types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  
  data?: ModalData;
  
  // Legacy props
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  closeLabel?: string;
  isCloseDisabled?: boolean;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  data,
  icon: legacyIcon,
  title: legacyTitle,
  subtitle: legacySubtitle,
  closeLabel: legacyCloseLabel,
  isCloseDisabled,
  onConfirm,
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

  const title = data?.title || legacyTitle || '';
  const subtitle = data?.subtitle || legacySubtitle || '';
  const closeLabel = data?.closeLabel || legacyCloseLabel || 'Close';
  const IconComponent = data?.icon;
  const icon = IconComponent ? <IconComponent size={20} /> : legacyIcon;

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
              {data && (
                <>
                  {data.intro && (
                    <div className={`p-4 border text-mini ${
                      isDarkMode
                        ? 'bg-white/5 border-space-sparkle/20 text-bright-gray/80'
                        : 'bg-space-sparkle/5 border-space-sparkle/15 text-vintage-charcoal/80'
                    }`}>
                      {data.intro.title && (
                        <span className="font-semibold block uppercase tracking-wider mb-1">{data.intro.title}</span>
                      )}
                      <div dangerouslySetInnerHTML={{ __html: data.intro.text }} />
                    </div>
                  )}

                  {data.sections?.map((section, idx) => {
                    const SectionIcon = section.icon;
                    return (
                      <section key={idx} className="space-y-3">
                        {section.title && (
                          <div className="flex items-center gap-2 text-h2 font-sans font-bold tracking-tight">
                            {SectionIcon && <SectionIcon size={18} className="opacity-70" />}
                            <h3>{section.title}</h3>
                          </div>
                        )}
                        {section.text && (
                          <p className="opacity-90" dangerouslySetInnerHTML={{ __html: section.text }} />
                        )}
                        {section.list && section.list.length > 0 && (
                          <ul className="list-disc pl-6 space-y-1.5 opacity-85">
                            {section.list.map((item, i) => (
                              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                          </ul>
                        )}
                      </section>
                    );
                  })}

                  {data.items && data.items.length > 0 && (
                    <div className="space-y-2 opacity-85 leading-relaxed text-caption">
                      {data.items.map((item, idx) => (
                        <div key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </div>
                  )}
                </>
              )}
              {children}
            </div>

            {/* Modal Footer */}
            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${
              isDarkMode
                ? 'bg-vintage-charcoal/95 border-space-sparkle/20'
                : 'bg-white/95 border-space-sparkle/15'
            }`}>
              <Button
                label={closeLabel}
                onClick={onConfirm || onClose}
                disabled={isCloseDisabled}
                type={isDarkMode ? 'outline' : 'filled'}
                className="!py-2 !px-6"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
