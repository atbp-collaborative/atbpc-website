'use client';

import React, { useState, FormEvent } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { SurveyResponse } from '../types';
import { MS_FORMS_CONFIG, submitLead } from '../lib/data/leads';
import { useTheme } from '../lib/theme-context';
import { ROUTES } from '../lib/routes';
import { Button } from './Button';
import { MsFormsEmbed } from './form-fields';
import { ProposalFormStep1 } from './ProposalFormStep1';
import { ProposalFormStep2 } from './ProposalFormStep2';
import { ProposalFormStep3 } from './ProposalFormStep3';

export const ProposalForm: React.FC = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const [surveyStep, setSurveyStep] = useState<number>(1);
  const [surveyData, setSurveyData] = useState<SurveyResponse>({
    name: '',
    email: '',
    phone: '',
    viber: '',
    projectType: '',
    incomeCategory: '',
    budgetRange: '',
    scopeNeeded: [],
    timeline: '',
    additionalDetails: ''
  });
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle survey inputs. Typed as a plain string (not `keyof SurveyResponse`)
  // since it's passed to FormFieldRenderer-driven steps, which only know
  // field names as strings from config data.
  const handleSurveyChange = (field: string, value: any) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitSurvey = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitLead(surveyData);
      setSurveySubmitted(true);
    } catch (err) {
      console.error("Microsoft Power Automate integration error:", err);
      // Fallback submission to local simulation
      setSurveySubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSurvey = () => {
    setSurveyStep(1);
    setSurveySubmitted(false);
    setSurveyData({
      name: '',
      email: '',
      phone: '',
      viber: '',
      projectType: '',
      incomeCategory: '',
      budgetRange: '',
      scopeNeeded: [],
      timeline: '',
      additionalDetails: ''
    });
  };

  return (
    <motion.div
      id="proposal-form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 py-12"
    >
      {/* Title Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="font-sans text-hero font-bold tracking-tight">Project Budget & Scope Survey</h1>
        <p className="text-body font-light opacity-80 max-w-lg mx-auto">
          Coordinate your build budget, location, and structural requirements.
        </p>
      </div>

      <MsFormsEmbed
        formsUrl={MS_FORMS_CONFIG.microsoftFormsUrl}
        isDarkMode={isDarkMode}
        onBackToHome={() => router.push(ROUTES.home)}
        embedTitle="Microsoft Forms Project Proposal"
      >
        {/* CUSTOM INTERACTIVE FRONT-END MODE */}
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="relative h-1 bg-space-sparkle/10 rounded-none mb-6 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-space-sparkle transition-all duration-500"
              style={{ width: `${(surveyStep / 3) * 100}%` }}
            ></div>
          </div>

          {surveySubmitted ? (
            <div className={`p-8 rounded-none border text-center space-y-6 ${
              isDarkMode ? 'bg-vintage-charcoal/50 border-space-sparkle/20' : 'bg-white border-space-sparkle/10'
            }`}>
              <div className="w-12 h-12 rounded-full bg-space-sparkle/20 text-space-sparkle flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans text-h1 font-bold">Survey Transmitted Successfully</h3>
                <p className="text-body font-light opacity-80 max-w-md mx-auto leading-relaxed">
                  Thank you for submitting your project context, <strong>{surveyData.name}</strong>. Our Principal Architect, Marchie Teodoro Borja, and technical directors will review your parameters within 24 hours.
                </p>
                {MS_FORMS_CONFIG.powerAutomateWebhookUrl && (
                  <span className="block text-caption text-space-sparkle font-semibold">
                    Synced automatically to Microsoft 365
                  </span>
                )}
              </div>

              <div className={`p-5 rounded-none text-left space-y-2.5 text-body font-sans max-w-md mx-auto ${
                isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'
              }`}>
                <div className="text-caption text-space-sparkle font-bold">QUALIFIED PROFILE DETAILS:</div>
                <div>• <strong>Typology:</strong> {surveyData.projectType}</div>
                <div>• <strong>Segment Focus:</strong> {surveyData.incomeCategory} ({surveyData.budgetRange})</div>
                <div>• <strong>Primary Viber/Mobile:</strong> {surveyData.viber || surveyData.phone}</div>
                <div>• <strong>Timeline Preference:</strong> {surveyData.timeline}</div>
              </div>

              <p className="text-caption text-space-sparkle">
                We will notify you on Viber to schedule our complimentary 2-hour online Discovery session.
              </p>

              <div className="pt-4 flex justify-center space-x-4">
                <Button
                  type="filled"
                  onClick={() => { router.push(ROUTES.home); resetSurvey(); }}
                  label="Back to Home"
                />
                <button
                  onClick={resetSurvey}
                  className="px-6 py-2.5 text-caption uppercase tracking-widest font-semibold rounded-none border border-space-sparkle/30 hover:bg-space-sparkle/10"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submitSurvey} className={`p-8 rounded-none border space-y-8 ${
              isDarkMode ? 'bg-vintage-charcoal/40 border-space-sparkle/20' : 'bg-white border-space-sparkle/10'
            }`}>
              {surveyStep === 1 && (
                <ProposalFormStep1
                  surveyData={surveyData}
                  onChange={handleSurveyChange}
                  onNext={() => setSurveyStep(2)}
                  isDarkMode={isDarkMode}
                />
              )}

              {surveyStep === 2 && (
                <ProposalFormStep2
                  surveyData={surveyData}
                  onChange={handleSurveyChange}
                  onBack={() => setSurveyStep(1)}
                  onNext={() => setSurveyStep(3)}
                  isDarkMode={isDarkMode}
                />
              )}

              {surveyStep === 3 && (
                <ProposalFormStep3
                  surveyData={surveyData}
                  onChange={handleSurveyChange}
                  isDarkMode={isDarkMode}
                  isSubmitting={isSubmitting}
                  onBack={() => setSurveyStep(2)}
                />
              )}
            </form>
          )}
        </div>
      </MsFormsEmbed>
    </motion.div>
  );
};
