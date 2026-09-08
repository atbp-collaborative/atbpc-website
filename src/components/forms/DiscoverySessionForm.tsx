'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Map } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { FormFieldRenderer, getFieldThemeStyles } from '@/components/forms/form-fields';
import { Button } from '@/components/primitives/buttons/Button';
import { MultiEntryButton } from '@/components/primitives/buttons/MultiEntryButton';
import { useFormViewport } from '@/hooks/useFormViewport';
import { 
  DiscoverySessionFormData, 
  INITIAL_DISCOVERY_DATA, 
  discoverySchema 
} from '@/lib/forms/discovery.schema';
import { submitDiscoverySession } from '@/services/api.service';

import { ClientDetailsModal } from './DiscoverySession/ClientDetailsModal';
import { ProjectDetailsModal } from './DiscoverySession/ProjectDetailsModal';
import { MeetupVenueModal } from './DiscoverySession/MeetupVenueModal';
import { CalComEmbed } from './DiscoverySession/CalComEmbed';

export const DiscoverySessionForm: React.FC = () => {
  const { isDarkMode } = useTheme();
  const isHeightConstrained = useFormViewport(680);

  const [formData, setFormData] = useState<DiscoverySessionFormData>(INITIAL_DISCOVERY_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

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

  const handleBookingSuccess = async (calData: any) => {
    setIsSubmitting(true);
    try {
      // Merge cal.com date into our formData
      const submissionData = {
        ...formData,
        date: calData.data?.date || '',
        startTime: calData.data?.startTime || '',
        endTime: calData.data?.endTime || '',
        calBookingId: calData.data?.uid
      };
      
      await submitDiscoverySession(submissionData);
      setIsSubmitted(true);
      localStorage.removeItem('discovery-session-form');
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
      localStorage.removeItem('discovery-session-form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_DISCOVERY_DATA);
    setIsSubmitted(false);
    localStorage.removeItem('discovery-session-form');
  };

  const fieldStyles = getFieldThemeStyles('neutral', isDarkMode);
  const inputBorderClass = fieldStyles.borderColor;

  // Safe parse to check if form is ready for calendar embed
  const validationResult = discoverySchema.safeParse(formData);
  const isProjectDetailsReady = !!formData.projectCategory && !!formData.projectType;
  const isFormReady = validationResult.success && isProjectDetailsReady;

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
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="discovery-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0 overflow-y-auto lg:overflow-hidden px-4 sm:px-8 pb-2"
          >
            {/* LEFT COLUMN - Form & Modals */}
            <div className="w-full lg:w-1/3 flex flex-col gap-5 justify-start lg:h-full lg:overflow-y-auto pr-2">
              
              <div className="space-y-4">
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

                {formData.meetingType === 'online' && (
                  <div className="border border-space-sparkle bg-transparent p-4 rounded-xl flex flex-col justify-center text-left text-caption font-medium min-h-[90px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="font-bold mb-1">Reminders:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Online discovery sessions are conducted strictly via Microsoft Teams. A meeting link will be sent to your email.</li>
                      <li>Reminder: 30 minutes maximum only.</li>
                    </ul>
                  </div>
                )}
                {formData.meetingType === 'meet-up' && (
                  <div className="border border-space-sparkle bg-transparent p-4 rounded-xl flex flex-col justify-center text-left text-caption font-medium min-h-[90px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="font-bold mb-1">Reminders:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Charges apply. Different rates apply within and outside Metro Manila.</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <MultiEntryButton 
                  fieldLabel="Client Details"
                  label={formData.firstName && formData.email ? "Edit Client Details" : "Add Client Details"} 
                  count={formData.firstName && formData.email ? 1 : 0} 
                  onClick={() => setIsClientModalOpen(true)} 
                  isDarkMode={isDarkMode} 
                />

                <MultiEntryButton 
                  fieldLabel="Project Details"
                  label={formData.projectCategory ? "Edit Project Details" : "Add Project Details"} 
                  count={formData.projectCategory ? 1 : 0} 
                  onClick={() => setIsProjectModalOpen(true)} 
                  isDarkMode={isDarkMode} 
                />

                {formData.meetingType === 'meet-up' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <MultiEntryButton 
                      fieldLabel="Venue Details"
                      label={formData.venue ? "Edit Venue Details" : "Add Venue Details"} 
                      count={formData.venue ? 1 : 0} 
                      onClick={() => setIsVenueModalOpen(true)} 
                      isDarkMode={isDarkMode} 
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Cal.com Embed */}
            <div className="w-full lg:w-2/3 flex flex-col lg:h-full overflow-y-auto no-scrollbar pl-0 lg:pl-4 border-t lg:border-t-0 border-space-sparkle/10 pt-6 lg:pt-0 min-h-[700px] lg:min-h-0">
              {!isFormReady ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 min-h-[400px]">
                  <Map size={48} className="mb-4 text-space-sparkle opacity-50" />
                  <p className="text-body text-center max-w-sm">Please complete all required fields (Client Details, Project Details, Venue) to load the booking calendar.</p>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <label className="text-caption font-semibold block opacity-90 w-full mb-0.5 text-vintage-charcoal dark:text-bright-gray">Date & Time</label>
                    <p className="text-micro font-medium opacity-60">Powered by Cal.com</p>
                  </div>
                  <div className="relative min-h-[700px] h-fit mb-4 w-full">
                    {isSubmitting && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-space-sparkle border-t-transparent"></div>
                      </div>
                    )}
                    <CalComEmbed 
                      formData={formData} 
                      onBookingSuccess={handleBookingSuccess} 
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`my-auto p-8 rounded-2xl border text-center space-y-4 max-w-md mx-auto ${inputBorderClass}`}
          >
            <CheckCircle size={40} className="mx-auto text-space-sparkle animate-bounce" />
            <h2 className="text-h2 font-bold tracking-tight">Session Scheduled!</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              Thank you for scheduling a discovery session. We've sent a calendar invitation and meeting details to your email address.
            </p>
            <button
              onClick={resetForm}
              className={`py-2 px-6 rounded-xl border text-caption font-semibold cursor-pointer transition-colors ${inputBorderClass} ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              Book Another Session
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ClientDetailsModal 
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        isDarkMode={isDarkMode}
        formData={formData}
        handleChange={handleChange}
      />

      <ProjectDetailsModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        isDarkMode={isDarkMode}
        formData={formData}
        handleChange={handleChange}
      />

      <MeetupVenueModal 
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        isDarkMode={isDarkMode}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};
