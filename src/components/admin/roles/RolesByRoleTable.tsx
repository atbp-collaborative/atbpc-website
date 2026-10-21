/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2, UserPlus, UserCheck, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Role, Member, RoleVisibility } from '@/types';
import {
  getCategoryBadgeClasses,
  getTrackBadgeClasses,
  formatCategoryLabel,
  formatTrackLabel,
  getMembersForRole,
} from '@/lib/roles/role-helpers';
import { updateRoleVisibilityAction } from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

interface RolesByRoleTableProps {
  roles: Role[];
  allMembers: Member[];
  onEditRole: (role: Role) => void;
  onDeleteRole?: (role: Role) => void;
  onAssignPersons: (role: Role) => void;
}

const getVisibilityBadgeClasses = (visibility: RoleVisibility = 'public') => {
  switch (visibility) {
    case 'superadmin':
      return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    case 'admin':
      return 'bg-space-sparkle/15 text-space-sparkle border-space-sparkle/30';
    case 'editor':
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    case 'public':
    default:
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  }
};

export const RolesByRoleTable: React.FC<RolesByRoleTableProps> = ({
  roles,
  allMembers,
  onEditRole,
  onDeleteRole,
  onAssignPersons,
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAdminAuth();
  const isSuperadmin = user?.role === 'superadmin';

  const [expandedPastRoles, setExpandedPastRoles] = useState<Record<string, boolean>>({});
  const [visibilityOverrides, setVisibilityOverrides] = useState<Record<string, RoleVisibility>>({});

  const togglePastRole = (roleId: string) => {
    setExpandedPastRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const handleChangeVisibility = async (role: Role, nextVis: RoleVisibility) => {
    if (!isSuperadmin) return;

    const currentVis = visibilityOverrides[role.id] ?? role.role_visibility ?? 'public';
    setVisibilityOverrides((prev) => ({ ...prev, [role.id]: nextVis }));

    const res = await updateRoleVisibilityAction(role.id, nextVis);
    if (res.success) {
      toast.success(`Role "${role.title}" visibility set to ${nextVis}.`);
    } else {
      setVisibilityOverrides((prev) => ({ ...prev, [role.id]: currentVis }));
      toast.error(res.error || 'Failed to update role visibility.');
    }
  };

  const renderMemberChip = (member: Member, isPast: boolean = false) => (
    <div
      key={member.id}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-micro transition-colors ${
        isPast ? 'opacity-65' : ''
      } ${
        isDarkMode
          ? 'bg-white/5 border-white/10'
          : 'bg-black/5 border-black/10'
      }`}
    >
      <div className="relative w-4 h-4 rounded-full overflow-hidden bg-space-sparkle/20 shrink-0">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            sizes="16px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-space-sparkle">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      <span className="font-medium truncate max-w-[120px]">{member.name}</span>

      {isPast && (
        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/10 dark:bg-white/10 opacity-70">
          Past
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {roles.length === 0 ? (
        <div
          className={`p-10 text-center rounded-2xl border ${
            isDarkMode
              ? 'bg-vintage-charcoal/40 border-white/10 text-bright-gray/60'
              : 'bg-black/[0.02] border-black/10 text-vintage-charcoal/60'
          }`}
        >
          <AlertCircle size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-body font-medium">No roles match the selected filters.</p>
          <p className="text-micro mt-1 opacity-70">
            Try adjusting your search query, department, or track selection.
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
            isDarkMode
              ? 'bg-vintage-charcoal/60 border-white/10'
              : 'bg-white border-black/10'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-mini">
              <thead>
                <tr
                  className={`border-b text-micro uppercase tracking-wider font-mono ${
                    isDarkMode
                      ? 'border-white/10 bg-white/[0.02] text-bright-gray/70'
                      : 'border-black/10 bg-black/[0.02] text-vintage-charcoal/70'
                  }`}
                >
                  <th className="py-3.5 px-4 font-semibold">Role &amp; Code</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Track</th>
                  <th className="py-3.5 px-4 font-semibold">Visibility</th>
                  <th className="py-3.5 px-4 font-semibold">Persons in this Role</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {roles.map((role) => {
                  const assignedMembers = getMembersForRole(role, allMembers);
                  const activeMembers = assignedMembers.filter((m) => m.isCurrentlyHired !== false);
                  const pastMembers = assignedMembers.filter((m) => m.isCurrentlyHired === false);
                  const isPastExpanded = Boolean(expandedPastRoles[role.id]);

                  const categoryBadge = getCategoryBadgeClasses(role.category, isDarkMode);
                  const trackBadge = getTrackBadgeClasses(role.track, isDarkMode);
                  const currentVis = visibilityOverrides[role.id] ?? role.role_visibility ?? 'public';

                  return (
                    <tr
                      key={role.id}
                      className={`group transition-colors ${
                        isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                      }`}
                    >
                      {/* Role Title & Code */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1 max-w-xs">
                          <div className="flex items-center gap-2">
                            {role.code && (
                              <span className="text-micro font-mono px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-bold shrink-0">
                                {role.code}
                              </span>
                            )}
                            <span className="font-semibold text-body-sm leading-snug">
                              {role.title}
                            </span>
                          </div>
                          {role.description && (
                            <p className="text-micro opacity-60 line-clamp-2 leading-relaxed">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-micro font-medium border ${categoryBadge}`}
                        >
                          {formatCategoryLabel(role.category)}
                        </span>
                      </td>

                      {/* Track Badge */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-micro font-medium border ${trackBadge}`}
                        >
                          {formatTrackLabel(role.track)}
                        </span>
                      </td>

                      {/* Visibility */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        {isSuperadmin ? (
                          <select
                            value={currentVis}
                            onChange={(e) => handleChangeVisibility(role, e.target.value as RoleVisibility)}
                            className={`px-2.5 py-1 rounded-lg text-micro font-mono uppercase tracking-wider font-semibold border cursor-pointer outline-none transition-colors ${getVisibilityBadgeClasses(currentVis)}`}
                            title="Select Role Visibility (Superadmin only)"
                          >
                            <option value="public" className="bg-white dark:bg-vintage-charcoal text-vintage-charcoal dark:text-white">Public</option>
                            <option value="editor" className="bg-white dark:bg-vintage-charcoal text-vintage-charcoal dark:text-white">Editor</option>
                            <option value="admin" className="bg-white dark:bg-vintage-charcoal text-vintage-charcoal dark:text-white">Admin</option>
                            <option value="superadmin" className="bg-white dark:bg-vintage-charcoal text-vintage-charcoal dark:text-white">Superadmin</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-micro font-mono uppercase tracking-wider font-semibold border ${getVisibilityBadgeClasses(currentVis)}`}
                          >
                            <Shield size={11} />
                            <span>{currentVis}</span>
                          </span>
                        )}
                      </td>

                      {/* Assigned Persons */}
                      <td className="py-3.5 px-4 align-top">
                        {activeMembers.length === 0 && pastMembers.length === 0 ? (
                          <span className="text-micro opacity-40 italic">
                            No person/s assigned
                          </span>
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
                                  onClick={() => togglePastRole(role.id)}
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

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onAssignPersons(role)}
                            title="Manage assigned persons"
                            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-space-sparkle/10 hover:text-space-sparkle transition-all cursor-pointer"
                            aria-label="Manage assigned persons"
                          >
                            <UserPlus size={15} />
                          </button>
                          <button
                            onClick={() => onEditRole(role)}
                            title="Edit Role"
                            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                            aria-label="Edit role"
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
