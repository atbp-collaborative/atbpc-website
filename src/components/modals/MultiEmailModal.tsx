'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { MultiEntryButton } from '@/components/primitives/MultiEntryButton';
import { PartnerEmail } from '@/lib/forms/partner';
import { TextField } from '@/components/forms/form-fields';

interface MultiEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emails: PartnerEmail[]) => void;
  initialEmails: PartnerEmail[];
  isDarkMode: boolean;
}

export const MultiEmailModal: React.FC<MultiEmailModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEmails,
  isDarkMode,
}) => {
  const [emails, setEmails] = useState<PartnerEmail[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEmails(initialEmails.length > 0 && initialEmails[0].email ? initialEmails : [{ email: '', description: '' }]);
    }
  }, [isOpen, initialEmails]);

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

  const handleUpdate = (index: number, patch: Partial<PartnerEmail>) => {
    setEmails(prev => prev.map((em, i) => i === index ? { ...em, ...patch } : em));
  };

  const handleRemove = (index: number) => {
    setEmails(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (emails.length < 5) {
      setEmails(prev => [...prev, { email: '', description: '' }]);
    }
  };

  const handleSave = () => {
    onSave(emails);
    onClose();
  };

  const isSaveDisabled = emails.some(e => !e.email || !e.description);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-lg shadow-2xl border z-10 overflow-hidden ${
              isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray' : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            <div className={`flex items-center justify-between px-6 py-5 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95' : 'bg-white/95'}`}>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Email Addresses</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Add up to 5 emails</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {emails.map((emailObj, idx) => (
                <div key={idx} className="flex gap-4 items-start relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <TextField
                      name={`email-${idx}`}
                      type="email"
                      label="Email Address"
                      value={emailObj.email}
                      placeholder="e.g. name@domain.com"
                      onChange={(_, val) => handleUpdate(idx, { email: val })}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                    <TextField
                      name={`description-${idx}`}
                      label="Description"
                      value={emailObj.description}
                      placeholder="e.g. Primary, Operations, Personal"
                      onChange={(_, val) => handleUpdate(idx, { description: val })}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  </div>
                  {emails.length > 1 && (
                    <button type="button" onClick={() => handleRemove(idx)} className="mt-8 text-red-500 hover:text-red-400 p-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              {emails.length < 5 && (
                <div className="pt-2 max-w-sm">
                  <MultiEntryButton
                    label="Add Another Email"
                    count={0}
                    onClick={handleAdd}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </div>

            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label={emails.length === 1 ? "Save Email" : "Save Emails"}
                onClick={handleSave}
                disabled={isSaveDisabled}
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
