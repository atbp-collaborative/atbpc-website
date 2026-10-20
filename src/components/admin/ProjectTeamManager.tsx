/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Member, Role, ProjectContributor, ProjectRole } from '@/types';
import { ProjectTeamMemberEntry, INITIAL_PROJECT_ROLES_DATA } from '@/services/mock/adminMockStorage';
import { getProjectRolesFromSupabase } from '@/services/supabase/project-roles.service';
import { Plus, Trash2, UserCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';

interface ProjectTeamManagerProps {
  projectId: string;
  team: (ProjectTeamMemberEntry | ProjectContributor)[];
  allMembers: Member[];
  allRoles?: Role[];
  projectRoles?: ProjectRole[];
  onAssociate: (memberId: string, roleInProject: string, description: string) => void;
  onDisassociate: (memberId: string) => void;
}

export const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({
  projectId,
  team = [],
  allMembers = [],
  allRoles,
  projectRoles,
  onAssociate,
  onDisassociate,
}) => {
  const { isDarkMode } = useTheme();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [loadedProjectRoles, setLoadedProjectRoles] = useState<ProjectRole[]>(
    projectRoles && projectRoles.length > 0 ? projectRoles : INITIAL_PROJECT_ROLES_DATA
  );

  useEffect(() => {
    if (projectRoles && projectRoles.length > 0) {
      setLoadedProjectRoles(projectRoles);
    } else {
      getProjectRolesFromSupabase().then((roles) => {
        if (roles && roles.length > 0) {
          setLoadedProjectRoles(roles);
        }
      });
    }
  }, [projectRoles]);

  // Members not yet assigned to this project
  const availableMembers = allMembers.filter(
    (m) => !team.some((t) => t.memberId === m.id)
  );

  const handleAdd = () => {
    if (!selectedMemberId || !selectedRoleId || !description.trim()) return;

    let roleTitle = 'Contributor';
    if (selectedRoleId === '__custom__') {
      if (!customRole.trim()) return;
      roleTitle = customRole.trim();
    } else if (selectedRoleId) {
      const foundRole = loadedProjectRoles.find((r) => r.id === selectedRoleId || r.name === selectedRoleId);
      roleTitle = foundRole ? foundRole.name : selectedRoleId;
    }

    onAssociate(selectedMemberId, roleTitle, description.trim());
    setSelectedMemberId('');
    setSelectedRoleId('');
    setCustomRole('');
    setDescription('');
  };

  const isAddDisabled =
    !selectedMemberId ||
    !selectedRoleId ||
    (selectedRoleId === '__custom__' && !customRole.trim()) ||
    !description.trim();

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
            Project Contributors ({team.length})
          </h4>
          <p className="text-micro opacity-60">
            Designers, managers, and builders who contributed to this project.
          </p>
        </div>
      </div>

      {/* Current Team list */}
      {team.length > 0 ? (
        <div className="space-y-2">
          {team.map((t) => (
            <div
              key={t.memberId}
              className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                  {t.memberImage ? (
                    <Image
                      src={t.memberImage}
                      alt={t.memberName || 'Member'}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-space-sparkle/20 text-space-sparkle">
                      <UserCheck size={18} />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-caption truncate">{t.memberName || t.memberId}</span>
                    {t.memberRole && (
                      <span className="text-micro opacity-60 truncate">({t.memberRole})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-mini text-space-sparkle">
                    <Briefcase size={11} className="shrink-0" />
                    <span className="font-medium">{t.roleInProject}</span>
                  </div>
                  {t.description && (
                    <p className="text-micro opacity-60 leading-relaxed truncate">{t.description}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDisassociate(t.memberId)}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer shrink-0"
                title="Remove contributor"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-dashed border-black/15 dark:border-white/15 text-center text-mini opacity-60">
          No contributors currently assigned to this project.
        </div>
      )}

      {/* Add new assignment block */}
      <div
        className={`p-4 rounded-lg border space-y-3 ${
          isDarkMode
            ? 'bg-vintage-charcoal/30 border-space-sparkle/20'
            : 'bg-white border-space-sparkle/20 shadow-xs'
        }`}
      >
        <span className="text-mini font-semibold uppercase tracking-wider text-space-sparkle block">
          + Add Project Contributor
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Select Member <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">[ Select Contributor ]</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Project Role <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">[ Select Project Role ]</option>
              {loadedProjectRoles.map((pr) => (
                <option key={pr.id} value={pr.name}>
                  {pr.name} ({pr.code})
                </option>
              ))}
              <option value="__custom__">✍️ Other / Custom Role...</option>
            </select>
          </div>
        </div>

        {selectedRoleId === '__custom__' && (
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Custom Role Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Interior Designer, Site Engineer"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className={inputBaseClass}
              autoFocus
            />
          </div>
        )}

        <div>
          <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
            Role Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Led architectural design"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputBaseClass}
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="filled"
            onClick={handleAdd}
            disabled={isAddDisabled}
            className="!py-1.5 !px-4 text-mini"
          >
            <Plus size={13} className="mr-1 inline" /> Add Entry
          </Button>
        </div>
      </div>
    </div>
  );
};
