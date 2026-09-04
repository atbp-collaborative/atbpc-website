'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Shield, Upload } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { InfoModal } from '@/components/modals/InfoModal';
import { careerPrivacyModalData } from '@/lib/modals/career-privacy';
import { FormFieldRenderer, getFieldThemeStyles } from '@/components/forms/form-fields';
import { CAREER_FORM_FIELDS, CAREER_FORM_INITIAL_DATA, CAREER_FORM_REQUIRED_FIELDS, CareerFormData, CareerFormType, STRUCTURE_DESCRIPTIONS, getRequiredDocumentFields, getDocumentFieldsForStructure } from '@/lib/forms/career';
import { submitCareerApplication } from '@/lib/services/career-applications';
import { RevolvingButton } from '@/components/primitives/RevolvingButton';
import { useFormViewport } from '@/hooks/useFormViewport';
import { MultiEntryButton } from '@/components/primitives/MultiEntryButton';
import { EmergencyContactModal } from '@/components/modals/EmergencyContactModal';
import { DocumentsModal } from '@/components/modals/DocumentsModal';
import { FacultyContactModal } from '@/components/modals/FacultyContactModal';

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
  const [isModalCheckboxChecked, setIsModalCheckboxChecked] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showFacultyContactModal, setShowFacultyContactModal] = useState(false);
  const isHeightConstrained = useFormViewport(680);

  const leftColumnTop = React.useMemo(() => {
    return fields.leftColumnTop.map((field) => {
      if (field.name === 'structure' && field.type === 'select') {
        const dept = formData.department;
        let options = field.options;
        
        if (formType === 'studioRegulars') {
          if (dept === "Admin Team (Finance, Marketing, Coordination)") {
            options = [
              "[HROA-02: Administrative Assistant]",
              "[HROA-03: Administrative Officer]",
              "[HROA-04: Associate Administrator]"
            ];
          } else if (dept === "Production Team (Design & Technical)") {
            options = [
              "[HRDT-03: Junior Architect]",
              "[HRDT-05: Junior Designer]",
              "[HRDT-06: Junior Engineer]",
              "[HRDT-07: Senior Architect]",
              "[HRDT-08: Senior Designer]",
              "[HRDT-09: Senior Engineer]",
              "[HRDT-10: Project Manager]"
            ];
          } else if (dept === "Construction Team (Supervision, Manpower)") {
            options = [
              "[HRGM-01: Helper]",
              "[HRGM-02: General Specialist]",
              "[HRGM-03: Skilled Specialist]",
              "[HRGM-04: Skilled Operator]",
              "[HRGM-05: Site Foreman]",
              "[HRGM-06: Construction Manager]"
            ];
          }
        }

        return {
          ...field,
          options,
          placeholder: dept ? (formType === 'studioRegulars' ? "[ Select Role ]" : field.placeholder) : "Please select a department first",
          disabled: !dept,
        };
      }
      return field;
    });
  }, [fields.leftColumnTop, formType, formData.department]);

  const handleSaveEmergencyContact = (
    name: string,
    relationship: string,
    number: string,
    landline: string,
    email: string,
    sameAsApplicant: boolean,
    address: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContactName: name,
      emergencyContactRelationship: relationship,
      emergencyContactNumber: number,
      emergencyContactLandline: landline,
      emergencyContactEmail: email,
      emergencyContactSameAsApplicant: sameAsApplicant,
      emergencyContactAddress: address,
    }));
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      if (formType === 'apprenticeship' && name === 'structure') {
        nextData.jobDescription = STRUCTURE_DESCRIPTIONS[value] || '';
      }
      if (formType === 'studioRegulars' && name === 'department') {
        nextData.structure = '';
      }
      if (name === 'structure') {
        // Clear all document file fields when structure changes
        nextData.resumeFile = null;
        nextData.ojtRequirementsFile = null;
        nextData.moaFile = null;
        nextData.contractFile = null;
        nextData.enrolmentFormFile = null;
        nextData.schoolIdFile = null;
        nextData.clearanceFile = null;
        nextData.diplomaFile = null;
        nextData.prcIdFile = null;
        nextData.validIdFile = null;
        nextData.tinIdFile = null;
      }
      return nextData;
    });
  };

  const isDocumentsComplete = () => {
    const structure = formData.structure;
    if (!structure) return false;
    
    if (
      structure === "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)" ||
      structure === "Vocational Internship (National Certificate Holder)"
    ) {
      return Boolean(
        formData.resumeFile &&
        formData.ojtRequirementsFile &&
        formData.moaFile &&
        formData.contractFile &&
        formData.enrolmentFormFile &&
        formData.schoolIdFile
      );
    } else if (structure === "Diversified Architectural Experience (3,840 logbook hours)") {
      return Boolean(
        formData.resumeFile &&
        formData.clearanceFile &&
        formData.diplomaFile
      );
    } else {
      // Regular
      return Boolean(
        formData.resumeFile &&
        formData.validIdFile &&
        formData.tinIdFile
      );
    }
  };

  const isFormValid =
    CAREER_FORM_REQUIRED_FIELDS.every((field) => Boolean(formData[field])) &&
    Boolean(formData.address.regionCode && formData.address.cityCode && formData.address.barangayCode) &&
    isDocumentsComplete();
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

  const fieldStyles = getFieldThemeStyles('neutral', isDarkMode);
  const inputBorderClass = fieldStyles.borderColor;

  const ActionButtons = ({ isTop }: { isTop?: boolean }) => (
    <div className={`grid grid-cols-2 gap-4 w-full ${isTop ? 'md:w-[75%] md:ml-auto' : ''}`}>
      <div className="relative min-w-0">
        {!privacyAcknowledged && (
          <div className="absolute inset-0 rounded-xl animate-glow-pulse" />
        )}
        <button
          type="button"
          onClick={() => setShowPrivacyModal(true)}
          className={`relative z-10 w-full h-full py-2 px-4 rounded-xl border font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass} ${isTop ? 'text-[1.75vw] lg:text-caption whitespace-nowrap truncate' : 'text-caption'}`}
        >
          Privacy Statement
        </button>
      </div>
      <RevolvingButton
        type="submit"
        disabled={isSubmitting || !canSubmit}
        active={!privacyAcknowledged}
        title={!privacyAcknowledged ? 'Acknowledge the Privacy Statement to continue' : !isFormValid ? 'Fill in all required fields to continue' : undefined}
        className={`w-full !bg-space-sparkle !text-bright-gray border-none min-w-0 ${isTop ? '!text-[1.75vw] lg:!text-caption whitespace-nowrap truncate' : ''}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </RevolvingButton>
    </div>
  );

  return (
    <div
      className="w-full flex-1 min-h-0 max-h-[calc(100vh-80px)] mx-auto overflow-hidden flex flex-col py-3 select-none"
    >
      {/* Title Header */}
      <div className="mb-3 lg:mb-2 shrink-0 flex flex-col md:flex-row md:justify-between md:items-start gap-4 px-4 sm:px-8">
        <div>
          <h1 className="font-sans text-h1 font-bold tracking-tight leading-none lowercase">
            grow with us
          </h1>
          <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
            are you currently in search of a practice that could support your future?
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
            key="grow-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden px-4 sm:px-8 pb-2"
          >
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:gap-2 justify-between lg:h-full lg:overflow-hidden">
              {leftColumnTop.map((field) => (
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

              {/* Bottom Row: Resume (replaced by Documents), Portfolio, Cover Video */}
              <div className={`grid grid-cols-1 ${formData.structure === "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)" ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3 pt-1`}>
                {fields.uploadRow.map((field) => {
                  if (field.name === 'resumeFile') {
                    const requiredList = getRequiredDocumentFields(formData.structure);
                    const isRoleSelected = Boolean(formData.structure);
                    
                    let uploadedCount = 0;
                    if (formData.structure) {
                      const allDocs = getDocumentFieldsForStructure(formData.structure);
                      allDocs.forEach((f) => {
                        if ((formData as any)[f.name]) {
                          uploadedCount++;
                        }
                      });
                    }

                    const isCurriculumBased = formData.structure === "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)";
                    const facultyFilled =
                      formData.facultyContacts.dean.name &&
                      formData.facultyContacts.chairperson.name &&
                      formData.facultyContacts.ojtInstructor.name &&
                      formData.facultyContacts.guidanceOfficer.name &&
                      formData.facultyContacts.disciplineOfficer.name;

                    return (
                      <React.Fragment key={field.name}>
                        <div className="space-y-1">
                          <label className={`${fieldStyles.label} truncate`}>
                            Documents
                            <span className="text-space-sparkle font-normal"> (!)</span>
                          </label>
                          <button
                            type="button"
                            disabled={!isRoleSelected}
                            onClick={() => setShowDocumentsModal(true)}
                            title={!isRoleSelected ? 'Please select a Role first' : undefined}
                            className={`w-full h-20 p-2 flex flex-col justify-center text-center border rounded-xl cursor-pointer transition-all ${
                              !isRoleSelected
                                ? 'opacity-50 cursor-not-allowed border-gray-300'
                                : isDocumentsComplete()
                                  ? 'border-space-sparkle bg-space-sparkle/5 text-space-sparkle hover:bg-space-sparkle/10'
                                  : fieldStyles.borderColor + ' hover:opacity-80 !bg-white/80 dark:!bg-white/10'
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center space-y-1 w-full">
                              {isDocumentsComplete() ? (
                                <CheckCircle size={16} className="text-space-sparkle mx-auto shrink-0" />
                              ) : (
                                <Upload size={14} className="opacity-70 mx-auto shrink-0" />
                              )}
                              <p className="text-micro font-archivo leading-tight font-medium opacity-80">
                                {!isRoleSelected
                                  ? 'Select a role first'
                                  : isDocumentsComplete()
                                    ? 'All Documents Attached'
                                    : uploadedCount > 0
                                      ? `${uploadedCount} Document(s) Added`
                                      : 'Add Documents'}
                              </p>
                              {isRoleSelected && (
                                <span className="text-micro font-archivo opacity-60 block">
                                  ({isDocumentsComplete() ? 'Complete' : `${uploadedCount} / ${requiredList.length} files`})
                                </span>
                              )}
                            </div>
                          </button>
                        </div>
                        {isCurriculumBased && (
                          <div className="space-y-1">
                            <label className={`${fieldStyles.label} truncate`}>
                              Faculty Contact
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowFacultyContactModal(true)}
                              className={`w-full h-20 p-2 flex flex-col justify-center text-center border rounded-xl cursor-pointer transition-all ${
                                facultyFilled
                                  ? 'border-space-sparkle bg-space-sparkle/5 text-space-sparkle hover:bg-space-sparkle/10'
                                  : fieldStyles.borderColor + ' hover:opacity-80 !bg-white/80 dark:!bg-white/10'
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center space-y-1 w-full">
                                {facultyFilled ? (
                                  <CheckCircle size={16} className="text-space-sparkle mx-auto shrink-0" />
                                ) : (
                                  <Upload size={14} className="opacity-70 mx-auto shrink-0" />
                                )}
                                <p className="text-micro font-archivo leading-tight font-medium opacity-80">
                                  {facultyFilled ? 'Contacts Added' : 'Add Contacts'}
                                </p>
                              </div>
                            </button>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  return (
                    <FormFieldRenderer
                      key={field.name}
                      config={field}
                      value={(formData as any)[field.name]}
                      onChange={handleChange}
                      isDarkMode={isDarkMode}
                      theme="neutral"
                    />
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between gap-2.5 lg:gap-2 lg:h-full lg:overflow-y-auto lg:pr-2">
              <div className="flex flex-col gap-2.5 lg:gap-2">
                {fields.rightColumnRows.map((row, idx) => (
                  <div key={idx} className={row.length > 1 ? 'grid grid-cols-1 sm:grid-cols-4 gap-3' : ''}>
                    {row.map((field) => {
                      if (field.name === 'emergencyContact') {
                        const count = (formData.emergencyContactName && formData.emergencyContactRelationship && formData.emergencyContactNumber) ? 1 : 0;
                        return (
                          <div key={field.name} className={field.wrapperClassName}>
                            <MultiEntryButton
                              fieldLabel="Emergency Contact"
                              label="Add Contact"
                              count={count}
                              onClick={() => setShowEmergencyModal(true)}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        );
                      }
                      return (
                        <FormFieldRenderer
                          key={field.name}
                          config={field}
                          value={(formData as any)[field.name]}
                          onChange={handleChange}
                          isDarkMode={isDarkMode}
                          theme="neutral"
                        />
                      );
                    })}
                  </div>
                ))}
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
        onConfirm={() => {
          setPrivacyAcknowledged(true);
          setShowPrivacyModal(false);
        }}
        isCloseDisabled={!isModalCheckboxChecked}
        closeLabel="Confirm"
        isDarkMode={isDarkMode}
        data={careerPrivacyModalData.contents}
      >

        <label className="flex items-center gap-2 pt-1 text-caption cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isModalCheckboxChecked}
            onChange={(e) => setIsModalCheckboxChecked(e.target.checked)}
            className="h-4 w-4 accent-space-sparkle cursor-pointer"
          />
          I have read and agree to the Privacy Statement
        </label>
      </InfoModal>

      <EmergencyContactModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onSave={handleSaveEmergencyContact}
        initialName={formData.emergencyContactName || ''}
        initialRelationship={formData.emergencyContactRelationship || ''}
        initialNumber={formData.emergencyContactNumber || ''}
        initialLandline={formData.emergencyContactLandline || ''}
        initialEmail={formData.emergencyContactEmail || ''}
        initialSameAsApplicant={formData.emergencyContactSameAsApplicant ?? true}
        initialAddress={formData.emergencyContactAddress}
        isDarkMode={isDarkMode}
      />

      <DocumentsModal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        formData={formData}
        onChange={handleChange}
        isDarkMode={isDarkMode}
      />

      <FacultyContactModal
        isOpen={showFacultyContactModal}
        onClose={() => setShowFacultyContactModal(false)}
        onSave={(contacts) => setFormData(prev => ({ ...prev, facultyContacts: contacts }))}
        initialContacts={formData.facultyContacts}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
