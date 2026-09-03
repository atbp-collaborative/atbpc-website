import { z } from 'zod';

export const personSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  title: z.string().optional(),
  contactNo: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export const proposalSchema = z.object({
  businessEntity: z.string().optional(),
  principalDecisionMakers: z.array(personSchema).max(3).optional(),
  authorizedRepresentatives: z.array(personSchema).max(1).optional(),

  category: z.string().optional(),
  typology: z.string().optional(),
  projectType: z.string().optional(),
  services: z.string().optional(),
  scope: z.string().optional(),

  propertyAreaType: z.string().optional(),
  propertyAreaSize: z.string().optional(),
  siteAddress: z.string().optional(),
  mapCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }).optional().nullable(),

  constructionBudget: z.string().optional(),
  targetDate: z.string().optional(),

  attachments: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    content: z.string() // base64
  })).optional(),
  
  superstitions: z.string().optional(),

  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    content: z.string() // base64
  })).optional(),

  additionalInfo: z.string().optional(),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;

export const defaultProposalFormData: ProposalFormData = {
  businessEntity: '',
  principalDecisionMakers: [{}],
  authorizedRepresentatives: [{}],
  category: '',
  typology: '',
  projectType: '',
  services: '',
  scope: '',
  propertyAreaType: '',
  propertyAreaSize: '',
  siteAddress: '',
  mapCoordinates: null,
  constructionBudget: '',
  targetDate: '',
  attachments: [],
  superstitions: '',
  documents: [],
  additionalInfo: '',
};

export const CATEGORY_OPTIONS = [
  { value: 'Shelter', label: 'Shelter' },
  { value: 'Livelihood', label: 'Livelihood' },
  { value: 'Community', label: 'Community' },
];

export const TYPOLOGY_MAPPING: Record<string, { value: string; label: string }[]> = {
  'Shelter': [
    { value: 'Tiny Living', label: 'Tiny Living' },
    { value: 'Multi-Generational', label: 'Multi-Generational' },
    { value: 'Vacation Homes', label: 'Vacation Homes' },
  ],
  'Livelihood': [
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Retail & Lifestyle', label: 'Retail & Lifestyle' },
    { value: 'Workspaces', label: 'Workspaces' },
  ],
  'Community': [
    { value: 'Shared Spaces', label: 'Shared Spaces' },
    { value: 'Shared Places', label: 'Shared Places' },
    { value: 'Sacred Structures', label: 'Sacred Structures' },
  ]
};

export const PROJECT_TYPE_OPTIONS = [
  { value: 'New Structure', label: 'New Structure' },
  { value: 'Renovation', label: 'Renovation' },
  { value: 'Extension', label: 'Extension' },
  { value: 'Fit-out', label: 'Fit-out' },
];

export const SERVICES_OPTIONS = [
  { value: 'Comprehensive Services', label: 'Comprehensive Services' },
  { value: 'Piecework Services', label: 'Piecework Services' },
  { value: 'Consultation & Retainer Services', label: 'Consultation & Retainer Services' },
];

// Based on OUR_SERVICES_DATA
export const SCOPE_MAPPING: Record<string, { value: string; label: string; desc?: string }[]> = {
  'Comprehensive Services': [
    { value: 'Comprehensive Design Services', label: 'Comprehensive Design Services' },
    { value: 'Comprehensive Management Services', label: 'Comprehensive Management Services' },
    { value: 'Building Construction Services', label: 'Building Construction Services' },
  ],
  'Piecework Services': [
    { value: 'Architectural Interiors', label: 'Architectural Interiors' },
    { value: 'Lighting Design', label: 'Lighting Design' },
    { value: 'Site Planning', label: 'Site Planning' },
    { value: 'Document & Assessment', label: 'Document & Assessment' },
    { value: 'Code Compliance', label: 'Code Compliance' },
    { value: 'Permit Processing', label: 'Permit Processing' },
    { value: 'Masonry', label: 'Masonry' },
    { value: 'Paint Jobs', label: 'Paint Jobs' },
  ],
  'Consultation & Retainer Services': [
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Retainer', label: 'Retainer' },
  ]
};

export const BUDGET_OPTIONS = [
  { value: '1M-3M', label: 'Php 1,000,000 - 3M' },
  { value: '4M-6M', label: 'Php 4,000,000 - 6M' },
  { value: '7M-12M', label: 'Php 7,000,000 - 12M' },
  { value: '12M+', label: 'Php 12,000,000 above' },
];
