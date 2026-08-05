'use client';

import React from 'react';
import { motion } from 'motion/react';

export interface StudioSubpageData {
  id: string;
  title: string;
  section: string;
  tagline: string;
  description: string;
  pillars: {
    title: string;
    desc: string;
  }[];
  parentTab: string;
  parentTabLabel: string;
}

export const STUDIO_SUBPAGES_DATA: Record<string, StudioSubpageData> = {
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
    parentTabLabel: 'Our Services Overview'
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
    parentTabLabel: 'Our Services Overview'
  },
  'designing-with-values': {
    id: 'designing-with-values',
    title: 'designing with values',
    section: 'process | paraán',
    tagline: 'purpose-driven spatial concepts anchored in environmental & social context',
    description: 'Our design methodology begins with deep contextual listening—ensuring every spatial form respects microclimates, community heritage, resource stewardship, and long-term utility.',
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
    parentTab: 'services',
    parentTabLabel: 'Process Overview'
  },
  'managing-with-integrity': {
    id: 'managing-with-integrity',
    title: 'managing with integrity',
    section: 'process | paraán',
    tagline: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    description: 'A discipline of project stewardship built on open-book budgeting, transparent contractor bidding, strict schedule milestones, and zero hidden markups.',
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
    parentTab: 'services',
    parentTabLabel: 'Process Overview'
  },
  'building-with-culture': {
    id: 'building-with-culture',
    title: 'building with culture',
    section: 'process | paraán',
    tagline: 'synthesizing regional craftsmanship with modern architectural technology',
    description: 'Bridging time-honored local artisan techniques with modern structural standards to craft buildings deeply rooted in place, character, and tactile permanence.',
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
    parentTab: 'services',
    parentTabLabel: 'Process Overview'
  }
};

interface StudioPlaceholderPageProps {
  subpageId: string;
}

export const StudioPlaceholderPage: React.FC<StudioPlaceholderPageProps> = ({
  subpageId,
}) => {
  const data = STUDIO_SUBPAGES_DATA[subpageId] || STUDIO_SUBPAGES_DATA['comprehensive-services'];

  return (
    <motion.div
      key={subpageId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-space-sparkle/10 pb-2 mb-2">
        <span className="text-mini font-semibold tracking-widest uppercase opacity-60">
          {data.section}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center min-h-0 my-auto py-1">
        <div className="space-y-3 max-w-5xl mx-auto w-full">
          {/* Title & Tagline */}
          <div className="space-y-1.5 text-left">
            <h1 className="font-sans text-h2 sm:text-h1 md:text-hero font-bold tracking-tight lowercase">
              {data.title}
            </h1>
            <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
              {data.tagline}
            </p>
            <p className="text-caption sm:text-body font-light leading-relaxed opacity-85 max-w-3xl pt-1">
              {data.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.title} placeholder page
        </p>
      </div>
    </motion.div>
  );
};


