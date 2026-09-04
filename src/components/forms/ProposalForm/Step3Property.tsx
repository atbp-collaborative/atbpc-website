'use client';

import React from 'react';
import { ProposalFormData, BUDGET_OPTIONS } from '@/lib/forms/proposal';
import { TextField } from '@/components/forms/form-fields/TextField';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { DateField } from '@/components/forms/form-fields/DateField';
import dynamic from 'next/dynamic';

const MapPinField = dynamic(() => import('@/components/forms/form-fields/MapPinField').then((mod) => mod.MapPinField), { ssr: false });

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step3Property: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-sans text-body font-bold text-space-sparkle mb-2">Step 3. Property, Budget & Timeline</h2>
        <p className="text-caption opacity-60">Help us understand the scale, location, and constraints of your project.</p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-sans text-caption font-bold mb-4">3a. Property Area</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SelectField
              name="propertyAreaType"
              label="Area Type"
              placeholder="Select Area Type"
              options={[
                { value: 'TLA', label: 'TLA (for land)' },
                { value: 'TUA', label: 'TUA (for fit-out)' }
              ]}
              value={formData.propertyAreaType || ''}
              onChange={(name, val) => updateField('propertyAreaType', val)}
              isDarkMode={isDarkMode}
            />

            <TextField
              type="number"
              name="propertyAreaSize"
              label="Area Size (sqm)"
              value={formData.propertyAreaSize || ''}
              onChange={(name, val) => updateField('propertyAreaSize', val)}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="mb-6">
            <TextField
              type="text"
              name="siteAddress"
              label="Site Address"
              value={formData.siteAddress || ''}
              onChange={(name, val) => updateField('siteAddress', val)}
              isDarkMode={isDarkMode}
            />
          </div>

          <div>
            <MapPinField
              name="mapCoordinates"
              label="Pin on Map"
              value={formData.mapCoordinates || null}
              onChange={(name, val) => updateField('mapCoordinates', val)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4">3b. Your Build Forecast</h3>
          <div className="w-full md:w-1/2">
            <SelectField
              name="constructionBudget"
              label={
                <span>
                  Budget <br />
                  <span className="text-xs font-normal opacity-70">How much are you willing to spend on materials? (PHP)</span>
                </span>
              }
              placeholder="Select a budget range"
              options={BUDGET_OPTIONS}
              value={formData.constructionBudget || ''}
              onChange={(name, val) => updateField('constructionBudget', val)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4">3c. Timeline</h3>
          <div className="w-full md:w-1/2">
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
    </div>
  );
};
