import { CONTACT_INFO, ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { Service, Member, Project } from '@/types';
import { SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
import { HOME_CAROUSEL_DATA, HomeCarouselImage } from '@/lib/dummy-data/works/home-carousel';
import { MEMBERS_DATA } from '@/lib/dummy-data/works/members';
import { PROJECTS_DATA } from '@/lib/dummy-data/works/projects';

// Reads from local dummy content today; swap the body for a Supabase/DB/CMS
// call later without changing any calling component.

export async function getContactInfo(): Promise<ContactInfo> {
  return CONTACT_INFO;
}

export async function getServices(): Promise<Service[]> {
  return SERVICES_DATA;
}

export async function getHomeCarouselImages(): Promise<HomeCarouselImage[]> {
  return HOME_CAROUSEL_DATA;
}

export async function getMembers(): Promise<Member[]> {
  return MEMBERS_DATA;
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  return MEMBERS_DATA.find((member) => member.id === id);
}

export async function getProjects(): Promise<Project[]> {
  return PROJECTS_DATA;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return PROJECTS_DATA.find((project) => project.id === id);
}
