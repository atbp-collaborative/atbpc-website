'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SurveyResponse } from '../types';
import { Button } from './Button';
import { FormFieldRenderer } from './form-fields';
import { STEP1_PROJECT_TYPE_FIELD } from './ProposalForm.config';

interface ProposalFormStep1Props {
  surveyData: SurveyResponse;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  isDarkMode: boolean;
}

export const ProposalFormStep1: React.FC<ProposalFormStep1Props> = ({ surveyData, onChange, onNext, isDarkMode }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-caption font-sans text-space-sparkle block">Step 1 of 3</span>
        <h3 className="font-sans text-h2 font-bold">What type of build project are you proposing?</h3>
        <p className="text-caption opacity-60">Select the option that matches your construction envelope.</p>
      </div>

      <FormFieldRenderer
        config={STEP1_PROJECT_TYPE_FIELD}
        value={surveyData.projectType}
        onChange={onChange}
        isDarkMode={isDarkMode}
        theme="accent"
      />

      <div className="pt-4 flex justify-end">
        <Button
          type="filled"
          disabled={!surveyData.projectType}
          onClick={onNext}
          label="Next: Budget Category"
          className="space-x-2"
        >
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
};
