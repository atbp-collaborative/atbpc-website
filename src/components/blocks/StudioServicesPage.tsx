'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { StudioSubpageData } from '@/lib/dummy-data/our-services/services-data';
import { ServiceOffering } from '@/types';
import { getServiceOfferingByIdData } from '@/services/dummy-data.service';
import { ROUTES } from '@/lib/navigation/routes';
import { useTheme } from '@/context/ThemeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface StudioServicesPageProps {
  data: StudioSubpageData;
  initialOffering?: ServiceOffering;
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
  const is1440 = useMediaQuery('(min-width: 1440px)');
  const isEffectiveOpen = is1440 || isOpen;

  return (
    <div className="py-2 first:pt-0 last:pb-0 select-none relative">
      <button
        onClick={is1440 ? undefined : onToggle}
        style={{
          backgroundColor: isDarkMode ? '#333436' : '#EDEFEF',
        }}
        className="flex items-start text-left focus:outline-none group w-full py-2 cursor-pointer min-[1440px]:cursor-default"
      >
        <span className="font-sans font-bold text-space-sparkle mr-2 text-body sm:text-h3 leading-tight select-none min-[1440px]:hidden">
          {isOpen ? '—' : '+'}
        </span>
        <h4 className="font-sans text-body sm:text-h3 font-bold tracking-tight select-none group-hover:opacity-85 transition-opacity leading-tight break-words">
          {title}
        </h4>
      </button>
      <AnimatePresence initial={false}>
        {isEffectiveOpen && (
          <motion.div
            initial={is1440 ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={is1440 ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden min-[1440px]:!block min-[1440px]:!h-auto min-[1440px]:!opacity-100"
          >
            <p className="pl-5 min-[1440px]:pl-0 pt-1.5 pb-2 text-caption font-light leading-relaxed opacity-85 whitespace-pre-line text-left break-words">
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
      'Our design process is rooted in a deep understanding of your vision, lifestyle, and the unique characteristics of your site.',
      'We integrate architectural planning, interior design, and engineering to create cohesive spaces that are both beautiful and functional.',
      'As a design-build studio, we prioritize constructability and material intelligence from the very beginning, ensuring that every design decision aligns with your budget and timeline.',
      'We navigate the complexities of local zoning, building codes, and environmental regulations, streamlining the path to construction.'
    ],
    linkText: 'Learn more about our process in designing',
    href: ROUTES.designingWithValues,
  },
  {
    title: 'Comprehensive Management Services',
    paragraphs: [
      'Effective project management is the bridge between a great design and a successful build.',
      'We oversee every phase of the project, from initial cost estimation and value engineering to procurement and scheduling.',
      'Our team acts as your single point of contact, coordinating with specialized consultants, suppliers, and local authorities to keep the project on track.',
      'By maintaining rigorous quality control and transparent communication, we mitigate risks and ensure that the final result exceeds expectations.'
    ],
    linkText: 'Understand how we manage projects',
    href: ROUTES.managingWithIntegrity,
  },
  {
    title: 'Building Construction Services',
    paragraphs: [
      'Construction is where our designs come to life. We bring decades of hands-on experience and a network of trusted craftsmen to every project.',
      'Our build teams work in tandem with our designers, fostering a collaborative environment that quickly resolves on-site challenges without compromising the design intent.',
      'We employ advanced construction methodologies and sustainable practices to deliver structures of enduring quality and performance.',
      'From groundbreaking to final handover, we are committed to safety, efficiency, and unparalleled craftsmanship in every detail.'
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
  initialOffering,
}) => {
  const { isDarkMode } = useTheme();
  const is1440 = useMediaQuery('(min-width: 1440px)');
  const [liveOffering, setLiveOffering] = useState<ServiceOffering | null>(initialOffering || null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [openCols, setOpenCols] = useState<boolean[]>([true, true, true]);

  useEffect(() => {
    if (!initialOffering) {
      getServiceOfferingByIdData(data.id)
        .then((res) => {
          if (res) setLiveOffering(res);
        })
        .catch((err) => {
          console.warn('Failed to fetch dynamic service offering:', err);
        });
    }
  }, [data.id, initialOffering]);

  const toggleCol = (idx: number) => {
    setOpenCols(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

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

  // Computed page copy
  const pageTitle = liveOffering?.title || data.title;
  const pageDescription = liveOffering?.description || data.description;
  const pageExtraDescription = liveOffering?.extraDescription || data.extraDescription;
  const pageSubtext = liveOffering?.subtext || data.subtext;

  // Computed dynamic accordions
  const accordions = liveOffering?.accordions && liveOffering.accordions.length > 0
    ? liveOffering.accordions.filter((a) => !a.isDraft).sort((a, b) => a.sortOrder - b.sortOrder)
    : null;

  const pieceworkColumns = useMemo(() => {
    if (!accordions || accordions.length === 0) return PIECEWORK_COLUMNS;
    const col0 = accordions.filter((a) => a.columnIndex === 0);
    const col1 = accordions.filter((a) => a.columnIndex === 1);
    const col2 = accordions.filter((a) => a.columnIndex === 2);
    if (col0.length === 0 && col1.length === 0 && col2.length === 0) return PIECEWORK_COLUMNS;
    return [
      { items: col0.map((a) => ({ title: a.title, content: a.content })) },
      { items: col1.map((a) => ({ title: a.title, content: a.content })) },
      { items: col2.map((a) => ({ title: a.title, content: a.content })) },
    ];
  }, [accordions]);

  const comprehensiveColumns = useMemo(() => {
    if (!accordions || accordions.length === 0) return COMPREHENSIVE_COLUMNS;
    return [0, 1, 2].map((colIdx) => {
      const item = accordions.find((a) => a.columnIndex === colIdx);
      if (!item) return COMPREHENSIVE_COLUMNS[colIdx];
      const paras = item.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
      return {
        title: item.title,
        paragraphs: paras.length > 0 ? paras : [item.content],
        linkText: item.linkText || COMPREHENSIVE_COLUMNS[colIdx]?.linkText || 'Learn more',
        href: item.linkHref || COMPREHENSIVE_COLUMNS[colIdx]?.href || '#',
      };
    });
  }, [accordions]);

  const consultationColumns = useMemo(() => {
    if (!accordions || accordions.length === 0) return CONSULTATION_RETAINER_COLUMNS;
    const items = accordions.map((a) => ({ title: a.title, content: a.content }));
    return items.length > 0 ? items : CONSULTATION_RETAINER_COLUMNS;
  }, [accordions]);

  return (
    <div className="w-full max-w-7xl mx-auto h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col overflow-hidden select-none min-h-0 flex-1">
      {/* Top Left Header Section: Title, Description (Tagline removed) */}
      <div className="shrink-0 text-left pt-3 pb-2 lg:pb-4 space-y-1">
        <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight lowercase leading-tight">
          {pageTitle}
        </h1>
        {pageDescription && (
          <div className="hidden lg:block text-caption font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 space-y-2">
            <p>{pageDescription}</p>
            {pageExtraDescription && <p>{pageExtraDescription}</p>}
          </div>
        )}
      </div>

      {/* Center Section: Dynamic Grid Content */}
      <div className="flex-1 flex flex-col justify-start items-stretch w-full min-h-0 py-1 overflow-y-auto lg:overflow-hidden no-scrollbar">
        {pageDescription && (
          <div className="block lg:hidden text-caption font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 space-y-2 shrink-0 mb-4">
            <p>{pageDescription}</p>
            {pageExtraDescription && <p>{pageExtraDescription}</p>}
          </div>
        )}

        {isPiecework && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full lg:h-full lg:min-h-0 mr-auto overflow-y-visible lg:overflow-y-hidden py-2">
            {pieceworkColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col space-y-4 lg:overflow-y-auto no-scrollbar lg:pr-2">
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
            {comprehensiveColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col h-full min-h-0 justify-start relative">
                {/* Sticky Heading */}
                <h3 
                  className="shrink-0 font-sans text-body sm:text-h3 font-bold tracking-tight leading-tight select-none pb-3 sticky top-0 z-10 break-words cursor-pointer min-[1440px]:cursor-default flex items-start group"
                  style={{ backgroundColor: isDarkMode ? '#333436' : '#EDEFEF' }}
                  onClick={() => !is1440 && toggleCol(colIdx)}
                >
                  <span className="font-sans font-bold text-space-sparkle mr-2 text-body sm:text-h3 leading-tight select-none min-[1440px]:hidden">
                    {openCols[colIdx] ? '—' : '+'}
                  </span>
                  <span className="group-hover:opacity-85 transition-opacity">{col.title}</span>
                </h3>
                
                {/* Scrollable, Snapping Paragraphs Container */}
                <AnimatePresence initial={false}>
                  {(is1440 || openCols[colIdx]) && (
                    <motion.div
                      initial={is1440 ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={is1440 ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="flex-1 min-h-0 flex flex-col overflow-hidden min-[1440px]:!block min-[1440px]:!h-auto min-[1440px]:!opacity-100"
                    >
                      <div className="flex-1 min-[1440px]:flex-none overflow-y-auto snap-y snap-mandatory no-scrollbar py-2 space-y-4">
                        {col.paragraphs.map((p, pIdx) => (
                          <div key={pIdx} className="snap-start snap-always py-1 shrink-0">
                            <p className="text-caption font-light opacity-95 leading-relaxed text-justify break-words">
                              {p}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Fixed CTA Link below scrollable area, clings under writeup on 1440px+ */}
                      <div 
                        className="shrink-0 pt-3 pb-1 mt-auto min-[1440px]:mt-2 min-[1440px]:pt-1"
                        style={{ backgroundColor: isDarkMode ? '#333436' : '#EDEFEF' }}
                      >
                        <Link
                          href={col.href}
                          className="font-sans text-caption text-space-sparkle hover:opacity-80 transition-opacity select-none flex items-center break-words"
                        >
                          &gt; {col.linkText}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {isComprehensive && !isLargeScreen && (
          <div className="flex flex-col space-y-4 w-full py-2">
            {comprehensiveColumns.map((col, colIdx) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full lg:h-full lg:min-h-0 mr-auto overflow-y-visible lg:overflow-y-hidden py-2">
            {consultationColumns.map((item, idx) => (
              <div key={`${idx}-${isLargeScreen}`} className="lg:overflow-y-auto no-scrollbar lg:pr-2">
                <PieceworkAccordionItem
                  title={item.title}
                  content={item.content}
                  isOpen={isLargeScreen ? true : openItemId === `consult-${idx}`}
                  onToggle={() => setOpenItemId(openItemId === `consult-${idx}` ? null : `consult-${idx}`)}
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-2">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          {pageSubtext}
        </p>
      </div>
    </div>
  );
};
