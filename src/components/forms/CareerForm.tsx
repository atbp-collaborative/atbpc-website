'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Shield } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { InfoModal } from '@/components/modals/InfoModal';
import { careerPrivacyModalData } from '@/lib/modals/career-privacy';
import { FormFieldRenderer, getFieldThemeStyles } from '@/components/forms/form-fields';
import { CAREER_FORM_FIELDS, CAREER_FORM_INITIAL_DATA, CAREER_FORM_REQUIRED_FIELDS, CareerFormData, CareerFormType } from '@/lib/forms/career';
import { submitCareerApplication } from '@/lib/services/career-applications';
import { RevolvingButton } from '@/components/primitives/RevolvingButton';

export interface CareerFormProps {
  initialStructure?: string;
  formType?: CareerFormType;
}

export const CareerForm: React.FC<CareerFormProps> = ({ initialStructure = '', formType = 'internship' }) => {
  const { isDarkMode } = useTheme();
  const fields = CAREER_FORM_FIELDS[formType];

  const [formData, setFormData] = useState<CareerFormData>({
    ...CAREER_FORM_INITIAL_DATA,
    structure: initialStructure,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    CAREER_FORM_REQUIRED_FIELDS.every((field) => Boolean(formData[field])) &&
    Boolean(formData.address.regionCode && formData.address.cityCode && formData.address.barangayCode);
  const canSubmit = isFormValid && privacyAcknowledged;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitCareerApplication(formData);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({ ...CAREER_FORM_INITIAL_DATA, structure: initialStructure });
    setIsSubmitted(false);
  };

  const inputBorderClass = getFieldThemeStyles('neutral', isDarkMode).borderColor;

  return (
    <motion.div
      key="grow-with-us"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex-1 min-h-0 overflow-hidden flex flex-col px-4 sm:px-8 py-3 select-none"
    >
      {/* Title Header */}
      <div className="mb-3 lg:mb-2 shrink-0">
        <h1 className="font-sans text-h1 font-bold tracking-tight leading-none lowercase">
          grow with us
        </h1>
        <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
          are you currently in search of a practice that could support your future?
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="grow-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto pb-2"
          >
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-3 lg:space-y-2">
              {fields.leftColumnTop.map((field) => (
                <FormFieldRenderer
                  key={field.name}
                  config={field}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  isDarkMode={isDarkMode}
                  theme="neutral"
                />
              ))}

              <FormFieldRenderer
                config={fields.jobDescriptionField}
                value={(formData as any)[fields.jobDescriptionField.name]}
                onChange={handleChange}
                isDarkMode={isDarkMode}
                theme="neutral"
              />

              {/* Bottom Row: Resume, Portfolio, Cover Video */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {fields.uploadRow.map((field) => (
                  <FormFieldRenderer
                    key={field.name}
                    config={field}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    isDarkMode={isDarkMode}
                    theme="neutral"
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-2.5 lg:space-y-2">
              {fields.rightColumnRows.map((row, idx) => (
                <div key={idx} className={row.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
                  {row.map((field) => (
                    <FormFieldRenderer
                      key={field.name}
                      config={field}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  ))}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2 lg:pt-1">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className={`py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass}`}
                >
                  Privacy Statement
                </button>
                <RevolvingButton
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  active={!privacyAcknowledged}
                  title={!privacyAcknowledged ? 'Acknowledge the Privacy Statement to continue' : !isFormValid ? 'Fill in all required fields to continue' : undefined}
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </RevolvingButton>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`my-auto p-8 rounded-2xl border text-center space-y-4 max-w-md mx-auto ${inputBorderClass}`}
          >
            <CheckCircle size={40} className="mx-auto text-space-sparkle animate-bounce" />
            <h2 className="text-h2 font-bold tracking-tight">Application Submitted</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              Thank you for expressing interest in growing with ATBP Collaborative. Our talent team will carefully review your credentials and contact you directly.
            </p>
            <button
              onClick={resetForm}
              className={`py-2 px-6 rounded-xl border text-caption font-semibold cursor-pointer ${inputBorderClass}`}
            >
              Submit Another Application
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Statement Modal */}
      <InfoModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        isDarkMode={isDarkMode}
        data={careerPrivacyModalData.contents}
      >

        <label className="flex items-center gap-2 pt-1 text-caption cursor-pointer select-none">
          <input
            type="checkbox"
            checked={privacyAcknowledged}
            onChange={(e) => setPrivacyAcknowledged(e.target.checked)}
            className="h-4 w-4 accent-space-sparkle cursor-pointer"
          />
          I have read and agree to the Privacy Statement
        </label>
      </InfoModal>
    </motion.div>
  );
};
