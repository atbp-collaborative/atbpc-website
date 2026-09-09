'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { AddressField } from '@/components/forms/form-fields/AddressField';
import dynamic from 'next/dynamic';
import { ProposalFormData } from '@/lib/forms/proposal.schema';

const MapPinField = dynamic(() => import('@/components/forms/form-fields/MapPinField').then((mod) => mod.MapPinField), { ssr: false });

interface ProjectAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const ProjectAddressModal: React.FC<ProjectAddressModalProps> = ({
  isOpen,
  onClose,
  formData,
  updateField,
  isDarkMode,
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
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95' : 'bg-white/95'}`}>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Project Address</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Provide the site location</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">
              <div>
                <AddressField
                  name="siteAddress"
                  value={formData.siteAddress || {}}
                  onChange={(name, val) => updateField('siteAddress', val)}
                  isDarkMode={isDarkMode}
                  variant="full"
                />
              </div>

              <div>
                <h3 className="font-sans text-caption font-bold mb-4">Map Location</h3>
                <MapPinField
                  name="mapCoordinates"
                  label="Pin on Map"
                  value={formData.mapCoordinates || null}
                  onChange={(name, val) => updateField('mapCoordinates', val)}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label="Confirm"
                onClick={onClose}
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
