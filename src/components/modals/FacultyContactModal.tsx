'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { TextField } from '@/components/forms/form-fields';
import { FacultyContacts } from '@/lib/forms/career';

interface FacultyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contacts: FacultyContacts) => void;
  initialContacts: FacultyContacts;
  isDarkMode: boolean;
}

export const FacultyContactModal: React.FC<FacultyContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContacts,
  isDarkMode,
}) => {
  const [contacts, setContacts] = useState<FacultyContacts>(initialContacts);
  const [openSection, setOpenSection] = useState<keyof FacultyContacts | null>('dean');

  useEffect(() => {
    if (isOpen) {
      setContacts(initialContacts);
      setOpenSection('dean');
    }
  }, [isOpen, initialContacts]);

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
    onSave(contacts);
    onClose();
  };

  const handleChange = (section: keyof FacultyContacts, field: string, value: string) => {
    setContacts(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const sections: { key: keyof FacultyContacts; label: string }[] = [
    { key: 'dean', label: 'Dean' },
    { key: 'chairperson', label: 'Chairperson' },
    { key: 'ojtInstructor', label: 'OJT Instructor' },
    { key: 'guidanceOfficer', label: 'Guidance Officer' },
    { key: 'disciplineOfficer', label: 'Discipline Officer' },
  ];

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
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Faculty Contacts</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Provide coordinator details</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {sections.map((section) => (
                <div key={section.key} className="border-b border-space-sparkle/10 pb-2">
                  <button
                    onClick={() => setOpenSection(openSection === section.key ? null : section.key)}
                    className="w-full py-2 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                  >
                    <h4 className={`font-sans text-mini font-semibold tracking-wide uppercase ${isDarkMode ? 'text-white' : 'text-vintage-charcoal'} group-hover:opacity-80 transition-opacity`}>
                      {section.label}
                    </h4>
                    <span className={`${isDarkMode ? 'text-white' : 'text-vintage-charcoal'} shrink-0 flex items-center justify-center`}>
                      {openSection === section.key ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openSection === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 py-4 pt-2">
                          <TextField
                            name={`${section.key}-name`}
                            label="Name"
                            value={contacts[section.key].name}
                            placeholder="Full Name"
                            onChange={(_, val) => handleChange(section.key, 'name', val)}
                            isDarkMode={isDarkMode}
                            theme="neutral"
                          />
                          <TextField
                            name={`${section.key}-contact`}
                            label="Contact Number"
                            value={contacts[section.key].contactNumber}
                            placeholder="Mobile No."
                            onChange={(_, val) => handleChange(section.key, 'contactNumber', val)}
                            isDarkMode={isDarkMode}
                            theme="neutral"
                          />
                          <TextField
                            name={`${section.key}-landline`}
                            label="Landline"
                            value={contacts[section.key].landline}
                            placeholder="Landline No."
                            onChange={(_, val) => handleChange(section.key, 'landline', val)}
                            isDarkMode={isDarkMode}
                            theme="neutral"
                          />
                          <TextField
                            name={`${section.key}-email`}
                            label="Email"
                            value={contacts[section.key].email}
                            placeholder="Email Address"
                            onChange={(_, val) => handleChange(section.key, 'email', val)}
                            isDarkMode={isDarkMode}
                            theme="neutral"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label="Save Contacts"
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
