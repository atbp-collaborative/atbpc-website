/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText,
  Phone,
  ShieldCheck,
  Scale,
  Handshake,
  Save,
  RotateCcw,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/primitives/buttons/Button';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminGeneralInfo, AdminGeneralInfoInitialData } from '@/hooks/admin/useAdminGeneralInfo';
import { useTheme } from '@/context/ThemeContext';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData } from '@/lib/modals/types';
import { CareerPrivacyData, PartnerConditionsData } from '@/types';
import {
  convertLegacySectionsToHtml,
  convertLegacyItemsToHtml,
  isFormDirty,
} from '@/lib/admin/editor-utils';
import { ContactSocialsForm } from '@/components/admin/general-info/ContactSocialsForm';
import {
  PolicyDocumentEditor,
  PolicyDocumentData,
} from '@/components/admin/general-info/PolicyDocumentEditor';

type TabKey = 'contact' | 'privacy' | 'legal' | 'career' | 'partner';
type PartnerCategory = 'builder' | 'consultant' | 'supplier';

interface AdminGeneralInfoClientProps {
  initialData?: AdminGeneralInfoInitialData;
}

function parsePrivacyToDocument(data: ModalData | null | undefined): PolicyDocumentData {
  if (!data) {
    return { title: '', subtitle: '', effectiveDate: '', bodyHtml: '' };
  }
  return {
    title: data.title || '',
    subtitle: data.subtitle || '',
    effectiveDate: data.effectiveDate || data.intro?.title || '',
    bodyHtml:
      data.bodyHtml ||
      convertLegacySectionsToHtml(data.intro?.text, data.sections),
  };
}

function parseLegalToDocument(data: ModalData | null | undefined): PolicyDocumentData {
  if (!data) {
    return { title: '', subtitle: '', effectiveDate: '', bodyHtml: '' };
  }
  return {
    title: data.title || '',
    subtitle: data.subtitle || '',
    effectiveDate: data.effectiveDate || data.intro?.title || '',
    bodyHtml:
      data.bodyHtml ||
      convertLegacySectionsToHtml(data.intro?.text, data.sections),
  };
}

function parseCareerToDocument(data: CareerPrivacyData | null | undefined): PolicyDocumentData {
  if (!data) {
    return { title: '', subtitle: '', effectiveDate: '', bodyHtml: '', badge: '' };
  }
  return {
    title: data.title || '',
    subtitle: data.subtitle || '',
    badge: data.badge || '',
    effectiveDate: data.effectiveDate || 'Effective Date: October 2026',
    bodyHtml: data.bodyHtml || convertLegacyItemsToHtml(data.items),
  };
}

