'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { StudioSubpageData } from '@/dummy-data/our-services';
import { ROUTES } from '@/lib/navigation/routes';

interface StudioServicesPageProps {
  data: StudioSubpageData;
}

// Custom Accordion Item for Piecework and Consultation/Retainer Services
const PieceworkAccordionItem = ({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-2 first:pt-0 last:pb-0 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-start text-left focus:outline-none cursor-pointer group w-full py-1"
      >
        <span className="font-sans font-bold text-space-sparkle mr-2 text-body sm:text-h3 leading-tight select-none">
          {isOpen ? '−' : '+'}
        </span>
        <h4 className="font-sans text-body sm:text-h3 font-bold tracking-tight select-none group-hover:opacity-85 transition-opacity leading-tight">
          {title}
        </h4>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pl-5 pt-1.5 pb-2 text-caption font-light leading-relaxed opacity-85 whitespace-pre-line text-justify">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Data for Piecework Services columns
const PIECEWORK_COLUMNS = [
  {
    items: [
      {
        title: 'Architectural Interiors',
        content: 'Custom interior spatial design focusing on finishes, millwork detailing, ceiling layout, and built-in furniture coordination. We bridge shell design with internal tactility.',
      },
      {
        title: 'Lighting Design',
        content: 'Fixture specification, reflected ceiling plans, lux level calculations, and circuit zoning. Crafted to amplify space utility, mood, and material textures.',
      },
      {
        title: 'Site Planning',
        content: 'Analyzing solar pathing, typography setbacks, accessibility routing, and easement compliance to optimize building footprint placement on your specific land.',
      },
    ],
  },
  {
    items: [
      {
        title: 'Document & Assessment',
        content: 'Comprehensive auditing of existing blueprints, structural condition reports, spatial efficiency analysis, and code compliance assessments for pre-construction.',
      },
      {
        title: 'Code Compliance',
        content: 'Rigorous validation of design plans against building codes, zoning regulations, fire safety policies, and local city ordinances to guarantee permit approvals.',
      },
      {
        title: 'Permit Processing',
        content: 'End-to-end administration of governmental approvals, environmental clearances, utility permits, and barangay/city hall certifications.',
      },
    ],
  },
  {
    items: [
      {
        title: 'Masonry',
        content: 'Detailed specifications for stone cladding, brick bonding, retaining wall structures, load-bearing concrete blocks, and external masonry finishes.',
      },
      {
        title: 'Paint Jobs',
        content: 'Specification of coating schedules, primer selections, anti-microbial interior paints, weatherproofing exterior paint systems, and custom color swatches.',
      },
    ],
  },
];

// Data for Comprehensive Services columns
const COMPREHENSIVE_COLUMNS = [
  {
    title: '+ Comprehensive Design Services',
    paragraphs: [
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
    ],
    linkText: 'Learn more about our process in designing',
    href: ROUTES.designingWithValues,
  },
  {
    title: '+ Comprehensive Management Services',
    paragraphs: [
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
    ],
    linkText: 'Understand how we manage projects',
    href: ROUTES.managingWithIntegrity,
  },
  {
    title: '+ Building Construction Services',
    paragraphs: [
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
      'fashdiasiudhcyasio7rdfqweuirbgfxiaueqwirbeqwgfkuewbcg qfkuyeqwgfkueqwcqkufegqrjkuyfbgcqjkuyfgekquwyfgyueij kqrwgcfkuyervbuyet',
    ],
    linkText: 'Validate our capabilities as Builder',
    href: ROUTES.buildingWithCulture,
  },
];

// Data for Consultation & Retainer columns
const CONSULTATION_RETAINER_COLUMNS = [
  {
    title: 'Consultation',
    content: 'Flexible, on-demand advisory sessions covering project feasibility, site evaluations, budget estimation, layout advice, and design critiques. Perfect for resolving specific design crossroads without long-term commitments.',
  },
  {
    title: 'Retainer',
    content: 'Continuous architectural partner support for phased developments, multi-property portfolios, and long-term asset management. Ensures ongoing design control, contractor alignment, and quality supervision over extended timelines.',
  },
];

export const StudioServicesPage: React.FC<StudioServicesPageProps> = ({
  data,
}) => {
  const isPiecework = data.id === 'piecework-services';
  const isComprehensive = data.id === 'comprehensive-services';
  const isConsultationRetainer = data.id === 'consultation-retainer-services';

  return (
    <div
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      {/* Top Left Header Section: Title, Subtext, and Single Paragraph Body Text */}
      <div className="shrink-0 text-left pt-1 sm:pt-2 pb-2 space-y-1">
        <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight lowercase leading-tight">
          {data.title}
        </h1>
        {data.tagline && (
          <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
            {data.tagline}
          </p>
        )}
        {data.description && (
          <div className="text-caption sm:text-body font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 space-y-2">
            <p>{data.description}</p>
            {data.extraDescription && <p>{data.extraDescription}</p>}
          </div>
        )}
      </div>

      {/* Center Section: Dynamic Grid Content */}
      <div className="flex-1 flex flex-col justify-start items-stretch w-full min-h-0 py-2 sm:py-4">
        {isPiecework && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar py-2">
            {PIECEWORK_COLUMNS.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col space-y-4">
                {col.items.map((item, itemIdx) => (
                  <PieceworkAccordionItem
                    key={itemIdx}
                    title={item.title}
                    content={item.content}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {isComprehensive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar py-2">
            {COMPREHENSIVE_COLUMNS.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <h3 className="font-sans text-body sm:text-h3 font-bold tracking-tight leading-tight select-none">
                    {col.title}
                  </h3>
                  <div className="space-y-3 text-caption font-light opacity-95 leading-relaxed text-justify">
                    {col.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                </div>
                <Link
                  href={col.href}
                  className="font-sans text-caption sm:text-body font-bold text-space-sparkle hover:opacity-80 transition-opacity pt-1 select-none flex items-center"
                >
                  &gt; {col.linkText}
                </Link>
              </div>
            ))}
          </div>
        )}

        {isConsultationRetainer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl mx-auto overflow-y-auto no-scrollbar py-2">
            {CONSULTATION_RETAINER_COLUMNS.map((item, idx) => (
              <PieceworkAccordionItem
                key={idx}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.subtext}
        </p>
      </div>
    </div>
  );
};
