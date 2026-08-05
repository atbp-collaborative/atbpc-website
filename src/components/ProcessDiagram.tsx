'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../lib/theme-context';

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

export const ProcessDiagram = () => {
  const { isDarkMode } = useTheme();
  // No active stage when visiting the page
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(1);

  const handleSelectNode = (index: number | null) => {
    if (index === selectedNodeIndex) {
      setSelectedNodeIndex(null);
      return;
    }
    if (index !== null && selectedNodeIndex !== null) {
      setDirection(index > selectedNodeIndex ? 1 : -1);
    } else {
      setDirection(1);
    }
    setSelectedNodeIndex(index);
  };

  const handlePrev = () => {
    if (selectedNodeIndex === null) {
      handleSelectNode(0);
    } else if (selectedNodeIndex > 0) {
      setDirection(-1);
      setSelectedNodeIndex(selectedNodeIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedNodeIndex === null) {
      handleSelectNode(0);
    } else if (selectedNodeIndex < PROCESS_NODES.length - 1) {
      setDirection(1);
      setSelectedNodeIndex(selectedNodeIndex + 1);
    }
  };

  // Keyboard navigation for selected stage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeIndex(null);
      } else if (e.key === 'ArrowLeft') {
        if (selectedNodeIndex === null) {
          handleSelectNode(0);
        } else if (selectedNodeIndex > 0) {
          setDirection(-1);
          setSelectedNodeIndex(selectedNodeIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (selectedNodeIndex === null) {
          handleSelectNode(0);
        } else if (selectedNodeIndex < PROCESS_NODES.length - 1) {
          setDirection(1);
          setSelectedNodeIndex(selectedNodeIndex + 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIndex]);

  const isFlattened = selectedNodeIndex !== null;
  const currentNode = selectedNodeIndex !== null ? PROCESS_NODES[selectedNodeIndex] : null;

  const getNodeClassName = (isSelected: boolean, isNext: boolean, isFlattened: boolean, isDarkMode: boolean) => {
    const base = `group relative flex flex-col items-center justify-center text-center p-1 cursor-pointer transition-all duration-200 shadow-md rounded-full border mx-auto ${
      isFlattened
        ? 'w-3/4 h-8 sm:h-9 md:h-10'
        : 'aspect-square w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24'
    }`;
    
    if (isSelected) {
      return `${base} opacity-100 z-10 ${isDarkMode ? 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-white/30 font-bold border-white' : 'bg-vintage-charcoal text-white ring-2 sm:ring-4 ring-vintage-charcoal/30 font-bold border-vintage-charcoal'}`;
    }
    
    if (isNext) {
      return `${base} z-10 ${isDarkMode ? 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-white/30 border-white/40 shadow-lg font-bold' : 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-vintage-charcoal/20 border-vintage-charcoal/40 shadow-lg font-bold'}`;
    }
    
    const opacityClass = isFlattened ? 'opacity-35 hover:opacity-100' : 'opacity-100';

    return `${base} ${opacityClass} ${isDarkMode ? 'bg-white/90 text-vintage-charcoal hover:bg-white hover:ring-2 hover:ring-white/40 border-white/20' : 'bg-white text-vintage-charcoal border border-slate-200 hover:border-vintage-charcoal hover:shadow-lg'}`;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  const getLinesForNode = (node: ProcessNode, isFlattened: boolean) => {
    if (isFlattened && node.id === 'support') {
      return ['15-Year Project', 'Support'];
    }
    return node.lines;
  };

  return (
    <motion.div 
      layout
      transition={{ layout: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
      className={`w-full flex flex-col relative overflow-hidden min-h-0 ${
        isFlattened ? 'h-full justify-start' : 'h-full justify-center my-auto'
      }`}
    >
      {/* Category Headers Row */}
      <motion.div 
        layout
        transition={{ layout: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
        className={`w-full grid grid-cols-7 gap-1 sm:gap-2 text-center tracking-widest lowercase shrink-0 ${
          isFlattened ? 'mb-1 sm:mb-1.5' : 'mb-2 sm:mb-3'
        }`}
      >
        {/* Guidance (Spans Nodes 01-03) */}
        <div className="col-span-3 flex flex-col items-center">
          <span className={`tracking-wider transition-all duration-300 ${
            isFlattened 
              ? 'text-micro sm:text-mini font-normal opacity-70'
              : 'text-mini sm:text-caption md:text-body font-semibold opacity-90'
          }`}>
            guidance
          </span>
          <div className={`w-3/4 h-[1px] mt-1 ${isDarkMode ? 'bg-white/20' : 'bg-vintage-charcoal/20'}`} />
        </div>

        {/* Experiential (Spans Nodes 04-06) */}
        <div className="col-span-3 flex flex-col items-center">
          <span className={`tracking-wider transition-all duration-300 ${
            isFlattened 
              ? 'text-micro sm:text-mini font-normal opacity-70'
              : 'text-mini sm:text-caption md:text-body font-semibold opacity-90'
          }`}>
            experiential
          </span>
          <div className={`w-3/4 h-[1px] mt-1 ${isDarkMode ? 'bg-white/20' : 'bg-vintage-charcoal/20'}`} />
        </div>

        {/* Presence (Spans Node 07) */}
        <div className="col-span-1 flex flex-col items-center">
          <span className={`tracking-wider transition-all duration-300 truncate ${
            isFlattened 
              ? 'text-micro sm:text-mini font-normal opacity-70'
              : 'text-mini sm:text-caption md:text-body font-semibold opacity-90'
          }`}>
            presence
          </span>
          <div className={`w-3/4 h-[1px] mt-1 ${isDarkMode ? 'bg-white/20' : 'bg-vintage-charcoal/20'}`} />
        </div>
      </motion.div>

      {/* Timeline Line & Stage Nodes Row */}
      <motion.div 
        layout
        transition={{ layout: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
        className={`relative w-full flex items-center justify-between shrink-0 ${
          isFlattened ? 'py-1 sm:py-1.5' : 'py-2 sm:py-3'
        }`}
      >
        {/* Connecting Dotted Horizontal Line */}
        <div 
          className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none transition-opacity duration-300 ${
            isFlattened ? 'opacity-25' : 'opacity-60'
          }`}
          style={{
            height: '2px',
            backgroundImage: isDarkMode 
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 2px, transparent 2px)' 
              : 'radial-gradient(circle, rgba(30, 30, 30, 0.5) 2px, transparent 2px)',
            backgroundSize: '16px 2px',
            backgroundRepeat: 'repeat-x'
          }}
        />

        {/* 7 Timeline Nodes Grid */}
        <div className="relative z-10 w-full grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 items-center">
          {PROCESS_NODES.map((node, index) => {
            const isSelected = selectedNodeIndex === index;
            const isNext = selectedNodeIndex !== null && index === selectedNodeIndex + 1;

            return (
              <div key={node.id} className="flex justify-center w-full">
                <motion.button
                  layout
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  animate={
                    isNext 
                      ? { scale: [1, 1.04, 1], opacity: [0.65, 1, 0.65] } 
                      : { scale: isSelected ? 1.03 : 1, opacity: isFlattened && !isSelected ? 0.35 : 1 }
                  }
                  transition={{
                    layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                    scale: isNext ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : { duration: 0.2, ease: 'easeOut' },
                    opacity: isNext ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : { duration: 0.2, ease: 'easeOut' },
                  }}
                  onClick={() => handleSelectNode(index)}
                  aria-label={node.title}
                  className={getNodeClassName(isSelected, isNext, isFlattened, isDarkMode)}
                >
                  {/* Active Step Display Badge */}
                  {isSelected && (
                    <motion.span 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2.5 sm:-top-3 px-2 py-0.5 text-micro font-sans font-extrabold uppercase rounded-full bg-vintage-charcoal text-white dark:bg-white dark:text-vintage-charcoal shadow-md z-20 whitespace-nowrap tracking-wider"
                    >
                      Step {node.stepNumber}
                    </motion.span>
                  )}

                  {/* Node Text */}
                  <div className="flex flex-col items-center justify-center leading-tight w-full px-1">
                    {getLinesForNode(node, isFlattened).map((line, i) => (
                      <span 
                        key={i} 
                        className={`font-sans tracking-tight select-none w-full text-center ${
                          isFlattened 
                            ? 'text-micro sm:text-mini font-bold line-clamp-1'
                            : 'font-semibold text-micro md:text-mini lg:text-caption'
                        }`}
                      >
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Step indicator badge on hover when unselected and non-next */}
                  {!isSelected && !isNext && !isFlattened && (
                    <span className="absolute -top-2.5 sm:-top-3 px-1.5 py-0.5 text-micro font-sans font-bold uppercase rounded-full bg-vintage-charcoal text-white dark:bg-white dark:text-vintage-charcoal shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
                      Step {node.stepNumber}
                    </span>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* BIG DETAILED CARD - ANCHORED BELOW STAGE NODES */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: isFlattened ? '100%' : '0%',
          opacity: isFlattened ? 1 : 0,
          marginTop: isFlattened ? 12 : 0,
        }}
        transition={{
          height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
          opacity: { duration: 0.3, ease: 'easeInOut' },
          marginTop: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        }}
        className="w-full flex-1 min-h-0 overflow-hidden shrink"
      >
        <div
          className={`w-full h-full flex flex-col justify-between p-4 sm:p-5 rounded-none border overflow-hidden relative ${
            isDarkMode 
              ? 'bg-white/[0.04] border-white/15 text-bright-gray' 
              : 'bg-vintage-charcoal/[0.03] border-space-sparkle/15 text-vintage-charcoal'
          }`}
        >
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            {currentNode && (
              <motion.div
                key={currentNode.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full flex flex-col justify-between space-y-2 sm:space-y-3 overflow-hidden"
              >
                {/* Top Bar inside Detail Card - Anchored to Left per Reference Image */}
                <div className="border-b border-space-sparkle/10 pb-2 shrink-0">
                  <h2 className="text-body sm:text-h2 font-bold tracking-tight">
                    {currentNode.title}
                  </h2>
                </div>

                {/* Section 1: Description & Subtitle */}
                <div className="shrink-0">
                  <h3 className="text-mini sm:text-caption font-semibold uppercase tracking-wider opacity-70 mb-1 flex items-center justify-between">
                    <span>description</span>
                    <span className="font-normal italic text-micro opacity-75">{currentNode.subtitle}</span>
                  </h3>
                  <p className="text-caption sm:text-body font-light leading-relaxed opacity-90 border-l-2 border-space-sparkle/30 pl-3">
                    {currentNode.description}
                  </p>
                </div>

                {/* Section 2: Key Deliverables */}
                <div className="flex-1 min-h-0 flex flex-col justify-start overflow-y-auto">
                  <h3 className="text-mini sm:text-caption font-semibold uppercase tracking-wider opacity-70 mb-1.5 shrink-0">
                    key deliverables
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pl-1">
                    {currentNode.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-caption font-light opacity-90">
                        <CheckCircle2 size={15} className="text-space-sparkle shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};



