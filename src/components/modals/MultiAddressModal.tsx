'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/primitives/Button';
import { MultiEntryButton } from '@/components/primitives/MultiEntryButton';
import { PartnerAddress } from '@/lib/forms/partner';
import { AddressField, SelectField, TextField, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields';

interface MultiAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addresses: PartnerAddress[]) => void;
  initialAddresses: PartnerAddress[];
  isDarkMode: boolean;
}

const ADDRESS_TYPES = [
  { value: 'Office', label: 'Office' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Facility', label: 'Facility' }
];

export const MultiAddressModal: React.FC<MultiAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAddresses,
  isDarkMode,
}) => {
  const [addresses, setAddresses] = useState<PartnerAddress[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAddresses(initialAddresses.length > 0 && initialAddresses[0].type ? initialAddresses : [{ ...EMPTY_PH_ADDRESS, type: '', landline: '', mapLink: '' }]);
    }
  }, [isOpen, initialAddresses]);

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

  const handleUpdate = (index: number, patch: Partial<PartnerAddress>) => {
    setAddresses(prev => prev.map((addr, i) => i === index ? { ...addr, ...patch } : addr));
  };

  const handleRemove = (index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (addresses.length < 5) {
      setAddresses(prev => [...prev, { ...EMPTY_PH_ADDRESS, type: '', landline: '', mapLink: '' }]);
    }
  };

  const handleSave = () => {
    onSave(addresses);
    onClose();
  };

  const isSaveDisabled = addresses.some(a => !a.regionCode || !a.cityCode || !a.barangayCode || !a.type);

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
            className={`relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-lg shadow-2xl border z-10 overflow-hidden ${
              isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray' : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            <div className={`flex items-center justify-between px-6 py-5 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95' : 'bg-white/95'}`}>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-h2 font-sans font-bold tracking-tight lowercase">Addresses</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">Office / Warehouse / Facility</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
              {addresses.map((address, idx) => (
                <div key={idx} className="space-y-4 relative pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-caption font-bold opacity-80 uppercase tracking-wider">Address {idx + 1}</h3>
                    {addresses.length > 1 && (
                      <button type="button" onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-400 p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <SelectField
                    name={`type-${idx}`}
                    label="Address Type"
                    value={address.type}
                    options={ADDRESS_TYPES}
                    placeholder="[ Select Address Type ]"
                    onChange={(_, val) => handleUpdate(idx, { type: val })}
                    isDarkMode={isDarkMode}
                    theme="neutral"
                  />
                  
                  <AddressField
                    name={`address-${idx}`}
                    label="Location Details"
                    value={address}
                    onChange={(_, val) => handleUpdate(idx, val)}
                    isDarkMode={isDarkMode}
                    theme="neutral"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name={`landline-${idx}`}
                      label="Landline"
                      value={address.landline}
                      placeholder="Viber & Whatsapp Ready"
                      onChange={(_, val) => handleUpdate(idx, { landline: val })}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                    <TextField
                      name={`mapLink-${idx}`}
                      label="Map Link"
                      value={address.mapLink}
                      placeholder="Paste Here Link to Map"
                      onChange={(_, val) => handleUpdate(idx, { mapLink: val })}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  </div>
                </div>
              ))}

              {addresses.length < 5 && (
                <div className="pt-2">
                  <MultiEntryButton
                    label="Add Another Address"
                    count={0}
                    onClick={handleAdd}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </div>

            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${isDarkMode ? 'bg-vintage-charcoal/95 border-space-sparkle/20' : 'bg-white/95 border-space-sparkle/15'}`}>
              <Button
                label={addresses.length === 1 ? "Save Address" : "Save Addresses"}
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
