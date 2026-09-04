'use client';

import React, { useState } from 'react';
import { ProposalFormData } from '@/lib/forms/proposal';
import { TextAreaField } from '@/components/forms/form-fields/TextAreaField';
import { MultiFileUploadField } from '@/components/forms/form-fields/MultiFileUploadField';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { ProposalDocumentsModal } from '@/components/modals/ProposalDocumentsModal';
import { getFieldThemeStyles } from '@/components/forms/form-fields/fieldStyles';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step4Additional: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  
  const getDocumentCount = () => {
    let count = 0;
    if (formData.tctDocument) count++;
    if (formData.lotPlanDocument) count++;
    if (formData.deedDocument) count++;
    return count;
  };
  
  const uploadedCount = getDocumentCount();
  const fieldStyles = getFieldThemeStyles('neutral', isDarkMode);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="font-sans text-body lg:text-h2 font-bold text-space-sparkle mb-2">Step 4. Additional Information (Optional)</h2>
        <p className="text-caption opacity-60">Upload relevant files and share any extra details.</p>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="font-sans text-caption lg:text-body font-bold mb-4">4a. References & Superstitions</h3>
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
          <h3 className="font-sans text-caption lg:text-body font-bold mb-4">4b. Documents</h3>
          <div className="space-y-1">
            <label className={`${fieldStyles.label} truncate`}>
              Legal Documents
            </label>
            <button
              type="button"
              onClick={() => setShowDocumentsModal(true)}
              className={`w-full h-20 p-2 flex flex-col justify-center text-center border rounded-xl cursor-pointer transition-all ${
                uploadedCount > 0
                  ? 'border-space-sparkle bg-space-sparkle/5 text-space-sparkle hover:bg-space-sparkle/10'
                  : fieldStyles.borderColor + ' hover:opacity-80 !bg-white/80 dark:!bg-white/10'
              }`}
            >
              <span className="font-medium font-sans text-caption mb-0.5 tracking-tight">Documents</span>
              <span className={`text-mini ${uploadedCount > 0 ? 'opacity-90 font-medium' : 'opacity-60'}`}>
                {uploadedCount > 0 ? `${uploadedCount} Uploaded` : 'Click to Upload'}
              </span>
            </button>
          </div>
          <p className="text-xs opacity-60 mt-2 italic">TCT/OCT/CCT, Lot Plan / Lease Plan, Deed of Restriction. PDF only.</p>
        </div>

        <div>
          <h3 className="font-sans text-caption lg:text-body font-bold mb-4">4c. Declarations</h3>
          
          <div className="mb-6">
            <SelectField
              name="hasProjectManager"
              label={
                <span>
                  Do you have a Project Manager and/or Builder on board?
                </span>
              }
              placeholder="Select Yes or No"
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
      
      <ProposalDocumentsModal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        formData={formData}
        onChange={(name, val) => updateField(name as any, val)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
