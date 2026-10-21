/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Save,
  Building,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  RotateCcw,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { ProjectTeamManager } from '@/components/admin/ProjectTeamManager';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { DynamicListField } from '@/components/admin/DynamicListField';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/primitives/buttons/Button';
import { AdminProjectsSkeleton } from '@/components/admin/skeletons';
import { DEFAULT_SHIMMER_BLUR_DATA_URL } from '@/lib/images/image-placeholders';
import {
  useAdminProjects,
  ProjectStatusFilter,
  VisibilityFilter,
} from '@/hooks/admin/useAdminProjects';
import { useAdminPeople } from '@/hooks/admin/useAdminPeople';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/types';
import { toast } from 'sonner';
import { MAIN_CATEGORIES, TYPOLOGY_MAP, ALL_TYPOLOGIES } from '@/lib/projects/project-constants';
import {
  isUuid,
  generateProjectSlug,
  normalizeCategoryId,
  normalizeTypologyId,
  normalizeContractTypeId,
  getTypologyName,
} from '@/lib/projects/project-helpers';

type ViewMode = 'list' | 'create' | 'edit';

const EMPTY_PROJECT: Project = {
  id: '',
  slug: '',
  projectCode: '2601',
  title: '',
  category: 'Multi-Generational',
  mainCategory: 'Shelter',
  categoryId: 'Shelter',
  typologyId: 'multi-generational',
  contractTypeId: 'comprehensive-design',
  floorAreaSqm: 100,
  subcategory: 'Multi-Generational',
  location: 'Metro Manila',
  year: String(new Date().getFullYear()),
  clientType: 'Mid-Income',
  description: '',
  fullWriteup: '',
  images: [],
  video: '',
  status: 'ongoing',
  specs: {
    area: '100 sqm',
    duration: '9 months',
    materials: ['Concrete', 'Wood', 'Steel', 'Glass'],
  },
  isDraft: true, // Default to draft per Excel Remarks
  contributors: [],
};

const CLIENT_TYPES: ('Mid-Income' | 'Mid-High-Income' | 'High-Income')[] = [
  'Mid-Income',
  'Mid-High-Income',
  'High-Income',
];

const PROJECT_STATUSES: ('completed' | 'ongoing' | 'schematics')[] = [
  'completed',
  'ongoing',
  'schematics',
];

const PROJECT_FILTER_CATEGORIES = ['all', 'Shelter', 'Livelihood', 'Community'] as const;

interface AdminProjectsClientProps {
  initialProjects?: Project[];
  initialRoles?: any[];
}

