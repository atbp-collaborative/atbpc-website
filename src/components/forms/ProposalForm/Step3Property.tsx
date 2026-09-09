'use client';

import React, { useState } from 'react';
import { ProposalFormData, BUDGET_OPTIONS } from '@/lib/forms/proposal.schema';
import { TextField } from '@/components/forms/form-fields/TextField';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { DateField } from '@/components/forms/form-fields/DateField';
import { MultiEntryButton } from '@/components/primitives/buttons/MultiEntryButton';
import { ProjectAddressModal } from './ProjectAddressModal';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step3Property: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Check if address has some values filled to show "Added" count
  const hasAddress = formData.projectAddress?.regionCode ? 1 : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-sans text-body font-bold text-space-sparkle mb-2">Step 3. Property, Budget & Timeline</h2>
        <p className="text-caption opacity-60">Help us understand the scale, location, and constraints of your project.</p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-sans text-caption font-bold mb-4">3a. Property Area</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
            <SelectField
              name="propertyAreaType"
              label="Area Type"
              placeholder="[ Select Area Type ]"
              options={[
                { value: 'tla', label: 'TLA (for land)' },
                { value: 'tua', label: 'TUA (for fit-out)' }
              ]}
              value={formData.propertyAreaType || ''}
              onChange={(name, val) => updateField('propertyAreaType', val)}
              isDarkMode={isDarkMode}
              dense={true}
            />

            <TextField
              type="number"
              name="propertyAreaSize"
              label="Area Size (sqm)"
              value={formData.propertyAreaSize || ''}
              onChange={(name, val) => updateField('propertyAreaSize', val)}
              isDarkMode={isDarkMode}
            />

            <MultiEntryButton 
              fieldLabel="Project Address"
              label={hasAddress ? "Edit Project Address" : "Add Project Address"} 
              count={hasAddress} 
              onClick={() => setShowAddressModal(true)} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4">3b. Your Build Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              name="constructionBudget"
              label={
                <span>
                  Budget <br />
                  <span className="text-xs font-normal opacity-70">How much are you willing to spend on materials? (PHP)</span>
                </span>
              }
              placeholder="[ Select Budget Range ]"
              options={BUDGET_OPTIONS}
              value={formData.constructionBudget || ''}
              onChange={(name, val) => updateField('constructionBudget', val)}
              isDarkMode={isDarkMode}
              dense={true}
            />
          </div>
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4">3c. Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DateField
              name="targetDate"
              label="Target date of start of project"
              value={formData.targetDate || ''}
              onChange={(name, val) => updateField('targetDate', val)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      <ProjectAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        formData={formData}
        updateField={updateField}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