export function AdminGeneralInfoClient({ initialData }: AdminGeneralInfoClientProps) {
  const { isDarkMode } = useTheme();
  const {
    contactInfo,
    privacyPolicy,
    careerPrivacy,
    partnerConditions,
    legalNotices,
    saveContact,
    savePrivacy,
    saveCareerPrivacy,
    savePartnerConditions,
    saveLegal,
    resetDefaults,
  } = useAdminGeneralInfo(initialData);

  // Tab 1: Contact & Socials, 2: Privacy Policy, 3: Legal, 4: Grow With Us Privacy, 5: Partner General Conditions
  const [activeTab, setActiveTab] = useState<TabKey>('contact');
  const [activePartnerCategory, setActivePartnerCategory] = useState<PartnerCategory>('builder');

  // Pending tab navigation state when switching away from dirty tab
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  // Reset confirmation modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Form states
  const [contactForm, setContactForm] = useState<ContactInfo | null>(
    initialData?.contactInfo ? JSON.parse(JSON.stringify(initialData.contactInfo)) : null
  );
  const [privacyForm, setPrivacyForm] = useState<PolicyDocumentData>(
    parsePrivacyToDocument(initialData?.privacyPolicy)
  );
  const [legalForm, setLegalForm] = useState<PolicyDocumentData>(
    parseLegalToDocument(initialData?.legalNotices)
  );
  const [careerForm, setCareerForm] = useState<PolicyDocumentData>(
    parseCareerToDocument(initialData?.careerPrivacy)
  );
  const [partnerForm, setPartnerForm] = useState<Record<PartnerCategory, PolicyDocumentData>>({
    builder: {
      title: initialData?.partnerConditions?.builder?.title || 'General Conditions for Builder Partnership',
      subtitle: initialData?.partnerConditions?.builder?.subtitle || 'ATBP Collaborative • Builder Accreditation',
      effectiveDate: initialData?.partnerConditions?.builder?.effectiveDate || 'Effective Date: October 2026',
      bodyHtml:
        initialData?.partnerConditions?.builder?.bodyHtml ||
        convertLegacyItemsToHtml(initialData?.partnerConditions?.builder?.items),
      badge: initialData?.partnerConditions?.builder?.badge || 'PCAB & Integrity Standards',
    },
    consultant: {
      title: initialData?.partnerConditions?.consultant?.title || 'General Conditions for Consultant Partnership',
      subtitle: initialData?.partnerConditions?.consultant?.subtitle || 'ATBP Collaborative • Consultant Accreditation',
      effectiveDate: initialData?.partnerConditions?.consultant?.effectiveDate || 'Effective Date: October 2026',
      bodyHtml:
        initialData?.partnerConditions?.consultant?.bodyHtml ||
        convertLegacyItemsToHtml(initialData?.partnerConditions?.consultant?.items),
      badge: initialData?.partnerConditions?.consultant?.badge || 'PRC / PTR Professional Standards',
    },
    supplier: {
      title: initialData?.partnerConditions?.supplier?.title || 'General Conditions for Product Qualification',
      subtitle: initialData?.partnerConditions?.supplier?.subtitle || 'ATBP Collaborative • Supplier Accreditation',
      effectiveDate: initialData?.partnerConditions?.supplier?.effectiveDate || 'Effective Date: October 2026',
      bodyHtml:
        initialData?.partnerConditions?.supplier?.bodyHtml ||
        convertLegacyItemsToHtml(initialData?.partnerConditions?.supplier?.items),
      badge: initialData?.partnerConditions?.supplier?.badge || 'Material Quality Verification',
    },
  });

  // Reference to last saved state for dirty tracking
  const initialContactRef = useRef<ContactInfo | null>(contactForm);
  const initialPrivacyRef = useRef<PolicyDocumentData>(privacyForm);
  const initialLegalRef = useRef<PolicyDocumentData>(legalForm);
  const initialCareerRef = useRef<PolicyDocumentData>(careerForm);
  const initialPartnerRef = useRef<Record<PartnerCategory, PolicyDocumentData>>(partnerForm);

  // Sync state when hook finishes loading
  useEffect(() => {
    if (contactInfo) {
      const cloned = JSON.parse(JSON.stringify(contactInfo));
      setContactForm(cloned);
      initialContactRef.current = JSON.parse(JSON.stringify(cloned));
    }
  }, [contactInfo]);

  useEffect(() => {
    if (privacyPolicy) {
      const parsed = parsePrivacyToDocument(privacyPolicy);
      setPrivacyForm(parsed);
      initialPrivacyRef.current = JSON.parse(JSON.stringify(parsed));
    }
  }, [privacyPolicy]);

  useEffect(() => {
    if (legalNotices) {
      const parsed = parseLegalToDocument(legalNotices);
      setLegalForm(parsed);
      initialLegalRef.current = JSON.parse(JSON.stringify(parsed));
    }
  }, [legalNotices]);

  useEffect(() => {
    if (careerPrivacy) {
      const parsed = parseCareerToDocument(careerPrivacy);
      setCareerForm(parsed);
      initialCareerRef.current = JSON.parse(JSON.stringify(parsed));
    }
  }, [careerPrivacy]);

  useEffect(() => {
    if (partnerConditions) {
      const parsed: Record<PartnerCategory, PolicyDocumentData> = {
        builder: {
          title: partnerConditions.builder?.title || '',
          subtitle: partnerConditions.builder?.subtitle || '',
          effectiveDate: partnerConditions.builder?.effectiveDate || 'Effective Date: October 2026',
          bodyHtml:
            partnerConditions.builder?.bodyHtml ||
            convertLegacyItemsToHtml(partnerConditions.builder?.items),
          badge: partnerConditions.builder?.badge || '',
        },
        consultant: {
          title: partnerConditions.consultant?.title || '',
          subtitle: partnerConditions.consultant?.subtitle || '',
          effectiveDate: partnerConditions.consultant?.effectiveDate || 'Effective Date: October 2026',
          bodyHtml:
            partnerConditions.consultant?.bodyHtml ||
            convertLegacyItemsToHtml(partnerConditions.consultant?.items),
          badge: partnerConditions.consultant?.badge || '',
        },
        supplier: {
          title: partnerConditions.supplier?.title || '',
          subtitle: partnerConditions.supplier?.subtitle || '',
          effectiveDate: partnerConditions.supplier?.effectiveDate || 'Effective Date: October 2026',
          bodyHtml:
            partnerConditions.supplier?.bodyHtml ||
            convertLegacyItemsToHtml(partnerConditions.supplier?.items),
          badge: partnerConditions.supplier?.badge || '',
        },
      };
      setPartnerForm(parsed);
      initialPartnerRef.current = JSON.parse(JSON.stringify(parsed));
    }
  }, [partnerConditions]);

  // Dirty state calculations per tab
  const isContactDirty = useMemo(() => {
    return isFormDirty(contactForm, initialContactRef.current);
  }, [contactForm]);

  const isPrivacyDirty = useMemo(() => {
    return isFormDirty(privacyForm, initialPrivacyRef.current);
  }, [privacyForm]);

  const isLegalDirty = useMemo(() => {
    return isFormDirty(legalForm, initialLegalRef.current);
  }, [legalForm]);

  const isCareerDirty = useMemo(() => {
    return isFormDirty(careerForm, initialCareerRef.current);
  }, [careerForm]);

  const isPartnerDirty = useMemo(() => {
    return isFormDirty(partnerForm, initialPartnerRef.current);
  }, [partnerForm]);

  const isCurrentTabDirty = useMemo(() => {
    switch (activeTab) {
      case 'contact':
        return isContactDirty;
      case 'privacy':
        return isPrivacyDirty;
      case 'legal':
        return isLegalDirty;
      case 'career':
        return isCareerDirty;
      case 'partner':
        return isPartnerDirty;
      default:
        return false;
    }
  }, [activeTab, isContactDirty, isPrivacyDirty, isLegalDirty, isCareerDirty, isPartnerDirty]);

  // Handle Tab Switching with Dirty Confirmation
  const handleTabClick = (targetTab: TabKey) => {
    if (targetTab === activeTab) return;
    if (isCurrentTabDirty) {
      setPendingTab(targetTab);
      setIsDiscardModalOpen(true);
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleDiscardAndSwitch = () => {
    // Reset dirty state of currently active tab
    if (activeTab === 'contact' && initialContactRef.current) {
      setContactForm(JSON.parse(JSON.stringify(initialContactRef.current)));
    } else if (activeTab === 'privacy') {
      setPrivacyForm(JSON.parse(JSON.stringify(initialPrivacyRef.current)));
    } else if (activeTab === 'legal') {
      setLegalForm(JSON.parse(JSON.stringify(initialLegalRef.current)));
    } else if (activeTab === 'career') {
      setCareerForm(JSON.parse(JSON.stringify(initialCareerRef.current)));
    } else if (activeTab === 'partner') {
      setPartnerForm(JSON.parse(JSON.stringify(initialPartnerRef.current)));
    }

    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setIsDiscardModalOpen(false);
  };

  // Save Handlers per Tab
  const handleSaveContact = () => {
    if (!contactForm) return;
    saveContact(contactForm);
    initialContactRef.current = JSON.parse(JSON.stringify(contactForm));
  };

  const handleSavePrivacy = () => {
    const payload: ModalData = {
      title: privacyForm.title,
      subtitle: privacyForm.subtitle,
      effectiveDate: privacyForm.effectiveDate,
      bodyHtml: privacyForm.bodyHtml,
      intro: {
        title: privacyForm.effectiveDate || '',
        text: '',
      },
    };
    savePrivacy(payload);
    initialPrivacyRef.current = JSON.parse(JSON.stringify(privacyForm));
  };

  const handleSaveLegal = () => {
    const payload: ModalData = {
      title: legalForm.title,
      subtitle: legalForm.subtitle,
      effectiveDate: legalForm.effectiveDate,
      bodyHtml: legalForm.bodyHtml,
      intro: {
        title: legalForm.effectiveDate || '',
        text: '',
      },
    };
    saveLegal(payload);
    initialLegalRef.current = JSON.parse(JSON.stringify(legalForm));
  };

  const handleSaveCareer = () => {
    const payload: CareerPrivacyData = {
      title: careerForm.title,
      subtitle: careerForm.subtitle,
      badge: careerForm.badge,
      effectiveDate: careerForm.effectiveDate,
      bodyHtml: careerForm.bodyHtml,
      items: careerForm.bodyHtml ? [careerForm.bodyHtml] : [],
      closeLabel: 'Understood',
    };
    saveCareerPrivacy(payload);
    initialCareerRef.current = JSON.parse(JSON.stringify(careerForm));
  };

  const handleSavePartner = () => {
    const payload: PartnerConditionsData = {
      builder: {
        title: partnerForm.builder.title,
        subtitle: partnerForm.builder.subtitle,
        badge: partnerForm.builder.badge,
        effectiveDate: partnerForm.builder.effectiveDate,
        bodyHtml: partnerForm.builder.bodyHtml,
        items: partnerForm.builder.bodyHtml ? [partnerForm.builder.bodyHtml] : [],
      },
      consultant: {
        title: partnerForm.consultant.title,
        subtitle: partnerForm.consultant.subtitle,
        badge: partnerForm.consultant.badge,
        effectiveDate: partnerForm.consultant.effectiveDate,
        bodyHtml: partnerForm.consultant.bodyHtml,
        items: partnerForm.consultant.bodyHtml ? [partnerForm.consultant.bodyHtml] : [],
      },
      supplier: {
        title: partnerForm.supplier.title,
        subtitle: partnerForm.supplier.subtitle,
        badge: partnerForm.supplier.badge,
        effectiveDate: partnerForm.supplier.effectiveDate,
        bodyHtml: partnerForm.supplier.bodyHtml,
        items: partnerForm.supplier.bodyHtml ? [partnerForm.supplier.bodyHtml] : [],
      },
    };
    savePartnerConditions(payload);
    initialPartnerRef.current = JSON.parse(JSON.stringify(partnerForm));
  };

  const handleSaveCurrentTab = () => {
    if (activeTab === 'contact') handleSaveContact();
    else if (activeTab === 'privacy') handleSavePrivacy();
    else if (activeTab === 'legal') handleSaveLegal();
    else if (activeTab === 'career') handleSaveCareer();
    else if (activeTab === 'partner') handleSavePartner();
  };

  // Tabs ordered exactly: Contact & Socials, Privacy Policy, Legal, Grow With Us Privacy, Partner General Conditions
  const tabs: { key: TabKey; label: string; icon: any; isDirty: boolean }[] = [
    { key: 'contact', label: 'Contact & Socials', icon: Phone, isDirty: isContactDirty },
    { key: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, isDirty: isPrivacyDirty },
    { key: 'legal', label: 'Legal', icon: Scale, isDirty: isLegalDirty },
    { key: 'career', label: 'Grow With Us Privacy', icon: FileText, isDirty: isCareerDirty },
    { key: 'partner', label: 'Partner General Conditions', icon: Handshake, isDirty: isPartnerDirty },
  ];

  const partnerTabs: { key: PartnerCategory; label: string }[] = [
    { key: 'builder', label: 'Builder Partnership' },
    { key: 'consultant', label: 'Consultant Partnership' },
    { key: 'supplier', label: 'Product Qualification' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage general info"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'General Info' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="p-2 text-micro font-mono uppercase tracking-wider opacity-60 hover:opacity-100 flex items-center gap-1 cursor-pointer"
              title="Reset all content to original defaults"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
            <Button
              type="filled"
              onClick={handleSaveCurrentTab}
              disabled={!isCurrentTabDirty}
              className={`!py-2 !px-4 text-mini font-semibold transition-all ${
                isCurrentTabDirty ? 'ring-2 ring-space-sparkle/40 animate-pulse' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <Save size={14} className="mr-1.5 inline" /> Save Changes
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        {/* Tab Selection Row in exact order */}
        <div
          className={`p-1.5 rounded-xl border flex items-center gap-1 overflow-x-auto ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {tabs.map(({ key, label, icon: Icon, isDirty }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTabClick(key)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-caption font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-space-sparkle text-white shadow-xs font-semibold'
                    : isDarkMode
                      ? 'text-bright-gray/70 hover:text-white hover:bg-white/5'
                      : 'text-vintage-charcoal/70 hover:text-black hover:bg-black/5'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {isDirty && (
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"
                    title="Unsaved changes in this tab"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Contact Information & Social Media */}
        {activeTab === 'contact' && contactForm && (
          <ContactSocialsForm
            data={contactForm}
            initialData={initialContactRef.current}
            onChange={setContactForm}
            onSave={handleSaveContact}
            onReset={() => {
              if (initialContactRef.current) {
                setContactForm(JSON.parse(JSON.stringify(initialContactRef.current)));
              }
            }}
          />
        )}

        {/* Tab 2: Privacy Policy */}
        {activeTab === 'privacy' && (
          <PolicyDocumentEditor
            heading="data privacy policy & ra 10173 compliance"
            description="Official privacy governance statements displayed on public privacy policy modals and footers."
            data={privacyForm}
            initialData={initialPrivacyRef.current}
            onChange={setPrivacyForm}
            onSave={handleSavePrivacy}
            onReset={() => setPrivacyForm(JSON.parse(JSON.stringify(initialPrivacyRef.current)))}
            saveButtonLabel="Save Privacy Policy"
          />
        )}

        {/* Tab 3: Legal & Regulatory Notices */}
        {activeTab === 'legal' && (
          <PolicyDocumentEditor
            heading="legal & regulatory notices (ra 9266)"
            description="Philippine Architecture Act (RA 9266), intellectual property copyright, and professional accreditation standards."
            data={legalForm}
            initialData={initialLegalRef.current}
            onChange={setLegalForm}
            onSave={handleSaveLegal}
            onReset={() => setLegalForm(JSON.parse(JSON.stringify(initialLegalRef.current)))}
            saveButtonLabel="Save Legal Notices"
          />
        )}

        {/* Tab 4: Grow With Us Privacy Statement */}
        {activeTab === 'career' && (
          <PolicyDocumentEditor
            heading="grow with us privacy statement"
            description="Official privacy terms and RA 10173 applicant disclosures displayed on career and internship application portals."
            data={careerForm}
            initialData={initialCareerRef.current}
            onChange={setCareerForm}
            onSave={handleSaveCareer}
            onReset={() => setCareerForm(JSON.parse(JSON.stringify(initialCareerRef.current)))}
            saveButtonLabel="Save Grow-With-Us Privacy"
            showBadgeField={true}
          />
        )}

        {/* Tab 5: Partner General Conditions */}
        {activeTab === 'partner' && (
          <div className="space-y-4">
            {/* Sub-tabs for Partner Category */}
            <div
              className={`p-1.5 rounded-xl border flex items-center gap-1 overflow-x-auto ${
                isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
              }`}
            >
              {partnerTabs.map(({ key, label }) => {
                const isSelected = activePartnerCategory === key;
                const isCategoryDirty = isFormDirty(
                  partnerForm[key],
                  initialPartnerRef.current?.[key]
                );

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePartnerCategory(key)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-micro font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-space-sparkle text-white shadow-xs font-semibold'
                        : isDarkMode
                          ? 'text-bright-gray/70 hover:text-white hover:bg-white/5'
                          : 'text-vintage-charcoal/70 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    <span>{label}</span>
                    {isCategoryDirty && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Partner Category Editor */}
            <PolicyDocumentEditor
              heading={`partner with us general conditions (${activePartnerCategory})`}
              description="Accreditation prerequisites, workmanship covenants, and qualification standards for builders, consultants, and suppliers."
              data={partnerForm[activePartnerCategory]}
              initialData={initialPartnerRef.current?.[activePartnerCategory] || null}
              onChange={(updatedCategory) =>
                setPartnerForm((prev) => ({
                  ...prev,
                  [activePartnerCategory]: updatedCategory,
                }))
              }
              onSave={handleSavePartner}
              onReset={() => {
                if (initialPartnerRef.current?.[activePartnerCategory]) {
                  setPartnerForm((prev) => ({
                    ...prev,
                    [activePartnerCategory]: JSON.parse(
                      JSON.stringify(initialPartnerRef.current[activePartnerCategory])
                    ),
                  }));
                }
              }}
              saveButtonLabel="Save Partner General Conditions"
              showBadgeField={true}
            />
          </div>
        )}
      </div>

      {/* Discard Changes on Tab Switch Confirmation Modal */}
      <ConfirmModal
        isOpen={isDiscardModalOpen}
        title="Discard Unsaved Changes?"
        description={`You have unsaved changes in the active tab. Switching tabs will discard your recent modifications.`}
        confirmLabel="Discard &amp; Switch"
        cancelLabel="Keep Editing"
        isDestructive={true}
        onCancel={() => {
          setPendingTab(null);
          setIsDiscardModalOpen(false);
        }}
        onConfirm={handleDiscardAndSwitch}
      />

      {/* Reset Defaults Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Content to Defaults?"
        description="This will restore all studio general info content (contact info, privacy policy, legal notices, grow with us privacy, and partner general conditions) to system defaults. Any unsaved edits will be discarded."
        confirmLabel="Reset to Defaults"
        cancelLabel="Keep Current Changes"
        isDestructive={false}
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          resetDefaults();
          setIsResetModalOpen(false);
        }}
      />
    </div>
  );
}
