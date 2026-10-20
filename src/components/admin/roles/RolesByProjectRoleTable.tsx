/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2, Plus, AlertCircle, UserCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ProjectRole, Member } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';

interface RolesByProjectRoleTableProps {
  projectRoles: ProjectRole[];
  members: Member[];
  onAddProjectRole: () => void;
  onEditProjectRole: (projectRole: ProjectRole) => void;
  onSelectPerson?: (member: Member) => void;
}

export const RolesByProjectRoleTable: React.FC<RolesByProjectRoleTableProps> = ({
  projectRoles,
  members,
  onAddProjectRole,
  onEditProjectRole,
  onSelectPerson,
}) => {
  const { isDarkMode } = useTheme();
  const [expandedPastRoles, setExpandedPastRoles] = useState<Record<string, boolean>>({});

  const togglePastRole = (roleId: string) => {
    setExpandedPastRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  // Helper to find all distinct members holding this project role
  const getAssignedMembers = (projectRole: ProjectRole): Member[] => {
    return members.filter((member) =>
      member.involvement?.some(
        (inv) =>
          (inv.projectRoleIds && inv.projectRoleIds.includes(projectRole.id)) ||
          (inv.roleInProject && inv.roleInProject.toLowerCase().includes(projectRole.name.toLowerCase())) ||
          (inv.roleInProject && projectRole.code && inv.roleInProject.toLowerCase().includes(projectRole.code.toLowerCase()))
      )
    );
  };

  const renderMemberChip = (member: Member, isPast: boolean = false) => (
    <button
      type="button"
      key={member.id}
      onClick={() => onSelectPerson?.(member)}
      title={`Click to view/manage project involvements for ${member.name}`}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-micro transition-colors cursor-pointer text-left ${
        isPast ? 'opacity-65' : ''
      } ${
        isDarkMode
          ? 'bg-white/5 border-white/10 hover:border-space-sparkle hover:bg-space-sparkle/10'
          : 'bg-black/5 border-black/10 hover:border-space-sparkle hover:bg-space-sparkle/5'
      }`}
    >
      <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="16px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-space-sparkle/20 flex items-center justify-center">
            <UserCheck size={10} className="text-space-sparkle" />
          </div>
        )}
      </div>
      <span className="font-medium truncate max-w-[120px]">{member.name}</span>
      {isPast && (
        <span className="text-[9px] font-mono opacity-60 uppercase tracking-tight">Past</span>
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Main Table */}
      {projectRoles.length === 0 ? (
        <div
          className={`p-12 text-center rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 ${
            isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
          }`}
        >
          <div className="p-3 rounded-full bg-space-sparkle/10 text-space-sparkle">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-body font-semibold">No project roles found</h4>
            <p className="text-caption opacity-60 max-w-sm">
              No project roles match your current search query or exist in the database.
            </p>
          </div>
          <Button
            type="outline"
            onClick={onAddProjectRole}
            className="!py-2 !px-4 text-caption mt-2"
          >
            <Plus size={14} className="mr-1 inline" /> Add Project Role
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
                  <th className="py-3.5 px-4 font-semibold">Project Role & Code</th>
                  <th className="py-3.5 px-4 font-semibold">Persons in this Role</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {projectRoles.map((pr) => {
                  const assignedMembers = getAssignedMembers(pr);
                  const activeMembers = assignedMembers.filter((m) => m.isCurrentlyHired !== false);
                  const pastMembers = assignedMembers.filter((m) => m.isCurrentlyHired === false);
                  const isPastExpanded = Boolean(expandedPastRoles[pr.id]);
                  const isActive = pr.isActive !== false;

                  return (
                    <tr
                      key={pr.id}
                      className={`group transition-colors ${
                        isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                      }`}
                    >
                      {/* Name & Code & Description */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1 max-w-md">
                          <div className="flex items-center gap-2">
                            {pr.code && (
                              <span className="text-micro font-mono px-2 py-0.5 rounded-md bg-space-sparkle/15 text-space-sparkle font-bold shrink-0">
                                {pr.code}
                              </span>
                            )}
                            <span className="font-semibold text-body-sm leading-snug">
                              {pr.name}
                            </span>
                          </div>
                          {pr.description && (
                            <p className="text-micro opacity-60 leading-relaxed line-clamp-2">
                              {pr.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Persons in this Role */}
                      <td className="py-3.5 px-4 align-top">
                        {activeMembers.length === 0 && pastMembers.length === 0 ? (
                          <span className="text-micro opacity-40 italic">No person/s assigned</span>
                        ) : (
                          <div className="space-y-1.5">
                            {activeMembers.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                                {activeMembers.map((member) => renderMemberChip(member, false))}
                              </div>
                            ) : (
                              <span className="text-micro opacity-40 italic block">
                                No active person/s assigned
                              </span>
                            )}

                            {pastMembers.length > 0 && (
                              <div className="space-y-1.5 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => togglePastRole(pr.id)}
                                  className="text-micro text-space-sparkle hover:underline cursor-pointer block font-medium"
                                >
                                  {isPastExpanded ? 'Hide Past Contributors' : 'Show Past Contributors'}
                                </button>

                                {isPastExpanded && (
                                  <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                                    {pastMembers.map((member) => renderMemberChip(member, true))}
                                  </div>
                                )}
                              </div>
                            )}

                            <span className="text-micro font-mono opacity-50 block">
                              Total: {activeMembers.length} active{pastMembers.length > 0 ? `, ${pastMembers.length} past` : ''}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-micro font-medium border ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions (Only Edit, No Trash icon per specification) */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditProjectRole(pr)}
                            title="Edit Project Role"
                            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                            aria-label="Edit project role"
                          >
                            <Edit2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
