'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { FormFieldRenderer } from '@/components/forms/form-fields';
import { PartnerFormVariant } from '@/lib/forms/partner';

interface BusinessRegistrations {
  secRegistration: File | null;
  birRegistration: File | null;
  dtiRegistration: File | null;
  philgepsRegistration: File | null;
  prcLicense?: File | null;
  ptrLicense?: File | null;
}

interface MultiRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (registrations: BusinessRegistrations) => void;
  initialRegistrations: BusinessRegistrations;
  isDarkMode: boolean;
  variant: PartnerFormVariant;
}

export const MultiRegistrationModal: React.FC<MultiRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRegistrations,
  isDarkMode,
  variant,
}) => {
  const [registrations, setRegistrations] = React.useState<BusinessRegistrations>({
    secRegistration: null,
    birRegistration: null,
    dtiRegistration: null,
    philgepsRegistration: null,
    prcLicense: null,
    ptrLicense: null,
  });

  useEffect(() => {
    if (isOpen) {
      setRegistrations(initialRegistrations);
    }
  }, [isOpen, initialRegistrations]);

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

  const handleFieldChange = (name: string, value: any) => {
    setRegistrations(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(registrations);
    onClose();
  };

  // We consider it saved even if empty (they might be optional or validated elsewhere), 
  // but if you want to require them, we can add validation here. For now, it's optional.
  const isSaveDisabled = false;

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
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">
                    {variant === 'consultant' ? 'Documents & Licenses' : 'Business Registrations'}
                  </h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">
                    {variant === 'consultant'
                      ? 'Upload SEC, BIR, DTI, PhilGEPS, PRC, & PTR'
                      : 'Upload SEC, BIR, DTI, & PhilGEPS Documents'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFieldRenderer
                  config={{ type: 'file', name: 'secRegistration', label: 'SEC Registration', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', variant: 'compact' }}
                  value={registrations.secRegistration}
                  onChange={handleFieldChange}
                  isDarkMode={isDarkMode}
                />
                <FormFieldRenderer
                  config={{ type: 'file', name: 'birRegistration', label: 'BIR Registration', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', variant: 'compact' }}
                  value={registrations.birRegistration}
                  onChange={handleFieldChange}
                  isDarkMode={isDarkMode}
                />
                <FormFieldRenderer
                  config={{ type: 'file', name: 'dtiRegistration', label: 'DTI Registration', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', variant: 'compact' }}
                  value={registrations.dtiRegistration}
                  onChange={handleFieldChange}
                  isDarkMode={isDarkMode}
                />
                <FormFieldRenderer
                  config={{
                    type: 'file',
                    name: 'philgepsRegistration',
                    label: (
                      <span>
                        PhilGEPS (
                        <a
                          href="https://www.philgeps.gov.ph"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-space-sparkle transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Website
                        </a>
                        )
                      </span>
                    ),
                    typeHint: '(PDF, JPG, GIF, PNG)',
                    variant: 'compact'
                  }}
                  value={registrations.philgepsRegistration}
                  onChange={handleFieldChange}
                  isDarkMode={isDarkMode}
                />
                {variant === 'consultant' && (
                  <>
                    <FormFieldRenderer
                      config={{ type: 'file', name: 'prcLicense', label: 'PRC License', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', variant: 'compact' }}
                      value={registrations.prcLicense}
                      onChange={handleFieldChange}
                      isDarkMode={isDarkMode}
                    />
                    <FormFieldRenderer
                      config={{ type: 'file', name: 'ptrLicense', label: 'PTR License', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', variant: 'compact' }}
                      value={registrations.ptrLicense}
                      onChange={handleFieldChange}
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}
              </div>
            </div>

            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label="Save Registrations"
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
