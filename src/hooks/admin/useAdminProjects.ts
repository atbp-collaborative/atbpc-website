/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Project, ProjectCategoryItem, ProjectTypologyItem, ContractTypeItem, ProjectContributor, ProjectRole } from '@/types';
import { getProjects as getProjectsFromDataService } from '@/services/dummy-data.service';
import { normalizeCategoryId, normalizeTypologyId, sortProjectsCanonically } from '@/lib/projects/project-helpers';
import {
  getProjects as getProjectsStorage,
  getProjectCategories,
  getProjectTypologies,
  getContractTypes,
  getTeamMembersForProject,
  ProjectTeamMemberEntry,
  INITIAL_PROJECT_ROLES_DATA,
  reorderProjects as reorderProjectsStorage,
} from '@/services/mock/adminMockStorage';
import { getProjectRolesFromSupabase } from '@/services/supabase/project-roles.service';
import {
  saveProjectAction,
  deleteProjectAction,
  toggleProjectDraftAction,
  fetchAdminProjectsAction,
  reorderProjectsAction,
} from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

export type ProjectStatusFilter = 'all' | 'completed' | 'ongoing' | 'schematics';
export type VisibilityFilter = 'all' | 'published' | 'draft';
export type ProjectCategoryFilter = 'all' | 'Shelter' | 'Livelihood' | 'Community';

export function useAdminProjects(initialProjects?: Project[], initialRoles?: ProjectRole[]) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typologyFilter, setTypologyFilter] = useState<string>('all');
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>(initialRoles || INITIAL_PROJECT_ROLES_DATA);
  const [isLoading, setIsLoading] = useState(!initialProjects || initialProjects.length === 0);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const initialOrderRef = useRef<string[]>(
    initialProjects && initialProjects.length > 0
      ? sortProjectsCanonically(initialProjects).map((p) => p.id)
      : []
  );

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
    if (!initialProjects || initialProjects.length === 0) {
      refresh();
    }
  }, [refresh, initialProjects]);

  useEffect(() => {
    if (initialRoles && initialRoles.length > 0) return;
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


  const isOrderDirty = useMemo(() => {
    if (!initialOrderRef.current || initialOrderRef.current.length === 0) return false;
    if (projects.length !== initialOrderRef.current.length) return false;
    return projects.some((p, idx) => p.id !== initialOrderRef.current[idx]);
  }, [projects]);

  const moveProject = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const currentIndex = filteredProjects.findIndex((p) => p.id === id);
      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= filteredProjects.length) return;

      const currentProject = filteredProjects[currentIndex];
      const targetProject = filteredProjects[targetIndex];

      const curCat = normalizeCategoryId(currentProject.mainCategory || currentProject.categoryId || currentProject.category);
      const tarCat = normalizeCategoryId(targetProject.mainCategory || targetProject.categoryId || targetProject.category);
      const curTyp = normalizeTypologyId(currentProject.typologyId || currentProject.subcategory || currentProject.category);
      const tarTyp = normalizeTypologyId(targetProject.typologyId || targetProject.subcategory || targetProject.category);

      // Category and Typology orders are strictly fixed: swap only within the same typology
      if (curCat !== tarCat || curTyp !== tarTyp) {
        return;
      }

      const reorderedFiltered = [...filteredProjects];
      reorderedFiltered[currentIndex] = targetProject;
      reorderedFiltered[targetIndex] = currentProject;

      // Assign sequential sortOrder to the items in this typology
      const typologyProjects = reorderedFiltered.filter((p) => {
        const pCat = normalizeCategoryId(p.mainCategory || p.categoryId || p.category);
        const pTyp = normalizeTypologyId(p.typologyId || p.subcategory || p.category);
        return pCat === curCat && pTyp === curTyp;
      });

      const orderMap = new Map<string, number>();
      typologyProjects.forEach((p, idx) => {
        orderMap.set(p.id, (idx + 1) * 10);
      });

      setProjects((prev) => {
        const updated = prev.map((p) => {
          const newOrder = orderMap.get(p.id);
          return newOrder !== undefined ? { ...p, sortOrder: newOrder } : p;
        });
        return sortProjectsCanonically(updated);
      });
    },
    [filteredProjects]
  );

  const saveOrder = useCallback(async () => {
    setIsSavingOrder(true);
    try {
      const sorted = sortProjectsCanonically([...projects]);
      const payload = sorted.map((p, idx) => ({
        id: p.id,
        sortOrder: (idx + 1) * 10,
      }));
      const res = await reorderProjectsAction(payload);
      if (!res.success) {
        reorderProjectsStorage(payload);
      }
      initialOrderRef.current = sorted.map((p) => p.id);
      setProjects(sorted.map((p, idx) => ({ ...p, sortOrder: (idx + 1) * 10 })));
      toast.success('Project order saved successfully');
    } catch (err: any) {
      console.error('Failed to save project order:', err);
      toast.error('Failed to save project order');
    } finally {
      setIsSavingOrder(false);
    }
  }, [projects]);

  const resetOrder = useCallback(() => {
    if (!initialOrderRef.current || initialOrderRef.current.length === 0) return;
    const initialMap = new Map<string, number>(
      initialOrderRef.current.map((id: string, idx: number) => [id, (idx + 1) * 10])
    );
    setProjects((prev) => {
      const restored = [...prev].map((p) => {
        const restoredOrder = initialMap.get(p.id);
        return {
          ...p,
          sortOrder: restoredOrder ?? p.sortOrder,
        };
      });
      return sortProjectsCanonically(restored);
    });
    toast.info('Project order reset');
  }, []);

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
    moveProject,
    isOrderDirty,
    isSavingOrder,
    saveOrder,
    resetOrder,
  };
}
