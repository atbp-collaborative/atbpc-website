import React from 'react';
import { InfoModal } from '@/components/modals/InfoModal';
import { FormFieldRenderer } from '@/components/forms/form-fields';
import { DISCOVERY_LEFT_FIELDS, DiscoverySessionFormData } from '@/lib/forms/discovery.schema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  formData: DiscoverySessionFormData;
  handleChange: (name: string, value: any) => void;
}

export const ClientDetailsModal: React.FC<Props> = ({ isOpen, onClose, isDarkMode, formData, handleChange }) => {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      title="Client Details"
      subtitle="Personal Information & Address"
      closeLabel="Done"
    >
      <div className="flex flex-col gap-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DISCOVERY_LEFT_FIELDS.map((field) => (
            <div key={field.name}>
              <FormFieldRenderer
                config={field}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                isDarkMode={isDarkMode}
                theme="neutral"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <h3 className="font-sans text-caption font-bold mb-2 opacity-80">Client Address</h3>
          <FormFieldRenderer
            config={{ type: 'address', name: 'clientAddress', label: 'Client Address', badge: '!', variant: 'city-region-only' } as any}
            value={formData.clientAddress}
            onChange={handleChange}
            isDarkMode={isDarkMode}
            theme="neutral"
          />
        </div>
      </div>
    </InfoModal>
  );
};
