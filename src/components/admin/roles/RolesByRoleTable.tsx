/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Edit2, Trash2, UserPlus, UserCheck, Shield, AlertCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Role, Member } from '@/types';
import {
  getCategoryBadgeClasses,
  getTrackBadgeClasses,
  formatCategoryLabel,
  formatTrackLabel,
  getMembersForRole,
} from '@/lib/roles/role-helpers';

interface RolesByRoleTableProps {
  roles: Role[];
  allMembers: Member[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
  onAssignPersons: (role: Role) => void;
}

export const RolesByRoleTable: React.FC<RolesByRoleTableProps> = ({
  roles,
  allMembers,
  onEditRole,
  onDeleteRole,
  onAssignPersons,
}) => {
  const { isDarkMode } = useTheme();

  if (roles.length === 0) {
    return (
      <div
        className={`p-12 text-center rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 ${
          isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
        }`}
      >
        <div className="p-3 rounded-full bg-space-sparkle/10 text-space-sparkle">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-1">
          <h4 className="text-body font-semibold">No roles found</h4>
          <p className="text-caption opacity-60 max-w-sm">
            Try adjusting your search query, category, or track filters to find roles.
          </p>
        </div>
      </div>
    );
  }

  return (
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
              <th className="py-3.5 px-4 font-semibold">Role & Code</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Track</th>
              <th className="py-3.5 px-4 font-semibold">Department</th>
              <th className="py-3.5 px-4 font-semibold">Persons in this Role</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {roles.map((role) => {
              const assignedMembers = getMembersForRole(role, allMembers);
              const categoryBadge = getCategoryBadgeClasses(role.category, isDarkMode);
              const trackBadge = getTrackBadgeClasses(role.track, isDarkMode);

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

                  {/* Department */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="text-caption opacity-80 block max-w-[200px] leading-snug">
                      {role.department || '—'}
                    </span>
                  </td>

                  {/* Assigned Persons */}
                  <td className="py-3.5 px-4 align-top">
                    {assignedMembers.length > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                          {assignedMembers.map((member) => (
                            <div
                              key={member.id}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-micro transition-colors ${
                                isDarkMode
                                  ? 'bg-white/5 border-white/10 hover:border-space-sparkle'
                                  : 'bg-black/5 border-black/10 hover:border-space-sparkle'
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
                            </div>
                          ))}
                        </div>
                        <span className="text-micro font-mono opacity-50 block">
                          Total: {assignedMembers.length} {assignedMembers.length === 1 ? 'person' : 'persons'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAssignPersons(role)}
                        className="text-micro opacity-50 hover:opacity-100 hover:text-space-sparkle flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <UserPlus size={12} /> Assign person
                      </button>
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
                      <button
                        onClick={() => onDeleteRole(role)}
                        title="Delete Role"
                        className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
                        aria-label="Delete role"
                      >
                        <Trash2 size={15} />
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
  );
};
