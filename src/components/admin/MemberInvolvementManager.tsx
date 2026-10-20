/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MemberInvolvement, Project, ProjectRole, ProjectCategoryItem, ProjectTypologyItem } from '@/types';
import { Plus, Trash2, Building, Briefcase, Filter } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { ComboboxMultiSelect } from '@/components/admin/ComboboxMultiSelect';
import { getProjectRolesFromSupabase } from '@/services/supabase/project-roles.service';
import { getProjectCategories, getProjectTypologies } from '@/services/mock/adminMockStorage';
import { supabasePublic } from '@/lib/supabase/public';

interface MemberInvolvementManagerProps {
  involvements: MemberInvolvement[];
  allProjects: Project[];
  onChange: (involvements: MemberInvolvement[]) => void;
}

export const MemberInvolvementManager: React.FC<MemberInvolvementManagerProps> = ({
  involvements = [],
  allProjects = [],
  onChange,
}) => {
  const { isDarkMode } = useTheme();

  // Dynamic reference tables state
  const [categories, setCategories] = useState<ProjectCategoryItem[]>([]);
  const [typologies, setTypologies] = useState<ProjectTypologyItem[]>([]);
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);

  // Cascading project selection states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTypology, setSelectedTypology] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Multi-chip project roles and description
  const [selectedProjectRoleIds, setSelectedProjectRoleIds] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');

  // Fetch categories, typologies, and project roles
  useEffect(() => {
    async function loadReferenceData() {
      // Load Categories
      try {
        const { data: catData } = await supabasePublic
          .from('project_categories')
          .select('*')
          .order('sort_order', { ascending: true });
        if (catData && catData.length > 0) {
          setCategories(catData.map((c: any) => ({
            id: c.id,
            name: c.name,
            tagline: c.tagline || '',
            heroImageUrl: c.hero_image_url,
            sortOrder: c.sort_order,
          })));
        } else {
          setCategories(getProjectCategories());
        }
      } catch {
        setCategories(getProjectCategories());
      }

      // Load Typologies
      try {
        const { data: typData } = await supabasePublic
          .from('project_typologies')
          .select('*')
          .order('sort_order', { ascending: true });
        if (typData && typData.length > 0) {
          setTypologies(typData.map((t: any) => ({
            id: t.id,
            categoryId: t.category_id,
            name: t.name,
            description: t.description,
            sortOrder: t.sort_order,
          })));
        } else {
          setTypologies(getProjectTypologies());
        }
      } catch {
        setTypologies(getProjectTypologies());
      }

      // Load Project Roles (Separate entity from studio roles)
      const pRoles = await getProjectRolesFromSupabase();
      setProjectRoles(pRoles);
    }

    loadReferenceData();
  }, []);

  // Projects not yet associated
  const unlinkedProjects = useMemo(() => {
    return allProjects.filter((p) => !involvements.some((inv) => inv.projectId === p.id));
  }, [allProjects, involvements]);

  // Available typologies filtered by selected category
  const availableTypologies = useMemo(() => {
    if (!selectedCategory) return typologies;
    return typologies.filter(
      (t) => t.categoryId.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory, typologies]);

  // Filter projects by category and typology
  const filteredProjects = useMemo(() => {
    return unlinkedProjects.filter((p) => {
      if (selectedCategory) {
        const matchesCat =
          (p.categoryId && p.categoryId.toLowerCase() === selectedCategory.toLowerCase()) ||
          (p.mainCategory && p.mainCategory.toLowerCase() === selectedCategory.toLowerCase()) ||
          (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
        if (!matchesCat) return false;
      }

      if (selectedTypology) {
        const matchesTyp =
          (p.typologyId && p.typologyId.toLowerCase() === selectedTypology.toLowerCase()) ||
          (p.subcategory && p.subcategory.toLowerCase() === selectedTypology.toLowerCase()) ||
          (p.category && p.category.toLowerCase() === selectedTypology.toLowerCase());
        if (!matchesTyp) return false;
      }

      return true;
    });
  }, [unlinkedProjects, selectedCategory, selectedTypology]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedTypology('');
    setSelectedProjectId('');
  };

  const handleTypologyChange = (typ: string) => {
    setSelectedTypology(typ);
    setSelectedProjectId('');
  };

  // Strict validation guard: "do not accept Associate Project if any field has no value provided"
  const canAssociate = Boolean(
    selectedCategory &&
    selectedTypology &&
    selectedProjectId &&
    selectedProjectRoleIds.length > 0 &&
    description.trim().length > 0
  );

  const handleAdd = () => {
    if (!canAssociate) return;
    const project = allProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    // Concatenate project role names for display
    const roleNames = selectedProjectRoleIds
      .map((id) => projectRoles.find((r) => r.id === id)?.name || id)
      .join(', ');

    const newInvolvement: MemberInvolvement = {
      projectId: project.id,
      projectTitle: project.title,
      projectSlug: project.slug || project.id,
      roleInProject: roleNames,
      projectRoleIds: selectedProjectRoleIds,
      description: description.trim(),
    };

    onChange([...involvements, newInvolvement]);
    setSelectedCategory('');
    setSelectedTypology('');
    setSelectedProjectId('');
    setSelectedProjectRoleIds([]);
    setDescription('');
  };

  const handleRemove = (projectId: string) => {
    onChange(involvements.filter((inv) => inv.projectId !== projectId));
  };

  const inputBaseClass = `w-full text-caption px-3 py-2 rounded-lg border outline-none ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-caption font-semibold uppercase tracking-wider">
            Project Involvements ({involvements.length})
          </h4>
          <p className="text-micro opacity-60">
            Associate this team member with studio portfolio projects and contribution scopes.
          </p>
        </div>
      </div>

      {/* Existing associations */}
      {involvements.length > 0 ? (
        <div className="space-y-2">
          {involvements.map((inv) => (
            <div
              key={inv.projectId}
              className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-space-sparkle shrink-0" />
                  <span className="font-semibold text-caption">{inv.projectTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-mini opacity-80 pl-5">
                  <Briefcase size={12} className="opacity-60 shrink-0" />
                  <span className="font-medium text-space-sparkle">{inv.roleInProject}</span>
                </div>
                {inv.description && (
                  <p className="text-micro opacity-60 pl-5 leading-relaxed">
                    {inv.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemove(inv.projectId)}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer shrink-0"
                title="Remove involvement"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-dashed border-black/15 dark:border-white/15 text-center text-mini opacity-60">
          No projects currently associated with this member.
        </div>
      )}

      {/* Add new involvement block */}
      <div
        className={`p-4 rounded-lg border space-y-3.5 ${
          isDarkMode
            ? 'bg-vintage-charcoal/30 border-space-sparkle/20'
            : 'bg-white border-space-sparkle/20 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-1.5 text-mini font-semibold uppercase tracking-wider text-space-sparkle">
          <Filter size={13} />
          <span>Link New Project Involvement</span>
        </div>

        {/* Cascading Filter Fields: Category & Typology (from database) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Project Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">[ Select Project Category ]</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Project Typology <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTypology}
              onChange={(e) => handleTypologyChange(e.target.value)}
              disabled={!selectedCategory}
              className={`${inputBaseClass} ${!selectedCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">[ Select Project Typology ]</option>
              {availableTypologies.map((typ) => (
                <option key={typ.id} value={typ.id}>
                  {typ.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project selector */}
        <div>
          <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
            Select Project <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={!selectedTypology}
            className={`${inputBaseClass} ${!selectedTypology ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {!selectedTypology
                ? '[ Select a Typology First ]'
                : filteredProjects.length === 0
                  ? '-- No Matching Projects Available --'
                  : `[ Select Project ] (${filteredProjects.length})`}
            </option>
            {filteredProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.year || p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Role in Project (Multi-chip Combobox from separate project_roles schema) */}
        <div>
          <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
            Role in Project <span className="text-red-500">*</span>
          </label>
          <ComboboxMultiSelect
            options={projectRoles.map((pr) => ({
              id: pr.id,
              label: pr.name,
              sublabel: pr.code,
            }))}
            selectedIds={selectedProjectRoleIds}
            onChange={setSelectedProjectRoleIds}
            placeholder="[ Select Role/s ]"
            searchPlaceholder="Search project roles..."
          />
        </div>

        {/* Role Description Textarea */}
        <div>
          <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
            Role Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Spearheaded spatial zoning and passive ventilation system."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputBaseClass}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-micro opacity-50">
            {!canAssociate && 'All 5 fields must be filled to associate project.'}
          </p>

          <Button
            type="filled"
            onClick={handleAdd}
            disabled={!canAssociate}
            className="!py-1.5 !px-4 text-mini"
          >
            <Plus size={13} className="mr-1 inline" /> Associate Project
          </Button>
        </div>
      </div>
    </div>
  );
};
