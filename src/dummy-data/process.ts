export interface ProcessNode {
  id: string;
  stepNumber: string;
  category: 'guidance' | 'experiential' | 'presence';
  title: string;
  lines: string[];
  subtitle: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export const PROCESS_NODES: ProcessNode[] = [
  {
    id: 'discovery',
    stepNumber: '01',
    category: 'guidance',
    title: 'Discovery Session',
    lines: ['Discovery', 'Session'],
    subtitle: 'Initial Consultation & Strategic Alignment',
    description: 'An initial casual 2-hour online consultation or in-person session where we align on project scale, site context, vision, and target budget bounds with zero commitment required.',
    deliverables: [
      'Client Brief & Vision Definition',
      'Site & Zoning Feasibility Assessment',
      'Budget & Timeline Expectations Alignment',
      'Non-Binding Pre-Design Roadmap'
    ],
    duration: '1 - 2 Weeks'
  },
  {
    id: 'proposal',
    stepNumber: '02',
    category: 'guidance',
    title: 'Proposal Review',
    lines: ['Proposal', 'Review'],
    subtitle: 'Tailored Scope of Services & Commercial Alignment',
    description: 'We submit a comprehensive, transparent design-build proposal outlining project scope, deliverables, team structure, and milestone payment schedules for client alignment.',
    deliverables: [
      'Detailed Scope of Architectural Services',
      'Phase-by-Phase Deliverables Checklist',
      'Transparent Fee Structure & Payment Terms',
      'Project Master Schedule'
    ],
    duration: '1 - 2 Weeks'
  },
  {
    id: 'contract',
    stepNumber: '03',
    category: 'guidance',
    title: 'Contract Review',
    lines: ['Contract', 'Review'],
    subtitle: 'Formalizing Service Agreements & Governance',
    description: 'We draft and finalize notarized service agreements mapping out precise legal responsibilities, project milestones, quality guarantees, and progressive payment stages.',
    deliverables: [
      'Notarized Architectural Service Agreement',
      'Defined Progressive Payment Schedule',
      'Legal & Regulatory Compliance Framework',
      'Milestone Verification Protocols'
    ],
    duration: '1 Week'
  },
  {
    id: 'design',
    stepNumber: '04',
    category: 'experiential',
    title: 'Design Stage',
    lines: ['Design', 'Stage'],
    subtitle: 'Spatial Programming & Conceptual Massing',
    description: 'Guided by the Double Diamond design framework, we analyze site orientation, solar diagnostics, and spatial requirements to synthesize schematic floor layouts and 3D architectural massing.',
    deliverables: [
      'Solar & Environmental Diagnostics',
      'Spatial Programming Matrix',
      'Schematic Architectural Floor Plans',
      '3D Volumetric Concept Models'
    ],
    duration: '4 - 8 Weeks'
  },
  {
    id: 'technical',
    stepNumber: '05',
    category: 'experiential',
    title: 'Technical Stage',
    lines: ['Technical', 'Stage'],
    subtitle: 'BIM Engineering & Permit-Ready Blueprints',
    description: 'We refine conceptual designs into high-resolution technical BIM models, integrating structural engineering, MEPFS systems, finish schedules, and construction drawing packages.',
    deliverables: [
      'High-Resolution Technical BIM Models',
      'Integrated Structural & MEPFS Systems',
      'Permit-Ready Construction Drawings',
      'Material Specifications & Schedules'
    ],
    duration: '6 - 10 Weeks'
  },
  {
    id: 'construction',
    stepNumber: '06',
    category: 'experiential',
    title: 'Construction Stage',
    lines: ['Construction', 'Stage'],
    subtitle: 'On-Site Execution & Quality Supervision',
    description: 'From contractor bidding and procurement to continuous on-site architectural oversight and quality assurance inspections, we safeguard the design intent through turnkey completion.',
    deliverables: [
      'Contractor Bidding & Procurement Support',
      'Continuous On-Site Quality Inspections',
      'Material Compliance & Verification',
      'Turnkey Handover & Final Sign-Off'
    ],
    duration: '6 - 18 Months'
  },
  {
    id: 'support',
    stepNumber: '07',
    category: 'presence',
    title: '15-Year Project Support',
    lines: ['15-Year', 'Project', 'Support'],
    subtitle: 'Long-Term Stewardship & Warranty Care',
    description: 'Our engagement continues far past move-in day. We provide a 15-year structural and maintenance support protocol to guarantee enduring building performance and client peace of mind.',
    deliverables: [
      '15-Year Structural Integrity Guarantee',
      'Scheduled Post-Occupancy Audits',
      'Building Maintenance & Renovation Advice',
      'Dedicated Lifetime Client Support Line'
    ],
    duration: '15 Years'
  }
];

export const CATEGORY_GROUPS: { key: ProcessNode['category']; label: string; colStart: number; colSpan: number }[] = [
  { key: 'guidance', label: 'guidance', colStart: 1, colSpan: 3 },
  { key: 'experiential', label: 'experiential', colStart: 4, colSpan: 3 },
  { key: 'presence', label: 'presence', colStart: 7, colSpan: 1 },
];
