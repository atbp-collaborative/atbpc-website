'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Shield, X } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { InfoModal } from '@/components/modals/InfoModal';
import { FormFieldRenderer } from '@/components/forms/form-fields';
import { MultiEntryButton } from '@/components/primitives/MultiEntryButton';
import { MultiAddressModal } from '@/components/modals/MultiAddressModal';
import { MultiEmailModal } from '@/components/modals/MultiEmailModal';
import { MultiContactModal } from '@/components/modals/MultiContactModal';
import { MultiRegistrationModal } from '@/components/modals/MultiRegistrationModal';
import { getPartnerFormFields, PARTNER_FORM_INITIAL_DATA, PartnerFormData, PartnerFormVariant } from '@/lib/forms/partner';
import { useFormViewport } from '@/hooks/useFormViewport';

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
  const [isModalCheckboxChecked, setIsModalCheckboxChecked] = useState(false);
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const isHeightConstrained = useFormViewport(680);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Boolean(
    formData.companyName &&
    (!categories || formData.category) &&
    (!specialties || formData.specialty) &&
    (!typologies || formData.typology) &&
    formData.contacts.length > 0 &&
    formData.contacts[0].number &&
    formData.addresses.length > 0 && 
    formData.addresses[0].regionCode &&
    formData.addresses[0].cityCode &&
    formData.addresses[0].barangayCode &&
    formData.addresses[0].type &&
    formData.emails.length > 0 &&
    formData.emails[0].email
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

  const ActionButtons = ({ isTop }: { isTop?: boolean }) => (
    <div className={`grid grid-cols-2 gap-4 w-full ${isTop ? 'md:w-[75%] md:ml-auto' : ''}`}>
      <div className="relative">
        {!conditionsAcknowledged && (
          <div className="absolute inset-0 rounded-xl animate-glow-pulse" />
        )}
        <button
          type="button"
          onClick={() => setShowConditionsModal(true)}
          className={`relative z-10 w-full h-full py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass}`}
        >
          General Conditions
        </button>
      </div>
      <div className="relative">
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          title={!conditionsAcknowledged ? 'Acknowledge the General Conditions to continue' : !isFormValid ? 'Fill in all required fields to continue' : undefined}
          className={`relative z-10 w-full py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50 ${inputBorderClass} !bg-space-sparkle !text-bright-gray border-none`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      key="partner-application-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full max-h-[calc(100vh-80px)] mx-auto overflow-hidden flex flex-col py-3 select-none"
    >
      <div className="mb-3 shrink-0 flex flex-col md:flex-row md:justify-between md:items-start gap-4 px-4 sm:px-8">
        <div>
          <h1 className="font-sans text-h1 font-bold tracking-tight leading-none lowercase">
            {title}
          </h1>
          <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
            {subtitle}
          </p>
        </div>
        {isHeightConstrained && !isSubmitted && (
          <div className="hidden md:block w-full md:w-[45%] shrink-0">
            <ActionButtons isTop />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="application-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden px-4 sm:px-8 pb-2"
          >
            {/* LEFT COLUMN */}
            <div className={`w-full lg:w-1/2 flex flex-col ${variant === 'supplier' ? 'gap-3' : 'gap-2.5'} justify-between`}>
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
                <div className={`grid ${variant === 'supplier' ? 'grid-cols-1 sm:grid-cols-3 gap-3' : 'grid-cols-1 sm:grid-cols-4 gap-2.5'} pt-1`}>
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
            <div className="w-full lg:w-1/2 flex flex-col gap-2.5 justify-between">
              {fields.rightColumnRowsTop.map((row, idx) => (
                <div key={idx} className={row.length > 1 ? 'grid grid-cols-1 sm:grid-cols-4 gap-3' : ''}>
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

              <div className="flex flex-col gap-2.5 justify-between flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MultiEntryButton 
                    fieldLabel="Address"
                    label="Add Address/es" 
                    count={formData.addresses[0]?.type ? formData.addresses.length : 0} 
                    onClick={() => setShowAddressModal(true)} 
                    isDarkMode={isDarkMode} 
                  />
                  <MultiEntryButton 
                    fieldLabel="Email"
                    label="Add Email/s" 
                    count={formData.emails[0]?.email ? formData.emails.length : 0} 
                    onClick={() => setShowEmailModal(true)} 
                    isDarkMode={isDarkMode} 
                  />
                </div>

                {variant !== 'supplier' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col justify-end">
                        <MultiEntryButton 
                          fieldLabel="Contact Numbers"
                          label="Add Contact Number/s" 
                          count={formData.contacts[0]?.number ? formData.contacts.length : 0} 
                          onClick={() => setShowContactModal(true)} 
                          isDarkMode={isDarkMode} 
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <MultiEntryButton
                          fieldLabel="Documents"
                          label="Registrations"
                          count={(formData.secRegistration ? 1 : 0) + (formData.birRegistration ? 1 : 0) + (formData.dtiRegistration ? 1 : 0)}
                          onClick={() => setShowRegistrationsModal(true)}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormFieldRenderer
                        config={{ type: 'text', name: 'licenseLink', label: variant === 'builder' ? 'PCAB License' : 'PRC / PTR License', badge: '!' }}
                        value={formData.licenseLink}
                        onChange={handleFieldChange}
                        isDarkMode={isDarkMode}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormFieldRenderer
                          config={{ type: 'text', name: 'facebook', label: 'Facebook', placeholder: 'Paste URL / Link / Handle' }}
                          value={formData.facebook}
                          onChange={handleFieldChange}
                          isDarkMode={isDarkMode}
                        />
                        <FormFieldRenderer
                          config={{ type: 'text', name: 'instagram', label: 'Instagram', placeholder: 'Paste URL / Link / Handle' }}
                          value={formData.instagram}
                          onChange={handleFieldChange}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col justify-end">
                        <MultiEntryButton 
                          fieldLabel="Contact Numbers"
                          label="Add Contact Number/s" 
                          count={formData.contacts[0]?.number ? formData.contacts.length : 0} 
                          onClick={() => setShowContactModal(true)} 
                          isDarkMode={isDarkMode} 
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <MultiEntryButton
                          fieldLabel="Documents"
                          label="Registrations"
                          count={(formData.secRegistration ? 1 : 0) + (formData.birRegistration ? 1 : 0) + (formData.dtiRegistration ? 1 : 0)}
                          onClick={() => setShowRegistrationsModal(true)}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormFieldRenderer
                        config={{ type: 'text', name: 'facebook', label: 'Facebook', placeholder: 'URL/Handle' }}
                        value={formData.facebook}
                        onChange={handleFieldChange}
                        isDarkMode={isDarkMode}
                      />
                      <FormFieldRenderer
                        config={{ type: 'text', name: 'instagram', label: 'Instagram', placeholder: 'URL/Handle' }}
                        value={formData.instagram}
                        onChange={handleFieldChange}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className={`sticky bottom-0 z-20 pb-4 pt-4 -mx-4 px-4 sm:-mx-8 sm:px-8 md:pt-2 md:pb-0 md:static md:bg-transparent md:dark:bg-transparent md:mx-0 md:px-0 ${isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'} ${isHeightConstrained ? 'md:hidden' : ''}`}>
                <ActionButtons />
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
        onConfirm={() => {
          setConditionsAcknowledged(true);
          setShowConditionsModal(false);
        }}
        isCloseDisabled={!isModalCheckboxChecked}
        closeLabel="Confirm"
        isDarkMode={isDarkMode}
        data={{
          title: conditionsTitle,
          subtitle: 'ATBP Collaborative',
          icon: Shield as any,
          items: conditionsContent
        }}
      >
        <label className="flex items-center gap-2 mt-4 pt-4 border-t border-space-sparkle/20 text-caption cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isModalCheckboxChecked}
            onChange={(e) => setIsModalCheckboxChecked(e.target.checked)}
            className="h-4 w-4 accent-space-sparkle cursor-pointer"
          />
          I have read and agree to the {conditionsTitle}
        </label>
      </InfoModal>

      <MultiAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        initialAddresses={formData.addresses}
        onSave={(addresses) => setFormData(prev => ({ ...prev, addresses }))}
        isDarkMode={isDarkMode}
      />

      <MultiEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        initialEmails={formData.emails}
        onSave={(emails) => setFormData(prev => ({ ...prev, emails }))}
        isDarkMode={isDarkMode}
      />

      <MultiContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        initialContacts={formData.contacts}
        onSave={(contacts) => setFormData(prev => ({ ...prev, contacts }))}
        isDarkMode={isDarkMode}
      />

      <MultiRegistrationModal
        isOpen={showRegistrationsModal}
        onClose={() => setShowRegistrationsModal(false)}
        initialRegistrations={{
          secRegistration: formData.secRegistration,
          birRegistration: formData.birRegistration,
          dtiRegistration: formData.dtiRegistration,
        }}
        onSave={(regs) => setFormData(prev => ({ ...prev, ...regs }))}
        isDarkMode={isDarkMode}
      />
    </motion.div>
  );
};
