'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SurveyResponse } from '@/types';
import { Button } from '@/components/primitives/Button';
import { FormFieldRenderer } from '@/components/forms/form-fields';
import { STEP2_INCOME_CATEGORY_FIELD, STEP2_SCOPE_FIELD } from '@/lib/forms/proposal';

interface ProposalFormStep2Props {
  surveyData: SurveyResponse;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
  isDarkMode: boolean;
}

export const ProposalFormStep2: React.FC<ProposalFormStep2Props> = ({
  surveyData,
  onChange,
  onBack,
  onNext,
  isDarkMode,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-caption font-sans text-space-sparkle block">Step 2 of 3</span>
        <h3 className="font-sans text-h2 font-bold">Estimate your budget scale & income segment</h3>
        <p className="text-caption opacity-60">We structure our builds honestly with absolute cost transparency. Select your segment.</p>
      </div>

      <FormFieldRenderer
        config={STEP2_INCOME_CATEGORY_FIELD}
        value={surveyData.incomeCategory}
        onChange={(name, value, option) => {
          onChange(name, value);
          if (option?.highlight) onChange('budgetRange', option.highlight);
        }}
        isDarkMode={isDarkMode}
        theme="accent"
      />

      <FormFieldRenderer
        config={STEP2_SCOPE_FIELD}
        value={surveyData.scopeNeeded}
        onChange={onChange}
        isDarkMode={isDarkMode}
        theme="accent"
      />

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
          disabled={!surveyData.incomeCategory}
          onClick={onNext}
          label="Next: Contact Details"
          className="space-x-2"
        >
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
};
