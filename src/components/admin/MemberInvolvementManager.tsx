/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { MemberInvolvement, Project } from '@/types';
import { Plus, Trash2, Building, Briefcase } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [roleInProject, setRoleInProject] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Projects not yet associated
  const availableProjects = allProjects.filter(
    (p) => !involvements.some((inv) => inv.projectId === p.id)
  );

  const handleAdd = () => {
    if (!selectedProjectId) return;
    const project = allProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    const newInvolvement: MemberInvolvement = {
      projectId: project.id,
      projectTitle: project.title,
      roleInProject: roleInProject.trim() || 'Contributor',
      description: description.trim(),
    };

    onChange([...involvements, newInvolvement]);
    setSelectedProjectId('');
    setRoleInProject('');
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
                isDarkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-black/5 border-black/10'
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

      {/* Add new involvement form block (strictly non-modal) */}
      <div
        className={`p-4 rounded-lg border space-y-3 ${
          isDarkMode
            ? 'bg-vintage-charcoal/30 border-space-sparkle/20'
            : 'bg-white border-space-sparkle/20 shadow-xs'
        }`}
      >
        <span className="text-mini font-semibold uppercase tracking-wider text-space-sparkle block">
          + Link New Project Involvement
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">-- Choose a Project --</option>
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Role in Project
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Principal Architect, BIM Lead"
              value={roleInProject}
              onChange={(e) => setRoleInProject(e.target.value)}
              className={inputBaseClass}
            />
          </div>
        </div>

        <div>
          <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
            Involvement Description (Optional)
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
            disabled={!selectedProjectId}
            className="!py-1.5 !px-4 text-mini"
          >
            <Plus size={13} className="mr-1 inline" /> Associate Project
          </Button>
        </div>
      </div>
    </div>
  );
};
