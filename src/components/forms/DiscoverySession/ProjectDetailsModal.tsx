import React from 'react';
import { InfoModal } from '@/components/modals/InfoModal';
import { FormFieldRenderer } from '@/components/forms/form-fields';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { DiscoverySessionFormData } from '@/lib/forms/discovery.schema';
import { CATEGORY_OPTIONS, TYPOLOGY_MAPPING, PROJECT_TYPE_OPTIONS } from '@/lib/forms/proposal.schema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  formData: DiscoverySessionFormData;
  handleChange: (name: string, value: any) => void;
}

export const ProjectDetailsModal: React.FC<Props> = ({ isOpen, onClose, isDarkMode, formData, handleChange }) => {
  const currentTypologyOptions = formData.projectCategory ? TYPOLOGY_MAPPING[formData.projectCategory as keyof typeof TYPOLOGY_MAPPING] || [] : [];

  const handleCategoryChange = (name: string, value: string) => {
    handleChange('projectCategory', value);
    handleChange('projectTypology', '');
  };

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      title="Project Details"
      subtitle="Project Classification & Site Address"
      closeLabel="Done"
    >
      <div className="flex flex-col gap-6 text-left">
        <div>
          <h3 className="font-sans text-caption font-bold mb-4 opacity-80">Project Classification</h3>
          <div className="space-y-4">
            <SelectField
              name="projectCategory"
              label="Project Category"
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
              value={formData.projectCategory || ''}
              onChange={handleCategoryChange}
              isDarkMode={isDarkMode}
            />

            <SelectField
              name="projectTypology"
              label="Project Typology"
              placeholder={formData.projectCategory ? "Select a typology" : "Select a category first"}
              options={currentTypologyOptions}
              value={formData.projectTypology || ''}
              onChange={(name, val) => handleChange('projectTypology', val)}
              isDarkMode={isDarkMode}
              disabled={!formData.projectCategory}
            />

            <SelectField
              name="projectType"
              label="Project Type"
              placeholder="Select project type"
              options={PROJECT_TYPE_OPTIONS}
              value={formData.projectType || ''}
              onChange={(name, val) => handleChange('projectType', val)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4 opacity-80">Project Site Address</h3>
          <FormFieldRenderer
            config={{ type: 'address', name: 'address', label: 'Project Site Address', required: true }}
            value={formData.address}
            onChange={handleChange}
            isDarkMode={isDarkMode}
            theme="neutral"
          />
        </div>
      </div>
    </InfoModal>
  );
};
