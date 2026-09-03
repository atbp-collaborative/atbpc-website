'use client';

import React, { useState } from 'react';
import { usePersistentForm } from '@/hooks/usePersistentForm';
import { defaultProposalFormData, ProposalFormData } from '@/lib/forms/proposal';
import { Step1Contact } from './Step1Contact';
import { Step2Services } from './Step2Services';
import { Step3Property } from './Step3Property';
import { Step4Additional } from './Step4Additional';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/primitives/Button';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const ProposalFormRoot: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData, isLoaded, clearForm] = usePersistentForm<ProposalFormData>('proposal-form', defaultProposalFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const totalSteps = isDesktop ? 2 : 4;

  if (!isLoaded) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-space-sparkle opacity-60" size={32} /></div>;

  const updateField = (field: keyof ProposalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/proposal/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitSuccess(true);
      clearForm();
    } catch (err) {
      setSubmitError('Failed to submit proposal. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
          <Check size={32} />
        </div>
        <div>
          <h2 className="font-sans text-h2 font-bold mb-2">Proposal Submitted Successfully</h2>
          <p className="text-caption opacity-60">We have received your request and will get back to you shortly.</p>
        </div>
      </div>
    );
  }

  // Adjust currentStep if viewport resizes down and currentStep is out of bounds
  if (currentStep > totalSteps) {
    setCurrentStep(totalSteps);
  }

  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full w-full mx-auto pt-0 pb-0">
      {/* Progress */}
      <div className="mb-6 flex space-x-2">
        {stepsArray.map(step => (
          <div key={step} className={`h-1.5 flex-1 rounded-full ${step <= currentStep ? 'bg-space-sparkle' : 'bg-space-sparkle/20'}`} />
        ))}
      </div>

      <div className="flex-1 min-h-0 mb-4">
        {!isDesktop ? (
          <div className="h-full overflow-y-auto pr-4">
            {currentStep === 1 && <Step1Contact formData={formData} updateField={updateField} isDarkMode={isDarkMode} />}
            {currentStep === 2 && <Step2Services formData={formData} updateField={updateField} isDarkMode={isDarkMode} />}
            {currentStep === 3 && <Step3Property formData={formData} updateField={updateField} isDarkMode={isDarkMode} />}
            {currentStep === 4 && <Step4Additional formData={formData} updateField={updateField} isDarkMode={isDarkMode} />}
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <div className="h-full grid grid-cols-2 gap-12">
                <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
                  <Step1Contact formData={formData} updateField={updateField} isDarkMode={isDarkMode} />
                </div>
                <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
                  <Step2Services formData={formData} updateField={updateField} isDarkMode={isDarkMode} />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="h-full grid grid-cols-2 gap-12">
                <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
                  <Step3Property formData={formData} updateField={updateField} isDarkMode={isDarkMode} />
                </div>
                <div className="h-full overflow-y-auto pr-4 custom-scrollbar">
                  <Step4Additional formData={formData} updateField={updateField} isDarkMode={isDarkMode} />
                </div>
              </div>
            )}
          </>
        )}
        {submitError && <p className="text-red-500 text-sm mt-4">{submitError}</p>}
      </div>

      <div className="flex justify-between mt-auto pt-4 pb-6 border-t border-space-sparkle/10">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1 || isSubmitting}
          className={`font-medium uppercase tracking-widest text-caption rounded-none transition-all flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 select-none py-3.5 px-8 space-x-2 border ${isDarkMode ? 'border-bright-gray/30 text-white hover:bg-white/10' : 'border-vintage-charcoal/30 text-vintage-charcoal hover:bg-vintage-charcoal/5'} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {currentStep < totalSteps ? (
          <Button 
            type="filled" 
            onClick={handleNext}
            label="Next Step"
            className="space-x-2"
          >
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button 
            type="filled" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            label={isSubmitting ? "Submitting..." : "Submit Proposal"}
          />
        )}
      </div>
    </div>
  );
};
