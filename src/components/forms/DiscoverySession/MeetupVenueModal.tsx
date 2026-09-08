import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!formData.venue || formData.venue.length < 3) return;

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.venue)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          handleChange('location', { lat: parseFloat(lat), lng: parseFloat(lon), address: display_name });
        }
      } catch (e) {
        console.error('Geocoding failed:', e);
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [formData.venue]); // Only depend on venue text changes

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
