'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Shield, Upload } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { InfoModal } from '@/components/modals/InfoModal';
import { careerPrivacyModalData } from '@/lib/modals/career-privacy';
import { getCareerPrivacyFromSupabase } from '@/services/supabase/settings.service';
import { ModalData } from '@/lib/modals/types';
import { FormFieldRenderer, getFieldThemeStyles } from '@/components/forms/form-fields';
import { CAREER_FORM_FIELDS, CAREER_FORM_INITIAL_DATA, CAREER_FORM_REQUIRED_FIELDS, CareerFormData, CareerFormType, STRUCTURE_DESCRIPTIONS, getRequiredDocumentFields, getDocumentFieldsForStructure, isAddressComplete, isEmergencyContactComplete } from '@/lib/forms/career.schema';
import { submitCareerApplication } from '@/services/api.service';
import { Button } from '@/components/primitives/buttons/Button';
import { useFormViewport } from '@/hooks/useFormViewport';
import { MultiEntryButton } from '@/components/primitives/buttons/MultiEntryButton';
import { EmergencyContactModal } from '@/components/modals/EmergencyContactModal';
import { DocumentsModal } from '@/components/modals/DocumentsModal';
import { FacultyContactModal } from '@/components/modals/FacultyContactModal';
import { Role, RoleTrack } from '@/types';
import {
  getPublicRolesFromSupabase,
  DEPARTMENT_FRONTEND_LABELS,
  DEPARTMENT_KEYS,
} from '@/services/supabase/roles.service';

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
  const [privacyData, setPrivacyData] = useState<ModalData>(careerPrivacyModalData.contents);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    getCareerPrivacyFromSupabase().then((data) => {
      if (mounted && data) {
        setPrivacyData({
          title: data.title || careerPrivacyModalData.contents.title,
          subtitle: data.subtitle || careerPrivacyModalData.contents.subtitle,
          icon: Shield,
          effectiveDate: data.effectiveDate,
          bodyHtml: data.bodyHtml,
          items: data.items,
          closeLabel: data.closeLabel || 'Confirm',
        });
      }
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showFacultyContactModal, setShowFacultyContactModal] = useState(false);
  const isHeightConstrained = useFormViewport(680);

  // Studio roles fetched from Supabase (with instant memory cache)
  const [roles, setRoles] = useState<Role[]>([]);

  React.useEffect(() => {
    let mounted = true;
    getPublicRolesFromSupabase()
      .then((data) => {
        if (mounted && data) {
          setRoles(data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load public roles from Supabase:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Department options sourced from Supabase categories with frontend-only display formatting
  const departmentOptions = React.useMemo(() => {
    const presentCategories = new Set(roles.map((r) => r.category));
    const activeCategories = DEPARTMENT_KEYS.filter(
      (cat) => presentCategories.size === 0 || presentCategories.has(cat)
    );
    return activeCategories.map((cat) => ({
      value: cat,
      label: DEPARTMENT_FRONTEND_LABELS[cat] || cat,
    }));
  }, [roles]);

  const leftColumnTop = React.useMemo(() => {
    return fields.leftColumnTop.map((field) => {
      if (field.name === 'department' && field.type === 'select') {
        return {
          ...field,
          options: departmentOptions,
          placeholder: '[ Select Department ]',
        };
      }

      if (field.name === 'structure' && field.type === 'select') {
        const dept = formData.department;
        const targetTrack: RoleTrack =
          formType === 'apprenticeship' ? 'internship' : 'professionals';

        // Filter roles from Supabase based on:
        // 1. Department (category)
        // 2. Career Track (internship for apprenticeship-programs, professionals for regular-programs)
        const filteredRoles = roles.filter((r) => {
          const matchCategory =
            r.category === dept ||
            dept.toLowerCase().startsWith(r.category.slice(0, 4));
          const matchTrack =
            r.track === targetTrack ||
            (targetTrack === 'internship' && r.trackId !== 'PROF');
          return matchCategory && matchTrack;
        });

        const options = filteredRoles.map((r) => ({
          value: r.code ? `[${r.code}: ${r.title}]` : r.title,
          label: r.code ? `[${r.code}: ${r.title}]` : r.title,
        }));

        return {
          ...field,
          label: 'Role',
          options,
          placeholder: dept ? '[ Select Role ]' : '[ Select a Department First ]',
          disabled: !dept,
        };
      }
      return field;
    });
  }, [fields.leftColumnTop, formType, formData.department, departmentOptions, roles]);

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
      emergencyContactPerson: {
        name,
        relationship,
        number,
        landline,
        email,
        sameAsApplicant,
        address,
      }
    }));
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };

      if (name === 'department') {
        nextData.structure = '';
        nextData.jobDescription = '';
        // Clear all document file fields when department changes
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

      if (name === 'structure') {
        // Clear all document file fields when role changes
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

        // Auto-populate jobDescription from Supabase role description
        const matchedRole = roles.find(
          (r) =>
            `[${r.code}: ${r.title}]` === value ||
            r.title === value ||
            r.id === value
        );
        if (matchedRole?.description) {
          nextData.jobDescription = matchedRole.description;
        } else if (STRUCTURE_DESCRIPTIONS[value]) {
          nextData.jobDescription = STRUCTURE_DESCRIPTIONS[value];
        }
      }
      return nextData;
    });
  };

  const isDocumentsComplete = () => {
    const structure = formData.structure;
    if (!structure) return false;
    const requiredList = getRequiredDocumentFields(structure);
    if (requiredList.length === 0) return false;
    return requiredList.every((fieldName) => Boolean((formData as any)[fieldName]));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = Boolean(formData.email?.trim()) && emailRegex.test(formData.email.trim());
  const isEmergencyValid = isEmergencyContactComplete(formData.emergencyContactPerson, formData.applicantAddress);
  const isApplicantAddressValid = isAddressComplete(formData.applicantAddress);

  const isFormValid =
    Boolean(formData.department) &&
    Boolean(formData.structure) &&
    Boolean(formData.firstName?.trim()) &&
    Boolean(formData.pseudonym?.trim()) &&
    Boolean(formData.lastName?.trim()) &&
    Boolean(formData.pronoun?.trim()) &&
    Boolean(formData.contactNumber?.trim()) &&
    isEmailValid &&
    Boolean(formData.portfolioLink?.trim()) &&
    Boolean(formData.coverVideoLink?.trim()) &&
    isApplicantAddressValid &&
    isEmergencyValid &&
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
      <Button type="revolving"
        htmlType="submit"
        disabled={isSubmitting || !canSubmit}
        active={!privacyAcknowledged}
        title={!privacyAcknowledged ? 'Acknowledge the Privacy Statement to continue' : !isFormValid ? 'Fill in all required fields to continue' : undefined}
        className={`w-full !bg-space-sparkle !text-bright-gray border-none min-w-0 ${isTop ? '!text-[1.75vw] lg:!text-caption whitespace-nowrap truncate' : ''}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </div>
  );

  return (
    <div
      className="w-full max-w-7xl flex-1 min-h-0 max-h-[calc(100vh-80px)] mx-auto overflow-hidden flex flex-col py-3 select-none"
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
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto no-scrollbar lg:overflow-hidden px-4 sm:px-8 pb-2"
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
              <div className={`grid grid-cols-1 ${formData.structure.includes('INT-CHED') || formData.structure.includes('Curriculum-based') ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3 pt-1`}>
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

                    const isCurriculumBased = formData.structure.includes('INT-CHED') || formData.structure.includes('Curriculum-based');
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
            <div className="w-full lg:w-1/2 flex flex-col justify-between gap-2.5 lg:gap-2 lg:h-full lg:overflow-y-auto no-scrollbar lg:pr-2">
              <div className="flex flex-col gap-2.5 lg:gap-2">
                {fields.rightColumnRows.map((row, idx) => (
                  <div key={idx} className={row.length > 1 ? 'grid grid-cols-1 sm:grid-cols-4 gap-3' : ''}>
                    {row.map((field) => {
                      if (field.name === 'emergencyContact') {
                        const isEmergencyValid = isEmergencyContactComplete(formData.emergencyContactPerson, formData.applicantAddress);
                        const hasEmergencyData = Boolean(formData.emergencyContactPerson?.name || formData.emergencyContactPerson?.number);
                        return (
                          <div key={field.name} className={field.wrapperClassName}>
                            <MultiEntryButton
                              fieldLabel="Emergency Contact"
                              label={hasEmergencyData ? "Edit Contact" : "Add Contact"}
                              count={isEmergencyValid ? 1 : 0}
                              showCheck={isEmergencyValid}
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
        data={privacyData}
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
        initialName={formData.emergencyContactPerson?.name || ''}
        initialRelationship={formData.emergencyContactPerson?.relationship || ''}
        initialNumber={formData.emergencyContactPerson?.number || ''}
        initialLandline={formData.emergencyContactPerson?.landline || ''}
        initialEmail={formData.emergencyContactPerson?.email || ''}
        initialSameAsApplicant={formData.emergencyContactPerson?.sameAsApplicant ?? true}
        initialAddress={formData.emergencyContactPerson?.address}
        applicantAddress={formData.applicantAddress}
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
        onSave={(contacts: any) => setFormData(prev => ({ ...prev, facultyContacts: contacts }))}
        initialContacts={formData.facultyContacts}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
