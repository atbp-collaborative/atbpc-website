'use client';

import React from 'react';
import { ProposalFormData } from '@/lib/forms/proposal';
import { TextAreaField } from '@/components/forms/form-fields/TextAreaField';
import { MultiFileUploadField } from '@/components/forms/form-fields/MultiFileUploadField';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step4Additional: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-sans text-h2 font-bold text-space-sparkle mb-2">Step 4. Additional Information (Optional)</h2>
        <p className="text-caption opacity-60">Upload relevant files and share any extra details.</p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-sans text-h3 font-bold mb-4">h. References & Superstitions</h3>
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
          <h3 className="font-sans text-h3 font-bold mb-4">i. Documents</h3>
          <MultiFileUploadField
            name="documents"
            label="Upload Legal Documents"
            note="TCT/OCT/CCT, Lot Plan / Lease Plan, Deed of Restriction. PDF only."
            accept=".pdf"
            value={formData.documents || []}
            onChange={(name, val) => updateField('documents', val)}
            isDarkMode={isDarkMode}
          />
        </div>

        <div>
          <h3 className="font-sans text-h3 font-bold mb-4">j. Additional Info</h3>
          <TextAreaField
            type="textarea"
            name="additionalInfo"
            label="Questions or Declarations"
            placeholder="Declare anything else or ask questions here..."
            value={formData.additionalInfo || ''}
            onChange={(name, val) => updateField('additionalInfo', val)}
            isDarkMode={isDarkMode}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
