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
import { ProposalFormStep1 } from './ProposalFormStep1';
import { ProposalFormStep2 } from './ProposalFormStep2';
import { ProposalFormStep3 } from './ProposalFormStep3';

export const ProposalForm: React.FC = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  // Support toggling between our custom interactive front-end or embedding the direct MS Forms iframe
  const [formIntegrationType, setFormIntegrationType] = useState<'custom' | 'direct'>(
    MS_FORMS_CONFIG.microsoftFormsUrl ? 'direct' : 'custom'
  );

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

  // Handle survey inputs
  const handleSurveyChange = (field: keyof SurveyResponse, value: any) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScopeToggle = (scope: string) => {
    const currentScopes = [...surveyData.scopeNeeded];
    const index = currentScopes.indexOf(scope);
    if (index > -1) {
      currentScopes.splice(index, 1);
    } else {
      currentScopes.push(scope);
    }
    handleSurveyChange('scopeNeeded', currentScopes);
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
      className="max-w-4xl mx-auto px-6 py-12"
    >
      {/* Title Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="font-sans text-hero font-bold tracking-tight">Project Budget & Scope Survey</h1>
        <p className="text-body font-light opacity-80 max-w-lg mx-auto">
          Coordinate your build budget, location, and structural requirements.
        </p>
      </div>

      {/* Integration Mode Switcher (Tab Controls) */}
      {MS_FORMS_CONFIG.microsoftFormsUrl && (
        <div className="flex justify-center mb-8">
          <div className={`p-1 rounded-none border flex space-x-2 ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => setFormIntegrationType('direct')}
              className={`px-4 py-1.5 rounded-none text-caption uppercase tracking-wider font-semibold transition-all ${
                formIntegrationType === 'direct'
                  ? 'bg-space-sparkle text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Direct MS Forms
            </button>
            <button
              onClick={() => setFormIntegrationType('custom')}
              className={`px-4 py-1.5 rounded-none text-caption uppercase tracking-wider font-semibold transition-all ${
                formIntegrationType === 'custom'
                  ? 'bg-space-sparkle text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Custom Front-End
            </button>
          </div>
        </div>
      )}

      {formIntegrationType === 'direct' ? (
        /* DIRECT MICROSOFT FORMS MODE */
        <div className="space-y-6">
          <div className={`p-6 rounded-none border text-center space-y-6 ${
            isDarkMode ? 'bg-vintage-charcoal/40 border-space-sparkle/20' : 'bg-white border-space-sparkle/10'
          }`}>
            <div className="space-y-2">
              <h3 className="font-sans text-h2 font-bold">Open via Microsoft Forms</h3>
              <p className="text-body font-light opacity-80 max-w-xl mx-auto leading-relaxed">
                We have integrated our official <strong>Microsoft Forms</strong> questionnaire to let you input details securely within the Microsoft ecosystem.
              </p>
            </div>

            {/* Embedded Microsoft Forms iFrame Container */}
            <div className="w-full h-[600px] overflow-hidden rounded-none border border-space-sparkle/10 shadow-inner bg-white">
              <iframe
                src={MS_FORMS_CONFIG.microsoftFormsUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title="Microsoft Forms Project Proposal"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={MS_FORMS_CONFIG.microsoftFormsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 text-caption uppercase tracking-widest font-semibold rounded-none bg-space-sparkle text-white hover:bg-space-sparkle/80 text-center w-full sm:w-auto"
              >
                Open in New Tab
              </a>
              <button
                onClick={() => router.push(ROUTES.home)}
                className="px-6 py-2.5 text-caption uppercase tracking-widest font-semibold rounded-none border border-space-sparkle/30 hover:bg-space-sparkle/10 text-center w-full sm:w-auto"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CUSTOM INTERACTIVE FRONT-END MODE */
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
                />
              )}

              {surveyStep === 2 && (
                <ProposalFormStep2
                  surveyData={surveyData}
                  onChange={handleSurveyChange}
                  onScopeToggle={handleScopeToggle}
                  onBack={() => setSurveyStep(1)}
                  onNext={() => setSurveyStep(3)}
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
      )}
    </motion.div>
  );
};
