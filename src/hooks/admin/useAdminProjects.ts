/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, ProjectCategoryItem, ProjectTypologyItem, ContractTypeItem, ProjectContributor, ProjectRole } from '@/types';
import { getProjects as getProjectsFromDataService } from '@/services/dummy-data.service';
import {
  getProjects as getProjectsStorage,
  getProjectCategories,
  getProjectTypologies,
  getContractTypes,
  getTeamMembersForProject,
  ProjectTeamMemberEntry,
  INITIAL_PROJECT_ROLES_DATA,
} from '@/services/mock/adminMockStorage';
import { getProjectRolesFromSupabase } from '@/services/supabase/project-roles.service';
import {
  saveProjectAction,
  deleteProjectAction,
  toggleProjectDraftAction,
  fetchAdminProjectsAction,
} from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

export type ProjectStatusFilter = 'all' | 'completed' | 'ongoing' | 'schematics';
export type VisibilityFilter = 'all' | 'published' | 'draft';
export type ProjectCategoryFilter = 'all' | 'Shelter' | 'Livelihood' | 'Community';

export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typologyFilter, setTypologyFilter] = useState<string>('all');
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>(INITIAL_PROJECT_ROLES_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const dbProjects = await fetchAdminProjectsAction();
      const data = dbProjects.length > 0 ? dbProjects : await getProjectsFromDataService(true);
      setProjects(data);
    } catch (err) {
      console.warn('Failed to fetch projects from Supabase, falling back to local storage:', err);
      const data = getProjectsStorage();
      setProjects(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    async function loadRoles() {
      try {
        const roles = await getProjectRolesFromSupabase();
        if (roles && roles.length > 0) {
          setProjectRoles(roles);
        }
      } catch (err) {
        console.warn('Failed to fetch project roles from Supabase:', err);
      }
    }
    loadRoles();
  }, []);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.mainCategory) set.add(p.mainCategory);
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        project.title.toLowerCase().includes(term) ||
        (typeof project.location === 'string' && project.location.toLowerCase().includes(term)) ||
        (project.category && project.category.toLowerCase().includes(term)) ||
        (project.year && String(project.year).toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'draft' && Boolean(project.isDraft)) ||
        (visibilityFilter === 'published' && !project.isDraft);

      const matchesCategory =
        categoryFilter === 'all' ||
        project.mainCategory === categoryFilter ||
        project.category === categoryFilter;

      const matchesTypology =
        typologyFilter === 'all' ||
        project.category === typologyFilter ||
        project.subcategory === typologyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVisibility &&
        matchesCategory &&
        matchesTypology
      );
    });
  }, [projects, searchTerm, statusFilter, visibilityFilter, categoryFilter, typologyFilter]);

  const saveProject = useCallback(async (projectData: Project) => {
    const res = await saveProjectAction(projectData);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return projectData;
    }

    const saved = res.data || projectData;
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Project "${saved.title}" saved successfully to database`);
    return saved;
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));

    const res = await deleteProjectAction(id);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return;
    }
    toast.success(`Project "${target?.title || id}" removed from database`);
  }, [projects]);

  const toggleDraft = useCallback(async (id: string) => {
    const target = projects.find((p) => p.id === id);
    const newDraftState = !target?.isDraft;

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isDraft: newDraftState } : p))
    );

    const res = await toggleProjectDraftAction(id, newDraftState);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return;
    }
    toast.info(`Project status set to ${newDraftState ? 'Draft' : 'Published'}`);
  }, [projects]);

  const getTeamForProject = useCallback(
    (projectId: string): ProjectContributor[] => {
      const target = projects.find((p) => p.id === projectId);
      if (target?.contributors && target.contributors.length > 0) {
        return target.contributors;
      }
      return (getTeamMembersForProject(projectId) as any) || [];
    },
    [projects]
  );

  const associateMember = useCallback(
    (memberId: string, projectId: string, roleInProject: string, description: string = '') => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const currentContributors = p.contributors || [];
          const exists = currentContributors.some((c) => c.memberId === memberId);
          if (exists) {
            return {
              ...p,
              contributors: currentContributors.map((c) =>
                c.memberId === memberId ? { ...c, roleInProject, description } : c
              ),
            };
          }
          return {
            ...p,
            contributors: [
              ...currentContributors,
              {
                memberId,
                roleInProject,
                description,
              },
            ],
          };
        })
      );
      toast.success('Team member associated with project');
    },
    []
  );

  const disassociateMember = useCallback((memberId: string, projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          contributors: (p.contributors || []).filter((c) => c.memberId !== memberId),
        };
      })
    );
    toast.info('Team member disassociated from project');
  }, []);

  return {
    projects,
    filteredProjects,
    allCategories,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    visibilityFilter,
    setVisibilityFilter,
    categoryFilter,
    setCategoryFilter,
    typologyFilter,
    setTypologyFilter,
    categories: useMemo(() => getProjectCategories(), []),
    typologies: useMemo(() => getProjectTypologies(), []),
    contractTypes: useMemo(() => getContractTypes(), []),
    projectRoles,
    isLoading,
    refresh,
    saveProject,
    deleteProject,
    toggleDraft,
    getTeamForProject,
    associateMember,
    disassociateMember,
  };
}
