import { MemberCategory } from '@/types';

// Central tab-id -> route map. Single source of truth for navigation paths,
// replacing the activeTab string comparisons that used to be duplicated
// across App.tsx, Header.tsx and MobileDrawer.tsx.
export const ROUTES = {
  home: '/',
  studio: '/studio',
  works: '/works',
  services: '/studio/our-process',
  ourServices: '/studio/our-services',
  ourPeople: '/studio/our-people',
  contact: '/contact',
  caseStudyHouse: '/contact/case-study-house',
  growWithUs: '/contact/grow-with-us',
  partnerWithUs: '/contact/partner-with-us',
  contactInfo: '/contact/case-study-house/contact-info',
  apprenticeshipPrograms: '/contact/grow-with-us/apprenticeship-programs',
  regularPrograms: '/contact/grow-with-us/regular-programs',
  supplier: '/contact/partner-with-us/supplier',
  builder: '/contact/partner-with-us/builder',
  consultant: '/contact/partner-with-us/consultant',
  discoverySession: '/contact/case-study-house/discovery-session',
  requestForProposal: '/contact/case-study-house/request-for-proposal',
  comprehensiveServices: '/studio/our-services/comprehensive-services',
  pieceworkServices: '/studio/our-services/piecework-services',
  consultationRetainerServices: '/studio/our-services/consultation-retainer-services',
  designingWithValues: '/studio/our-process/designing-with-values',
  managingWithIntegrity: '/studio/our-process/managing-with-integrity',
  buildingWithCulture: '/studio/our-process/building-with-culture',
} as const;

export function projectRoute(slug: string): string {
  return `/works/${slug}`;
}

export function memberRoute(slug: string): string {
  return `/studio/our-people/${slug}`;
}

export function memberCategoryRoute(category: MemberCategory): string {
  return `${ROUTES.ourPeople}/category/${category}`;
}

