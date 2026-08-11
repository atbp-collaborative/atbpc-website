'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Shield, X } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { InfoModal } from '@/components/modals/InfoModal';
import { FormFieldRenderer, PhAddress, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields';
import { SnakeBorder } from '@/components/primitives/SnakeBorder';
import { getPartnerFormFields, PARTNER_FORM_INITIAL_DATA, PartnerFormData, PartnerFormVariant } from '@/lib/forms/partner';

export interface PartnerApplicationFormProps {
  variant: PartnerFormVariant;
  title: string;
  subtitle: string;
  categories?: string[];
  specialties?: string[];
  typologies?: string[];
  successTitle: string;
  successMessage: string;
  submitAnotherLabel: string;
  conditionsTitle: string;
  conditionsContent: string[];
}

export const PartnerApplicationForm: React.FC<PartnerApplicationFormProps> = ({
  variant,
  title,
  subtitle,
  categories,
  specialties,
  typologies,
  successTitle,
  successMessage,
  submitAnotherLabel,
  conditionsTitle,
  conditionsContent,
}) => {
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState<PartnerFormData>(PARTNER_FORM_INITIAL_DATA);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [conditionsAcknowledged, setConditionsAcknowledged] = useState(false);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Boolean(
    formData.companyName &&
    (!categories || formData.category) &&
    (!specialties || formData.specialty) &&
    (!typologies || formData.typology) &&
    formData.contactNumber &&
    formData.email &&
    formData.address.regionCode &&
    formData.address.cityCode &&
    formData.address.barangayCode
  );
  
  const canSubmit = isFormValid && conditionsAcknowledged;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const resetForm = () => {
    setFormData(PARTNER_FORM_INITIAL_DATA);
    setIsSubmitted(false);
  };

  const inputBorderClass = isDarkMode
    ? 'border-bright-gray/30 focus:border-bright-gray bg-vintage-charcoal/50 text-white placeholder-bright-gray/40'
    : 'border-vintage-charcoal/30 focus:border-vintage-charcoal bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40';

  const fields = getPartnerFormFields(variant, { categories, specialties, typologies });

  return (
    <motion.div
      key="partner-application-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full max-h-[calc(100vh-80px)] overflow-hidden flex flex-col px-4 sm:px-8 py-3 select-none"
    >
      <div className="mb-3 shrink-0">
        <h1 className="font-sans text-h1 font-bold tracking-tight leading-none lowercase">
          {title}
        </h1>
        <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
          {subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="application-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-2"
          >
            {/* LEFT COLUMN */}
            <div className={`w-full lg:w-1/2 flex flex-col ${variant === 'supplier' ? 'space-y-3' : 'space-y-2.5'} justify-between`}>
              {fields.leftColumnTop.map((field) => (
                <FormFieldRenderer
                  key={field.name}
                  config={field}
                  value={(formData as any)[field.name]}
                  onChange={handleFieldChange}
                  isDarkMode={isDarkMode}
                />
              ))}

              {fields.leftColumnBottomGrid && (
                <div className={`grid ${variant === 'supplier' ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-2.5'} pt-1`}>
                  {fields.leftColumnBottomGrid.map((field) => (
                    <FormFieldRenderer
                      key={field.name}
                      config={field}
                      value={(formData as any)[field.name]}
                      onChange={handleFieldChange}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-2.5 justify-between">
              {fields.rightColumnRowsTop.map((row, idx) => (
                <div key={idx} className={row.length > 1 ? 'grid grid-cols-2 gap-3' : ''}>
                  {row.map((field) => (
                    <FormFieldRenderer
                      key={field.name}
                      config={field}
                      value={(formData as any)[field.name]}
                      onChange={handleFieldChange}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              ))}

              <FormFieldRenderer
                config={fields.addressField}
                value={(formData as any)[fields.addressField.name]}
                onChange={handleFieldChange}
                isDarkMode={isDarkMode}
              />

              {fields.rightColumnRowsBottom.map((row, idx) => (
                <div key={idx} className={row.length > 1 ? 'grid grid-cols-2 gap-3' : ''}>
                  {row.map((field) => (
                    <FormFieldRenderer
                      key={field.name}
                      config={field}
                      value={(formData as any)[field.name]}
                      onChange={handleFieldChange}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConditionsModal(true)}
                  className={`py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass}`}
                >
                  General Conditions
                </button>
                <div className="relative">
                  <SnakeBorder active={!conditionsAcknowledged} />
                  <button
                    type="submit"
                    disabled={isSubmitting || !canSubmit}
                    title={!conditionsAcknowledged ? 'Acknowledge the General Conditions to continue' : !isFormValid ? 'Fill in all required fields to continue' : undefined}
                    className={`relative z-10 w-full py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50 ${inputBorderClass}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
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
            <h2 className="text-h2 font-bold tracking-tight">{successTitle}</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              {successMessage}
            </p>
            <button
              onClick={resetForm}
              className={`py-2 px-6 rounded-xl border text-caption font-semibold cursor-pointer ${inputBorderClass}`}
            >
              {submitAnotherLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <InfoModal
        isOpen={showConditionsModal}
        onClose={() => setShowConditionsModal(false)}
        isDarkMode={isDarkMode}
        data={{
          title: conditionsTitle,
          subtitle: 'ATBP Collaborative',
          icon: Shield as any,
          items: conditionsContent
        }}
        closeLabel="Acknowledged"
      >
        <label className="flex items-center gap-2 mt-4 pt-4 border-t border-space-sparkle/20 text-caption cursor-pointer select-none">
          <input
            type="checkbox"
            checked={conditionsAcknowledged}
            onChange={(e) => setConditionsAcknowledged(e.target.checked)}
            className="h-4 w-4 accent-space-sparkle cursor-pointer"
          />
          I have read and agree to the {conditionsTitle}
        </label>
      </InfoModal>
    </motion.div>
  );
};
