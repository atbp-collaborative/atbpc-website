/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Role, RoleCategory, RoleTrack, Member, MemberCategory, Project, ProjectRole, MemberInvolvement } from '@/types';
import {
  getRoles,
  saveRole as saveRoleStorage,
  deleteRole as deleteRoleStorage,
  toggleRoleDraft as toggleRoleDraftStorage,
  getMembers,
  getProjects,
  getProjectRoles,
  saveProjectRole as saveProjectRoleStorage,
  deleteProjectRole as deleteProjectRoleStorage,
  assignRoleToMember as assignRoleStorage,
  unassignRoleFromMember as unassignRoleStorage,
  setMemberRoles as setMemberRolesStorage,
  associateMemberToProject as associateMemberToProjectStorage,
  disassociateMemberFromProject as disassociateMemberFromProjectStorage,
} from '@/services/mock/adminMockStorage';
import { getProjectRolesFromSupabase } from '@/services/supabase/project-roles.service';
import { getMembers as getMembersFromDataService } from '@/services/dummy-data.service';
import {
  saveRoleAction,
  deleteRoleAction,
  saveProjectRoleAction,
  deleteProjectRoleAction,
  updatePersonRolesAction,
  updatePersonInvolvementsAction,
  fetchAdminPeopleAction,
} from '@/app/actions/admin-mutations';
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
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
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
    const prLocal = getProjectRoles();
    setRoles(r);
    setMembers(m);
    setProjects(p);
    setProjectRoles(prLocal);

    // Asynchronously fetch latest project roles and members from Supabase
    Promise.all([
      getProjectRolesFromSupabase(true).catch((err) => {
        console.warn('Failed to load project roles from Supabase:', err);
        return null;
      }),
      fetchAdminPeopleAction().catch((err) => {
        console.warn('Failed to load admin people from Supabase:', err);
        return null;
      }),
    ]).then(([dbProjectRoles, dbMembers]) => {
      if (dbProjectRoles && dbProjectRoles.length > 0) {
        setProjectRoles(dbProjectRoles);
      }
      if (dbMembers && dbMembers.length > 0) {
        setMembers(dbMembers);
      }
    }).finally(() => {
      setIsLoading(false);
    });
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
    })
    .sort((a, b) => {
      const aHired = a.isCurrentlyHired !== false;
      const bHired = b.isCurrentlyHired !== false;
      if (aHired && !bHired) return -1;
      if (!aHired && bHired) return 1;
      return (a.displayOrder ?? 99) - (b.displayOrder ?? 99);
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

  // Filtered Project Roles (for By Project Role View)
  const filteredProjectRoles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return projectRoles;

    return projectRoles.filter((pr) => {
      const matchName = pr.name.toLowerCase().includes(term);
      const matchCode = pr.code ? pr.code.toLowerCase().includes(term) : false;
      const matchDesc = pr.description ? pr.description.toLowerCase().includes(term) : false;
      return matchName || matchCode || matchDesc;
    });
  }, [projectRoles, searchTerm]);

  // CRUD for Project Roles
  const saveProjectRole = useCallback(async (projectRoleData: ProjectRole) => {
    saveProjectRoleStorage(projectRoleData);

    const res = await saveProjectRoleAction(projectRoleData);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return projectRoleData;
    }

    const saved = res.data || projectRoleData;
    setProjectRoles((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Project role "${saved.name}" saved successfully`);
    return saved;
  }, []);

  const deleteProjectRole = useCallback(async (id: string) => {
    const target = projectRoles.find((r) => r.id === id);
    deleteProjectRoleStorage(id);
    setProjectRoles((prev) => prev.filter((r) => r.id !== id));

    const res = await deleteProjectRoleAction(id);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return;
    }
    toast.success(`Project role "${target?.name || id}" removed from database`);
  }, [projectRoles]);

  // CRUD for Roles
  const saveRole = useCallback(async (roleData: Role) => {
    saveRoleStorage(roleData);

    const res = await saveRoleAction(roleData);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return roleData;
    }

    const saved = res.data || roleData;
    setRoles((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Role "${saved.title}" saved successfully to database`);
    return saved;
  }, []);

  const deleteRole = useCallback(async (id: string) => {
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

    const res = await deleteRoleAction(id);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return;
    }
    toast.success(`Role "${target?.title || id}" removed from database`);
  }, [roles]);

  const toggleDraft = useCallback((id: string) => {
    const updated = toggleRoleDraftStorage(id);
    if (updated) {
      setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, isDraft: updated.isDraft } : r)));
      toast.info(`Role status set to ${updated.isDraft ? 'Draft' : 'Published'}`);
    }
  }, []);

  // Member Role assignment
  const assignRoleToMember = useCallback(async (memberId: string, roleId: string) => {
    assignRoleStorage(memberId, roleId);
    let updatedRoleIds: string[] = [];
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const current = m.roles || [];
          updatedRoleIds = current.includes(roleId) ? current : [...current, roleId];
          return { ...m, roles: updatedRoleIds, otherRoleIds: updatedRoleIds };
        }
        return m;
      })
    );
    await updatePersonRolesAction(memberId, updatedRoleIds);
    toast.success('Role assigned to member');
  }, []);

  const unassignRoleFromMember = useCallback(async (memberId: string, roleId: string) => {
    unassignRoleStorage(memberId, roleId);
    let updatedRoleIds: string[] = [];
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId && m.roles) {
          updatedRoleIds = m.roles.filter((r) => r !== roleId);
          return { ...m, roles: updatedRoleIds, otherRoleIds: updatedRoleIds };
        }
        return m;
      })
    );
    await updatePersonRolesAction(memberId, updatedRoleIds);
    toast.success('Role unassigned from member');
  }, []);

  const setMemberRoles = useCallback(async (memberId: string, roleIds: string[]) => {
    setMemberRolesStorage(memberId, roleIds);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, roles: roleIds, otherRoleIds: roleIds } : m))
    );
    const res = await updatePersonRolesAction(memberId, roleIds);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
    } else {
      toast.success('Member roles updated');
    }
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

  const saveMemberInvolvements = useCallback(
    async (memberId: string, involvements: MemberInvolvement[]) => {
      // Optimistically update local members state
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, involvement: involvements } : m))
      );

      const res = await updatePersonInvolvementsAction(memberId, involvements);
      if (!res.success) {
        toast.error(`Database error: ${res.error}`);
        return false;
      }
      toast.success('Project involvements saved successfully');
      return true;
    },
    []
  );

  return {
    roles,
    filteredRoles,
    projectRoles,
    filteredProjectRoles,
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
    saveProjectRole,
    deleteProjectRole,
    toggleDraft,
    assignRoleToMember,
    unassignRoleFromMember,
    setMemberRoles,
    associateMemberToProject,
    disassociateMemberFromProject,
    saveMemberInvolvements,
    refresh,
  };
}
