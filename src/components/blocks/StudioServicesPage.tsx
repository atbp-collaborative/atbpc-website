'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { StudioSubpageData } from '@/dummy-data/our-services';
import { ROUTES } from '@/lib/navigation/routes';
import { useTheme } from '@/lib/theme-context';

interface StudioServicesPageProps {
  data: StudioSubpageData;
}

// Custom Accordion Item for Piecework and Consultation/Retainer Services
const PieceworkAccordionItem = ({
  title,
  content,
  isOpen = false,
  onToggle,
  isDarkMode = false,
}: {
  title: string;
  content: string;
  isOpen?: boolean;
  onToggle?: () => void;
  isDarkMode?: boolean;
}) => {
  return (
    <div className="py-2 first:pt-0 last:pb-0 select-none relative">
      <button
        onClick={onToggle}
        style={{
          backgroundColor: isDarkMode ? '#333436' : '#EDEFEF',
        }}
        className="flex items-start text-left focus:outline-none cursor-pointer group w-full py-2"
      >
        <span className="font-sans font-bold text-space-sparkle mr-2 text-body sm:text-h3 leading-tight select-none">
          {isOpen ? '—' : '+'}
        </span>
        <h4 className="font-sans text-body sm:text-h3 font-bold tracking-tight select-none group-hover:opacity-85 transition-opacity leading-tight break-words">
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
            <p className="pl-5 pt-1.5 pb-2 text-caption font-light leading-relaxed opacity-85 whitespace-pre-line text-left break-words">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom Accordion Item for Comprehensive Services (Mobile/Tablet)
const ComprehensiveAccordionItem = ({
  title,
  paragraphs,
  linkText,
  href,
  isOpen = false,
  onToggle,
  isDarkMode = false,
}: {
  title: string;
  paragraphs: string[];
  linkText: string;
  href: string;
  isOpen?: boolean;
  onToggle?: () => void;
  isDarkMode?: boolean;
}) => {
  return (
    <div className="py-2 first:pt-0 last:pb-0 select-none relative">
      <button
        onClick={onToggle}
        style={{
          backgroundColor: isDarkMode ? '#333436' : '#EDEFEF',
        }}
        className="flex items-start text-left focus:outline-none cursor-pointer group w-full py-2"
      >
        <span className="font-sans font-bold text-space-sparkle mr-2 text-body sm:text-h3 leading-tight select-none">
          {isOpen ? '—' : '+'}
        </span>
        <h4 className="font-sans text-body sm:text-h3 font-bold tracking-tight select-none group-hover:opacity-85 transition-opacity leading-tight break-words">
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
            <div className="pl-5 pt-1.5 pb-2 space-y-3 text-caption font-light opacity-95 leading-relaxed text-left break-words">
              {paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
              <Link
                href={href}
                className="font-sans text-caption text-space-sparkle hover:opacity-80 transition-opacity pt-1 select-none flex items-center"
              >
                &gt; {linkText}
              </Link>
            </div>
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
    title: 'Comprehensive Design Services',
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
    title: 'Comprehensive Management Services',
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
    title: 'Building Construction Services',
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
  const { isDarkMode } = useTheme();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    const checkSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const isPiecework = data.id === 'piecework-services';
  const isComprehensive = data.id === 'comprehensive-services';
  const isConsultationRetainer = data.id === 'consultation-retainer-services';

  return (
    <div className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col overflow-hidden select-none min-h-0 flex-1">
      {/* Top Left Header Section: Title, Subtext */}
      <div className="shrink-0 text-left pt-3 pb-2 lg:pb-4 space-y-1">
        <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight lowercase leading-tight">
          {data.title}
        </h1>
        {data.tagline && (
          <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
            {data.tagline}
          </p>
        )}
        {data.description && (
          <div className="hidden lg:block text-caption font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 space-y-2">
            <p>{data.description}</p>
            {data.extraDescription && <p>{data.extraDescription}</p>}
          </div>
        )}
      </div>

      {/* Center Section: Dynamic Grid Content */}
      <div className="flex-1 flex flex-col justify-start items-stretch w-full min-h-0 py-1 overflow-y-auto lg:overflow-hidden no-scrollbar">
        {data.description && (
          <div className="block lg:hidden text-caption font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 space-y-2 shrink-0 mb-4">
            <p>{data.description}</p>
            {data.extraDescription && <p>{data.extraDescription}</p>}
          </div>
        )}

        {isPiecework && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full mr-auto overflow-y-visible lg:overflow-y-auto no-scrollbar py-2">
            {PIECEWORK_COLUMNS.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col space-y-4">
                {col.items.map((item, itemIdx) => {
                  const itemId = `piecework-${colIdx}-${itemIdx}`;
                  return (
                    <PieceworkAccordionItem
                      key={itemIdx}
                      title={item.title}
                      content={item.content}
                      isOpen={isLargeScreen ? true : openItemId === itemId}
                      onToggle={() => setOpenItemId(openItemId === itemId ? null : itemId)}
                      isDarkMode={isDarkMode}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {isComprehensive && isLargeScreen && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full mr-auto overflow-y-hidden py-2 h-full min-h-0 flex-1">
            {COMPREHENSIVE_COLUMNS.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col h-full min-h-0 justify-between relative">
                {/* Sticky Heading */}
                <h3 
                  className="shrink-0 font-sans text-body sm:text-h3 font-bold tracking-tight leading-tight select-none pb-3 sticky top-0 z-10 break-words"
                  style={{ backgroundColor: isDarkMode ? '#333436' : '#EDEFEF' }}
                >
                  + {col.title}
                </h3>
                
                {/* Scrollable, Snapping Paragraphs Container */}
                <div className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar space-y-4 py-2 min-h-0">
                  {col.paragraphs.map((p, pIdx) => (
                    <div key={pIdx} className="snap-start snap-always py-1">
                      <p className="text-caption font-light opacity-95 leading-relaxed text-justify break-words">
                        {p}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sticky CTA Link */}
                <div 
                  className="shrink-0 pt-3 sticky bottom-0 z-10"
                  style={{ backgroundColor: isDarkMode ? '#333436' : '#EDEFEF' }}
                >
                  <Link
                    href={col.href}
                    className="font-sans text-caption text-space-sparkle hover:opacity-80 transition-opacity select-none flex items-center break-words"
                  >
                    &gt; {col.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {isComprehensive && !isLargeScreen && (
          <div className="flex flex-col space-y-4 w-full py-2">
            {COMPREHENSIVE_COLUMNS.map((col, colIdx) => (
              <ComprehensiveAccordionItem
                key={colIdx}
                title={col.title}
                paragraphs={col.paragraphs}
                linkText={col.linkText}
                href={col.href}
                isOpen={openItemId === `comp-${colIdx}`}
                onToggle={() => setOpenItemId(openItemId === `comp-${colIdx}` ? null : `comp-${colIdx}`)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        {isConsultationRetainer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full mr-auto overflow-y-visible lg:overflow-y-auto no-scrollbar py-2">
            {CONSULTATION_RETAINER_COLUMNS.map((item, idx) => (
              <PieceworkAccordionItem
                key={`${idx}-${isLargeScreen}`}
                title={item.title}
                content={item.content}
                isOpen={isLargeScreen ? true : openItemId === `consult-${idx}`}
                onToggle={() => setOpenItemId(openItemId === `consult-${idx}` ? null : `consult-${idx}`)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-2">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          {data.subtext}
        </p>
      </div>
    </div>
  );
};

