import { StudioSubpageData } from '../our-services/services-data';
import { ROUTES } from '@/lib/navigation/routes';

export const OUR_SERVICES_PROCESS_DATA: Record<string, StudioSubpageData> = {
  'designing-with-values': {
    id: 'designing-with-values',
    title: 'designing with values',
    section: 'process | paraán',
    tagline: 'purpose-driven spatial concepts anchored in environmental & social context',
    description: 'Our design methodology begins with deep contextual listening—ensuring every spatial form respects microclimates, community heritage, resource stewardship, and long-term utility.',
    extraDescription: 'Every decision we make in the design phase is guided by a commitment to environmental stewardship and human-centric ergonomics. We strive to build enduring structures that act as positive forces within their respective ecologies and communities.',
    image: '/images/contact_case_study_house_img_1785469986420.jpg',
    pillars: [
      {
        title: 'Passive Environmental Response',
        desc: 'Optimizing natural light, cross-ventilation, and solar orientation to minimize operational energy loads.'
      },
      {
        title: 'Material Integrity & Circularity',
        desc: 'Prioritizing non-toxic, locally harvested, and enduring building materials that age with grace.'
      },
      {
        title: 'Human-Centric Spatial Ergonomics',
        desc: 'Crafting spaces that nurture emotional wellbeing, intuitive navigation, and multi-generational adaptability.'
      },
      {
        title: 'Vernacular & Cultural Adaptation',
        desc: 'Harmonizing contemporary spatial minimalism with regional architectural heritage and micro-histories.'
      }
    ],
    subtext: 'Designing spaces that respect context, microclimate, and the human experience.'
  },
  'managing-with-integrity': {
    id: 'managing-with-integrity',
    title: 'managing with integrity',
    section: 'process | paraán',
    tagline: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    description: 'A discipline of project stewardship built on open-book budgeting, transparent contractor bidding, strict schedule milestones, and zero hidden markups.',
    extraDescription: 'We champion full transparency throughout the lifecycle of every project. By enforcing open-book budgeting and uncompromised quality standards, we protect our clients\' investments and deliver spaces exactly as envisioned, without hidden surprises.',
    image: '/images/contact_headquarters_img_1785470005846.jpg',
    pillars: [
      {
        title: 'Open-Book Financial Reporting',
        desc: 'Real-time cost tracking and transparent line-item breakdowns with complete client visibility.'
      },
      {
        title: 'Competitive Vendor Bidding',
        desc: 'Unbiased contractor evaluation and transparent bid comparisons to protect project capital.'
      },
      {
        title: 'Milestone Verification',
        desc: 'Strict payment releases tied directly to verified site completion and quality benchmarks.'
      },
      {
        title: 'Proactive Risk Mitigation',
        desc: 'Pre-emptive issue resolution, delay tracking, and safety compliance protocols.'
      }
    ],
    subtext: 'Ensuring project success through transparent procurement and uncompromising oversight.'
  },
  'building-with-culture': {
    id: 'building-with-culture',
    title: 'building with culture',
    section: 'process | paraán',
    tagline: 'synthesizing regional craftsmanship with modern architectural technology',
    description: 'Bridging time-honored local artisan techniques with modern structural standards to craft buildings deeply rooted in place, character, and tactile permanence.',
    extraDescription: 'We believe that true sustainability involves preserving cultural heritage and empowering local artisans. By integrating time-honored building techniques with contemporary standards, we create spaces that resonate with history while serving modern needs.',
    image: '/images/studio_process_img_1785469980353.jpg',
    pillars: [
      {
        title: 'Artisan & Guild Collaboration',
        desc: 'Partnering directly with local woodcarvers, stonemasons, weavers, and metal fabricators.'
      },
      {
        title: 'Regional Material Sourcing',
        desc: 'Utilizing indigenous timbers, volcanic stone, bamboo composites, and local aggregates.'
      },
      {
        title: 'Hybrid Construction Technology',
        desc: 'Pairing modern engineered steel and concrete with hand-crafted natural finishes.'
      },
      {
        title: 'Community Skill Empowerment',
        desc: 'Investing in local labor force training and supporting traditional building guilds.'
      }
    ],
    subtext: 'Honoring regional craftsmanship by integrating traditional artisan techniques with modern standards.'
  }
};

export const OUR_PROCESS_CARDS = [
  {
    id: 'designing-with-values',
    href: ROUTES.designingWithValues,
    title: 'designing with values',
    tagline: 'purpose-driven spatial concepts anchored in environmental & social context',
    subtext: 'designing spaces that respect context, microclimate, and the human experience.',
    image: '/images/contact_case_study_house_img_1785469986420.jpg',
  },
  {
    id: 'managing-with-integrity',
    href: ROUTES.managingWithIntegrity,
    title: 'managing with integrity',
    tagline: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    subtext: 'ensuring project success through transparent procurement and uncompromising oversight.',
    image: '/images/contact_headquarters_img_1785470005846.jpg',
  },
  {
    id: 'building-with-culture',
    href: ROUTES.buildingWithCulture,
    title: 'building with culture',
    tagline: 'synthesizing regional craftsmanship with modern architectural technology',
    subtext: 'honoring regional craftsmanship by integrating traditional artisan techniques with modern standards.',
    image: '/images/studio_process_img_1785469980353.jpg',
  },
];

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

export const BASE_PROCESS_NODES: ProcessNode[] = [
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

export const PROCESS_NODES = BASE_PROCESS_NODES; // Kept for backward compatibility if used elsewhere

export const CATEGORY_GROUPS: { key: ProcessNode['category']; label: string; colStart: number; colSpan: number }[] = [
  { key: 'guidance', label: 'guidance', colStart: 1, colSpan: 3 },
  { key: 'experiential', label: 'experiential', colStart: 4, colSpan: 3 },
  { key: 'presence', label: 'presence', colStart: 7, colSpan: 1 },
];
