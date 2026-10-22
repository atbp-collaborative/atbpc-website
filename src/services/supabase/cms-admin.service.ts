/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SitePage,
  NavigationCardItem,
  ServiceOffering,
  ServiceAccordionItem,
  ProcessPhilosophy,
  StageGroup,
  ProcessStageItem,
  HomeSlideItem,
  HomepageSlogans,
} from '@/types';
import {
  getSitePages,
  getNavigationCards,
  getProcessPhilosophies,
  getStageGroupsWithStages,
  getServiceOfferings,
  getHomeSlides,
  getHomepageSlogans,
} from './cms.service';
import {
  saveSitePageAction,
  saveNavigationCardAction,
  saveProcessPhilosophyAction,
  saveStageGroupAction,
  deleteStageGroupAction,
  saveProcessStageAction,
  deleteProcessStageAction,
  saveServiceOfferingAction,
  saveServiceAccordionAction,
  deleteServiceAccordionAction,
  saveHomeSlideAction,
  deleteHomeSlideAction,
  reorderHomeSlidesAction,
  saveHomepageSlogansAction,
  fetchAdminSitePagesAction,
} from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

function reportCleanupWarning(warning?: string) {
  if (warning) toast.warning(`Content saved, but image cleanup failed: ${warning}`);
}

// ==========================================
// 1. SITE PAGES CRUD (SEO-Locked Slugs)
// ==========================================

export async function fetchAdminSitePages(): Promise<SitePage[]> {
  try {
    const pages = await fetchAdminSitePagesAction();
    if (pages && pages.length > 0) return pages;
  } catch (err) {
    console.warn('Failed to fetch site pages from server action:', err);
  }
  return getSitePages(true);
}

export async function saveAdminSitePage(page: SitePage): Promise<SitePage> {
  const res = await saveSitePageAction(page);
  if (!res.success) {
    console.error('Failed to save site page to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save site page');
  }
  reportCleanupWarning(res.cleanupWarning);
  return res.data || page;
}

// ==========================================
// 2. NAVIGATION CARDS CRUD
// ==========================================

export async function fetchAdminNavigationCards(): Promise<NavigationCardItem[]> {
  try {
    const cards = await getNavigationCards(undefined, true);
    if (cards && cards.length > 0) return cards;
  } catch (err) {
    console.warn('Failed to fetch navigation cards from Supabase:', err);
  }
  return getNavigationCards(undefined, false);
}

export async function saveAdminNavigationCard(card: NavigationCardItem): Promise<NavigationCardItem> {
  const res = await saveNavigationCardAction(card);
  if (!res.success) {
    console.error('Failed to save navigation card to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save navigation card');
  }
  reportCleanupWarning(res.cleanupWarning);
  return res.data || card;
}

// ==========================================
// 3. PROCESS PHILOSOPHIES, STAGE GROUPS & STAGES
// ==========================================

export async function fetchAdminProcessPhilosophies(): Promise<ProcessPhilosophy[]> {
  try {
    const philosophies = await getProcessPhilosophies(true);
    if (philosophies && philosophies.length > 0) return philosophies;
  } catch (err) {
    console.warn('Failed to fetch process philosophies from Supabase:', err);
  }
  return getProcessPhilosophies(false);
}

export async function saveAdminProcessPhilosophy(item: ProcessPhilosophy): Promise<ProcessPhilosophy> {
  const res = await saveProcessPhilosophyAction(item);
  if (!res.success) {
    console.error('Failed to save process philosophy to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save process philosophy');
  }
  reportCleanupWarning(res.cleanupWarning);
  return res.data || item;
}

export async function fetchAdminStageGroups(processPageId: string): Promise<StageGroup[]> {
  try {
    const groups = await getStageGroupsWithStages(processPageId, true);
    if (groups && groups.length > 0) return groups;
  } catch (err) {
    console.warn(`Failed to fetch stage groups for ${processPageId}:`, err);
  }
  return getStageGroupsWithStages(processPageId, false);
}

export async function saveAdminStageGroup(group: StageGroup): Promise<StageGroup> {
  const res = await saveStageGroupAction(group);
  if (!res.success) {
    console.error('Failed to save stage group to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save stage group');
  }
  return res.data || group;
}

