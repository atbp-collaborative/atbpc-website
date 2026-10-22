import { CONTACT_INFO, ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { Service, Member, Project } from '@/types';
import { SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
import { HOME_CAROUSEL_DATA, HomeCarouselImage } from '@/lib/dummy-data/works/home-carousel';
import { MEMBERS_DATA } from '@/lib/dummy-data/works/members';
import { PROJECTS_DATA } from '@/lib/dummy-data/works/projects';
import { getPeopleFromSupabase, getPersonByIdFromSupabase } from './supabase/people.service';
import { getProjectsFromSupabase, getProjectByIdFromSupabase } from './supabase/projects.service';
import { getContactInfoFromSupabase } from './supabase/settings.service';
import { getContactInfo as getMockContactInfo } from './mock/adminMockStorage';
import {
  getHomeSlides,
  getSitePages,
  getNavigationCards,
  getServiceOfferings,
  getProcessPhilosophies,
  getStageGroupsWithStages,
  getHomepageSlogans,
} from './supabase/cms.service';
import { fetchAdminSitePagesAction } from '@/app/actions/admin-mutations';
import { sortProjectsCanonically } from '@/lib/projects/project-helpers';
import {
  SitePage,
  NavigationCardItem,
  ServiceOffering,
  ProcessPhilosophy,
  StageGroup,
  HomepageSlogans,
} from '@/types';

/**
 * Determines whether to query Supabase or use local mock data.
 * - By default, respects NEXT_PUBLIC_DATA_SOURCE ('supabase' | 'mock').
 * - In non-production or preview (localhost, *.vercel.app), allows query override: ?source=mock | ?source=supabase.
 * - On the official production domain (atbpcollaborative.com), URL overrides are strictly disabled.
 */
function shouldQuerySupabase(): boolean {
  const envSource = process.env.NEXT_PUBLIC_DATA_SOURCE;
  let useSupabase = envSource !== 'mock';

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isOfficialProduction = hostname === 'atbpcollaborative.com' || hostname === 'www.atbpcollaborative.com';

    // Only allow URL query parameter override outside official production domain
    if (!isOfficialProduction) {
      const params = new URLSearchParams(window.location.search);
      const querySource = params.get('source');
      if (querySource === 'mock') return false;
      if (querySource === 'supabase') return true;
    }
  }

  return useSupabase;
}

export async function getContactInfo(): Promise<ContactInfo> {
  if (shouldQuerySupabase()) {
    try {
      const data = await getContactInfoFromSupabase();
      if (data) return data;
    } catch (err) {
      console.warn('[DataService] Supabase getContactInfo failed, falling back to mock data:', err);
    }
  }
  try {
    const mock = getMockContactInfo();
    if (mock) return mock;
  } catch (err) {
    console.warn('[DataService] Failed to read mock contact info:', err);
  }
  return CONTACT_INFO;
}

export async function getServices(): Promise<Service[]> {
  try {
    const cards = await getNavigationCardsData('services');
    if (cards && cards.length > 0) {
      return cards.map((c) => {
        let iconName = 'Briefcase';
        if (c.cardKey === 'comprehensive-services' || c.title.includes('comprehensive')) iconName = 'Layers';
        else if (c.cardKey === 'piecework-services' || c.title.includes('piecework')) iconName = 'LayoutGrid';
        return {
          title: c.title,
          iconName,
          desc: c.tagline || c.subtext,
          image: c.imageUrl,
        };
      });
    }
  } catch (err) {
    console.warn('[DataService] Failed to load services navigation cards:', err);
  }
  return SERVICES_DATA;
}

export async function getServiceOfferingByIdData(id: string): Promise<ServiceOffering | null> {
  const all = await getServiceOfferingsData();
  return all.find((s) => s.id === id) || null;
}

export async function getHomeCarouselImages(): Promise<HomeCarouselImage[]> {
  if (shouldQuerySupabase()) {
    try {
      const slides = await getHomeSlides();
      if (slides && slides.length > 0) {
        return slides.map((s) => ({ url: s.imageUrl, title: s.title }));
      }
    } catch (err) {
      console.warn('[DataService] Supabase getHomeCarouselImages failed, falling back to mock data:', err);
    }
  }
  return HOME_CAROUSEL_DATA;
}

export async function getSitePagesData(): Promise<SitePage[]> {
  if (shouldQuerySupabase()) {
    try {
      const pages = await fetchAdminSitePagesAction();
      if (pages && pages.length > 0) return pages;
    } catch (err) {
      console.warn('[DataService] fetchAdminSitePagesAction failed, falling back to getSitePages:', err);
    }
  }
  return getSitePages(true);
}

export async function getNavigationCardsData(hubId?: string): Promise<NavigationCardItem[]> {
  if (shouldQuerySupabase()) {
    try {
      return await getNavigationCards(hubId);
    } catch (err) {
      console.warn('[DataService] Supabase getNavigationCards failed:', err);
    }
  }
  return getNavigationCards(hubId, false);
}

export async function getServiceOfferingsData(): Promise<ServiceOffering[]> {
  if (shouldQuerySupabase()) {
    try {
      return await getServiceOfferings();
    } catch (err) {
      console.warn('[DataService] Supabase getServiceOfferings failed:', err);
    }
  }
  return getServiceOfferings(false);
}

export async function getProcessPhilosophiesData(): Promise<ProcessPhilosophy[]> {
  if (shouldQuerySupabase()) {
    try {
      return await getProcessPhilosophies();
    } catch (err) {
      console.warn('[DataService] Supabase getProcessPhilosophies failed:', err);
    }
  }
  return getProcessPhilosophies(false);
}

export async function getStageGroupsData(processPageId: string): Promise<StageGroup[]> {
  if (shouldQuerySupabase()) {
    try {
      return await getStageGroupsWithStages(processPageId);
    } catch (err) {
      console.warn(`[DataService] Supabase getStageGroupsWithStages(${processPageId}) failed:`, err);
    }
  }
  return getStageGroupsWithStages(processPageId, false);
}

export async function getHomepageSlogansData(): Promise<HomepageSlogans> {
  if (shouldQuerySupabase()) {
    try {
      return await getHomepageSlogans();
    } catch (err) {
      console.warn('[DataService] Supabase getHomepageSlogans failed:', err);
    }
  }
  return getHomepageSlogans();
}

export async function getMembers(includeDrafts: boolean = false): Promise<Member[]> {
  if (shouldQuerySupabase()) {
    try {
      const people = await getPeopleFromSupabase(includeDrafts);
      if (people && people.length > 0) return people;
    } catch (err) {
      console.warn('[DataService] Supabase getMembers failed, falling back to mock data:', err);
    }
  }
  if (!includeDrafts) {
    return MEMBERS_DATA.filter((m) => !m.isDraft && m.isCurrentlyHired !== false);
  }
  return MEMBERS_DATA;
}

export async function getMemberById(id: string, includeDrafts: boolean = false): Promise<Member | undefined> {
  if (shouldQuerySupabase()) {
    try {
      const person = await getPersonByIdFromSupabase(id, includeDrafts);
      if (person) return person;
    } catch (err) {
      console.warn(`[DataService] Supabase getMemberById(${id}) failed, falling back to mock data:`, err);
    }
  }
  const found = MEMBERS_DATA.find((member) => member.id === id);
  if (!found) return undefined;
  if (!includeDrafts && (found.isDraft || found.isCurrentlyHired === false)) {
    return undefined;
  }
  return found;
}

export async function getProjects(includeDrafts: boolean = false): Promise<Project[]> {
  if (shouldQuerySupabase()) {
    try {
      const projects = await getProjectsFromSupabase(includeDrafts);
      if (projects && projects.length > 0) return sortProjectsCanonically(projects);
    } catch (err) {
      console.warn('[DataService] Supabase getProjects failed, falling back to mock data:', err);
    }
  }
  return sortProjectsCanonically(PROJECTS_DATA);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (shouldQuerySupabase()) {
    try {
      const project = await getProjectByIdFromSupabase(id);
      if (project) return project;
    } catch (err) {
      console.warn(`[DataService] Supabase getProjectById(${id}) failed, falling back to mock data:`, err);
    }
  }
  return PROJECTS_DATA.find((project) => project.id === id || (project.slug && project.slug === id));
}
