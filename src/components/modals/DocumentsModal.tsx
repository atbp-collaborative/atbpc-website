'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { FileUploadField } from '@/components/forms/form-fields/FileUploadField';
import { CareerFormData, getDocumentFieldsForStructure } from '@/lib/forms/career';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CareerFormData;
  onChange: (name: string, value: any) => void;
  isDarkMode: boolean;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
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

  const documentFields = getDocumentFieldsForStructure(formData.structure);

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
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Documents</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Provide required credentials for your role</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {documentFields.length === 0 ? (
                <p className="text-caption opacity-80 text-center py-8">Please select a structure/role first to see document requirements.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documentFields.map((field) => (
                    <div key={field.name} className="h-28 flex flex-col justify-end">
                      <FileUploadField
                        name={field.name}
                        label={field.label}
                        badge={field.required ? "!" : undefined}
                        value={(formData as any)[field.name]}
                        onChange={onChange}
                        isDarkMode={isDarkMode}
                        theme="neutral"
                        variant="default"
                      />
                    </div>
                  ))}
                </div>
              )}
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