export function AdminProjectsClient({
  initialProjects,
  initialRoles,
}: AdminProjectsClientProps) {
  const { isDarkMode } = useTheme();
  const {
    projects,
    filteredProjects,
    allCategories,
    categories,
    typologies,
    contractTypes,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    visibilityFilter,
    setVisibilityFilter,
    categoryFilter,
    setCategoryFilter,
    typologyFilter,
    setTypologyFilter,
    projectRoles,
    isLoading,
    saveProject,
    deleteProject,
    toggleDraft,
    getTeamForProject,
    associateMember,
    disassociateMember,
  } = useAdminProjects(initialProjects, initialRoles);

  const availableTypologies =
    categoryFilter !== 'all' && TYPOLOGY_MAP[categoryFilter]
      ? TYPOLOGY_MAP[categoryFilter]
      : ALL_TYPOLOGIES;

  const { members: allMembers } = useAdminPeople();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [formData, setFormData] = useState<Project>(EMPTY_PROJECT);
  const initialDataRef = useRef<Project>(EMPTY_PROJECT);

  // Modal states
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const startCreate = () => {
    // Generate next code in YYNN format (e.g. 2601)
    const curYear = new Date().getFullYear().toString().slice(-2);
    const existingCodes = (projects || [])
      .map((p) => p.projectCode)
      .filter((c): c is string => Boolean(c && c.startsWith(curYear)));
    let nextNum = 1;
    if (existingCodes.length > 0) {
      const nums = existingCodes
        .map((c) => parseInt(c.slice(2), 10))
        .filter((n) => !isNaN(n));
      if (nums.length > 0) nextNum = Math.max(...nums) + 1;
    }
    const nextCode = `${curYear}${nextNum.toString().padStart(2, '0')}`;

    const newProj: Project = {
      ...EMPTY_PROJECT,
      id: crypto.randomUUID(),
      slug: '',
      projectCode: nextCode,
      categoryId: 'Shelter',
      mainCategory: 'Shelter',
      typologyId: 'multi-generational',
      contractTypeId: 'comprehensive-design',
      isDraft: true,
      images: [],
      contributors: [],
    };
    initialDataRef.current = newProj;
    setFormData(newProj);
    setViewMode('create');
  };

  const startEdit = (proj: Project) => {
    const areaNum =
      proj.floorAreaSqm ||
      (proj.specs?.area
        ? parseFloat(proj.specs.area.replace(/[^0-9.]/g, '')) || undefined
        : undefined);
    const catId = normalizeCategoryId(proj.categoryId || proj.mainCategory);
    const typId = normalizeTypologyId(proj.typologyId || proj.subcategory || proj.category);
    const typName = getTypologyName(typId);
    const contractId = normalizeContractTypeId(proj.contractTypeId || proj.specs?.scope);
    const readableSlug = proj.slug || (!isUuid(proj.id) ? proj.id : generateProjectSlug(proj.title, proj.year));
    const currentContributors = proj.contributors && proj.contributors.length > 0
      ? proj.contributors
      : (getTeamForProject(proj.id) as any) || [];

    const editProj: Project = {
      ...EMPTY_PROJECT,
      ...proj,
      id: proj.id,
      slug: readableSlug,
      projectCode: proj.projectCode || '',
      categoryId: catId,
      mainCategory: catId,
      typologyId: typId,
      category: typName,
      subcategory: typName,
      contractTypeId: contractId || 'comprehensive-design',
      floorAreaSqm: areaNum,
      contributors: currentContributors,
    };
    initialDataRef.current = { ...editProj };
    setFormData({ ...editProj });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Project Title is required.');
      return;
    }

    if (!formData.projectCode?.trim()) {
      toast.error('Project Code (YYNN) is required.');
      return;
    }

    if (!formData.location?.trim()) {
      toast.error('Location is required.');
      return;
    }

    if (!formData.description?.trim()) {
      toast.error('Short Overview Summary is required.');
      return;
    }

    if (!formData.fullWriteup?.trim()) {
      toast.error('Comprehensive Writeup is required.');
      return;
    }

    // Remark 25: "do not accept if no primary photo uploaded"
    if (!formData.images || formData.images.length === 0) {
      toast.error('Please upload at least one primary project photo before saving.');
      return;
    }

    // Maintain UUID for primary key (generate if empty or temp)
    const effectiveId = isUuid(formData.id) ? formData.id : crypto.randomUUID();

    // Generate human-readable slug (never a UUID)
    const effectiveSlug = generateProjectSlug(
      (formData.slug || formData.title || '').replace(/^-+|-+$/g, ''),
      formData.year
    );

    const catId = normalizeCategoryId(formData.categoryId || formData.mainCategory);
    const typId = normalizeTypologyId(formData.typologyId || formData.subcategory);
    const typName = getTypologyName(typId);

    const projectToSave: Project = {
      ...formData,
      id: effectiveId,
      slug: effectiveSlug,
      categoryId: catId,
      mainCategory: catId,
      typologyId: typId,
      category: typName,
      subcategory: typName,
      contractTypeId: normalizeContractTypeId(formData.contractTypeId) || undefined,
      contributors: formData.contributors || [],
    };

    await saveProject(projectToSave);
    initialDataRef.current = projectToSave;
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
  if (viewMode === 'create' || viewMode === 'edit') {
    const currentTeam = getTeamForProject(formData.id);

    return (
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
                {viewMode === 'create' ? 'New Portfolio Entry' : 'Editing Project'}
              </span>
              <h2 className="text-body sm:text-h2 font-major font-bold tracking-tight lowercase">
                {viewMode === 'create' ? 'add architectural project' : formData.title || 'unnamed project'}
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
                <Save size={14} className="mr-1.5 inline" /> Save Project
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
                  General Project Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Code (YYNN) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectCode || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, projectCode: e.target.value.trim() }))
                      }
                      placeholder="26XX"
                      className={`${inputClass} font-mono font-semibold`}
                    />
                    <p className="text-micro opacity-50">
                      Studio standard: YYNN (e.g. 2601: year 26, project #01).
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ''),
                        }))
                      }
                      onBlur={() =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: (prev.slug || '').replace(/^-+|-+$/g, ''),
                        }))
                      }
                      placeholder="project-title"
                      className={`${inputClass} font-mono text-mini`}
                    />
                    <div className="flex items-center justify-between text-micro opacity-60">
                      <span>Public path: /works/{formData.slug || generateProjectSlug(formData.title, formData.year)}</span>
                      {isUuid(formData.id) && (
                        <span className="font-mono text-[10px] opacity-75">UUID: {formData.id.slice(0, 8)}...</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: newTitle,
                          slug: prev.slug ? prev.slug : generateProjectSlug(newTitle, prev.year),
                        }));
                      }}
                      placeholder="project-title"
                      className={inputClass}
                    />
                  </div>

                  {/* Dynamic Category & Typology Cascading Dropdowns */}
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={normalizeCategoryId(formData.categoryId || formData.mainCategory)}
                      onChange={(e) => {
                        const newCat = normalizeCategoryId(e.target.value);
                        const typologiesForCat = typologies.filter((t) => t.categoryId === newCat);
                        const firstTypology = typologiesForCat[0];
                        const newTypId = firstTypology ? firstTypology.id : 'tiny-living';
                        const newTypName = firstTypology ? firstTypology.name : getTypologyName(newTypId);
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: newCat,
                          mainCategory: newCat,
                          typologyId: newTypId,
                          subcategory: newTypName,
                          category: newTypName,
                        }));
                      }}
                      className={inputClass}
                    >
                      <option value="">[ Select Project Category ]</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.tagline})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Typology (Cascading) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={normalizeTypologyId(formData.typologyId || formData.subcategory)}
                      onChange={(e) => {
                        const typId = normalizeTypologyId(e.target.value);
                        const found = typologies.find((t) => t.id === typId);
                        const typName = found ? found.name : getTypologyName(typId);
                        setFormData((prev) => ({
                          ...prev,
                          typologyId: typId,
                          subcategory: typName,
                          category: typName,
                        }));
                      }}
                      className={inputClass}
                    >
                      <option value="">[ Select Project Typology ]</option>
                      {typologies
                        .filter((t) => t.categoryId === normalizeCategoryId(formData.categoryId || formData.mainCategory))
                        .map((typ) => (
                          <option key={typ.id} value={typ.id}>
                            {typ.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Contract Type / Scope of Services */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Contract Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.contractTypeId || ''}
                      onChange={(e) => {
                        const cId = e.target.value;
                        const found = contractTypes.find((c) => c.id === cId);
                        setFormData((prev) => ({
                          ...prev,
                          contractTypeId: cId,
                          specs: {
                            ...prev.specs,
                            scope: found ? `${found.name} (${found.contractModel})` : prev.specs?.scope || '',
                          },
                        }));
                      }}
                      className={inputClass}
                    >
                      <option value="">[ Select Contract Type ]</option>
                      {contractTypes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.contractModel} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="Metro Manila"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Year Completed
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, year: e.target.value }))
                      }
                      placeholder="<this year>"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Client Demographic <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.clientType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientType: e.target.value as any,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="">[ Select Demographic ]</option>
                      <option value="Mid-Income">Mid Income</option>
                      <option value="Mid-High-Income">Mid-High Income</option>
                      <option value="High-Income">High Income</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Phase <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as any,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="">[ Select Phase ]</option>
                      <option value="schematics">Schematics</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: Descriptions & Writeups */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Narratives &amp; Design Philosophy
                </h3>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Short Overview Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief overview for cards and portfolio preview..."
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Comprehensive Writeup <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.fullWriteup}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullWriteup: e.target.value }))
                    }
                    placeholder="Full case study narrative: climate response, passive cooling, materials, client journey..."
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Walkthrough Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, video: e.target.value }))
                    }
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Card 3: Project Specifications */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Project Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Floor Area (sqm) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.floorAreaSqm !== undefined ? formData.floorAreaSqm : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = val ? parseFloat(val) : undefined;
                          setFormData((prev) => ({
                            ...prev,
                            floorAreaSqm: num,
                            specs: {
                              ...prev.specs,
                              area: num !== undefined ? `${num} sqm` : '',
                            },
                          }));
                        }}
                        placeholder="100"
                        className={`${inputClass} pr-12`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-mini opacity-40 font-mono pointer-events-none">
                        sqm
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Duration
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.duration || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specs: { ...prev.specs, duration: e.target.value },
                        }))
                      }
                      placeholder="9 months"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <DynamicListField
                    mode="strings"
                    label="Core Building Materials"
                    placeholder="e.g. Off-form Concrete, Rose Ebony Veneer, Structural Steel"
                    helperText="Key structural and tactile materials highlighted on the project showcase."
                    items={formData.specs?.materials || []}
                    onChange={(materials) =>
                      setFormData((prev) => ({
                        ...prev,
                        specs: { ...prev.specs, materials },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Card 4: Project Contributors (Assigned Team & Collaborators) */}
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <ProjectTeamManager
                  projectId={formData.id}
                  team={formData.contributors || []}
                  allMembers={allMembers}
                  projectRoles={projectRoles}
                  onAssociate={(memberId, role, desc) => {
                    const foundMember = allMembers.find((m) => m.id === memberId);
                    setFormData((prev) => {
                      const currentList = prev.contributors || [];
                      const exists = currentList.some((c) => c.memberId === memberId);
                      if (exists) {
                        return {
                          ...prev,
                          contributors: currentList.map((c) =>
                            c.memberId === memberId
                              ? {
                                  ...c,
                                  roleInProject: role,
                                  description: desc,
                                  memberName: foundMember?.name || c.memberName,
                                  memberRole: foundMember?.role || c.memberRole,
                                  memberImage: foundMember?.image || c.memberImage,
                                }
                              : c
                          ),
                        };
                      }
                      return {
                        ...prev,
                        contributors: [
                          ...currentList,
                          {
                            memberId,
                            roleInProject: role,
                            description: desc,
                            memberName: foundMember?.name || memberId,
                            memberRole: foundMember?.role || '',
                            memberImage: foundMember?.image || '',
                            sortOrder: currentList.length,
                          },
                        ],
                      };
                    });
                  }}
                  onDisassociate={(memberId) => {
                    setFormData((prev) => ({
                      ...prev,
                      contributors: (prev.contributors || []).filter((c) => c.memberId !== memberId),
                    }));
                  }}
                />
              </div>
            </div>

            {/* Secondary Column (Right 1 col: Images & Publication) */}
            <div className="space-y-6">
              {/* Image Gallery Manager */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <ImageManagerField
                  single={false}
                  label="Project Photography"
                  helperText="Primary image will serve as portfolio cover. Reorder using arrows."
                  images={formData.images || []}
                  folder="projects"
                  onChange={(imgs) =>
                    setFormData((prev) => ({ ...prev, images: imgs }))
                  }
                />
              </div>

              {/* Publication Status Card */}
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
                    onToggle={() =>
                      setFormData((prev) => ({ ...prev, isDraft: !prev.isDraft }))
                    }
                  />
                </div>
                <p className="text-micro opacity-60">
                  {formData.isDraft
                    ? 'Staged in draft mode. Hidden from public portfolio.'
                    : 'Published and showcased on public /works pages.'}
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
                    You have modified this project. Save to apply or reset to discard changes.
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

              {viewMode === 'edit' && (
                <div
                  className={`p-6 rounded-xl border space-y-3 ${
                    isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="text-caption font-semibold uppercase tracking-wider block text-red-600 dark:text-red-400">
                    Danger Zone
                  </span>
                  <p className="text-micro opacity-70">
                    Permanently delete this project portfolio item and all associated specs and photos.
                  </p>
                  <Button
                    type="ghost"
                    onClick={() => setProjectToDelete(formData)}
                    fullWidth
                    className="!py-2 text-mini border border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 size={14} className="mr-1.5 inline" /> Delete Project
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // RENDER: PROJECTS LIST VIEW
  // ==========================================
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage projects"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Projects' }]}
        actions={
          <Button type="filled" onClick={startCreate} className="!py-2 !px-4 text-mini font-semibold">
            <Plus size={14} className="mr-1 inline" /> Add Project
          </Button>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter and Search Bar */}
        <div
          className={`p-4 rounded-xl border space-y-3.5 ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {/* Top Row: Search box, Status Filter, Visibility Filter */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search box */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by title, location, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter Tabs */}
              <div className="p-1 rounded-lg border border-black/10 dark:border-white/10 flex items-center gap-1 flex-wrap">
                {(['all', 'completed', 'ongoing', 'schematics'] as ProjectStatusFilter[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-md text-mini font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-space-sparkle text-white'
                        : isDarkMode
                          ? 'hover:bg-white/5 text-bright-gray/70'
                          : 'hover:bg-black/5 text-vintage-charcoal/70'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Visibility Filter (All, Published, Draft) */}
              <div className="flex items-center gap-1 border-l pl-3 border-black/10 dark:border-white/10">
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
            </div>
          </div>

          {/* Bottom Row: Category & Typology Filters */}
          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-mini">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 mr-1">
                Category:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PROJECT_FILTER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setTypologyFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-mini font-medium uppercase tracking-wider transition-colors cursor-pointer border ${
                      categoryFilter === cat
                        ? 'bg-space-sparkle text-white border-space-sparkle'
                        : isDarkMode
                          ? 'border-gray-600 hover:bg-white/5 text-bright-gray/80'
                          : 'border-gray-300 hover:bg-black/5 text-vintage-charcoal/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Typology Filter Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 mr-1">
                Typology:
              </span>
              <select
                value={typologyFilter}
                onChange={(e) => setTypologyFilter(e.target.value)}
                className={`text-mini px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-vintage-charcoal text-bright-gray'
                    : 'border-gray-300 bg-white text-vintage-charcoal'
                }`}
              >
                <option value="all">All Typologies</option>
                {availableTypologies.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const team = getTeamForProject(project.id);
              return (
                <div
                  key={project.id}
                  className={`rounded-xl border overflow-hidden flex flex-col justify-between transition-all group ${
                    isDarkMode
                      ? 'bg-vintage-charcoal/60 border-white/10 hover:border-space-sparkle/40'
                      : 'bg-white border-black/10 hover:border-space-sparkle/40 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Cover Thumbnail */}
                    <div className="relative aspect-video w-full bg-black/10 overflow-hidden">
                      {project.images && project.images[0] ? (
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-40">
                          <Building size={28} />
                        </div>
                      )}

                      {/* Top Overlay Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded text-micro uppercase tracking-wider font-semibold font-mono backdrop-blur-md bg-black/60 text-white">
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {project.projectCode && (
                            <span className="text-micro font-mono font-bold px-1.5 py-0.5 rounded bg-space-sparkle/15 text-space-sparkle">
                              {project.projectCode}
                            </span>
                          )}
                          <span className="text-micro font-mono uppercase tracking-wider text-space-sparkle block">
                            {project.category || project.mainCategory}
                          </span>
                        </div>
                        <h3 className="font-bold text-caption sm:text-body line-clamp-1">
                          {project.title}
                        </h3>
                      </div>

                      <div className="space-y-1 text-mini opacity-70">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="shrink-0 text-space-sparkle" />
                          <span className="truncate">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="shrink-0 text-space-sparkle" />
                          <span>{project.year}</span>
                        </div>
                      </div>

                      {/* Team involvement preview */}
                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-micro font-mono opacity-70">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-space-sparkle" />
                          {team.length} Team Member(s)
                        </span>
                        <span>{project.images?.length || 0} photo(s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row (pt-[4px] creates 4px space between border-t and edit button) */}
                  <div className="p-4 pt-[4px] flex items-center justify-between gap-2 border-t border-black/5 dark:border-white/5 mt-2">
                    <Button
                      type="ghost"
                      onClick={() => startEdit(project)}
                      className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                    >
                      <Edit2 size={13} className="mr-1 inline" /> Edit
                    </Button>

                    <span
                      className={`px-2 py-0.5 rounded text-micro font-mono uppercase tracking-wider font-semibold ${
                        project.isDraft
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {project.isDraft ? 'Draft' : 'Published'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3 rounded-xl border border-dashed border-black/15 dark:border-white/15">
            <FolderKanban size={32} className="mx-auto opacity-30 text-space-sparkle" />
            <p className="text-caption opacity-60">No projects found matching current criteria.</p>
            <Button type="filled" onClick={startCreate} className="!py-1.5 !px-4 text-mini">
              Add New Project
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Modal (Exclusively for delete confirmation) */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Remove Architectural Project?"
        description={`Are you sure you want to remove "${projectToDelete?.title}"? All photos, specifications, and associated member linkages will be removed from the database.`}
        confirmLabel="Confirm Delete"
        cancelLabel="Keep Project"
        isDestructive={true}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
            setViewMode('list');
          }
        }}
      />
    </div>
  );
}
