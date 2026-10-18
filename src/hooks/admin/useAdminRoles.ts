/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Role, RoleCategory, RoleTrack, Member, MemberCategory, Project } from '@/types';
import {
  getRoles,
  saveRole as saveRoleStorage,
  deleteRole as deleteRoleStorage,
  toggleRoleDraft as toggleRoleDraftStorage,
  getMembers,
  getProjects,
  assignRoleToMember as assignRoleStorage,
  unassignRoleFromMember as unassignRoleStorage,
  setMemberRoles as setMemberRolesStorage,
  associateMemberToProject as associateMemberToProjectStorage,
  disassociateMemberFromProject as disassociateMemberFromProjectStorage,
} from '@/services/mock/adminMockStorage';
import { memberHasRole } from '@/lib/roles/role-helpers';
import { toast } from 'sonner';

export type RoleCategoryFilter = 'all' | RoleCategory;
export type RoleTrackFilter = 'all' | RoleTrack;

export interface ProjectRoleEntry {
  id: string;
  memberId: string;
  memberName: string;
  memberImage: string;
  memberCategories: MemberCategory[];
  projectId: string;
  projectTitle: string;
  roleInProject: string;
  description: string;
}

export function useAdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RoleCategoryFilter>('all');
  const [trackFilter, setTrackFilter] = useState<RoleTrackFilter>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const refresh = useCallback(() => {
    setIsLoading(true);
    const r = getRoles();
    const m = getMembers();
    const p = getProjects();
    setRoles(r);
    setMembers(m);
    setProjects(p);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return roles.filter((role) => {
      // Category filter
      if (categoryFilter !== 'all' && role.category !== categoryFilter) {
        return false;
      }

      // Track filter
      if (trackFilter !== 'all' && role.track !== trackFilter) {
        return false;
      }

      // Search term
      if (term) {
        const matchesTitle = role.title.toLowerCase().includes(term);
        const matchesCode = role.code ? role.code.toLowerCase().includes(term) : false;
        const matchesDept = role.department ? role.department.toLowerCase().includes(term) : false;
        const matchesDesc = role.description ? role.description.toLowerCase().includes(term) : false;

        // Check if any person in this role matches search
        const hasMatchingPerson = members.some(
          (m) => memberHasRole(m, role) && m.name.toLowerCase().includes(term)
        );

        if (!matchesTitle && !matchesCode && !matchesDept && !matchesDesc && !hasMatchingPerson) {
          return false;
        }
      }

      return true;
    });
  }, [roles, categoryFilter, trackFilter, searchTerm, members]);

  // Filtered Members (for View 2: By Person)
  const filteredMembers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return members.filter((member) => {
      // Category filter
      if (categoryFilter !== 'all') {
        const inCategory = member.categories && member.categories.includes(categoryFilter as MemberCategory);
        if (!inCategory) return false;
      }

      // Track filter: if track filter is selected, check if member has at least one role with that track
      if (trackFilter !== 'all') {
        const hasTrackRole = roles.some(
          (r) => r.track === trackFilter && memberHasRole(member, r)
        );
        if (!hasTrackRole) return false;
      }

      // Search query
      if (term) {
        const matchesName = member.name.toLowerCase().includes(term);
        const matchesRole = member.role.toLowerCase().includes(term);
        const matchesLicense = member.license ? member.license.toLowerCase().includes(term) : false;
        if (!matchesName && !matchesRole && !matchesLicense) {
          return false;
        }
      }

      return true;
    });
  }, [members, categoryFilter, trackFilter, searchTerm, roles]);

  // Project Role Entries (for View 3: Project Roles)
  const projectRoleEntries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const entries: ProjectRoleEntry[] = [];

    for (const member of members) {
      if (!member.involvement || member.involvement.length === 0) continue;

      for (const inv of member.involvement) {
        // Project filter
        if (selectedProjectId !== 'all' && inv.projectId !== selectedProjectId) {
          continue;
        }

        // Category filter
        if (categoryFilter !== 'all' && (!member.categories || !member.categories.includes(categoryFilter as MemberCategory))) {
          continue;
        }

        // Search query
        if (term) {
          const matchesProject = inv.projectTitle.toLowerCase().includes(term);
          const matchesPerson = member.name.toLowerCase().includes(term);
          const matchesRole = inv.roleInProject.toLowerCase().includes(term);
          const matchesDesc = inv.description.toLowerCase().includes(term);

          if (!matchesProject && !matchesPerson && !matchesRole && !matchesDesc) {
            continue;
          }
        }

        entries.push({
          id: `${member.id}-${inv.projectId}`,
          memberId: member.id,
          memberName: member.name,
          memberImage: member.image,
          memberCategories: member.categories || [],
          projectId: inv.projectId,
          projectTitle: inv.projectTitle,
          roleInProject: inv.roleInProject,
          description: inv.description,
        });
      }
    }

    return entries;
  }, [members, selectedProjectId, categoryFilter, searchTerm]);

  // CRUD for Roles
  const saveRole = useCallback((roleData: Role) => {
    const saved = saveRoleStorage(roleData);
    setRoles((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Role "${saved.title}" saved successfully`);
    return saved;
  }, []);

  const deleteRole = useCallback((id: string) => {
    const target = roles.find((r) => r.id === id);
    deleteRoleStorage(id);
    setRoles((prev) => prev.filter((r) => r.id !== id));
    // Also update members locally
    setMembers((prev) =>
      prev.map((m) => {
        if (m.roles && m.roles.includes(id)) {
          return {
            ...m,
            roles: m.roles.filter((rId) => rId !== id),
          };
        }
        return m;
      })
    );
    toast.success(`Role "${target?.title || id}" removed`);
  }, [roles]);

  const toggleDraft = useCallback((id: string) => {
    const updated = toggleRoleDraftStorage(id);
    if (updated) {
      setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, isDraft: updated.isDraft } : r)));
      toast.info(`Role status set to ${updated.isDraft ? 'Draft' : 'Published'}`);
    }
  }, []);

  // Member Role assignment
  const assignRoleToMember = useCallback((memberId: string, roleId: string) => {
    assignRoleStorage(memberId, roleId);
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const current = m.roles || [];
          return current.includes(roleId) ? m : { ...m, roles: [...current, roleId] };
        }
        return m;
      })
    );
    toast.success('Role assigned to member');
  }, []);

  const unassignRoleFromMember = useCallback((memberId: string, roleId: string) => {
    unassignRoleStorage(memberId, roleId);
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId && m.roles) {
          return { ...m, roles: m.roles.filter((r) => r !== roleId) };
        }
        return m;
      })
    );
    toast.success('Role unassigned from member');
  }, []);

  const setMemberRoles = useCallback((memberId: string, roleIds: string[]) => {
    setMemberRolesStorage(memberId, roleIds);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, roles: roleIds } : m))
    );
    toast.success('Member roles updated');
  }, []);

  // Project Role association
  const associateMemberToProject = useCallback(
    (memberId: string, projectId: string, roleInProject: string, description: string = '') => {
      associateMemberToProjectStorage(memberId, projectId, roleInProject, description);
      refresh();
      toast.success('Project role assigned');
    },
    [refresh]
  );

  const disassociateMemberFromProject = useCallback(
    (memberId: string, projectId: string) => {
      disassociateMemberFromProjectStorage(memberId, projectId);
      refresh();
      toast.success('Project role removed');
    },
    [refresh]
  );

  return {
    roles,
    filteredRoles,
    members,
    filteredMembers,
    projects,
    projectRoleEntries,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    trackFilter,
    setTrackFilter,
    selectedProjectId,
    setSelectedProjectId,
    saveRole,
    deleteRole,
    toggleDraft,
    assignRoleToMember,
    unassignRoleFromMember,
    setMemberRoles,
    associateMemberToProject,
    disassociateMemberFromProject,
    refresh,
  };
}