export async function deleteAdminStageGroup(groupId: string, processPageId: string): Promise<void> {
  const res = await deleteStageGroupAction(groupId, processPageId);
  if (!res.success) {
    console.error('Failed to delete stage group from Supabase:', res.error);
    throw new Error(res.error || 'Failed to delete stage group');
  }
}

export async function saveAdminProcessStage(stage: ProcessStageItem): Promise<ProcessStageItem> {
  const res = await saveProcessStageAction(stage);
  if (!res.success) {
    console.error('Failed to save process stage to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save process stage');
  }
  return res.data || stage;
}

export async function deleteAdminProcessStage(stageId: string, processPageId: string): Promise<void> {
  const res = await deleteProcessStageAction(stageId, processPageId);
  if (!res.success) {
    console.error('Failed to delete process stage from Supabase:', res.error);
    throw new Error(res.error || 'Failed to delete process stage');
  }
}

// ==========================================
// 4. SERVICE OFFERINGS CRUD
// ==========================================

export async function fetchAdminServiceOfferings(): Promise<ServiceOffering[]> {
  try {
    const offerings = await getServiceOfferings(true);
    if (offerings && offerings.length > 0) return offerings;
  } catch (err) {
    console.warn('Failed to fetch service offerings from Supabase:', err);
  }
  return getServiceOfferings(false);
}

export async function saveAdminServiceOffering(offering: ServiceOffering): Promise<ServiceOffering> {
  const res = await saveServiceOfferingAction(offering);
  if (!res.success) {
    console.error('Failed to save service offering to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save service offering');
  }
  reportCleanupWarning(res.cleanupWarning);
  return res.data || offering;
}

export async function saveAdminServiceAccordion(item: ServiceAccordionItem): Promise<ServiceAccordionItem> {
  const res = await saveServiceAccordionAction(item);
  if (!res.success) {
    console.error('Failed to save service accordion to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save service accordion');
  }
  return res.data || item;
}

export async function deleteAdminServiceAccordion(itemId: string, serviceId: string): Promise<void> {
  const res = await deleteServiceAccordionAction(itemId, serviceId);
  if (!res.success) {
    console.error('Failed to delete service accordion from Supabase:', res.error);
    throw new Error(res.error || 'Failed to delete service accordion');
  }
}

// ==========================================
// 5. HOMEPAGE SLIDES & SLOGANS CRUD
// ==========================================

export async function fetchAdminHomeSlides(): Promise<HomeSlideItem[]> {
  try {
    const slides = await getHomeSlides(true);
    if (slides && slides.length > 0) return slides;
  } catch (err) {
    console.warn('Failed to fetch home slides from Supabase:', err);
  }
  return getHomeSlides(false);
}

export async function saveAdminHomeSlide(slide: HomeSlideItem): Promise<HomeSlideItem> {
  const res = await saveHomeSlideAction(slide);
  if (!res.success) {
    console.error('Failed to save home slide to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save home slide');
  }
  reportCleanupWarning(res.cleanupWarning);
  return res.data || slide;
}

export async function deleteAdminHomeSlide(slideId: string): Promise<void> {
  const res = await deleteHomeSlideAction(slideId);
  if (!res.success) {
    console.error('Failed to delete home slide from Supabase:', res.error);
    throw new Error(res.error || 'Failed to delete home slide');
  }
  if (res.cleanupWarning) toast.warning(`Slide deleted, but image cleanup failed: ${res.cleanupWarning}`);
}

export async function reorderAdminHomeSlides(slides: HomeSlideItem[]): Promise<void> {
  const res = await reorderHomeSlidesAction(
    slides.map((s) => ({ id: s.id, sortOrder: s.sortOrder }))
  );
  if (!res.success) {
    console.error('Failed to reorder home slides in Supabase:', res.error);
    throw new Error(res.error || 'Failed to reorder home slides');
  }
}

export async function fetchAdminHomepageSlogans(): Promise<HomepageSlogans> {
  try {
    const slogans = await getHomepageSlogans();
    if (slogans) return slogans;
  } catch (err) {
    console.warn('Failed to fetch homepage slogans from Supabase:', err);
  }
  return getHomepageSlogans();
}

export async function saveAdminHomepageSlogans(data: HomepageSlogans): Promise<HomepageSlogans> {
  const res = await saveHomepageSlogansAction(data);
  if (!res.success) {
    console.error('Failed to save homepage slogans to Supabase:', res.error);
    throw new Error(res.error || 'Failed to save homepage slogans');
  }
  return res.data || data;
}
