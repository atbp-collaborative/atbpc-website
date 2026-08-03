'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SurveyResponse } from '../types';
import { Button } from './Button';

interface ProposalFormStep1Props {
  surveyData: SurveyResponse;
  onChange: (field: keyof SurveyResponse, value: any) => void;
  onNext: () => void;
}

const PROJECT_TYPES = [
  { id: 'Residential', label: 'Residential Dwelling', desc: 'Custom ground-up houses or massive full-scale renovations.' },
  { id: 'Condo Fit-out', label: 'Condominium Interior Fit-out', desc: 'Sleek modular built-ins and custom space layouts.' },
  { id: 'Kiosk', label: 'Specialty Retail Kiosk', desc: 'F&B units or mall-based commercial express counters.' },
  { id: 'Retail Fit-out', label: 'Commercial / Retail Store Fit-out', desc: 'Fashion boutiques, modern offices, or restaurant spots.' },
  { id: 'Production Outsourcing', label: 'B2B Production Drawings', desc: 'Detailed CAD Permitting & shop drawing outsourcing.' },
];

export const ProposalFormStep1: React.FC<ProposalFormStep1Props> = ({ surveyData, onChange, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-caption font-sans text-space-sparkle block">Step 1 of 3</span>
        <h3 className="font-sans text-h2 font-bold">What type of build project are you proposing?</h3>
        <p className="text-caption opacity-60">Select the option that matches your construction envelope.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROJECT_TYPES.map(opt => (
          <div
            key={opt.id}
            onClick={() => onChange('projectType', opt.id)}
            className={`p-4 rounded-none border cursor-pointer transition-all ${
              surveyData.projectType === opt.id
                ? 'border-space-sparkle bg-space-sparkle/10 ring-1 ring-space-sparkle'
                : 'border-space-sparkle/15 hover:bg-space-sparkle/5'
            }`}
          >
            <span className="text-body font-bold block">{opt.label}</span>
            <span className="text-caption opacity-70 block mt-1 leading-normal">{opt.desc}</span>
          </div>
        ))}
      </div>

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
