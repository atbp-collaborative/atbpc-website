import { ROUTES, memberCategoryRoute } from './routes';

export interface DropdownSubItem {
  label: string;
  id: string; // The route identifier or filter string
}

export interface DropdownGroup {
  label: string;
  translation?: string; // Optional subtitle (e.g., "Kaya")
  id: string; // The route identifier or filter string
  subItems: DropdownSubItem[];
}

export const WORKS_NAV_STRUCTURE: DropdownGroup[] = [
  {
    label: 'Shelter',
    id: 'Shelter',
    subItems: [
      { label: 'Tiny Living', id: 'Tiny Living' },
      { label: 'Urban Living', id: 'Urban Living' },
      { label: 'Multi-Generational', id: 'Multi-Generational' },
      { label: 'Penthouses', id: 'Penthouses' },
      { label: 'Vacation Homes', id: 'Vacation Homes' },
    ],
  },
  {
    label: 'Livelihood',
    id: 'Livelihood',
    subItems: [
      { label: 'Build & Sell Homes', id: 'Build & Sell Homes' },
      { label: 'Food & Beverage', id: 'Food & Beverage' },
      { label: 'Retail & Lifestyle', id: 'Retail & Lifestyle' },
      { label: 'Workspaces', id: 'Workspaces' },
    ],
  },
  {
    label: 'Community',
    id: 'Community',
    subItems: [
      { label: 'Shared Spaces', id: 'Shared Spaces' },
      { label: 'Shared Places', id: 'Shared Places' },
      { label: 'Sacred Structures', id: 'Sacred Structures' },
    ],
  },
];

export const STUDIO_NAV_STRUCTURE: DropdownGroup[] = [
  {
    label: 'Services',
    translation: 'Kaya',
    id: ROUTES.ourServices,
    subItems: [
      { label: 'Comprehensive Services', id: ROUTES.comprehensiveServices },
      { label: 'Piecework Services', id: ROUTES.pieceworkServices },
    ],
  },
  {
    label: 'Process',
    translation: 'Paraán',
    id: ROUTES.services,
    subItems: [
      { label: 'Designing with Values', id: ROUTES.designingWithValues },
      { label: 'Managing with Integrity', id: ROUTES.managingWithIntegrity },
      { label: 'Building with Culture', id: ROUTES.buildingWithCulture },
    ],
  },
  {
    label: 'People',
    translation: 'Haligi',
    id: ROUTES.ourPeople,
    subItems: [
      { label: 'Designers', id: memberCategoryRoute('designers') },
      { label: 'Managers', id: memberCategoryRoute('managers') },
      { label: 'Builders', id: memberCategoryRoute('builders') },
    ],
  },
];

export const CONTACT_NAV_STRUCTURE: DropdownGroup[] = [
  {
    label: 'Case Study House',
    id: ROUTES.caseStudyHouse,
    subItems: [
      { label: 'Schedule a Discovery Session', id: ROUTES.discoverySession },
      { label: 'Request a Proposal', id: ROUTES.requestForProposal },
      { label: 'Locate & Communicate', id: ROUTES.contactInfo },
    ],
  },
  {
    label: 'Grow With Us',
    id: ROUTES.growWithUs,
    subItems: [
      { label: 'Internship Program', id: ROUTES.internshipProgram },
      { label: 'Apprenticeship Program', id: ROUTES.apprenticeshipProgram },
      { label: 'Studio Regulars', id: ROUTES.studioRegulars },
    ],
  },
  {
    label: 'Partner With Us',
    id: ROUTES.partnerWithUs,
    subItems: [
      { label: 'Suppliers', id: ROUTES.supplier },
      { label: 'Consultants', id: ROUTES.consultant },
      { label: 'Builders', id: ROUTES.builder },
    ],
  },
];
