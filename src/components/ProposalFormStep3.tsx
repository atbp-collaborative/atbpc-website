'use client';

import React from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { SurveyResponse } from '../types';
import { Button } from './Button';

interface ProposalFormStep3Props {
  surveyData: SurveyResponse;
  onChange: (field: keyof SurveyResponse, value: any) => void;
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
  const inputClass = `w-full p-2.5 text-body rounded-none border outline-none ${
    isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
  }`;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-caption font-sans text-space-sparkle block">Step 3 of 3</span>
        <h3 className="font-sans text-h2 font-bold">Onboarding & Contact Coordination</h3>
        <p className="text-caption opacity-60">We usually communicate through Viber or Mobile. Provide valid coordinates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-caption uppercase tracking-wider block opacity-70">Your Complete Name *</label>
          <input
            type="text"
            required
            value={surveyData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className={inputClass}
            placeholder="e.g., Adrian Mores"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption uppercase tracking-wider block opacity-70">Email Address *</label>
          <input
            type="email"
            required
            value={surveyData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={inputClass}
            placeholder="e.g., adrian@domain.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption uppercase tracking-wider block opacity-70">Mobile Contact Number *</label>
          <input
            type="tel"
            required
            value={surveyData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={inputClass}
            placeholder="e.g., +63 917 123 4567"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption uppercase tracking-wider block opacity-70">Viber Number (If different)</label>
          <input
            type="tel"
            value={surveyData.viber}
            onChange={(e) => onChange('viber', e.target.value)}
            className={inputClass}
            placeholder="e.g., Same as Mobile"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 space-y-1.5">
          <label className="text-caption uppercase tracking-wider block opacity-70">Onboarding Timeline</label>
          <select
            value={surveyData.timeline}
            onChange={(e) => onChange('timeline', e.target.value)}
            className={inputClass}
          >
            <option value="">-- Select Timeline Preference --</option>
            <option value="Immediate">Immediate / Within 30 days</option>
            <option value="Quarterly">This Quarter / 2-3 months</option>
            <option value="Planning">Just planning / 6+ months</option>
          </select>
        </div>

        <div className="col-span-1 sm:col-span-2 space-y-1.5">
          <label className="text-caption uppercase tracking-wider block opacity-70">Briefly Outline Site Location & Requirements</label>
          <textarea
            rows={3}
            value={surveyData.additionalDetails}
            onChange={(e) => onChange('additionalDetails', e.target.value)}
            className={inputClass}
            placeholder="Describe lot dimension, specific subdivision regulations, structural parameters..."
          ></textarea>
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
