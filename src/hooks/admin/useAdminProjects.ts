/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project } from '@/types';
import {
  getProjects,
  saveProject as saveProjectStorage,
  deleteProject as deleteProjectStorage,
  toggleProjectDraft as toggleProjectDraftStorage,
  getTeamMembersForProject,
  associateMemberToProject,
  disassociateMemberFromProject,
  ProjectTeamMemberEntry,
} from '@/services/mock/adminMockStorage';
import { toast } from 'sonner';

export type ProjectStatusFilter = 'all' | 'completed' | 'ongoing' | 'schematics';
export type VisibilityFilter = 'all' | 'published' | 'draft';

export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const data = getProjects();
    setProjects(data);
    setIsLoading(false);
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
        project.location.toLowerCase().includes(term) ||
        (project.category && project.category.toLowerCase().includes(term)) ||
        (project.year && project.year.toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'draft' && Boolean(project.isDraft)) ||
        (visibilityFilter === 'published' && !project.isDraft);

      const matchesCategory =
        categoryFilter === 'all' ||
        project.mainCategory === categoryFilter ||
        project.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesVisibility && matchesCategory;
    });
  }, [projects, searchTerm, statusFilter, visibilityFilter, categoryFilter]);

  const saveProject = useCallback((projectData: Project) => {
    const saved = saveProjectStorage(projectData);
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Project "${saved.title}" saved successfully`);
    return saved;
  }, []);

  const deleteProject = useCallback((id: string) => {
    const target = projects.find((p) => p.id === id);
    deleteProjectStorage(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success(`Project "${target?.title || id}" removed`);
  }, [projects]);

  const toggleDraft = useCallback((id: string) => {
    const updated = toggleProjectDraftStorage(id);
    if (updated) {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, isDraft: updated.isDraft } : p)));
      toast.info(`Project status set to ${updated.isDraft ? 'Draft' : 'Published'}`);
    }
  }, []);

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
