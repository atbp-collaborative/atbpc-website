import { CONTACT_INFO, ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { Service, Member, Project } from '@/types';
import { SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
import { HOME_CAROUSEL_DATA, HomeCarouselImage } from '@/lib/dummy-data/works/home-carousel';
import { MEMBERS_DATA } from '@/lib/dummy-data/works/members';
import { PROJECTS_DATA } from '@/lib/dummy-data/works/projects';
import { getPeopleFromSupabase, getPersonByIdFromSupabase } from './supabase/people.service';
import { getProjectsFromSupabase, getProjectByIdFromSupabase } from './supabase/projects.service';
import { getContactInfoFromSupabase } from './supabase/settings.service';
import {
  getHomeSlides,
  getSitePages,
  getNavigationCards,
  getServiceOfferings,
  getProcessPhilosophies,
  getStageGroupsWithStages,
  getHomepageSlogans,
} from './supabase/cms.service';
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
  return CONTACT_INFO;
}

export async function getServices(): Promise<Service[]> {
  return SERVICES_DATA;
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
      return await getSitePages();
    } catch (err) {
      console.warn('[DataService] Supabase getSitePages failed:', err);
    }
  }
  return getSitePages(false);
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
  return MEMBERS_DATA;
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  if (shouldQuerySupabase()) {
    try {
      const person = await getPersonByIdFromSupabase(id);
      if (person) return person;
    } catch (err) {
      console.warn(`[DataService] Supabase getMemberById(${id}) failed, falling back to mock data:`, err);
    }
  }
  return MEMBERS_DATA.find((member) => member.id === id);
}

export async function getProjects(includeDrafts: boolean = false): Promise<Project[]> {
  if (shouldQuerySupabase()) {
    try {
      const projects = await getProjectsFromSupabase(includeDrafts);
      if (projects && projects.length > 0) return projects;
    } catch (err) {
      console.warn('[DataService] Supabase getProjects failed, falling back to mock data:', err);
    }
  }
  return PROJECTS_DATA;
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
  return PROJECTS_DATA.find((project) => project.id === id);
}
