/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCheck, Shield, ExternalLink, Settings, AlertCircle, FolderKanban } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Member, Role } from '@/types';
import {
  getCategoryBadgeClasses,
  getTrackBadgeClasses,
  formatCategoryLabel,
  formatTrackLabel,
  getRolesForMember,
} from '@/lib/roles/role-helpers';
import { Button } from '@/components/primitives/buttons/Button';

interface RolesByPersonTableProps {
  members: Member[];
  allRoles: Role[];
  onManageMemberRoles: (member: Member) => void;
}

export const RolesByPersonTable: React.FC<RolesByPersonTableProps> = ({
  members,
  allRoles,
  onManageMemberRoles,
}) => {
  const { isDarkMode } = useTheme();

  if (members.length === 0) {
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
          <h4 className="text-body font-semibold">No persons found</h4>
          <p className="text-caption opacity-60 max-w-sm">
            Try adjusting your search query or category filters.
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
              <th className="py-3.5 px-4 font-semibold">Person</th>
              <th className="py-3.5 px-4 font-semibold">Primary Categories</th>
              <th className="py-3.5 px-4 font-semibold">Assigned Roles</th>
              <th className="py-3.5 px-4 font-semibold">Project Involvements</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {members.map((member) => {
              const assignedRoles = getRolesForMember(member, allRoles);
              const projectsCount = member.involvement?.length || 0;

              return (
                <tr
                  key={member.id}
                  className={`group transition-colors ${
                    isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                  }`}
                >
                  {/* Person details */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-space-sparkle/20 flex items-center justify-center">
                            <UserCheck size={18} className="text-space-sparkle" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-semibold text-body-sm leading-snug truncate">
                          {member.name}
                        </div>
                        <div className="text-micro opacity-60 truncate">
                          {member.role || 'No title set'}
                        </div>
                        {member.license && (
                          <div className="text-micro font-mono text-space-sparkle truncate">
                            {member.license}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Primary Categories */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                      {member.categories && member.categories.length > 0 ? (
                        member.categories.map((cat) => (
                          <span
                            key={cat}
                            className={`inline-block px-2 py-0.5 rounded-full text-micro font-medium border ${getCategoryBadgeClasses(
                              cat,
                              isDarkMode
                            )}`}
                          >
                            {formatCategoryLabel(cat)}
                          </span>
                        ))
                      ) : (
                        <span className="text-micro opacity-40">—</span>
                      )}
                    </div>
                  </td>

                  {/* Assigned Roles */}
                  <td className="py-3.5 px-4 align-top">
                    {assignedRoles.length > 0 ? (
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex flex-wrap gap-1.5">
                          {assignedRoles.map((role) => (
                            <span
                              key={role.id}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-micro font-medium ${
                                isDarkMode
                                  ? 'bg-white/5 border-white/10'
                                  : 'bg-black/5 border-black/10'
                              }`}
                            >
                              <Shield size={11} className="text-space-sparkle shrink-0" />
                              <span className="truncate max-w-[180px]">{role.title}</span>
                              {role.code && (
                                <span className="text-[10px] font-mono opacity-60">
                                  ({role.code})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <span className="text-micro font-mono opacity-50 block">
                          Total: {assignedRoles.length} {assignedRoles.length === 1 ? 'role' : 'roles'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-caption opacity-50 italic block">
                          Primary role: {member.role || 'None'}
                        </span>
                        <button
                          onClick={() => onManageMemberRoles(member)}
                          className="text-micro text-space-sparkle hover:underline cursor-pointer flex items-center gap-1"
                        >
                          + Assign roles
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Projects Involvement */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-space-sparkle">
                        <FolderKanban size={14} />
                      </div>
                      <span className="font-semibold text-caption">{projectsCount}</span>
                      <span className="text-micro opacity-60">
                        {projectsCount === 1 ? 'project' : 'projects'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="outline"
                        onClick={() => onManageMemberRoles(member)}
                        className="!py-1.5 !px-3 text-micro"
                      >
                        <Settings size={13} className="mr-1 inline" /> Manage Roles
                      </Button>
                      <Link
                        href={`/admin/people`}
                        title="View in Manage People"
                        className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
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
