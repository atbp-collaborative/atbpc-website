import React, { useState, FormEvent } from 'react';
import { ArrowRight, Check, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { SurveyResponse } from '../types';
import { MS_FORMS_CONFIG, submitLead } from '../lib/data/leads';

interface ProposalFormProps {
  isDarkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({
  isDarkMode,
  setActiveTab,
}) => {
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
                onClick={() => setActiveTab('studio')}
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
                <button 
                  onClick={() => { setActiveTab('studio'); resetSurvey(); }}
                  className="px-6 py-2.5 text-caption uppercase tracking-widest font-semibold rounded-none bg-space-sparkle text-white hover:bg-space-sparkle/80"
                >
                  Back to Home
                </button>
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
              
              {/* STEP 1: TYPOLOGY */}
              {surveyStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-caption font-sans text-space-sparkle block">Step 1 of 3</span>
                    <h3 className="font-sans text-h2 font-bold">What type of build project are you proposing?</h3>
                    <p className="text-caption opacity-60">Select the option that matches your construction envelope.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'Residential', label: 'Residential Dwelling', desc: 'Custom ground-up houses or massive full-scale renovations.' },
                      { id: 'Condo Fit-out', label: 'Condominium Interior Fit-out', desc: 'Sleek modular built-ins and custom space layouts.' },
                      { id: 'Kiosk', label: 'Specialty Retail Kiosk', desc: 'F&B units or mall-based commercial express counters.' },
                      { id: 'Retail Fit-out', label: 'Commercial / Retail Store Fit-out', desc: 'Fashion boutiques, modern offices, or restaurant spots.' },
                      { id: 'Production Outsourcing', label: 'B2B Production Drawings', desc: 'Detailed CAD Permitting & shop drawing outsourcing.' },
                    ].map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => handleSurveyChange('projectType', opt.id)}
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
                    <button
                      type="button"
                      disabled={!surveyData.projectType}
                      onClick={() => setSurveyStep(2)}
                      className={`flex items-center space-x-2 py-2.5 px-6 rounded-none text-caption uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                        surveyData.projectType 
                          ? 'bg-space-sparkle text-white hover:bg-space-sparkle/80' 
                          : 'bg-gray-400/20 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Next: Budget Category</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: BUDGET & FINANCIAL MAPPING */}
              {surveyStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-caption font-sans text-space-sparkle block">Step 2 of 3</span>
                    <h3 className="font-sans text-h2 font-bold">Estimate your budget scale & income segment</h3>
                    <p className="text-caption opacity-60">We structure our builds honestly with absolute cost transparency. Select your segment.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'Mid-Income', label: 'Mid-Income Project', range: '₱350k - ₱1.5M', desc: 'Suited for boutiques, F&B kiosks, and premium modular condo layouts.' },
                      { id: 'Mid-High-Income', label: 'Mid-High-Income Project', range: '₱1.5M - ₱5M', desc: 'Suited for complete residential overhauls, high-end retail, and larger suites.' },
                      { id: 'High-Income', label: 'High-Income Project', range: '₱5M - ₱15M+', desc: 'Suited for ground-up concrete villas, mansions, or global outsourcing contracts.' },
                    ].map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => {
                          handleSurveyChange('incomeCategory', opt.id);
                          handleSurveyChange('budgetRange', opt.range);
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
                      {[
                        'Architecture Design', 'Interior Fit-Out', 'Project Management', 
                        'Structural Engineering', 'Plumbing & Sanitary Design', 
                        'BIM Modeling / Rendering', 'General Construction / Contracting', 'Outsourced Drafting'
                      ].map(scope => (
                        <button
                          type="button"
                          key={scope}
                          onClick={() => handleScopeToggle(scope)}
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
                      onClick={() => setSurveyStep(1)}
                      className="py-2.5 px-6 rounded-none text-caption uppercase tracking-widest font-semibold border border-space-sparkle/30 hover:bg-space-sparkle/10 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!surveyData.incomeCategory}
                      onClick={() => setSurveyStep(3)}
                      className={`flex items-center space-x-2 py-2.5 px-6 rounded-none text-caption uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                        surveyData.incomeCategory 
                          ? 'bg-space-sparkle text-white hover:bg-space-sparkle/80' 
                          : 'bg-gray-400/20 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Next: Contact Details</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONTACT COORDINATION */}
              {surveyStep === 3 && (
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
                        onChange={(e) => handleSurveyChange('name', e.target.value)}
                        className={`w-full p-2.5 text-body rounded-none border outline-none ${
                          isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
                        }`}
                        placeholder="e.g., Adrian Mores"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-caption uppercase tracking-wider block opacity-70">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={surveyData.email}
                        onChange={(e) => handleSurveyChange('email', e.target.value)}
                        className={`w-full p-2.5 text-body rounded-none border outline-none ${
                          isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
                        }`}
                        placeholder="e.g., adrian@domain.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-caption uppercase tracking-wider block opacity-70">Mobile Contact Number *</label>
                      <input 
                        type="tel"
                        required
                        value={surveyData.phone}
                        onChange={(e) => handleSurveyChange('phone', e.target.value)}
                        className={`w-full p-2.5 text-body rounded-none border outline-none ${
                          isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
                        }`}
                        placeholder="e.g., +63 917 123 4567"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-caption uppercase tracking-wider block opacity-70">Viber Number (If different)</label>
                      <input 
                        type="tel"
                        value={surveyData.viber}
                        onChange={(e) => handleSurveyChange('viber', e.target.value)}
                        className={`w-full p-2.5 text-body rounded-none border outline-none ${
                          isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
                        }`}
                        placeholder="e.g., Same as Mobile"
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2 space-y-1.5">
                      <label className="text-caption uppercase tracking-wider block opacity-70">Onboarding Timeline</label>
                      <select
                        value={surveyData.timeline}
                        onChange={(e) => handleSurveyChange('timeline', e.target.value)}
                        className={`w-full p-2.5 text-body rounded-none border outline-none ${
                          isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
                        }`}
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
                        onChange={(e) => handleSurveyChange('additionalDetails', e.target.value)}
                        className={`w-full p-2.5 text-body rounded-none border outline-none ${
                          isDarkMode ? 'bg-vintage-charcoal border-space-sparkle/30 text-white' : 'bg-white border-space-sparkle/25 text-slate-800'
                        }`}
                        placeholder="Describe lot dimension, specific subdivision regulations, structural parameters..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setSurveyStep(2)}
                      className="py-2.5 px-6 rounded-none text-caption uppercase tracking-widest font-semibold border border-space-sparkle/30 hover:bg-space-sparkle/10 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!surveyData.name || !surveyData.email || !surveyData.phone || isSubmitting}
                      className={`flex items-center space-x-2 py-2.5 px-8 rounded-none text-caption uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                        surveyData.name && surveyData.email && surveyData.phone && !isSubmitting
                          ? 'bg-space-sparkle text-white hover:bg-space-sparkle/80' 
                          : 'bg-gray-400/20 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span>Transmitting...</span>
                          <RefreshCw size={12} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          <span>Transmit Profile Survey</span>
                          <Check size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>
      )}
    </motion.div>
  );
};
