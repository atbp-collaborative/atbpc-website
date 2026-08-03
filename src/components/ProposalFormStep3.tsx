'use client';

import React from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { SurveyResponse } from '../types';
import { Button } from './Button';
import { FormFieldRenderer } from './form-fields';
import { STEP3_FIELDS } from './ProposalForm.config';

interface ProposalFormStep3Props {
  surveyData: SurveyResponse;
  onChange: (field: string, value: any) => void;
  isDarkMode: boolean;
  isSubmitting: boolean;
  onBack: () => void;
}

export const ProposalFormStep3: React.FC<ProposalFormStep3Props> = ({
  surveyData,
  onChange,
  isDarkMode,
  isSubmitting,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-caption font-sans text-space-sparkle block">Step 3 of 3</span>
        <h3 className="font-sans text-h2 font-bold">Onboarding & Contact Coordination</h3>
        <p className="text-caption opacity-60">We usually communicate through Viber or Mobile. Provide valid coordinates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STEP3_FIELDS.map((field) => (
          <FormFieldRenderer
            key={field.name}
            config={field}
            value={(surveyData as any)[field.name]}
            onChange={onChange}
            isDarkMode={isDarkMode}
            theme="accent"
          />
        ))}
      </div>

      <div className="pt-4 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="py-2.5 px-6 rounded-none text-caption uppercase tracking-widest font-semibold border border-space-sparkle/30 hover:bg-space-sparkle/10 cursor-pointer"
        >
          Back
        </button>
        <Button
          type="filled"
          disabled={!surveyData.name || !surveyData.email || !surveyData.phone || isSubmitting}
          label={isSubmitting ? 'Transmitting...' : 'Transmit Profile Survey'}
          className="space-x-2 px-8"
        >
          {isSubmitting ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
        </Button>
      </div>
    </div>
  );
};
