/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Phone,
  ShieldCheck,
  Scale,
  Handshake,
  Save,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/primitives/buttons/Button';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminGeneralInfo, AdminGeneralInfoInitialData } from '@/hooks/admin/useAdminGeneralInfo';
import { useTheme } from '@/context/ThemeContext';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData, ModalSection } from '@/lib/modals/types';
import { CareerPrivacyData, PartnerConditionsData } from '@/types';

type TabKey = 'contact' | 'privacy' | 'career' | 'partner' | 'legal';
type PartnerCategory = 'builder' | 'consultant' | 'supplier';

interface AdminGeneralInfoClientProps {
  initialData?: AdminGeneralInfoInitialData;
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

  const [activeTab, setActiveTab] = useState<TabKey>('contact');
  const [activePartnerCategory, setActivePartnerCategory] = useState<PartnerCategory>('builder');

  // Local form states initialized immediately from initialData
  const [contactForm, setContactForm] = useState<ContactInfo | null>(
    initialData?.contactInfo ? JSON.parse(JSON.stringify(initialData.contactInfo)) : null
  );
  const [privacyForm, setPrivacyForm] = useState<ModalData | null>(
    initialData?.privacyPolicy ? JSON.parse(JSON.stringify(initialData.privacyPolicy)) : null
  );
  const [careerPrivacyForm, setCareerPrivacyForm] = useState<CareerPrivacyData | null>(
    initialData?.careerPrivacy ? JSON.parse(JSON.stringify(initialData.careerPrivacy)) : null
  );
  const [partnerConditionsForm, setPartnerConditionsForm] = useState<PartnerConditionsData | null>(
    initialData?.partnerConditions ? JSON.parse(JSON.stringify(initialData.partnerConditions)) : null
  );
  const [legalForm, setLegalForm] = useState<ModalData | null>(
    initialData?.legalNotices ? JSON.parse(JSON.stringify(initialData.legalNotices)) : null
  );

