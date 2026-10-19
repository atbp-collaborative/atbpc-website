/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Role, RoleCategory, RoleTrack, Member } from '@/types';

/**
 * Visual styling classes for categories
 */
export function getCategoryBadgeClasses(category: RoleCategory, isDarkMode: boolean): string {
  switch (category) {
    case 'designers':
      return isDarkMode
        ? 'bg-space-sparkle/20 text-space-sparkle border-space-sparkle/40'
        : 'bg-space-sparkle/15 text-space-sparkle border-space-sparkle/30';
    case 'managers':
      return isDarkMode
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        : 'bg-amber-500/15 text-amber-700 border-amber-500/30';
    case 'builders':
      return isDarkMode
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        : 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
    default:
      return isDarkMode
        ? 'bg-white/10 text-white/80 border-white/20'
        : 'bg-black/10 text-black/80 border-black/20';
  }
}

/**
 * Visual styling classes for tracks
 */
export function getTrackBadgeClasses(track: RoleTrack, isDarkMode: boolean): string {
  switch (track) {
    case 'internship':
      return isDarkMode
        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        : 'bg-purple-500/15 text-purple-700 border-purple-500/30';
    case 'professionals':
      return isDarkMode
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        : 'bg-cyan-500/15 text-cyan-700 border-cyan-500/30';
    default:
      return isDarkMode
        ? 'bg-white/10 text-white/80 border-white/20'
        : 'bg-black/10 text-black/80 border-black/20';
  }
}

/**
 * Capitalizes category name for display
 */
export function formatCategoryLabel(category: RoleCategory): string {
  switch (category) {
    case 'designers':
      return 'Designers';
    case 'managers':
      return 'Managers';
    case 'builders':
      return 'Builders';
    default:
      return category;
  }
}

/**
 * Formats track name for display
 */
export function formatTrackLabel(track: RoleTrack): string {
  switch (track) {
    case 'internship':
      return 'Internship / Apprentice';
    case 'professionals':
      return 'Professionals';
    default:
      return track;
  }
}

/**
 * Checks if a member holds a specific role.
 * Matches either by explicit role IDs array (`member.roles`) or by primary role string matching (`member.role`).
 */
export function memberHasRole(member: Member, role: Role): boolean {
  if (member.roles && member.roles.includes(role.id)) {
    return true;
  }
  if (member.roles && member.roles.includes(role.title)) {
    return true;
  }
  if (member.role) {
    const normMemberRole = member.role.toLowerCase().trim();
    const normRoleTitle = role.title.toLowerCase().trim();
    if (normMemberRole === normRoleTitle) {
      return true;
    }
    // Also match if code is in the role string, e.g. "[HRDT-03: Junior Architect]"
    if (role.code && normMemberRole.includes(role.code.toLowerCase())) {
      return true;
    }
  }
  return false;
}

/**
 * Returns all roles currently held by a member from the given roles list.
 */
export function getRolesForMember(member: Member, allRoles: Role[]): Role[] {
  return allRoles.filter((role) => memberHasRole(member, role));
}

/**
 * Returns all members who currently hold a given role.
 */
export function getMembersForRole(role: Role, allMembers: Member[]): Member[] {
  return allMembers.filter((member) => memberHasRole(member, role));
}
