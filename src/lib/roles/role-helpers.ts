/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Role, RoleCategory, RoleTrack, Member, ProjectRole } from '@/types';

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
 * Matches by primaryRoleId, roles array, otherRoleIds array, or primary role string matching.
 */
export function memberHasRole(member: Member, role: Role): boolean {
  const normRoleTitle = role.title ? role.title.toLowerCase().trim() : '';
  const cleanRoleCode = role.code ? role.code.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  // 1. Check primaryRoleId
  if (member.primaryRoleId) {
    const normPrimary = member.primaryRoleId.toLowerCase().trim();
    const cleanPrimary = normPrimary.replace(/[^a-z0-9]/g, '');

    if (member.primaryRoleId === role.id) {
      return true;
    }
    if (cleanRoleCode && (cleanPrimary === cleanRoleCode || cleanPrimary.includes(cleanRoleCode))) {
      return true;
    }
    if (normRoleTitle && normPrimary === normRoleTitle) {
      return true;
    }
  }

  // 2. Check explicit role arrays (roles, otherRoleIds)
  const roleList = [
    ...(member.roles || []),
    ...(member.otherRoleIds || []),
  ];

  if (roleList.length > 0) {
    for (const rId of roleList) {
      if (rId === role.id) {
        return true;
      }
      const normRId = rId.toLowerCase().trim();
      const cleanRId = normRId.replace(/[^a-z0-9]/g, '');
      if (cleanRoleCode && (cleanRId === cleanRoleCode || cleanRId.includes(cleanRoleCode))) {
        return true;
      }
      if (normRoleTitle && normRId === normRoleTitle) {
        return true;
      }
    }
  }

  // 3. Check legacy member.role string
  if (member.role) {
    const normMemberRole = member.role.toLowerCase().trim();
    const cleanMemberRole = normMemberRole.replace(/[^a-z0-9]/g, '');

    if (normRoleTitle && normMemberRole === normRoleTitle) {
      return true;
    }
    if (role.code && normMemberRole.includes(role.code.toLowerCase())) {
      return true;
    }
    if (cleanRoleCode && cleanMemberRole.includes(cleanRoleCode)) {
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

/**
 * Evaluates a search term and determines whether it most strongly matches
 * a Person name, a Studio Role, or a Project Role.
 */
export function detectIntelligentRolesViewMode(
  term: string,
  roles: Role[],
  members: Member[],
  projectRoles: ProjectRole[]
): 'roles' | 'persons' | 'project-roles' | null {
  const clean = term.toLowerCase().trim();
  if (clean.length < 2) return null;

  // 1. Score matching for members (names, pseudonyms, titles)
  let personScore = 0;
  for (const m of members) {
    const fullName = m.name?.toLowerCase() || '';
    const firstName = m.firstName?.toLowerCase() || '';
    const lastName = m.lastName?.toLowerCase() || '';
    const pseudonym = m.pseudonym?.toLowerCase() || '';

    if (fullName === clean || firstName === clean || lastName === clean) {
      personScore += 100;
    } else if (
      fullName.startsWith(clean) ||
      firstName.startsWith(clean) ||
      lastName.startsWith(clean) ||
      pseudonym.startsWith(clean)
    ) {
      personScore += 60;
    } else if (
      fullName.includes(clean) ||
      pseudonym.includes(clean) ||
      (m.role && m.role.toLowerCase().includes(clean))
    ) {
      personScore += 25;
    }
  }

  // 2. Score matching for project roles (name, code)
  let projectRoleScore = 0;
  for (const pr of projectRoles) {
    const prName = pr.name?.toLowerCase() || '';
    const prCode = pr.code?.toLowerCase() || '';

    if (prName === clean || prCode === clean) {
      projectRoleScore += 100;
    } else if (prName.startsWith(clean) || prCode.startsWith(clean)) {
      projectRoleScore += 60;
    } else if (prName.includes(clean) || prCode.includes(clean)) {
      projectRoleScore += 25;
    }
  }

  // 3. Score matching for studio roles (title, code)
  let studioRoleScore = 0;
  for (const r of roles) {
    const rTitle = r.title?.toLowerCase() || '';
    const rCode = r.code?.toLowerCase() || '';

    if (rTitle === clean || rCode === clean) {
      studioRoleScore += 100;
    } else if (rTitle.startsWith(clean) || rCode.startsWith(clean)) {
      studioRoleScore += 60;
    } else if (rTitle.includes(clean) || rCode.includes(clean)) {
      studioRoleScore += 25;
    }
  }

  const maxScore = Math.max(personScore, projectRoleScore, studioRoleScore);
  if (maxScore < 25) return null;

  if (personScore > studioRoleScore && personScore > projectRoleScore) {
    return 'persons';
  }
  if (projectRoleScore > studioRoleScore && projectRoleScore > personScore) {
    return 'project-roles';
  }
  if (studioRoleScore > personScore && studioRoleScore > projectRoleScore) {
    return 'roles';
  }

  // Tie-breaker
  if (personScore === maxScore) return 'persons';
  if (projectRoleScore === maxScore) return 'project-roles';
  return 'roles';
}

/**
 * Determines whether a role is selectable in dropdown/select fields
 * based on the actor's administrative tier or public status.
 *
 * - public: Only roles with role_visibility === 'public'
 * - editor: Roles with role_visibility === 'editor' or 'public'
 * - admin: Roles with role_visibility !== 'superadmin' ('admin', 'editor', 'public')
 * - superadmin: All roles
 */
export function isRoleSelectable(
  roleVisibility: 'superadmin' | 'admin' | 'editor' | 'public' | undefined,
  userTier: 'superadmin' | 'admin' | 'editor' | 'public'
): boolean {
  const vis = roleVisibility || 'public';
  if (userTier === 'superadmin') return true;
  if (userTier === 'admin') return vis !== 'superadmin';
  if (userTier === 'editor') return vis === 'editor' || vis === 'public';
  if (userTier === 'public') return vis === 'public';
  return false;
}