  // Reset confirmation modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    if (contactInfo) setContactForm(JSON.parse(JSON.stringify(contactInfo)));
  }, [contactInfo]);

  useEffect(() => {
    if (privacyPolicy) setPrivacyForm(JSON.parse(JSON.stringify(privacyPolicy)));
  }, [privacyPolicy]);

  useEffect(() => {
    if (careerPrivacy) setCareerPrivacyForm(JSON.parse(JSON.stringify(careerPrivacy)));
  }, [careerPrivacy]);

  useEffect(() => {
    if (partnerConditions) setPartnerConditionsForm(JSON.parse(JSON.stringify(partnerConditions)));
  }, [partnerConditions]);

  useEffect(() => {
    if (legalNotices) setLegalForm(JSON.parse(JSON.stringify(legalNotices)));
  }, [legalNotices]);

  const handleSaveCurrentTab = () => {
    if (activeTab === 'contact' && contactForm) {
      saveContact(contactForm);
    } else if (activeTab === 'privacy' && privacyForm) {
      savePrivacy(privacyForm);
    } else if (activeTab === 'career' && careerPrivacyForm) {
      saveCareerPrivacy(careerPrivacyForm);
    } else if (activeTab === 'partner' && partnerConditionsForm) {
      savePartnerConditions(partnerConditionsForm);
    } else if (activeTab === 'legal' && legalForm) {
      saveLegal(legalForm);
    }
  };

  const inputClass = `w-full text-caption px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'contact', label: 'Contact & Socials', icon: Phone },
    { key: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { key: 'career', label: 'Grow With Us Privacy', icon: FileText },
    { key: 'partner', label: 'Partner Conditions', icon: Handshake },
    { key: 'legal', label: 'Legal & Regulatory', icon: Scale },
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
              className="!py-2 !px-4 text-mini font-semibold"
            >
              <Save size={14} className="mr-1.5 inline" /> Save Changes
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        {/* Tab Selection Row */}
        <div
          className={`p-1.5 rounded-xl border flex items-center gap-1 overflow-x-auto ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-caption font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-space-sparkle text-white shadow-xs font-semibold'
                    : isDarkMode
                      ? 'text-bright-gray/70 hover:text-white hover:bg-white/5'
                      : 'text-vintage-charcoal/70 hover:text-black hover:bg-black/5'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Contact Information & Social Media */}
        {activeTab === 'contact' && contactForm && (
          <div
            className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <div className="border-b pb-4 border-black/5 dark:border-white/5">
              <h3 className="text-body font-major font-bold tracking-tight lowercase">
                studio contact coordinates
              </h3>
              <p className="text-caption opacity-70">
                Official addresses, telephone, mobile hotline, and social profiles displayed in footers and contact pages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Full Studio Physical Address
                </label>
                <textarea
                  rows={2}
                  value={contactForm.address}
                  onChange={(e) =>
                    setContactForm((prev) => (prev ? { ...prev, address: e.target.value } : null))
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Landline Telephone
                </label>
                <input
                  type="text"
                  value={contactForm.landline}
                  onChange={(e) =>
                    setContactForm((prev) => (prev ? { ...prev, landline: e.target.value } : null))
                  }
                  placeholder="+632 8257-0968"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Mobile Hotline
                </label>
                <input
                  type="text"
                  value={contactForm.mobile}
                  onChange={(e) =>
                    setContactForm((prev) => (prev ? { ...prev, mobile: e.target.value } : null))
                  }
                  placeholder="+63 917 165 4827"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Official Inquiries Email
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((prev) => (prev ? { ...prev, email: e.target.value } : null))
                  }
                  placeholder="enquire@atbpcollaborative.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Social Accounts */}
            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
              <h4 className="text-caption font-semibold uppercase tracking-wider opacity-80">
                Official Social Media Channels
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro uppercase tracking-wider block opacity-70">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.socials?.facebook?.url || ''}
                    onChange={(e) =>
                      setContactForm((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socials: {
                            ...prev.socials,
                            facebook: { ...prev.socials.facebook, url: e.target.value },
                          },
                        };
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro uppercase tracking-wider block opacity-70">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.socials?.instagram?.url || ''}
                    onChange={(e) =>
                      setContactForm((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socials: {
                            ...prev.socials,
                            instagram: { ...prev.socials.instagram, url: e.target.value },
                          },
                        };
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro uppercase tracking-wider block opacity-70">
                    Threads Profile URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.socials?.threads?.url || ''}
                    onChange={(e) =>
                      setContactForm((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socials: {
                            ...prev.socials,
                            threads: { ...prev.socials.threads, url: e.target.value },
                          },
                        };
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro uppercase tracking-wider block opacity-70">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.socials?.youtube?.url || ''}
                    onChange={(e) =>
                      setContactForm((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          socials: {
                            ...prev.socials,
                            youtube: { ...prev.socials.youtube, url: e.target.value },
                          },
                        };
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
              <Button type="filled" onClick={handleSaveCurrentTab} className="!py-2 !px-6 text-mini">
                Save Contact Information
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Privacy Policy */}
        {activeTab === 'privacy' && privacyForm && (
          <div
            className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <div className="border-b pb-4 border-black/5 dark:border-white/5">
              <h3 className="text-body font-major font-bold tracking-tight lowercase">
                data privacy policy &amp; ra 10173 compliance
              </h3>
              <p className="text-caption opacity-70">
                Official privacy governance statements displayed on public privacy policy views.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={privacyForm.title}
                    onChange={(e) =>
                      setPrivacyForm((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Document Subtitle / Scope
                  </label>
                  <input
                    type="text"
                    value={privacyForm.subtitle}
                    onChange={(e) =>
                      setPrivacyForm((prev) =>
                        prev ? { ...prev, subtitle: e.target.value } : null
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {privacyForm.intro && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Effective Date Label
                    </label>
                    <input
                      type="text"
                      value={privacyForm.intro.title || ''}
                      onChange={(e) =>
                        setPrivacyForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                intro: { ...prev.intro, text: prev.intro?.text || '', title: e.target.value },
                              }
                            : null
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Introductory Statement (RA 10173 Context)
                    </label>
                    <textarea
                      rows={3}
                      value={privacyForm.intro.text}
                      onChange={(e) =>
                        setPrivacyForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                intro: { ...prev.intro, text: e.target.value },
                              }
                            : null
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {/* Sections Editor */}
              <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-caption font-semibold uppercase tracking-wider opacity-80">
                    Policy Articles &amp; Clauses ({privacyForm.sections?.length || 0})
                  </h4>
                  <Button
                    type="ghost"
                    onClick={() => {
                      const newSec: ModalSection = {
                        title: 'New Policy Section',
                        text: 'Describe data handling standards...',
                        list: [],
                      };
                      setPrivacyForm((prev) =>
                        prev ? { ...prev, sections: [...(prev.sections || []), newSec] } : null
                      );
                    }}
                    className="!py-1 !px-2 text-micro border border-black/10 dark:border-white/10"
                  >
                    <Plus size={12} className="mr-1 inline" /> Add Section
                  </Button>
                </div>

                <div className="space-y-4">
                  {privacyForm.sections?.map((section, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border space-y-3 ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const newSecs = [...(privacyForm.sections || [])];
                            newSecs[idx] = { ...newSecs[idx], title: e.target.value };
                            setPrivacyForm((prev) => (prev ? { ...prev, sections: newSecs } : null));
                          }}
                          className={`${inputClass} font-semibold`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSecs = (privacyForm.sections || []).filter((_, i) => i !== idx);
                            setPrivacyForm((prev) => (prev ? { ...prev, sections: newSecs } : null));
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer shrink-0"
                          title="Remove section"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={section.text || ''}
                        onChange={(e) => {
                          const newSecs = [...(privacyForm.sections || [])];
                          newSecs[idx] = { ...newSecs[idx], text: e.target.value };
                          setPrivacyForm((prev) => (prev ? { ...prev, sections: newSecs } : null));
                        }}
                        placeholder="Section content..."
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
              <Button type="filled" onClick={handleSaveCurrentTab} className="!py-2 !px-6 text-mini">
                Save Privacy Policy
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Grow With Us Privacy Statement */}
        {activeTab === 'career' && careerPrivacyForm && (
          <div
            className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <div className="border-b pb-4 border-black/5 dark:border-white/5">
              <h3 className="text-body font-major font-bold tracking-tight lowercase">
                grow with us privacy statement
              </h3>
              <p className="text-caption opacity-70">
                Official privacy terms and RA 10173 disclosures displayed on careers, apprenticeships, and internship application portals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Statement Title
                  </label>
                  <input
                    type="text"
                    value={careerPrivacyForm.title}
                    onChange={(e) =>
                      setCareerPrivacyForm((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Subtitle / Scope
                  </label>
                  <input
                    type="text"
                    value={careerPrivacyForm.subtitle}
                    onChange={(e) =>
                      setCareerPrivacyForm((prev) => (prev ? { ...prev, subtitle: e.target.value } : null))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Regulatory Badge
                  </label>
                  <input
                    type="text"
                    value={careerPrivacyForm.badge || ''}
                    onChange={(e) =>
                      setCareerPrivacyForm((prev) => (prev ? { ...prev, badge: e.target.value } : null))
                    }
                    placeholder="Republic Act No. 10173"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Items Clauses Editor */}
              <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-caption font-semibold uppercase tracking-wider opacity-80">
                    Statement Clauses &amp; Paragraphs ({careerPrivacyForm.items?.length || 0})
                  </h4>
                  <Button
                    type="ghost"
                    onClick={() => {
                      setCareerPrivacyForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              items: [
                                ...(prev.items || []),
                                '<p>New data privacy clause regarding applicant materials and confidentiality.</p>',
                              ],
                            }
                          : null
                      );
                    }}
                    className="!py-1 !px-2 text-micro border border-black/10 dark:border-white/10"
                  >
                    <Plus size={12} className="mr-1 inline" /> Add Clause
                  </Button>
                </div>

                <div className="space-y-4">
                  {careerPrivacyForm.items?.map((itemHtml, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border space-y-2 ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-micro font-mono uppercase tracking-wider opacity-60">
                          Clause #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = (careerPrivacyForm.items || []).filter((_, i) => i !== idx);
                            setCareerPrivacyForm((prev) => (prev ? { ...prev, items: newItems } : null));
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer shrink-0"
                          title="Remove clause"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={itemHtml}
                        onChange={(e) => {
                          const newItems = [...(careerPrivacyForm.items || [])];
                          newItems[idx] = e.target.value;
                          setCareerPrivacyForm((prev) => (prev ? { ...prev, items: newItems } : null));
                        }}
                        placeholder="Clause content (HTML tags like <p>, <a>, <strong> supported)..."
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
              <Button type="filled" onClick={handleSaveCurrentTab} className="!py-2 !px-6 text-mini">
                Save Grow-With-Us Privacy
              </Button>
            </div>
          </div>
        )}

        {/* Tab 4: Partner With Us General Conditions */}
        {activeTab === 'partner' && partnerConditionsForm && (
          <div
            className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <div className="border-b pb-4 border-black/5 dark:border-white/5">
              <h3 className="text-body font-major font-bold tracking-tight lowercase">
                partner with us general conditions
              </h3>
              <p className="text-caption opacity-70">
                Accreditation standards, workmanship covenants, and qualification prerequisites for builders, consultants, and suppliers.
              </p>
            </div>

            {/* Sub-tabs for Partner Category */}
            <div className="flex items-center gap-2 border-b pb-3 border-black/5 dark:border-white/5">
              {partnerTabs.map(({ key, label }) => {
                const isSelected = activePartnerCategory === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePartnerCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-micro font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-space-sparkle text-white shadow-xs font-semibold'
                        : isDarkMode
                          ? 'bg-vintage-charcoal/80 text-bright-gray/70 hover:bg-white/5 border border-white/10'
                          : 'bg-white text-vintage-charcoal/70 hover:bg-black/5 border border-black/10'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Active Category Content */}
            {partnerConditionsForm[activePartnerCategory] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Conditions Title ({activePartnerCategory})
                    </label>
                    <input
                      type="text"
                      value={partnerConditionsForm[activePartnerCategory].title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPartnerConditionsForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                [activePartnerCategory]: {
                                  ...prev[activePartnerCategory],
                                  title: val,
                                },
                              }
                            : null
                        );
                      }}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Badge / Accreditation Type
                    </label>
                    <input
                      type="text"
                      value={partnerConditionsForm[activePartnerCategory].badge || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPartnerConditionsForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                [activePartnerCategory]: {
                                  ...prev[activePartnerCategory],
                                  badge: val,
                                },
                              }
                            : null
                        );
                      }}
                      placeholder="e.g. PCAB Standards"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Clauses list */}
                <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-caption font-semibold uppercase tracking-wider opacity-80">
                      Clauses &amp; Specifications ({partnerConditionsForm[activePartnerCategory].items?.length || 0})
                    </h4>
                    <Button
                      type="ghost"
                      onClick={() => {
                        setPartnerConditionsForm((prev) => {
                          if (!prev) return null;
                          const currentItems = prev[activePartnerCategory].items || [];
                          const nextNum = currentItems.length + 1;
                          return {
                            ...prev,
                            [activePartnerCategory]: {
                              ...prev[activePartnerCategory],
                              items: [
                                ...currentItems,
                                `<p>${nextNum}. <strong>New Specification:</strong> Detail covenant standards here.</p>`,
                              ],
                            },
                          };
                        });
                      }}
                      className="!py-1 !px-2 text-micro border border-black/10 dark:border-white/10"
                    >
                      <Plus size={12} className="mr-1 inline" /> Add Clause
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {partnerConditionsForm[activePartnerCategory].items?.map((clauseHtml, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border space-y-2 ${
                          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-micro font-mono uppercase tracking-wider opacity-60">
                            Clause #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setPartnerConditionsForm((prev) => {
                                if (!prev) return null;
                                const newItems = (prev[activePartnerCategory].items || []).filter(
                                  (_, i) => i !== idx
                                );
                                return {
                                  ...prev,
                                  [activePartnerCategory]: {
                                    ...prev[activePartnerCategory],
                                    items: newItems,
                                  },
                                };
                              });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer shrink-0"
                            title="Remove clause"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          value={clauseHtml}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPartnerConditionsForm((prev) => {
                              if (!prev) return null;
                              const newItems = [...(prev[activePartnerCategory].items || [])];
                              newItems[idx] = val;
                              return {
                                ...prev,
                                [activePartnerCategory]: {
                                  ...prev[activePartnerCategory],
                                  items: newItems,
                                },
                              };
                            });
                          }}
                          placeholder="Condition text (HTML tags like <p>, <strong> supported)..."
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
              <Button type="filled" onClick={handleSaveCurrentTab} className="!py-2 !px-6 text-mini">
                Save Partner Conditions
              </Button>
            </div>
          </div>
        )}

        {/* Tab 5: Legal Notices */}
        {activeTab === 'legal' && legalForm && (
          <div
            className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <div className="border-b pb-4 border-black/5 dark:border-white/5">
              <h3 className="text-body font-major font-bold tracking-tight lowercase">
                legal &amp; regulatory notices (ra 9266)
              </h3>
              <p className="text-caption opacity-70">
                Philippine Architecture Act (RA 9266), intellectual property copyright, and professional accreditation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    value={legalForm.title}
                    onChange={(e) =>
                      setLegalForm((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Practice Title
                  </label>
                  <input
                    type="text"
                    value={legalForm.subtitle}
                    onChange={(e) =>
                      setLegalForm((prev) => (prev ? { ...prev, subtitle: e.target.value } : null))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {legalForm.intro && (
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Professional Practice Disclaimer
                  </label>
                  <textarea
                    rows={3}
                    value={legalForm.intro.text}
                    onChange={(e) =>
                      setLegalForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              intro: { ...prev.intro, text: e.target.value },
                            }
                          : null
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}

              {/* Sections Editor */}
              <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-caption font-semibold uppercase tracking-wider opacity-80">
                    Regulatory Articles ({legalForm.sections?.length || 0})
                  </h4>
                </div>

                <div className="space-y-4">
                  {legalForm.sections?.map((section, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border space-y-3 ${
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                      }`}
                    >
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const newSecs = [...(legalForm.sections || [])];
                          newSecs[idx] = { ...newSecs[idx], title: e.target.value };
                          setLegalForm((prev) => (prev ? { ...prev, sections: newSecs } : null));
                        }}
                        className={`${inputClass} font-semibold`}
                      />

                      <textarea
                        rows={3}
                        value={section.text || ''}
                        onChange={(e) => {
                          const newSecs = [...(legalForm.sections || [])];
                          newSecs[idx] = { ...newSecs[idx], text: e.target.value };
                          setLegalForm((prev) => (prev ? { ...prev, sections: newSecs } : null));
                        }}
                        placeholder="Regulatory legal text..."
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
              <Button type="filled" onClick={handleSaveCurrentTab} className="!py-2 !px-6 text-mini">
                Save Legal Notices
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Resetting to Defaults */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Content to Defaults?"
        description="This will restore all simulated studio content (contact info, legal notices, privacy policy, and partner conditions) to system defaults. Any unsaved edits will be discarded."
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
