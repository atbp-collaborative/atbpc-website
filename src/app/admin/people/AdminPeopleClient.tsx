/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Save,
  UserCheck,
  Building,
  List,
  LayoutGrid,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Lock,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { ClassificationSelector } from '@/components/admin/ClassificationSelector';
import { MemberInvolvementManager } from '@/components/admin/MemberInvolvementManager';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { DynamicListField } from '@/components/admin/DynamicListField';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/primitives/buttons/Button';
import { ComboboxMultiSelect } from '@/components/admin/ComboboxMultiSelect';
import { ComboboxSelect } from '@/components/admin/ComboboxSelect';
import { AddressField } from '@/components/forms/form-fields/AddressField';
import { EMPTY_PH_ADDRESS } from '@/components/forms/form-fields/types';
import { generateMemberSlug } from '@/lib/people/slug-helpers';
import { isRoleSelectable } from '@/lib/roles/role-helpers';
import { getLicensesFromSupabase } from '@/services/supabase/licenses.service';
import {
  useAdminPeople,
  PeopleClassificationFilter,
  VisibilityFilter,
} from '@/hooks/admin/useAdminPeople';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminRoles } from '@/hooks/admin/useAdminRoles';
import { useTheme } from '@/context/ThemeContext';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useAdminUiSettings } from '@/context/AdminUiSettingsContext';
import { Member, MemberCategory, MemberAffiliation, MemberInvolvement, License } from '@/types';
import { toast } from 'sonner';

type ViewMode = 'list' | 'create' | 'edit';
type DisplayMode = 'list' | 'grid';

const EMPTY_MEMBER: Member = {
  id: '',
  name: '',
  firstName: '',
  middleName: '',
  lastName: '',
  pseudonym: '',
  pronouns: '',
  titles: '',
  role: '',
  roles: [],
  otherRoleIds: [],
  primaryRoleId: '',
  trackId: 'PROF',
  license: '',
  professionalLicenseTitle: '',
  licenseNumber: '',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  bio: '',
  fullBio: '',
  personalEmail: '',
  contactNumber: '',
  addressDetails: { ...EMPTY_PH_ADDRESS },
  portfolioUrl: '',
  externalUrl: '',
  dateOfHiring: '',
  dateOfSeparation: '',
  isCurrentlyHired: true,
  affiliations: [],
  categories: ['designers'],
  involvement: [],
  isDraft: false,
};

const isFounder = (member?: { id?: string; role?: string; name?: string } | null) => {
  if (!member) return false;
  const r = (member.role || '').toLowerCase();
  return (
    r.includes('principal architect') ||
    r.includes('founder') ||
    member.id === 'marchie-borja'
  );
};

interface AdminPeopleClientProps {
  initialMembers?: Member[];
  initialLicenses?: License[];
}

