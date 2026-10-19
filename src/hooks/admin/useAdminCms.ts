/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  SitePage,
  NavigationCardItem,
  ServiceOffering,
  ProcessPhilosophy,
  StageGroup,
  ProcessStageItem,
  HomeSlideItem,
  HomepageSlogans,
} from '@/types';
import {
  fetchAdminSitePages,
  saveAdminSitePage,
  fetchAdminNavigationCards,
  saveAdminNavigationCard,
  fetchAdminProcessPhilosophies,
  saveAdminProcessPhilosophy,
  fetchAdminStageGroups,
  saveAdminStageGroup,
  deleteAdminStageGroup,
  saveAdminProcessStage,
  deleteAdminProcessStage,
  fetchAdminServiceOfferings,
  saveAdminServiceOffering,
  fetchAdminHomeSlides,
  saveAdminHomeSlide,
  deleteAdminHomeSlide,
  fetchAdminHomepageSlogans,
  saveAdminHomepageSlogans,
} from '@/services/supabase/cms-admin.service';
import { toast } from 'sonner';

export type CmsTab = 'pages' | 'process' | 'services' | 'home';

export function useAdminCms() {
  const [activeTab, setActiveTab] = useState<CmsTab>('pages');
  const [isLoading, setIsLoading] = useState(true);

  // Tab 1: Pages & Nav
  const [pages, setPages] = useState<SitePage[]>([]);
  const [cards, setCards] = useState<NavigationCardItem[]>([]);

  // Tab 2: Process & Stages
  const [philosophies, setPhilosophies] = useState<ProcessPhilosophy[]>([]);
  const [selectedProcessPageId, setSelectedProcessPageId] = useState<string>('designing-with-values');
  const [stageGroups, setStageGroups] = useState<StageGroup[]>([]);

  // Tab 3: Services
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('comprehensive');

  // Tab 4: Home
  const [slides, setSlides] = useState<HomeSlideItem[]>([]);
  const [slogans, setSlogans] = useState<HomepageSlogans>({ slogans: [], heroSubtext: [] });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [p, c, phil, srv, sld, slg] = await Promise.all([
        fetchAdminSitePages(),
        fetchAdminNavigationCards(),
        fetchAdminProcessPhilosophies(),
        fetchAdminServiceOfferings(),
        fetchAdminHomeSlides(),
        fetchAdminHomepageSlogans(),
      ]);
      setPages(p);
      setCards(c);
      setPhilosophies(phil);
      setServices(srv);
      setSlides(sld);
      setSlogans(slg);

      // Load initial stage groups for selected process page
      const groups = await fetchAdminStageGroups(selectedProcessPageId);
      setStageGroups(groups);
    } catch (err) {
      console.error('Failed to load CMS data:', err);
      toast.error('Failed to load some CMS data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProcessPageId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload stage groups when selected process page changes
  const handleSelectProcessPage = useCallback(async (pageId: string) => {
    setSelectedProcessPageId(pageId);
    try {
      const groups = await fetchAdminStageGroups(pageId);
      setStageGroups(groups);
    } catch (err) {
      console.error('Failed to load stage groups:', err);
    }
  }, []);

  // Page mutation
  const handleSavePage = useCallback(async (page: SitePage) => {
    const saved = await saveAdminSitePage(page);
    setPages((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    toast.success(`Page "${saved.title}" saved successfully`);
    return saved;
  }, []);

  // Card mutation
  const handleSaveCard = useCallback(async (card: NavigationCardItem) => {
    const saved = await saveAdminNavigationCard(card);
    setCards((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    toast.success(`Navigation card "${saved.title}" saved`);
    return saved;
  }, []);

  // Philosophy mutation
  const handleSavePhilosophy = useCallback(async (item: ProcessPhilosophy) => {
    const saved = await saveAdminProcessPhilosophy(item);
    setPhilosophies((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    toast.success(`Philosophy for "${saved.title}" updated`);
    return saved;
  }, []);

  // Stage Group mutations
  const handleSaveStageGroup = useCallback(async (group: StageGroup) => {
    const saved = await saveAdminStageGroup(group);
    setStageGroups((prev) => {
      const idx = prev.findIndex((g) => g.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    toast.success(`Stage Group "${saved.name}" saved`);
    return saved;
  }, []);

  const handleDeleteStageGroup = useCallback(async (groupId: string) => {
    await deleteAdminStageGroup(groupId, selectedProcessPageId);
    setStageGroups((prev) => prev.filter((g) => g.id !== groupId));
    toast.info('Stage Group deleted');
  }, [selectedProcessPageId]);

  // Process Stage mutations
  const handleSaveProcessStage = useCallback(async (stage: ProcessStageItem) => {
    const saved = await saveAdminProcessStage(stage);
    setStageGroups((prev) =>
      prev.map((g) => {
        if (g.id === saved.stageGroupId) {
          const stgs = g.stages || [];
          const sIdx = stgs.findIndex((s) => s.id === saved.id);
          let newStgs: ProcessStageItem[];
          if (sIdx >= 0) {
            newStgs = [...stgs];
            newStgs[sIdx] = saved;
          } else {
            newStgs = [...stgs, saved];
          }
          return { ...g, stages: newStgs };
        }
        return g;
      })
    );
    toast.success(`Stage "${saved.title}" saved`);
    return saved;
  }, []);

  const handleDeleteProcessStage = useCallback(async (stageId: string) => {
    await deleteAdminProcessStage(stageId, selectedProcessPageId);
    setStageGroups((prev) =>
      prev.map((g) => ({
        ...g,
        stages: (g.stages || []).filter((s) => s.id !== stageId),
      }))
    );
    toast.info('Process Stage removed');
  }, [selectedProcessPageId]);

  // Service mutation
  const handleSaveService = useCallback(async (offering: ServiceOffering) => {
    const saved = await saveAdminServiceOffering(offering);
    setServices((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
    toast.success(`Service offering "${saved.title}" updated`);
    return saved;
  }, []);

  // Home Slide mutations
  const handleSaveSlide = useCallback(async (slide: HomeSlideItem) => {
    const saved = await saveAdminHomeSlide(slide);
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    toast.success(`Hero slide "${saved.title}" saved`);
    return saved;
  }, []);

  const handleDeleteSlide = useCallback(async (slideId: string) => {
    await deleteAdminHomeSlide(slideId);
    setSlides((prev) => prev.filter((s) => s.id !== slideId));
    toast.info('Hero slide removed');
  }, []);

  // Homepage Slogans mutation
  const handleSaveSlogans = useCallback(async (data: HomepageSlogans) => {
    const saved = await saveAdminHomepageSlogans(data);
    setSlogans(saved);
    toast.success('Homepage slogans & subtext updated');
    return saved;
  }, []);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    refresh: loadData,
    // Tab 1
    pages,
    cards,
    savePage: handleSavePage,
    saveCard: handleSaveCard,
    // Tab 2
    philosophies,
    selectedProcessPageId,
    selectProcessPage: handleSelectProcessPage,
    stageGroups,
    savePhilosophy: handleSavePhilosophy,
    saveStageGroup: handleSaveStageGroup,
    deleteStageGroup: handleDeleteStageGroup,
    saveProcessStage: handleSaveProcessStage,
    deleteProcessStage: handleDeleteProcessStage,
    // Tab 3
    services,
    selectedServiceId,
    setSelectedServiceId,
    saveService: handleSaveService,
    // Tab 4
    slides,
    slogans,
    saveSlide: handleSaveSlide,
    deleteSlide: handleDeleteSlide,
    saveSlogans: handleSaveSlogans,
  };
}
