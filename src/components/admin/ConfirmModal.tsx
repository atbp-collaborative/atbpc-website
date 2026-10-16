/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-md rounded-lg shadow-2xl border p-6 z-10 ${
              isDarkMode
                ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray'
                : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            {/* Close icon */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full shrink-0 ${
                  isDestructive
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-space-sparkle/10 text-space-sparkle'
                }`}
              >
                <AlertTriangle size={22} />
              </div>

              <div className="space-y-1.5 flex-1 pr-4">
                <h3 className="text-body font-sans font-bold leading-snug">{title}</h3>
                <p className="text-caption font-light opacity-80 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
              <Button
                type="ghost"
                onClick={onCancel}
                className="!py-2 !px-4 text-caption"
                label={cancelLabel}
              />
              <Button
                type="filled"
                onClick={onConfirm}
                className={`!py-2 !px-5 text-caption ${
                  isDestructive
                    ? '!bg-red-600 hover:!bg-red-700 text-white'
                    : '!bg-space-sparkle text-white'
                }`}
                label={confirmLabel}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