export function AdminPeopleClient({
  initialMembers,
  initialLicenses = [],
}: AdminPeopleClientProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAdminAuth();
  const isSuperadmin = user?.role === 'superadmin';
  const { getDisplayMode, setDisplayMode } = useAdminUiSettings();
  const displayMode = getDisplayMode('people');
  const {
    filteredMembers,
    searchTerm,
    setSearchTerm,
    classificationFilter,
    setClassificationFilter,
    visibilityFilter,
    setVisibilityFilter,
    tracks,
    isLoading,
    saveMember,
    deleteMember,
    toggleDraft,
    moveMember,
    isOrderDirty,
    isSavingOrder,
    saveOrder,
    resetOrder,
  } = useAdminPeople(initialMembers);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isOrderDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isOrderDirty]);

  const { projects: allProjects } = useAdminProjects();
  const { roles: allRoles } = useAdminRoles();

  const designerRoles = useMemo(
    () => allRoles.filter((r) => r.category === 'designers'),
    [allRoles]
  );
  const managerRoles = useMemo(
    () => allRoles.filter((r) => r.category === 'managers'),
    [allRoles]
  );
  const builderRoles = useMemo(
    () => allRoles.filter((r) => r.category === 'builders'),
    [allRoles]
  );

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  // displayMode now managed by useAdminUiSettings
  const [formData, setFormData] = useState<Member>(EMPTY_MEMBER);
  const initialDataRef = useRef<Member>(EMPTY_MEMBER);
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);

  const userTier = (user?.role as 'superadmin' | 'admin' | 'editor') || 'editor';
  const selectableRoles = useMemo(() => {
    return allRoles.filter((r) => {
      const isAlreadyAssigned =
        formData.primaryRoleId === r.id ||
        (formData.otherRoleIds || []).includes(r.id) ||
        formData.role === r.title;
      if (isAlreadyAssigned) return true;

      return isRoleSelectable(r.role_visibility, userTier);
    });
  }, [allRoles, userTier, formData.primaryRoleId, formData.otherRoleIds, formData.role]);

  useEffect(() => {
    if (initialLicenses && initialLicenses.length > 0) return;
    getLicensesFromSupabase().then((data) => {
      if (data && data.length > 0) setLicenses(data);
    });
  }, [initialLicenses]);

  // Modal states
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const startCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    const newMember: Member = {
      ...EMPTY_MEMBER,
      id: '',
      dateOfHiring: today,
      addressDetails: { ...EMPTY_PH_ADDRESS },
      categories: ['designers'],
    };
    initialDataRef.current = newMember;
    setFormData(newMember);
    setViewMode('create');
  };

  const startEdit = (member: Member) => {
    if (!isSuperadmin && isFounder(member)) {
      toast.error('The Principal Architect & Founder profile is protected and can only be modified by the Super Admin.');
      return;
    }

    // Populate atomic names if missing
    let fName = member.firstName || '';
    let mName = member.middleName || '';
    let lName = member.lastName || '';
    if (!fName && member.name) {
      const parts = member.name.trim().split(/\s+/);
      if (parts.length === 1) {
        fName = parts[0];
      } else if (parts.length === 2) {
        fName = parts[0];
        lName = parts[1];
      } else {
        fName = parts[0];
        mName = parts.slice(1, -1).join(' ');
        lName = parts[parts.length - 1];
      }
    }

    const matchedRole = allRoles.find((r) => r.id === member.primaryRoleId || r.title === member.role);

    const editData: Member = {
      ...EMPTY_MEMBER,
      ...member,
      firstName: fName,
      middleName: mName,
      lastName: lName,
      pseudonym: member.pseudonym || '',
      pronouns: member.pronouns || '',
      titles: member.titles || '',
      primaryRoleId: matchedRole ? matchedRole.id : member.primaryRoleId || '',
      role: matchedRole ? matchedRole.title : member.role,
      roles: member.roles || member.otherRoleIds || [],
      otherRoleIds: member.otherRoleIds || member.roles || [],
      trackId: member.trackId || 'PROF',
      professionalLicenseTitle: member.professionalLicenseTitle || (member.license && isNaN(Number(member.license)) ? member.license : ''),
      licenseNumber: member.licenseNumber || (member.license && !isNaN(Number(member.license)) ? member.license : ''),
      personalEmail: member.personalEmail || '',
      contactNumber: member.contactNumber || '',
      addressDetails: member.addressDetails ? { ...EMPTY_PH_ADDRESS, ...member.addressDetails } : { ...EMPTY_PH_ADDRESS },
      portfolioUrl: member.portfolioUrl || '',
      externalUrl: member.externalUrl || '',
      dateOfHiring: member.dateOfHiring || new Date().toISOString().split('T')[0],
      dateOfSeparation: member.dateOfSeparation || '',
      isCurrentlyHired: member.isCurrentlyHired !== undefined ? member.isCurrentlyHired : true,
      isDraft: member.isCurrentlyHired === false ? true : Boolean(member.isDraft),
    };
    initialDataRef.current = { ...editData };
    setFormData({ ...editData });
    setViewMode('edit');
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
  }, [formData]);

  const handleResetDefaults = () => {
    setFormData({ ...initialDataRef.current });
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast.error('First Name and Last Name are required.');
      return;
    }
    if (!formData.pronouns?.trim()) {
      toast.error('Please select pronouns.');
      return;
    }
    if (!formData.personalEmail?.trim()) {
      toast.error('Personal Email is required.');
      return;
    }
    if (!formData.contactNumber?.trim()) {
      toast.error('Contact Number is required.');
      return;
    }
    if (!formData.categories || formData.categories.length === 0) {
      toast.error('Please select at least one professional classification.');
      return;
    }

    const cleanId =
      viewMode === 'edit' && initialDataRef.current?.id
        ? initialDataRef.current.id
        : formData.id.trim().toLowerCase().replace(/^-+|-+$/g, '') ||
          generateMemberSlug(formData.firstName, formData.lastName) ||
          'member-' + Date.now();

    const fullName = [formData.firstName.trim(), formData.middleName?.trim(), formData.lastName.trim()]
      .filter(Boolean)
      .join(' ');

    const isCurrentlyHired = formData.isCurrentlyHired !== false;
    const memberToSave: Member = {
      ...formData,
      id: cleanId,
      name: fullName,
      roles: formData.otherRoleIds || formData.roles || [],
      otherRoleIds: formData.otherRoleIds || formData.roles || [],
      isCurrentlyHired,
      isDraft: !isCurrentlyHired ? true : Boolean(formData.isDraft),
    };

    saveMember(memberToSave);
    initialDataRef.current = memberToSave;
    setViewMode('list');
  };

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  // ==========================================
  // RENDER: NON-MODAL FORM VIEW (CREATE / EDIT)
  // ==========================================
  return (
    <>
      {viewMode === 'create' || viewMode === 'edit' ? (
        <div className="flex-1 flex flex-col min-h-screen">
        {/* Sticky Form Action Header */}
        <div
          className={`sticky top-0 z-30 px-4 sm:px-8 py-4 border-b backdrop-blur-md flex items-center justify-between gap-4 ${
            isDarkMode
              ? 'bg-vintage-charcoal/90 border-white/10 text-bright-gray'
              : 'bg-white/95 border-black/10 text-vintage-charcoal'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToList}
              className="p-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Return to list"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                {viewMode === 'create' ? 'New Profile' : 'Editing Profile'}
              </span>
              <h2 className="text-body sm:text-h2 font-major font-bold tracking-tight lowercase">
                {viewMode === 'create' ? 'add team member' : formData.name || 'unnamed member'}
              </h2>
            </div>
          </div>

          {isDirty && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                type="ghost"
                onClick={handleResetDefaults}
                className="!py-2 !px-3 sm:!px-4 text-mini"
              >
                <RotateCcw size={13} className="mr-1.5 inline" /> Reset Changes
              </Button>

              <Button
                type="filled"
                onClick={handleSave}
                className="!py-2 !px-4 sm:!px-5 text-mini font-semibold"
              >
                <Save size={14} className="mr-1.5 inline" /> Save Member
              </Button>
            </div>
          )}
        </div>

        {/* Full-Page Form Body (Strictly non-modal) */}
        <form onSubmit={handleSave} className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Column (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Core Identifiers */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  General Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const m = formData.middleName || '';
                        const l = formData.lastName || '';
                        const fullName = [val.trim(), m.trim(), l.trim()].filter(Boolean).join(' ');
                        setFormData((prev) => ({
                          ...prev,
                          firstName: val,
                          name: fullName,
                          id: viewMode === 'create' ? generateMemberSlug(val, l) : prev.id,
                        }));
                      }}
                      placeholder="Kim"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={formData.middleName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const f = formData.firstName || '';
                        const l = formData.lastName || '';
                        const fullName = [f.trim(), val.trim(), l.trim()].filter(Boolean).join(' ');
                        setFormData((prev) => ({ ...prev, middleName: val, name: fullName }));
                      }}
                      placeholder="Chi"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const f = formData.firstName || '';
                        const m = formData.middleName || '';
                        const fullName = [f.trim(), m.trim(), val.trim()].filter(Boolean).join(' ');
                        setFormData((prev) => ({
                          ...prev,
                          lastName: val,
                          name: fullName,
                          id: viewMode === 'create' ? generateMemberSlug(f, val) : prev.id,
                        }));
                      }}
                      placeholder="Dela Cruz"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Pseudonym
                    </label>
                    <input
                      type="text"
                      value={formData.pseudonym || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pseudonym: e.target.value }))}
                      placeholder="Kim"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Prefix/Titles
                    </label>
                    <input
                      type="text"
                      value={formData.titles || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, titles: e.target.value }))}
                      placeholder="Ar."
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Pronouns <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.pronouns || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pronouns: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">[ Select Pronouns ]</option>
                      <option value="He/Him">He/Him</option>
                      <option value="She/Her">She/Her</option>
                      <option value="They/Them">They/Them</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Career Track <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.trackId || 'PROF'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, trackId: e.target.value }))}
                      className={inputClass}
                    >
                      <option value="">[ Select Career Track ]</option>
                      {tracks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Primary Studio Role <span className="text-red-500">*</span>
                    </label>
                    <ComboboxSelect
                      options={selectableRoles.map((r) => ({
                        id: r.id,
                        label: r.title,
                        sublabel: r.code,
                        category: r.category ? r.category.charAt(0).toUpperCase() + r.category.slice(1) : undefined,
                      }))}
                      value={formData.primaryRoleId || ''}
                      onChange={(id, opt) => {
                        setFormData((prev) => ({
                          ...prev,
                          primaryRoleId: id,
                          role: opt ? opt.label : prev.role,
                        }));
                      }}
                      placeholder="[ Select Role ]"
                      searchPlaceholder="Search studio roles..."
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Other Studio Role
                    </label>
                    <ComboboxMultiSelect
                      options={selectableRoles.map((r) => ({
                        id: r.id,
                        label: r.title,
                        sublabel: r.code,
                        category: r.category,
                      }))}
                      selectedIds={formData.otherRoleIds || []}
                      onChange={(ids) =>
                        setFormData((prev) => ({
                          ...prev,
                          otherRoleIds: ids,
                          roles: ids,
                        }))
                      }
                      placeholder="[ Select Role ]"
                      searchPlaceholder="Search studio roles..."
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      disabled={viewMode === 'edit'}
                      readOnly={viewMode === 'edit'}
                      onChange={(e) => {
                        if (viewMode === 'edit') return;
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                        setFormData((prev) => ({ ...prev, id: val }));
                      }}
                      onBlur={() => {
                        if (viewMode === 'edit') return;
                        setFormData((prev) => ({
                          ...prev,
                          id: (prev.id || '').replace(/^-+|-+$/g, ''),
                        }));
                      }}
                      placeholder="first-last"
                      className={`${inputClass} font-mono text-mini ${viewMode === 'edit' ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                    <p className="text-micro opacity-50">
                      Used for public routing: /studio/our-people/{formData.id || 'first-last'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Professional Licensure */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Professional Licensure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      License Title
                    </label>
                    <select
                      value={formData.professionalLicenseTitle || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          professionalLicenseTitle: val,
                          license: prev.licenseNumber ? `${val} ${prev.licenseNumber}`.trim() : val,
                        }));
                      }}
                      className={inputClass}
                    >
                      <option value="">[ Select License ]</option>
                      {licenses.map((lic) => (
                        <option key={lic.id} value={lic.title}>
                          {lic.title} {lic.abbreviation ? `(${lic.abbreviation})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          licenseNumber: val,
                          license: prev.professionalLicenseTitle
                            ? `${prev.professionalLicenseTitle} ${val}`.trim()
                            : val,
                        }));
                      }}
                      placeholder="0012345"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Employment Status & Dates */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Employment &amp; Engagement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Employment Status <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => {
                          const nextHired = !prev.isCurrentlyHired;
                          return {
                            ...prev,
                            isCurrentlyHired: nextHired,
                            isDraft: !nextHired ? true : prev.isDraft,
                          };
                        })
                      }
                      className={`w-full py-2 px-3 rounded-lg text-mini font-semibold uppercase tracking-wider transition-colors border cursor-pointer ${
                        formData.isCurrentlyHired
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {formData.isCurrentlyHired ? '● Currently Hired' : '○ Separated / Alumni'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Date of Hiring <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfHiring || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfHiring: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Date of Separation
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfSeparation || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfSeparation: e.target.value }))}
                      placeholder="-- dd,yyyy"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Contact Details & Cascading Address */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Personal Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.personalEmail || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, personalEmail: e.target.value }))}
                      placeholder="kim_delacruz@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))}
                      placeholder="+63 917 123 4567"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Cascading Address Field (matching Grow With Us / Partner With Us) */}
                <div className="pt-2 border-t border-black/5 dark:border-white/5">
                  <AddressField
                    name="address"
                    label={
                      <span className="text-micro font-semibold uppercase tracking-wider block opacity-80 mb-2">
                        Address
                      </span>
                    }
                    value={formData.addressDetails || EMPTY_PH_ADDRESS}
                    onChange={(_name, val) =>
                      setFormData((prev) => ({ ...prev, addressDetails: val }))
                    }
                    isDarkMode={isDarkMode}
                    variant="full"
                    columns={2}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Portfolio
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      External URL
                    </label>
                    <input
                      type="url"
                      value={formData.externalUrl || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, externalUrl: e.target.value }))}
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Card 5: Multi-Classification Selector */}
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <ClassificationSelector
                  selected={formData.categories || []}
                  onChange={(cats) =>
                    setFormData((prev) => ({ ...prev, categories: cats }))
                  }
                />
              </div>

              {/* Card 6: Biographies */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Narratives &amp; Bio
                </h3>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Short Biography
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Member of ATBP Collaborative"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Full Biography
                  </label>
                  <textarea
                    rows={6}
                    value={formData.fullBio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullBio: e.target.value }))
                    }
                    placeholder="Comprehensive career and philosophical background..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Card 4: Affiliations Dynamic List */}
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <DynamicListField
                  mode="pairs"
                  label="Affiliations & Credentials"
                  helperText="Academic institutions, professional associations, and licensing bodies."
                  items={formData.affiliations || []}
                  onChange={(affs) =>
                    setFormData((prev) => ({ ...prev, affiliations: affs as MemberAffiliation[] }))
                  }
                  titlePlaceholder="e.g. United Architects of the Philippines (Makati)"
                  descPlaceholder="e.g. Active member in good standing participating in regular CPD..."
                />
              </div>

              {/* Card 5: Project Involvements (Bi-directional link to Projects) */}
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <MemberInvolvementManager
                  involvements={formData.involvement || []}
                  allProjects={allProjects}
                  onChange={(invs) =>
                    setFormData((prev) => ({ ...prev, involvement: invs }))
                  }
                />
              </div>
            </div>

            {/* Secondary Column (Right 1 col: Image & Visibility) */}
            <div className="space-y-6">
              {/* Photo Manager */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <ImageManagerField
                  single={true}
                  label="Profile Portrait"
                  helperText="Upload a high-resolution portrait photograph."
                  images={formData.image ? [formData.image] : []}
                  folder="people"
                  onChange={(imgs) =>
                    setFormData((prev) => ({ ...prev, image: imgs[0] || '' }))
                  }
                />
              </div>

              {/* Status and Summary Card */}
              <div
                className={`p-6 rounded-xl border space-y-3 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <span className="text-caption font-semibold uppercase tracking-wider block opacity-70">
                  Publication Status
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-mini">Visibility:</span>
                  <PublicationToggle
                    isDraft={Boolean(formData.isDraft)}
                    onToggle={() => {
                      if (!formData.isCurrentlyHired) {
                        toast.info('Separated members are automatically kept as Draft.');
                        return;
                      }
                      setFormData((prev) => ({ ...prev, isDraft: !prev.isDraft }));
                    }}
                  />
                </div>
                <p className="text-micro opacity-60">
                  {!formData.isCurrentlyHired
                    ? 'Separated members are automatically kept as Draft and hidden from the public website.'
                    : formData.isDraft
                    ? 'Hidden from /studio/our-people on the public website.'
                    : 'Visible to all visitors on the public directory.'}
                </p>
              </div>

              {/* Dedicated Actions Div for Unsaved Changes */}
              {isDirty && (
                <div
                  className={`p-6 rounded-xl border space-y-3 transition-all ${
                    isDarkMode
                      ? 'bg-vintage-charcoal/80 border-space-sparkle/40 ring-1 ring-space-sparkle/20'
                      : 'bg-white border-space-sparkle/40 shadow-sm ring-1 ring-space-sparkle/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-semibold uppercase tracking-wider block text-space-sparkle">
                      Unsaved Changes
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <p className="text-micro opacity-60">
                    You have modified this profile. Save to apply or reset to discard changes.
                  </p>

                  <div className="space-y-2 pt-2">
                    <Button
                      type="filled"
                      onClick={handleSave}
                      fullWidth
                      className="!py-2.5 text-mini font-semibold"
                    >
                      <Save size={14} className="mr-1.5 inline" /> Save Changes
                    </Button>
                    <Button
                      type="ghost"
                      onClick={handleResetDefaults}
                      fullWidth
                      className="!py-2 text-mini border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <RotateCcw size={13} className="mr-1.5 inline" /> Reset Changes
                    </Button>
                  </div>
                </div>
              )}

              {viewMode === 'edit' && isSuperadmin && (
                <div
                  className={`p-6 rounded-xl border space-y-3 ${
                    isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="text-caption font-semibold uppercase tracking-wider block text-red-600 dark:text-red-400">
                    Danger Zone
                  </span>
                  {isFounder(formData) ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-micro">
                      <Lock size={14} className="shrink-0" />
                      <span>The Principal Architect &amp; Founder profile is protected and cannot be deleted.</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-micro opacity-70">
                        Permanently delete this member profile and all associated project affiliations.
                      </p>
                      <Button
                        type="ghost"
                        onClick={() => setMemberToDelete(formData)}
                        fullWidth
                        className="!py-2 text-mini border border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 size={14} className="mr-1.5 inline" /> Delete Member Profile
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    ) : (
      <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage people"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'People' }]}
        actions={
          <div className="flex items-center gap-2.5">
            {isOrderDirty && (
              <Button
                type="filled"
                onClick={saveOrder}
                disabled={isSavingOrder}
                className="!py-2 !px-4 text-mini font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                <Save size={14} className={`mr-1.5 inline ${isSavingOrder ? 'animate-spin' : ''}`} />
                {isSavingOrder ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            <Button
              type="filled"
              onClick={startCreate}
              className="hidden md:inline-flex !py-2 !px-4 text-mini font-semibold"
            >
              <Plus size={14} className="mr-1 inline" /> Add Member
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter and Search Bar */}
        <div
          className={`p-4 rounded-xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, role, license..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>

          {/* Classification Filter Tabs with thin light grey border */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'designers', 'managers', 'builders'] as PeopleClassificationFilter[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setClassificationFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-mini font-medium uppercase tracking-wider transition-colors cursor-pointer border ${
                    classificationFilter === cat
                      ? 'bg-space-sparkle text-white border-space-sparkle'
                      : isDarkMode
                        ? 'border-gray-600 hover:bg-white/5 text-bright-gray/80'
                        : 'border-gray-300 hover:bg-black/5 text-vintage-charcoal/80'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Visibility Filter (All, Published, Draft) */}
          <div className="flex items-center gap-1 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-black/10 dark:border-white/10">
            {(['all', 'published', 'draft'] as VisibilityFilter[]).map((vis) => (
              <button
                key={vis}
                onClick={() => setVisibilityFilter(vis)}
                className={`px-2.5 py-1 rounded text-micro uppercase tracking-wider transition-colors cursor-pointer ${
                  visibilityFilter === vis
                    ? 'border border-space-sparkle text-space-sparkle font-semibold'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                {vis}
              </button>
            ))}
          </div>

          {/* View Mode Switcher: List vs Grid */}
          <div className="flex items-center gap-1 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setDisplayMode('people', 'list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                displayMode === 'list'
                  ? 'bg-space-sparkle text-white'
                  : isDarkMode
                    ? 'hover:bg-white/10 text-bright-gray/70'
                    : 'hover:bg-black/5 text-vintage-charcoal/70'
              }`}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('people', 'grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                displayMode === 'grid'
                  ? 'bg-space-sparkle text-white'
                  : isDarkMode
                    ? 'hover:bg-white/10 text-bright-gray/70'
                    : 'hover:bg-black/5 text-vintage-charcoal/70'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Add Member Action (between search/filter and list) */}
        <div className="md:hidden space-y-2">
          {isOrderDirty && (
            <Button
              type="filled"
              onClick={saveOrder}
              disabled={isSavingOrder}
              fullWidth
              className="!py-2.5 text-mini font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <Save size={14} className={`mr-1.5 inline ${isSavingOrder ? 'animate-spin' : ''}`} />
              {isSavingOrder ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          <Button
            type="filled"
            onClick={startCreate}
            fullWidth
            className="!py-2.5 text-mini font-semibold shadow-xs"
          >
            <Plus size={14} className="mr-1 inline" /> Add Member
          </Button>
        </div>

        {/* Members Table / Grid */}
        {isLoading ? (
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 sm:p-5 h-20" />
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          displayMode === 'list' ? (
            <div
              className={`rounded-xl border overflow-hidden ${
                isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
              }`}
            >
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filteredMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/2'
                    }`}
                  >
                    {/* Left: Avatar + Details */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-space-sparkle/20 text-space-sparkle">
                            <UserCheck size={20} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-caption sm:text-body truncate">
                            {member.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold ${
                              member.isDraft
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {member.isDraft ? 'Draft' : 'Published'}
                          </span>
                          {member.isCurrentlyHired === false && (
                            <span className="px-2 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-600/30">
                              Separated
                            </span>
                          )}
                        </div>

                        <p className="text-mini opacity-70 truncate">{member.role}</p>

                        {/* Classification Chips */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {member.categories?.map((c) => (
                            <span
                              key={c}
                              className="text-micro font-mono uppercase px-2 py-0.5 rounded-full bg-space-sparkle/15 text-space-sparkle font-medium"
                            >
                              {c}
                            </span>
                          ))}

                          {member.involvement && member.involvement.length > 0 && (
                            <span className="text-micro opacity-50 flex items-center gap-1 ml-1 font-mono">
                              <Building size={11} /> {member.involvement.length} project(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <div className="flex items-center border border-black/15 dark:border-white/15 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 shadow-xs">
                        <button
                          type="button"
                          onClick={() => moveMember(member.id, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1.5 hover:bg-space-sparkle hover:text-white text-vintage-charcoal dark:text-bright-gray disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono text-micro font-semibold cursor-pointer"
                          title={index === 0 ? 'Top position' : `Move member earlier (${index + 1} → ${index})`}
                        >
                          <ArrowUp size={13} />
                        </button>
                        <div className="w-[1px] h-4 bg-black/15 dark:bg-white/15" />
                        <button
                          type="button"
                          onClick={() => moveMember(member.id, 'down')}
                          disabled={index === filteredMembers.length - 1}
                          className="px-2 py-1.5 hover:bg-space-sparkle hover:text-white text-vintage-charcoal dark:text-bright-gray disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono text-micro font-semibold cursor-pointer"
                          title={index === filteredMembers.length - 1 ? 'Bottom position' : `Move member later (${index + 1} → ${index + 2})`}
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      {!isSuperadmin && isFounder(member) ? (
                        <span
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 text-micro font-mono uppercase tracking-wider rounded-lg border border-space-sparkle/30 bg-space-sparkle/10 text-space-sparkle font-medium"
                          title="Protected Founder Profile"
                        >
                          <Lock size={12} /> Protected
                        </span>
                      ) : (
                        <Button
                          type="ghost"
                          onClick={() => startEdit(member)}
                          className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                        >
                          <Edit2 size={13} className="mr-1 inline" /> Edit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                    isDarkMode
                      ? 'bg-vintage-charcoal/60 border-white/10 hover:border-space-sparkle/50 hover:bg-white/5'
                      : 'bg-white border-black/10 hover:border-space-sparkle/50 shadow-xs hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Top bar: Avatar & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-space-sparkle/20 text-space-sparkle">
                            <UserCheck size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span
                          className={`px-2.5 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold ${
                            member.isDraft
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {member.isDraft ? 'Draft' : 'Published'}
                        </span>
                        {member.isCurrentlyHired === false && (
                          <span className="px-2 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-600/30">
                            Separated
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name and Role */}
                    <div className="space-y-1 mb-3">
                      <h3 className="font-bold text-body truncate" title={member.name}>
                        {member.name}
                      </h3>
                      <p className="text-mini opacity-70 line-clamp-1">{member.role}</p>
                    </div>

                    {/* Bio snippet if available */}
                    {member.bio && (
                      <p className="text-micro opacity-60 line-clamp-2 mb-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Classification Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      {member.categories?.map((c) => (
                        <span
                          key={c}
                          className="text-micro font-mono uppercase px-2 py-0.5 rounded-full bg-space-sparkle/15 text-space-sparkle font-medium"
                        >
                          {c}
                        </span>
                      ))}

                      {member.involvement && member.involvement.length > 0 && (
                        <span className="text-micro opacity-50 flex items-center gap-1 font-mono">
                          <Building size={11} /> {member.involvement.length} project(s)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Reorder buttons & Edit Button */}
                  <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center border border-black/15 dark:border-white/15 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 shadow-xs">
                      <button
                        type="button"
                        onClick={() => moveMember(member.id, 'up')}
                        disabled={index === 0}
                        className="px-2.5 py-1.5 hover:bg-space-sparkle hover:text-white text-vintage-charcoal dark:text-bright-gray disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono text-micro font-semibold cursor-pointer"
                        title={index === 0 ? 'Top position' : `Move member earlier (${index + 1} → ${index})`}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <div className="w-[1px] h-4 bg-black/15 dark:bg-white/15" />
                      <button
                        type="button"
                        onClick={() => moveMember(member.id, 'down')}
                        disabled={index === filteredMembers.length - 1}
                        className="px-2.5 py-1.5 hover:bg-space-sparkle hover:text-white text-vintage-charcoal dark:text-bright-gray disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono text-micro font-semibold cursor-pointer"
                        title={index === filteredMembers.length - 1 ? 'Bottom position' : `Move member later (${index + 1} → ${index + 2})`}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {!isSuperadmin && isFounder(member) ? (
                      <span
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-micro font-mono uppercase tracking-wider rounded-lg border border-space-sparkle/30 bg-space-sparkle/10 text-space-sparkle font-medium flex-1"
                        title="Protected Founder Profile"
                      >
                        <Lock size={12} /> Protected Profile
                      </span>
                    ) : (
                      <Button
                        type="ghost"
                        onClick={() => startEdit(member)}
                        className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle flex-1 justify-center"
                      >
                        <Edit2 size={13} className="mr-1 inline" /> Edit Member
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div
            className={`rounded-xl border p-12 text-center space-y-3 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <Users size={32} className="mx-auto opacity-30 text-space-sparkle" />
            <p className="text-caption opacity-60">No members matched the selected filters.</p>
            <Button type="filled" onClick={startCreate} className="!py-1.5 !px-4 text-mini">
              Add New Member
            </Button>
          </div>
        )}
      </div>
    </div>
  )}

  {/* Confirmation Modal (Exclusively for delete confirmation) */}
  <ConfirmModal
    isOpen={Boolean(memberToDelete)}
    title="Remove Team Member?"
    description={`Are you sure you want to remove "${memberToDelete?.name}"? Their profile and portfolio involvements will be deleted from the database.`}
    confirmLabel="Confirm Delete"
    cancelLabel="Keep Member"
    isDestructive={true}
    onCancel={() => setMemberToDelete(null)}
    onConfirm={() => {
      if (memberToDelete) {
        deleteMember(memberToDelete.id);
        setMemberToDelete(null);
        setViewMode('list');
      }
    }}
  />
</>
  );
}
