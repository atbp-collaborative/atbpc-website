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
import {
  useAdminProjects,
  ProjectStatusFilter,
  VisibilityFilter,
} from '@/hooks/admin/useAdminProjects';
import { useAdminPeople } from '@/hooks/admin/useAdminPeople';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/types';

type ViewMode = 'list' | 'create' | 'edit';

const EMPTY_PROJECT: Project = {
  id: '',
  title: '',
  category: 'Multi-Generational',
  mainCategory: 'Shelter',
  subcategory: 'Multi-Generational',
  location: 'Metro Manila, Philippines',
  year: '2026',
  clientType: 'Mid-High-Income',
  description: '',
  fullWriteup: '',
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  ],
  video: '',
  status: 'ongoing',
  specs: {
    area: '250 sqm',
    scope: 'Comprehensive Architectural & Interior Design',
    duration: '12 Months',
    materials: ['Concrete', 'Wood', 'Steel', 'Glass'],
  },
  isDraft: false,
};

const MAIN_CATEGORIES = [
  'Shelter',
  'Livelihood',
  'Community',
  'Residential',
  'Commercial',
  'Institutional',
];

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

const TYPOLOGY_MAP: Record<string, string[]> = {
  Shelter: ['Tiny Living', 'Multi-Generational', 'Vacation Homes'],
  Livelihood: ['Food & Beverage', 'Retail & Lifestyle', 'Workspaces'],
  Community: ['Shared Spaces', 'Shared Places', 'Sacred Structures'],
};

const ALL_TYPOLOGIES = [
  'Tiny Living',
  'Multi-Generational',
  'Vacation Homes',
  'Food & Beverage',
  'Retail & Lifestyle',
  'Workspaces',
  'Shared Spaces',
  'Shared Places',
  'Sacred Structures',
];

export default function AdminProjectsPage() {
  const { isDarkMode } = useTheme();
  const {
    filteredProjects,
    allCategories,
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
    saveProject,
    deleteProject,
    toggleDraft,
    getTeamForProject,
    associateMember,
    disassociateMember,
  } = useAdminProjects();

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
    const newProj: Project = {
      ...EMPTY_PROJECT,
      id: 'project-' + Date.now(),
    };
    initialDataRef.current = newProj;
    setFormData(newProj);
    setViewMode('create');
  };

  const startEdit = (proj: Project) => {
    initialDataRef.current = { ...proj };
    setFormData({ ...proj });
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
    if (!formData.title.trim()) return;

    const cleanId =
      formData.id.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const projectToSave = {
      ...formData,
      id: cleanId,
    };

    saveProject(projectToSave);
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
                <RotateCcw size={13} className="mr-1.5 inline" /> Reset Defaults
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
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g. Multi-Generational Residence 1"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Main Category
                    </label>
                    <select
                      value={formData.mainCategory || 'Shelter'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, mainCategory: e.target.value }))
                      }
                      className={inputClass}
                    >
                      {MAIN_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Typology / Subcategory
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                          subcategory: e.target.value,
                        }))
                      }
                      placeholder="e.g. Vacation Homes, Tiny Living"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="e.g. Metro Manila, Philippines"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Year Completed / Begun
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, year: e.target.value }))
                      }
                      placeholder="e.g. 2026"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Client Demographic
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
                      {CLIENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project Lifecycle Status
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
                      {PROJECT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Project ID / URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, id: e.target.value }))
                      }
                      placeholder="e.g. multi-generational-1"
                      className={`${inputClass} font-mono text-mini`}
                    />
                    <p className="text-micro opacity-50">
                      Public path: /works/{formData.id || 'slug'}
                    </p>
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
                    Short Overview Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief 1-2 sentence overview for cards and portfolio preview..."
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Comprehensive Full Writeup
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
                    Walkthrough Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.video || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, video: e.target.value }))
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Card 3: Specifications & Materials */}
              <div
                className={`p-6 rounded-xl border space-y-4 ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <h3 className="text-caption font-semibold uppercase tracking-wider opacity-70 border-b pb-2 border-black/5 dark:border-white/5">
                  Tectonics &amp; Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Floor Area
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.area || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specs: { ...prev.specs, area: e.target.value },
                        }))
                      }
                      placeholder="e.g. 140 sqm"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Engagement Scope
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.scope || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specs: { ...prev.specs, scope: e.target.value },
                        }))
                      }
                      placeholder="e.g. Comprehensive Design-Build"
                      className={inputClass}
                    />
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
                      placeholder="e.g. 12 Months"
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

              {/* Card 4: Assigned Team & Collaborators (Bi-directional link to Members) */}
              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                <ProjectTeamManager
                  projectId={formData.id}
                  team={currentTeam}
                  allMembers={allMembers}
                  onAssociate={(memberId, role, desc) => {
                    associateMember(memberId, formData.id, role, desc);
                  }}
                  onDisassociate={(memberId) => {
                    disassociateMember(memberId, formData.id);
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
                      <RotateCcw size={13} className="mr-1.5 inline" /> Reset Defaults
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
        {filteredProjects.length > 0 ? (
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
                        <span className="text-micro font-mono uppercase tracking-wider text-space-sparkle block">
                          {project.category || project.mainCategory}
                        </span>
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
