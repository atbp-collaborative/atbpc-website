'use client';

import React from 'react';
import { ProposalFormData } from '@/lib/forms/proposal.schema';
import { TextAreaField } from '@/components/forms/form-fields/TextAreaField';
import { MultiFileUploadField } from '@/components/forms/form-fields/MultiFileUploadField';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { FileUploadField } from '@/components/forms/form-fields/FileUploadField';
import { getFieldThemeStyles } from '@/components/forms/form-fields/fieldStyles';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step4Additional: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const fieldStyles = getFieldThemeStyles('neutral', isDarkMode);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-sans text-body font-bold text-space-sparkle mb-2">Step 4. Additional Information (Optional)</h2>
        <p className="text-caption opacity-60">Upload relevant files and share any extra details.</p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-sans text-caption font-bold mb-4">4a. References & Superstitions</h3>
          <div className="mb-6">
            <MultiFileUploadField
              name="attachments"
              label="Attachments (pegs, space requirements, design direction)"
              note="PDF only"
              accept=".pdf"
              value={formData.attachments || []}
              onChange={(name, val) => updateField('attachments', val)}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <TextAreaField
            name="superstitions"
            label="Pamahiin (Superstitions)"
            placeholder="List any design superstitions or beliefs we should consider..."
            value={formData.superstitions || ''}
            onChange={(name, val) => updateField('superstitions', val)}
            isDarkMode={isDarkMode}
            rows={3}
          />
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4">4b. Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FileUploadField
                name="tctDocument"
                label="TCT / OCT / CCT"
                badge="!"
                value={formData.tctDocument as any}
                onChange={(name, val) => updateField(name as any, val)}
                isDarkMode={isDarkMode}
                theme="neutral"
                variant="compact"
                accept=".pdf"
              />
            </div>
            <div>
              <FileUploadField
                name="lotPlanDocument"
                label="Lot Plan / Lease Plan"
                badge="!"
                value={formData.lotPlanDocument as any}
                onChange={(name, val) => updateField(name as any, val)}
                isDarkMode={isDarkMode}
                theme="neutral"
                variant="compact"
                accept=".pdf"
              />
            </div>
            <div className="md:col-span-2">
              <FileUploadField
                name="dorDocument"
                label="Deed of Restrictions"
                badge="!"
                value={formData.dorDocument as any}
                onChange={(name, val) => updateField(name as any, val)}
                isDarkMode={isDarkMode}
                theme="neutral"
                variant="compact"
                accept=".pdf"
              />
            </div>
          </div>
          <p className="text-xs opacity-60 mt-3 italic">TCT/OCT/CCT, Lot Plan / Lease Plan, Deed of Restriction. PDF only.</p>
        </div>

        <div>
          <h3 className="font-sans text-caption font-bold mb-4">4c. Declarations</h3>
          
          <div className="mb-6">
            <SelectField
              name="hasProjectManager"
              label={
                <span>
                  Do you have a Project Manager and/or Builder on board?
                </span>
              }
              placeholder="[ Select ]"
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' }
              ]}
              value={formData.hasProjectManager || ''}
              onChange={(name, val) => updateField('hasProjectManager', val)}
              isDarkMode={isDarkMode}
            />
          </div>

          {formData.hasProjectManager === 'Yes' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <TextAreaField
                type="textarea"
                name="additionalInfo"
                label="Please provide details"
                placeholder="List the project manager or builder details here..."
                value={formData.additionalInfo || ''}
                onChange={(name, val) => updateField('additionalInfo', val)}
                isDarkMode={isDarkMode}
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
