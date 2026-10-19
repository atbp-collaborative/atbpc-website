/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Member, Role } from '@/types';
import { ProjectTeamMemberEntry, getRoles } from '@/services/mock/adminMockStorage';
import { Plus, Trash2, UserCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';

interface ProjectTeamManagerProps {
  projectId: string;
  team: ProjectTeamMemberEntry[];
  allMembers: Member[];
  allRoles?: Role[];
  onAssociate: (memberId: string, roleInProject: string, description: string) => void;
  onDisassociate: (memberId: string) => void;
}

export const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({
  projectId,
  team = [],
  allMembers = [],
  allRoles,
  onAssociate,
  onDisassociate,
}) => {
  const { isDarkMode } = useTheme();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const rolesList = useMemo(() => {
    return allRoles && allRoles.length > 0 ? allRoles : getRoles();
  }, [allRoles]);

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

  // Members not yet assigned to this project
  const availableMembers = allMembers.filter(
    (m) => !team.some((t) => t.memberId === m.id)
  );

  const handleAdd = () => {
    if (!selectedMemberId) return;

    let roleTitle = 'Contributor';
    if (selectedRoleId === '__custom__') {
      roleTitle = customRole.trim() || 'Contributor';
    } else if (selectedRoleId) {
      const foundRole = rolesList.find((r) => r.id === selectedRoleId || r.title === selectedRoleId);
      roleTitle = foundRole ? foundRole.title : selectedRoleId;
    }

    onAssociate(selectedMemberId, roleTitle, description.trim());
    setSelectedMemberId('');
    setSelectedRoleId('');
    setCustomRole('');
    setDescription('');
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
            Assigned Team & Collaborators ({team.length})
          </h4>
          <p className="text-micro opacity-60">
            Designers, managers, and engineers who contributed to this project.
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
                      alt={t.memberName}
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
                    <span className="font-semibold text-caption truncate">{t.memberName}</span>
                    <span className="text-micro opacity-60 truncate">({t.memberRole})</span>
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
                title="Remove collaborator"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-dashed border-black/15 dark:border-white/15 text-center text-mini opacity-60">
          No team members currently assigned to this project.
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
          + Assign Team Member to this Project
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className={inputBaseClass}
            >
              <option value="">-- Choose Team Member --</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Role in this Project (from Manage Roles)
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

        {selectedRoleId === '__custom__' && (
          <div>
            <label className="text-micro uppercase tracking-wider block opacity-70 mb-1">
              Custom Role Title
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
            Role / Contribution Summary (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Led structural foundation inspections and formwork approval."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputBaseClass}
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="filled"
            onClick={handleAdd}
            disabled={!selectedMemberId || (selectedRoleId === '__custom__' && !customRole.trim())}
            className="!py-1.5 !px-4 text-mini"
          >
            <Plus size={13} className="mr-1 inline" /> Assign Member
          </Button>
        </div>
      </div>
    </div>
  );
};
