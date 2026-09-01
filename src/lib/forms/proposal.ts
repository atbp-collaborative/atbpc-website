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
  principalDecisionMakers: z.array(personSchema).max(2).optional(),
  authorizedRepresentatives: z.array(personSchema).max(2).optional(),

  typology: z.string().optional(),
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
  principalDecisionMakers: [{}],
  authorizedRepresentatives: [{}],
  typology: '',
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

export const TYPOLOGY_OPTIONS = [
  { value: 'Residential', label: 'Residential', desc: 'Custom ground-up houses or massive full-scale renovations.' },
  { value: 'Commercial', label: 'Commercial', desc: 'Sleek modular built-ins, retail spaces, and corporate offices.' },
  { value: 'Institutional', label: 'Institutional', desc: 'Schools, hospitals, and specialized public facilities.' },
];

export const SERVICES_OPTIONS = [
  { value: 'Comprehensive', label: 'Comprehensive' },
  { value: 'Piecework', label: 'Piecework' },
  { value: 'Consultation and Retainer', label: 'Consultation & Retainer' },
];

// Based on OUR_SERVICES_DATA
export const SCOPE_MAPPING: Record<string, { value: string; label: string; desc: string }[]> = {
  'Comprehensive': [
    { value: 'Full Architectural Masterplanning', label: 'Full Architectural Masterplanning', desc: 'Integrated spatial design, exterior form development...' },
    { value: 'Engineering & MEPFS Integration', label: 'Engineering & MEPFS Integration', desc: 'Comprehensive structural calculation, electrical...' },
    { value: 'Permitting & Bureaucratic Approvals', label: 'Permitting & Bureaucratic Approvals', desc: 'Full regulatory compliance, local government approvals...' },
    { value: 'Turnkey Construction Supervision', label: 'Turnkey Construction Supervision', desc: 'On-site quality audits, material inspection...' },
  ],
  'Piecework': [
    { value: 'Architectural Working Drawings', label: 'Architectural Working Drawings', desc: 'High-precision technical drafting...' },
    { value: 'Joinery & Facade Detailing', label: 'Joinery & Facade Detailing', desc: 'Bespoke architectural metalwork...' },
    { value: 'Peer Review & Value Engineering', label: 'Peer Review & Value Engineering', desc: 'Independent auditing of third-party blueprints...' },
    { value: 'Material Specification Audits', label: 'Material Specification Audits', desc: 'Specialized procurement advisory...' },
  ],
  'Consultation and Retainer': [
    { value: 'Strategic Project Advisory', label: 'Strategic Project Advisory', desc: 'High-level guidance on feasibility...' },
    { value: 'Portfolio & Asset Management', label: 'Portfolio & Asset Management', desc: 'Long-term architectural strategy...' },
    { value: 'Phased Development Planning', label: 'Phased Development Planning', desc: 'Masterplanning and architectural roadmapping...' },
    { value: 'On-Demand Technical Consultation', label: 'On-Demand Technical Consultation', desc: 'Flexible access to architectural expertise...' },
  ]
};

export const BUDGET_OPTIONS = [
  { value: '1M-3M', label: 'Php 1,000,000 - 3M' },
  { value: '4M-6M', label: 'Php 4,000,000 - 6M' },
  { value: '7M-12M', label: 'Php 7,000,000 - 12M' },
  { value: '12M+', label: 'Php 12,000,000 above' },
];
