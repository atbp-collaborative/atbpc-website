'use client';

import React from 'react';
import { ProposalFormData, TYPOLOGY_OPTIONS, SERVICES_OPTIONS, SCOPE_MAPPING } from '@/lib/forms/proposal';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { ChoiceCardOption } from '@/components/forms/form-fields/types';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step2Services: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const currentScopeOptions = formData.services ? SCOPE_MAPPING[formData.services] || [] : [];
  const selectedTypology = TYPOLOGY_OPTIONS.find(t => t.value === formData.typology);
  const selectedScope = currentScopeOptions.find(s => s.value === formData.scope);

  const handleServiceChange = (name: string, value: string) => {
    updateField('services', value);
    updateField('scope', ''); // Reset scope when service changes
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="text-caption font-sans text-space-sparkle block opacity-70 mb-2 uppercase tracking-widest">Step 2 of 4</span>
        <h2 className="font-sans text-h2 font-bold text-space-sparkle mb-2">Project Typology & Services</h2>
        <p className="text-caption opacity-60">Select the appropriate project classification and the services you require from ATBP Collaborative.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-sans text-h3 font-bold mb-4">c. Project Typology</h3>
          <SelectField
            name="typology"
            label="Project Typology"
            placeholder="Select a typology"
            options={TYPOLOGY_OPTIONS}
            value={formData.typology || ''}
            onChange={(name, val) => updateField('typology', val)}
            isDarkMode={isDarkMode}
          />
          {selectedTypology && (
            <div className="mt-3 text-caption opacity-80 pl-2 border-l-2 border-space-sparkle/20">
              <p className="font-medium">{selectedTypology.label}</p>
              <p className="text-xs opacity-70">{selectedTypology.desc}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-sans text-h3 font-bold mb-4">d. Services & Scope</h3>
          <div className="space-y-4">
            <SelectField
              name="services"
              label="Services"
              placeholder="Select a service"
              options={SERVICES_OPTIONS}
              value={formData.services || ''}
              onChange={handleServiceChange}
              isDarkMode={isDarkMode}
            />
            
            <SelectField
              name="scope"
              label="Scope"
              placeholder={formData.services ? "Select a scope" : "Select a service first"}
              options={currentScopeOptions}
              value={formData.scope || ''}
              onChange={(name, val) => updateField('scope', val)}
              isDarkMode={isDarkMode}
              disabled={!formData.services}
            />
          </div>
          
          {selectedScope && (
            <div className="mt-3 text-caption opacity-80 pl-2 border-l-2 border-space-sparkle/20">
              <p className="font-medium">{selectedScope.label}</p>
              <p className="text-xs opacity-70">{selectedScope.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
