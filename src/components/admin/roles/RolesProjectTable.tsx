/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Image from 'next/image';
import {
  FolderKanban,
  UserCheck,
  Briefcase,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ProjectRoleEntry } from '@/hooks/admin/useAdminRoles';
import { Project, Member } from '@/types';
import {
  getCategoryBadgeClasses,
  formatCategoryLabel,
} from '@/lib/roles/role-helpers';
import { Button } from '@/components/primitives/buttons/Button';

interface RolesProjectTableProps {
  entries: ProjectRoleEntry[];
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  onAddProjectRole: () => void;
  onEditProjectRole: (entry: ProjectRoleEntry) => void;
  onRemoveProjectRole: (entry: ProjectRoleEntry) => void;
}

export const RolesProjectTable: React.FC<RolesProjectTableProps> = ({
  entries,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onAddProjectRole,
  onEditProjectRole,
  onRemoveProjectRole,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-4">
      {/* Top Filter and Action Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode
            ? 'bg-vintage-charcoal/60 border-white/10'
            : 'bg-white border-black/10 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <FolderKanban size={16} className="text-space-sparkle" />
            <label
              htmlFor="project-select"
              className="text-caption font-semibold uppercase tracking-wider shrink-0"
            >
              Filter by Project:
            </label>
          </div>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className={`w-full sm:max-w-xs px-3 py-2 rounded-lg border text-caption outline-none transition-colors ${
              isDarkMode
                ? 'bg-vintage-charcoal/80 border-bright-gray/20 text-white focus:border-space-sparkle'
                : 'bg-white border-vintage-charcoal/20 text-vintage-charcoal focus:border-space-sparkle'
            }`}
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.title}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="filled"
          onClick={onAddProjectRole}
          className="!py-2 !px-4 text-caption shrink-0"
        >
          <Plus size={14} className="mr-1.5 inline" /> Assign Member to Project
        </Button>
      </div>

      {/* Main Table */}
      {entries.length === 0 ? (
        <div
          className={`p-12 text-center rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
          }`}
        >
          <div className="p-3 rounded-full bg-space-sparkle/10 text-space-sparkle">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-body font-semibold">No project role assignments found</h4>
            <p className="text-caption opacity-60 max-w-sm">
              No members are assigned to the selected project, or your search filters returned no matches.
            </p>
          </div>
          <Button
            type="outline"
            onClick={onAddProjectRole}
            className="!py-2 !px-4 text-caption mt-2"
          >
            <Plus size={14} className="mr-1 inline" /> Assign Member to Project
          </Button>
        </div>
      ) : (
        <div
          className={`rounded-xl border overflow-hidden transition-all ${
            isDarkMode
              ? 'bg-vintage-charcoal/60 border-white/10'
              : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption border-collapse">
              <thead>
                <tr
                  className={`border-b text-micro font-mono uppercase tracking-wider ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-bright-gray/60'
                      : 'bg-black/5 border-black/10 text-vintage-charcoal/60'
                  }`}
                >
                  <th className="py-3.5 px-4 font-semibold">Project</th>
                  <th className="py-3.5 px-4 font-semibold">Person</th>
                  <th className="py-3.5 px-4 font-semibold">Role in Project</th>
                  <th className="py-3.5 px-4 font-semibold">Scope & Description</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`group transition-colors ${
                      isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    {/* Project */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-0.5 max-w-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-body-sm leading-snug">
                          <Building size={14} className="text-space-sparkle shrink-0" />
                          <span className="truncate">{entry.projectTitle}</span>
                        </div>
                        <span className="text-micro font-mono opacity-50 block">
                          ID: {entry.projectId}
                        </span>
                      </div>
                    </td>

                    {/* Person */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                          {entry.memberImage ? (
                            <Image
                              src={entry.memberImage}
                              alt={entry.memberName}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-space-sparkle/20 flex items-center justify-center">
                              <UserCheck size={14} className="text-space-sparkle" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-semibold text-caption leading-snug truncate">
                            {entry.memberName}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {entry.memberCategories.map((cat) => (
                              <span
                                key={cat}
                                className={`text-[10px] px-1.5 py-0.2 rounded-full border ${getCategoryBadgeClasses(
                                  cat,
                                  isDarkMode
                                )}`}
                              >
                                {formatCategoryLabel(cat)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role in Project */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-caption bg-space-sparkle/10 border-space-sparkle/25 text-space-sparkle">
                        <Briefcase size={13} />
                        <span>{entry.roleInProject}</span>
                      </div>
                    </td>

                    {/* Scope & Description */}
                    <td className="py-3.5 px-4 align-top">
                      <p className="text-caption opacity-80 max-w-md leading-relaxed line-clamp-3">
                        {entry.description || '—'}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditProjectRole(entry)}
                          title="Edit role in project"
                          className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                          aria-label="Edit project role"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onRemoveProjectRole(entry)}
                          title="Remove from project"
                          className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                          aria-label="Remove from project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
