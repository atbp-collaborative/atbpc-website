import { MemberCategory } from '../types';

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
  contactInfo: '/contact/contact-info',
  internshipProgram: '/contact/internship-program',
  apprenticeshipProgram: '/contact/apprenticeship-program',
  studioRegulars: '/contact/studio-regulars',
  supplier: '/contact/supplier',
  builder: '/contact/builder',
  consultant: '/contact/consultant',
  discoverySession: '/contact/discovery-session',
  requestForProposal: '/contact/request-for-proposal',
  comprehensiveServices: '/studio/our-services/comprehensive-services',
  pieceworkServices: '/studio/our-services/piecework-services',
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

// Legacy tab-id -> route lookup, for spots that used to key off the old
// activeTab strings (e.g. contact card `tab` fields, contact-dropdown data).
export const TAB_TO_ROUTE: Record<string, string> = {
  home: ROUTES.home,
  studio: ROUTES.studio,
  works: ROUTES.works,
  services: ROUTES.services,
  'our-services': ROUTES.ourServices,
  'our-people': ROUTES.ourPeople,
  'our-people-designers': memberCategoryRoute('designers'),
  'our-people-managers': memberCategoryRoute('managers'),
  'our-people-builders': memberCategoryRoute('builders'),
  contact: ROUTES.contact,
  'case-study-house': ROUTES.caseStudyHouse,
  'grow-with-us': ROUTES.growWithUs,
  'partner-with-us': ROUTES.partnerWithUs,
  'contact-info': ROUTES.contactInfo,
  'internship-program': ROUTES.internshipProgram,
  'apprenticeship-program': ROUTES.apprenticeshipProgram,
  'studio-regulars': ROUTES.studioRegulars,
  supplier: ROUTES.supplier,
  suppliers: ROUTES.supplier,
  builder: ROUTES.builder,
  builders: ROUTES.builder,
  consultant: ROUTES.consultant,
  consultants: ROUTES.consultant,
  'discovery-session': ROUTES.discoverySession,
  'request-for-proposal': ROUTES.requestForProposal,
  'comprehensive-services': ROUTES.comprehensiveServices,
  'piecework-services': ROUTES.pieceworkServices,
  'designing-with-values': ROUTES.designingWithValues,
  'managing-with-integrity': ROUTES.managingWithIntegrity,
  'building-with-culture': ROUTES.buildingWithCulture,
};
