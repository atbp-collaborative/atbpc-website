/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, ProjectCategoryItem, ProjectTypologyItem, ContractTypeItem } from '@/types';
import { getProjects as getProjectsFromDataService } from '@/services/dummy-data.service';
import {
  getProjects as getProjectsStorage,
  getProjectCategories,
  getProjectTypologies,
  getContractTypes,
  saveProject as saveProjectStorage,
  deleteProject as deleteProjectStorage,
  toggleProjectDraft as toggleProjectDraftStorage,
  getTeamMembersForProject,
  associateMemberToProject,
  disassociateMemberFromProject,
  ProjectTeamMemberEntry,
} from '@/services/mock/adminMockStorage';
import {
  saveProjectAction,
  deleteProjectAction,
  toggleProjectDraftAction,
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
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProjectsFromDataService(true);
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
    saveProjectStorage(projectData);

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
    deleteProjectStorage(id);
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

    toggleProjectDraftStorage(id);
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

  const getTeamForProject = useCallback((projectId: string): ProjectTeamMemberEntry[] => {
    return getTeamMembersForProject(projectId);
  }, []);

  const associateMember = useCallback(
    (memberId: string, projectId: string, roleInProject: string, description: string = '') => {
      associateMemberToProject(memberId, projectId, roleInProject, description);
      toast.success('Team member associated with project');
    },
    []
  );

  const disassociateMember = useCallback((memberId: string, projectId: string) => {
    disassociateMemberFromProject(memberId, projectId);
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
