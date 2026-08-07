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
    id: 'our-services',
    subItems: [
      { label: 'Comprehensive Services', id: 'comprehensive-services' },
      { label: 'Piecework Services', id: 'piecework-services' },
    ],
  },
  {
    label: 'Process',
    translation: 'Paraán',
    id: 'services',
    subItems: [
      { label: 'Designing with Values', id: 'designing-with-values' },
      { label: 'Managing with Integrity', id: 'managing-with-integrity' },
      { label: 'Building with Culture', id: 'building-with-culture' },
    ],
  },
  {
    label: 'People',
    translation: 'Haligi',
    id: 'our-people',
    subItems: [
      { label: 'Designers', id: 'our-people-designers' },
      { label: 'Managers', id: 'our-people-managers' },
      { label: 'Builders', id: 'our-people-builders' },
    ],
  },
];

export const CONTACT_NAV_STRUCTURE: DropdownGroup[] = [
  {
    label: 'Case Study House',
    id: 'case-study-house',
    subItems: [
      { label: 'Schedule a Discovery Session', id: 'discovery-session' },
      { label: 'Locate & Communicate', id: 'contact-info' },
    ],
  },
  {
    label: 'Grow With Us',
    id: 'grow-with-us',
    subItems: [
      { label: 'Internship Program', id: 'internship-program' },
      { label: 'Apprenticeship Program', id: 'apprenticeship-program' },
      { label: 'Studio Regulars', id: 'studio-regulars' },
    ],
  },
  {
    label: 'Partner With Us',
    id: 'partner-with-us',
    subItems: [
      { label: 'Suppliers', id: 'supplier' },
      { label: 'Consultants', id: 'consultant' },
      { label: 'Builders', id: 'builder' },
    ],
  },
];
