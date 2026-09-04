'use client';

import React from 'react';
import { ProposalFormData, CATEGORY_OPTIONS, TYPOLOGY_MAPPING, PROJECT_TYPE_OPTIONS, SERVICES_OPTIONS, SCOPE_MAPPING } from '@/lib/forms/proposal';
import { SelectField } from '@/components/forms/form-fields/SelectField';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step2Services: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const currentTypologyOptions = formData.category ? TYPOLOGY_MAPPING[formData.category] || [] : [];
  const currentScopeOptions = formData.services ? SCOPE_MAPPING[formData.services] || [] : [];
  
  const selectedScope = currentScopeOptions.find(s => s.value === formData.scope);

  const handleCategoryChange = (name: string, value: string) => {
    updateField('category', value);
    updateField('typology', ''); // Reset typology when category changes
  };

  const handleServiceChange = (name: string, value: string) => {
    updateField('services', value);
    updateField('scope', ''); // Reset scope when service changes
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-sans text-body lg:text-h2 font-bold text-space-sparkle mb-2">Step 2. Project Typology & Services</h2>
        <p className="text-caption opacity-60">Select the appropriate project classification and the services you require from ATBP Collaborative.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-sans text-caption lg:text-body font-bold mb-4">2a. Project Typology & Services</h3>
          <div className="space-y-4">
            <SelectField
              name="category"
              label="Project Category"
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
              value={formData.category || ''}
              onChange={handleCategoryChange}
              isDarkMode={isDarkMode}
            />

            <SelectField
              name="typology"
              label="Project Typology"
              placeholder={formData.category ? "Select a typology" : "Select a category first"}
              options={currentTypologyOptions}
              value={formData.typology || ''}
              onChange={(name, val) => updateField('typology', val)}
              isDarkMode={isDarkMode}
              disabled={!formData.category}
            />

            <SelectField
              name="projectType"
              label="Project Type"
              placeholder="Select project type"
              options={PROJECT_TYPE_OPTIONS}
              value={formData.projectType || ''}
              onChange={(name, val) => updateField('projectType', val)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div>
          <h3 className="font-sans text-caption lg:text-body font-bold mb-4">2b. Services & Scope</h3>
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
