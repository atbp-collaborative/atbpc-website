export interface StudioSubpageData {
  id: string;
  title: string;
  section: string;
  tagline: string;
  description: string;
  extraDescription?: string;
  image?: string;
  pillars: {
    title: string;
    desc: string;
  }[];
  parentTab: string;
  parentTabLabel: string;
  subtext: string;
}

export const OUR_SERVICES_DATA: Record<string, StudioSubpageData> = {
  'comprehensive-services': {
    id: 'comprehensive-services',
    title: 'comprehensive services',
    section: 'services | kaya',
    tagline: 'full-lifecycle architectural design, technical engineering, & turnkey delivery',
    description: 'End-to-end design and building management from initial site evaluation, conceptual design, regulatory approvals, through technical detailing, construction oversight, and final project handover.',
    pillars: [
      {
        title: 'Full Architectural Masterplanning',
        desc: 'Integrated spatial design, exterior form development, and interior zoning tailored to site topology and lifestyle.'
      },
      {
        title: 'Engineering & MEPFS Integration',
        desc: 'Comprehensive structural calculation, electrical, plumbing, mechanical, and fire protection coordination.'
      },
      {
        title: 'Permitting & Bureaucratic Approvals',
        desc: 'Full regulatory compliance, local government approvals, and environmental clearance documentation.'
      },
      {
        title: 'Turnkey Construction Supervision',
        desc: 'On-site quality audits, material inspection, schedule tracking, and seamless contractor direction.'
      }
    ],
    parentTab: 'our-services',
    parentTabLabel: 'Our Services Overview',
    subtext: 'From concept to turnkey delivery, we guide every detail of your vision to reality.'
  },
  'piecework-services': {
    id: 'piecework-services',
    title: 'piecework services',
    section: 'services | kaya',
    tagline: 'modular technical detailing, targeted consulting & specialized scopes',
    description: 'Flexible, specialized engagements designed to resolve critical project bottlenecks, refine complex architectural detailing, or provide expert peer reviews without full turnkey commitments.',
    pillars: [
      {
        title: 'Architectural Working Drawings',
        desc: 'High-precision technical drafting, construction details, and construction-ready drawing packages.'
      },
      {
        title: 'Joinery & Facade Detailing',
        desc: 'Bespoke architectural metalwork, millwork, custom fenestration, and enclosure assemblies.'
      },
      {
        title: 'Peer Review & Value Engineering',
        desc: 'Independent auditing of third-party blueprints to optimize costs, constructability, and code compliance.'
      },
      {
        title: 'Material Specification Audits',
        desc: 'Specialized procurement advisory, finish schedules, and performance material sourcing.'
      }
    ],
    parentTab: 'our-services',
    parentTabLabel: 'Our Services Overview',
    subtext: 'Targeted architectural solutions and independent technical reviews for bespoke requirements.'
  },
  'consultation-retainer-services': {
    id: 'consultation-retainer-services',
    title: 'consultation & retainer services',
    section: 'services | kaya',
    tagline: 'ongoing architectural guidance, strategic advisory & long-term partnerships',
    description: 'Continuous, expert architectural advice designed for ongoing developments, portfolio management, or phased projects that require strategic oversight and flexible, on-demand consultation.',
    pillars: [
      {
        title: 'Strategic Project Advisory',
        desc: 'High-level guidance on feasibility, site selection, and overarching architectural vision.'
      },
      {
        title: 'Portfolio & Asset Management',
        desc: 'Long-term architectural strategy for multi-property developers and institutional clients.'
      },
      {
        title: 'Phased Development Planning',
        desc: 'Masterplanning and architectural roadmapping for projects executed over extended timelines.'
      },
      {
        title: 'On-Demand Technical Consultation',
        desc: 'Flexible access to architectural expertise for troubleshooting, peer review, and continuous improvement.'
      }
    ],
    parentTab: 'our-services',
    parentTabLabel: 'Our Services Overview',
    subtext: 'Long-term architectural guidance and strategic advisory for complex, ongoing developments.'
  }
};
