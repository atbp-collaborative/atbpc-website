'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { TextField } from '@/components/forms/form-fields';

interface EmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, relationship: string, number: string) => void;
  initialName: string;
  initialRelationship: string;
  initialNumber: string;
  isDarkMode: boolean;
}

export const EmergencyContactModal: React.FC<EmergencyContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialRelationship,
  initialNumber,
  isDarkMode,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialName || '');
      setRelationship(initialRelationship || '');
      setNumber(initialNumber || '');
    }
  }, [isOpen, initialName, initialRelationship, initialNumber]);

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

  const handleSave = () => {
    onSave(name, relationship, number);
    onClose();
  };

  const isSaveDisabled =
    (name !== '' || relationship !== '' || number !== '') &&
    (name === '' || relationship === '' || number === '');

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
            className={`relative w-full max-w-md max-h-[85vh] flex flex-col rounded-lg shadow-2xl border z-10 overflow-hidden ${
              isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray' : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            <div className={`flex items-center justify-between px-6 py-5 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95' : 'bg-white/95'}`}>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Emergency Contact</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Provide primary emergency details</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <TextField
                name="emergency-name"
                label="Name"
                value={name}
                placeholder="e.g. Jane Doe"
                onChange={(_, val) => setName(val)}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
              <TextField
                name="emergency-relationship"
                label="Relationship"
                value={relationship}
                placeholder="e.g. Parent, Spouse, Sibling"
                onChange={(_, val) => setRelationship(val)}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
              <TextField
                name="emergency-number"
                label="Contact No."
                value={number}
                placeholder="e.g. 0917XXXXXXX"
                onChange={(_, val) => setNumber(val)}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
            </div>

            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label="Save Emergency Contact"
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
