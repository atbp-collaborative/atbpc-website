/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { MemberInvolvement, Project, Role } from '@/types';
import { Plus, Trash2, Building, Briefcase, Filter } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import {
  MAIN_CATEGORIES,
  TYPOLOGY_MAP,
  getTypologiesForCategory,
} from '@/lib/projects/project-constants';
import { getRoles } from '@/services/mock/adminMockStorage';

interface MemberInvolvementManagerProps {
  involvements: MemberInvolvement[];
  allProjects: Project[];
  allRoles?: Role[];
  onChange: (involvements: MemberInvolvement[]) => void;
}

export const MemberInvolvementManager: React.FC<MemberInvolvementManagerProps> = ({
  involvements = [],
  allProjects = [],
  allRoles,
  onChange,
}) => {
  const { isDarkMode } = useTheme();

  // Cascading project selection states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTypology, setSelectedTypology] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Role states (based on Manage Roles)
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Effective roles from Manage Roles
  const rolesList = useMemo(() => {
    return allRoles && allRoles.length > 0 ? allRoles : getRoles();
  }, [allRoles]);

  // Group roles by category for easy selection
  const designerRoles = useMemo(
    () => rolesList.filter((r) => r.category === 'designers'),
    [rolesList]
  );
  const managerRoles = useMemo(
    () => rolesList.filter((r) => r.category === 'managers'),
    [rolesList]
  );
  const builderRoles = useMemo(
    () => rolesList.filter((r) => r.category === 'builders'),
    [rolesList]
  );

  // Projects not yet associated
  const unlinkedProjects = useMemo(() => {
    return allProjects.filter((p) => !involvements.some((inv) => inv.projectId === p.id));
  }, [allProjects, involvements]);

  // Available typologies based on selected category
  const availableTypologies = useMemo(() => {
    return getTypologiesForCategory(selectedCategory);
  }, [selectedCategory]);

  // Cascading filtered projects
  const filteredProjects = useMemo(() => {
    return unlinkedProjects.filter((p) => {
      // Resolve project category
      const projCat =
        p.mainCategory ||
        Object.keys(TYPOLOGY_MAP).find((cat) =>
          TYPOLOGY_MAP[cat].includes(p.category) ||
          (p.subcategory && TYPOLOGY_MAP[cat].includes(p.subcategory))
        ) ||
        '';

      if (
        selectedCategory &&
        selectedCategory !== 'all' &&
        projCat.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Resolve project typology
      const projTyp = p.subcategory || p.category || '';
      if (
        selectedTypology &&
        selectedTypology !== 'all' &&
        projTyp.toLowerCase() !== selectedTypology.toLowerCase()
      ) {
        return false;
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

  const handleAdd = () => {
    if (!selectedProjectId) return;
    const project = allProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    let roleTitle = 'Contributor';
    if (selectedRoleId === '__custom__') {
      roleTitle = customRole.trim() || 'Contributor';
    } else if (selectedRoleId) {
      const foundRole = rolesList.find((r) => r.id === selectedRoleId || r.title === selectedRoleId);
      roleTitle = foundRole ? foundRole.title : selectedRoleId;
    }

    const newInvolvement: MemberInvolvement = {
      projectId: project.id,
      projectTitle: project.title,
      roleInProject: roleTitle,
      description: description.trim(),
    };

    onChange([...involvements, newInvolvement]);
    setSelectedProjectId('');
    setSelectedRoleId('');
    setCustomRole('');
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
            Associate this team member with studio portfolio projects.
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
                  <span>{inv.roleInProject}</span>
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

        {/* Cascading Filter Fields: Category & Typology */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              1. Project Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">-- All / Choose Category --</option>
              {MAIN_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              2. Project Typology
            </label>
            <select
              value={selectedTypology}
              onChange={(e) => handleTypologyChange(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">-- All Typologies in Category --</option>
              {availableTypologies.map((typ) => (
                <option key={typ} value={typ}>
                  {typ}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project and Role selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              3. Select Project <span className="text-space-sparkle">*</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">
                {filteredProjects.length === 0
                  ? '-- No Matching Projects Available --'
                  : `-- Choose a Project (${filteredProjects.length}) --`}
              </option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.year || p.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Role in Project (from Manage Roles) <span className="text-space-sparkle">*</span>
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">-- Choose Role from Manage Roles --</option>
              {designerRoles.length > 0 && (
                <optgroup label="Designers">
                  {designerRoles.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                </optgroup>
              )}
              {managerRoles.length > 0 && (
                <optgroup label="Managers">
                  {managerRoles.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                </optgroup>
              )}
              {builderRoles.length > 0 && (
                <optgroup label="Builders">
                  {builderRoles.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                </optgroup>
              )}
              <option value="__custom__">✍️ Other / Custom Role...</option>
            </select>
          </div>
        </div>

        {/* Optional Custom Role Input when __custom__ is selected */}
        {selectedRoleId === '__custom__' && (
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Custom Role Title <span className="text-space-sparkle">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Special Lighting Consultant, Landscape Associate"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className={inputBaseClass}
              autoFocus
            />
          </div>
        )}

        {/* Description field */}
        <div>
          <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
            Involvement Description / Scope (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Spearheaded spatial zoning and passive ventilation design."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputBaseClass}
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="filled"
            onClick={handleAdd}
            disabled={!selectedProjectId || (selectedRoleId === '__custom__' && !customRole.trim())}
            className="!py-1.5 !px-4 text-mini"
          >
            <Plus size={13} className="mr-1 inline" /> Associate Project
          </Button>
        </div>
      </div>
    </div>
  );
};
