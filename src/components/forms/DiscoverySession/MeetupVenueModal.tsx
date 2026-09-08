import React from 'react';
import { InfoModal } from '@/components/modals/InfoModal';
import { FormFieldRenderer } from '@/components/forms/form-fields';
import { DiscoverySessionFormData } from '@/lib/forms/discovery.schema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  formData: DiscoverySessionFormData;
  handleChange: (name: string, value: any) => void;
}

export const MeetupVenueModal: React.FC<Props> = ({ isOpen, onClose, isDarkMode, formData, handleChange }) => {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      title="Venue Details"
      subtitle="Meet-up Location"
      closeLabel="Done"
    >
      <div className="flex flex-col gap-4 text-left">
        <FormFieldRenderer
          config={{ type: 'text', name: 'venue', label: 'Venue', placeholder: 'Enter venue name or address', required: true }}
          value={formData.venue}
          onChange={handleChange}
          isDarkMode={isDarkMode}
          theme="neutral"
        />
        
        <FormFieldRenderer
          config={{ type: 'map-pin', name: 'location', label: 'Location', required: true, note: 'Please pin your preferred meeting location' }}
          value={formData.location}
          onChange={handleChange}
          isDarkMode={isDarkMode}
          theme="neutral"
        />
      </div>
    </InfoModal>
  );
};
