'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SurveyResponse } from '../types';
import { Button } from './Button';

interface ProposalFormStep2Props {
  surveyData: SurveyResponse;
  onChange: (field: keyof SurveyResponse, value: any) => void;
  onScopeToggle: (scope: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const INCOME_CATEGORIES = [
  { id: 'Mid-Income', label: 'Mid-Income Project', range: '₱350k - ₱1.5M', desc: 'Suited for boutiques, F&B kiosks, and premium modular condo layouts.' },
  { id: 'Mid-High-Income', label: 'Mid-High-Income Project', range: '₱1.5M - ₱5M', desc: 'Suited for complete residential overhauls, high-end retail, and larger suites.' },
  { id: 'High-Income', label: 'High-Income Project', range: '₱5M - ₱15M+', desc: 'Suited for ground-up concrete villas, mansions, or global outsourcing contracts.' },
];

const SCOPE_OPTIONS = [
  'Architecture Design', 'Interior Fit-Out', 'Project Management',
  'Structural Engineering', 'Plumbing & Sanitary Design',
  'BIM Modeling / Rendering', 'General Construction / Contracting', 'Outsourced Drafting'
];

export const ProposalFormStep2: React.FC<ProposalFormStep2Props> = ({
  surveyData,
  onChange,
  onScopeToggle,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-caption font-sans text-space-sparkle block">Step 2 of 3</span>
        <h3 className="font-sans text-h2 font-bold">Estimate your budget scale & income segment</h3>
        <p className="text-caption opacity-60">We structure our builds honestly with absolute cost transparency. Select your segment.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INCOME_CATEGORIES.map(opt => (
          <div
            key={opt.id}
            onClick={() => {
              onChange('incomeCategory', opt.id);
              onChange('budgetRange', opt.range);
            }}
            className={`p-4 rounded-none border cursor-pointer transition-all flex flex-col justify-between ${
              surveyData.incomeCategory === opt.id
                ? 'border-space-sparkle bg-space-sparkle/10 ring-1 ring-space-sparkle'
                : 'border-space-sparkle/15 hover:bg-space-sparkle/5'
            }`}
          >
            <div>
              <span className="text-body font-bold block">{opt.label}</span>
              <span className="text-h2 font-sans font-bold text-space-sparkle block mt-1">{opt.range}</span>
            </div>
            <span className="text-caption opacity-70 block mt-3 leading-normal">{opt.desc}</span>
          </div>
        ))}
      </div>

      {/* Required Scope Checklist */}
      <div className="space-y-3 pt-2">
        <label className="text-body font-bold block">What architectural services do you require? (Select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {SCOPE_OPTIONS.map(scope => (
            <button
              type="button"
              key={scope}
              onClick={() => onScopeToggle(scope)}
              className={`px-3 py-1.5 rounded-none text-caption font-medium border transition-all cursor-pointer ${
                surveyData.scopeNeeded.includes(scope)
                  ? 'bg-space-sparkle text-white border-space-sparkle'
                  : 'bg-transparent border-space-sparkle/20 hover:border-space-sparkle/60'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>
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
