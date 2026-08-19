'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { TextField } from '@/components/forms/form-fields';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { facebook: string; instagram: string; websiteLink: string }) => void;
  initialValues: { facebook: string; instagram: string; websiteLink: string };
  isDarkMode: boolean;
}

export const SocialMediaModal: React.FC<SocialMediaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
  isDarkMode,
}) => {
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFacebook(initialValues.facebook || '');
      setInstagram(initialValues.instagram || '');
      setWebsiteLink(initialValues.websiteLink || '');
    }
  }, [isOpen, initialValues]);

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
    onSave({ facebook, instagram, websiteLink });
    onClose();
  };

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
            className={`relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-lg shadow-2xl border z-10 overflow-hidden ${
              isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray' : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            <div className={`flex items-center justify-between px-6 py-5 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95' : 'bg-white/95'}`}>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Social Media</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Connect Your Social Pages</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <TextField
                name="facebook"
                label="Facebook"
                value={facebook}
                placeholder="Paste URL / Link / Handle"
                onChange={(_, val) => setFacebook(val)}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
              <TextField
                name="instagram"
                label="Instagram"
                value={instagram}
                placeholder="Paste URL / Link / Handle"
                onChange={(_, val) => setInstagram(val)}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
              <TextField
                name="websiteLink"
                label="Website"
                value={websiteLink}
                placeholder="Paste Here Link to Website"
                onChange={(_, val) => setWebsiteLink(val)}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
            </div>

            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label="Save Links"
                onClick={handleSave}
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
