'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { FormFieldRenderer, getFieldThemeStyles } from '@/components/forms/form-fields';
import { RevolvingButton } from '@/components/primitives/RevolvingButton';
import { useFormViewport } from '@/hooks/useFormViewport';
import { EMPTY_PH_ADDRESS, PhAddress } from '@/components/forms/form-fields/types';
import { FieldConfig } from '@/components/forms/form-fields/types';

export interface DiscoverySessionFormData {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: PhAddress;
  clientAddress: PhAddress;
  meetingType: 'meet-up' | 'online' | '';
  venue: string;
  location: { lat: number; lng: number; address?: string } | null;
  date: string;
  startTime: string;
  endTime: string;
}

const INITIAL_DATA: DiscoverySessionFormData = {
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  address: EMPTY_PH_ADDRESS,
  clientAddress: EMPTY_PH_ADDRESS,
  meetingType: '',
  venue: '',
  location: null,
  date: '',
  startTime: '',
  endTime: '',
};

export const DiscoverySessionForm: React.FC = () => {
  const { isDarkMode } = useTheme();
  const isHeightConstrained = useFormViewport(680);

  const [formData, setFormData] = useState<DiscoverySessionFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('discovery-session-form');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('discovery-session-form', JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.contactNumber &&
    formData.address.regionCode &&
    formData.clientAddress.regionCode &&
    formData.clientAddress.cityCode &&
    formData.meetingType &&
    (formData.meetingType === 'online' || (formData.location && formData.venue)) &&
    formData.date &&
    formData.startTime &&
    formData.endTime;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      localStorage.removeItem('discovery-session-form');
    }, 1200);
  };

  const resetForm = () => {
    setFormData(INITIAL_DATA);
    setIsSubmitted(false);
    localStorage.removeItem('discovery-session-form');
  };

  const fieldStyles = getFieldThemeStyles('neutral', isDarkMode);
  const inputBorderClass = fieldStyles.borderColor;

  const leftFields: FieldConfig[] = [
    { type: 'text', name: 'firstName', label: 'Given Name', required: true },
    { type: 'text', name: 'middleName', label: 'Middle Name' },
    { type: 'text', name: 'lastName', label: 'Last Name', required: true },
    { type: 'text', name: 'title', label: 'Title / Suffix / Prefix', placeholder: 'e.g. Mr., Ms., Dr., Jr.' },
    { type: 'tel', name: 'contactNumber', label: 'Contact No.', required: true },
    { type: 'email', name: 'email', label: 'Email Address', required: true },
  ];

  const ActionButtons = ({ isTop }: { isTop?: boolean }) => (
    <div className={`grid grid-cols-1 gap-4 w-full ${isTop ? 'md:w-[50%] md:ml-auto' : ''}`}>
      <RevolvingButton
        type="submit"
        disabled={isSubmitting || !isFormValid}
        active={true}
        title={!isFormValid ? 'Fill in all required fields to continue' : undefined}
        className={`w-full !bg-space-sparkle !text-bright-gray border-none min-w-0 ${isTop ? '!text-[1.75vw] lg:!text-caption whitespace-nowrap truncate' : ''}`}
      >
        {isSubmitting ? 'Submitting...' : 'Schedule Session'}
      </RevolvingButton>
    </div>
  );

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <div className="w-full flex-1 min-h-0 max-h-[calc(100vh-80px)] mx-auto overflow-hidden flex flex-col py-3 select-none">
      {/* Title Header */}
      <div className="mb-3 lg:mb-2 shrink-0 flex flex-col md:flex-row md:justify-between md:items-start gap-4 px-4 sm:px-8">
        <div>
          <h1 className="font-sans text-h1 font-bold tracking-tight leading-none lowercase">
            schedule a discovery session
          </h1>
          <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
            for project intake, site feasibility & spatial planning consultations
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
            key="discovery-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden px-4 sm:px-8 pb-2"
          >
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:gap-2 justify-start lg:h-full lg:overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-2">
                {leftFields.map((field) => (
                  <div key={field.name}>
                    <FormFieldRenderer
                      config={field}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <FormFieldRenderer
                  config={{ type: 'address', name: 'address', label: 'Project Site Address', required: true }}
                  value={formData.address}
                  onChange={handleChange}
                  isDarkMode={isDarkMode}
                  theme="neutral"
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col justify-start gap-2.5 lg:gap-2 lg:h-full lg:overflow-y-auto lg:pr-2">
              <div className="flex flex-col gap-3 lg:gap-2">
                <div className="pb-1">
                  <FormFieldRenderer
                    config={{ type: 'address', name: 'clientAddress', label: 'Client Address', badge: '!', variant: 'city-region-only' } as any}
                    value={formData.clientAddress}
                    onChange={handleChange}
                    isDarkMode={isDarkMode}
                    theme="neutral"
                  />
                </div>
                <FormFieldRenderer
                  config={{
                    type: 'select',
                    name: 'meetingType',
                    label: 'Meeting Type',
                    placeholder: '[ Select Meeting Type ]',
                    options: [
                      { value: 'meet-up', label: 'Meet-up' },
                      { value: 'online', label: 'Online' }
                    ],
                    required: true
                  }}
                  value={formData.meetingType}
                  onChange={handleChange}
                  isDarkMode={isDarkMode}
                  theme="neutral"
                />

                {formData.meetingType === 'meet-up' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                    <div className="p-4 border rounded-xl bg-space-sparkle/5 border-space-sparkle/20 flex flex-col justify-center">
                      <span className="text-body font-bold text-space-sparkle mb-1">Meet-up Reminder</span>
                      <p className="text-caption opacity-80 leading-relaxed">
                        Charges apply. Different rates apply within and outside Metro Manila.
                      </p>
                    </div>
                    <FormFieldRenderer
                      config={{ type: 'text', name: 'venue', label: 'Venue', placeholder: 'Enter venue name or address', required: true }}
                      value={formData.venue}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                    <FormFieldRenderer
                      config={{ type: 'map-pin', name: 'location', label: 'Location', required: true, note: 'Please pin your preferred meeting location' }}
                      value={formData.location}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  </div>
                )}

                {formData.meetingType === 'online' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-4 border rounded-xl bg-space-sparkle/5 border-space-sparkle/20 flex flex-col justify-center min-h-[90px]">
                    <span className="text-body font-bold text-space-sparkle mb-1">Online Meeting Platform</span>
                    <p className="text-caption opacity-80 leading-relaxed">
                      Please note that all online discovery sessions are conducted strictly via Microsoft Teams. A meeting link will be sent to your email address once scheduled.
                      <br /><br />
                      <strong>Reminder:</strong> 30 minutes maximum only.
                    </p>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  <FormFieldRenderer
                    config={{ type: 'date', name: 'date', label: 'Date', required: true } as any}
                    value={formData.date}
                    onChange={handleChange}
                    isDarkMode={isDarkMode}
                    theme="neutral"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormFieldRenderer
                      config={{ type: 'time', name: 'startTime', label: 'Start Time', required: true } as any}
                      value={formData.startTime}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                    <FormFieldRenderer
                      config={{ type: 'time', name: 'endTime', label: 'End Time', required: true } as any}
                      value={formData.endTime}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`mt-2 md:mt-8 lg:mt-0 pt-2 md:pt-1 lg:pt-1 ${isHeightConstrained ? 'md:hidden' : ''}`}>
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
            <h2 className="text-h2 font-bold tracking-tight">Session Request Received</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              Thank you for scheduling a discovery session with us. We will review your request and contact you shortly to confirm the appointment.
            </p>
            <button
              onClick={resetForm}
              className={`py-2 px-6 rounded-xl border text-caption font-semibold cursor-pointer ${inputBorderClass}`}
            >
              Schedule Another Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
