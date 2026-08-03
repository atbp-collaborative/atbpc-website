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
  licenseProgram: '/contact/license-program',
  supplier: '/contact/supplier',
  builder: '/contact/builder',
  consultant: '/contact/consultant',
  discoveryMeeting: '/contact/discovery-meeting',
  comprehensiveServices: '/studio/comprehensive-services',
  pieceworkServices: '/studio/piecework-services',
  designingWithValues: '/studio/designing-with-values',
  managingWithIntegrity: '/studio/managing-with-integrity',
  buildingWithCulture: '/studio/building-with-culture',
} as const;

export function projectRoute(slug: string): string {
  return `/works/${slug}`;
}

export function memberRoute(slug: string): string {
  return `/studio/our-people/${slug}`;
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
  'our-people-designers': `${ROUTES.ourPeople}?filter=designers`,
  'our-people-managers': `${ROUTES.ourPeople}?filter=managers`,
  'our-people-builders': `${ROUTES.ourPeople}?filter=builders`,
  contact: ROUTES.contact,
  'case-study-house': ROUTES.caseStudyHouse,
  'grow-with-us': ROUTES.growWithUs,
  'partner-with-us': ROUTES.partnerWithUs,
  'contact-info': ROUTES.contactInfo,
  'internship-program': ROUTES.internshipProgram,
  'apprenticeship-program': ROUTES.apprenticeshipProgram,
  'license-program': ROUTES.licenseProgram,
  supplier: ROUTES.supplier,
  suppliers: ROUTES.supplier,
  builder: ROUTES.builder,
  builders: ROUTES.builder,
  consultant: ROUTES.consultant,
  consultants: ROUTES.consultant,
  'discovery-meeting': ROUTES.discoveryMeeting,
  'comprehensive-services': ROUTES.comprehensiveServices,
  'piecework-services': ROUTES.pieceworkServices,
  'designing-with-values': ROUTES.designingWithValues,
  'managing-with-integrity': ROUTES.managingWithIntegrity,
  'building-with-culture': ROUTES.buildingWithCulture,
};
