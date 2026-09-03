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
        <h2 className="font-sans text-h2 font-bold text-space-sparkle mb-2">Step 3. Property, Budget & Timeline</h2>
        <p className="text-caption opacity-60">Help us understand the scale, location, and constraints of your project.</p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-sans text-h3 font-bold mb-4">e. Property Area</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-caption font-sans font-medium text-space-sparkle flex items-baseline">Area Type</label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="propertyAreaType" 
                    value="TLA" 
                    checked={formData.propertyAreaType === 'TLA'} 
                    onChange={(e) => updateField('propertyAreaType', e.target.value)} 
                    className="accent-space-sparkle w-4 h-4"
                  />
                  <span className="text-sm">TLA (for land)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="propertyAreaType" 
                    value="TUA" 
                    checked={formData.propertyAreaType === 'TUA'} 
                    onChange={(e) => updateField('propertyAreaType', e.target.value)} 
                    className="accent-space-sparkle w-4 h-4"
                  />
                  <span className="text-sm">TUA (for fit-out)</span>
                </label>
              </div>
            </div>

            <TextField
              type="text"
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
          <h3 className="font-sans text-h3 font-bold mb-4">f. Construction Budget</h3>
          <div className="w-full md:w-1/2">
            <SelectField
              name="constructionBudget"
              label="Budget"
              placeholder="Select a budget range"
              options={BUDGET_OPTIONS}
              value={formData.constructionBudget || ''}
              onChange={(name, val) => updateField('constructionBudget', val)}
              isDarkMode={isDarkMode}
            />
          </div>
          <p className="text-xs opacity-60 mt-2 italic">Reminder: budget is understood as materials only.</p>
        </div>

        <div>
          <h3 className="font-sans text-h3 font-bold mb-4">g. Timeline</h3>
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
