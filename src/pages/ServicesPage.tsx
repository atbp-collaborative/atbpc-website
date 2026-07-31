import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface ServicesPageProps {
  isDarkMode: boolean;
  setActiveTab: (tab: string) => void;
}

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

const PROCESS_NODES: ProcessNode[] = [
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

export const ServicesPage: React.FC<ServicesPageProps> = ({
  isDarkMode
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(0);

  const currentNode = selectedNodeIndex !== null ? PROCESS_NODES[selectedNodeIndex] : null;

  // Keyboard navigation for selected stage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedNodeIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedNodeIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedNodeIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
      } else if (e.key === 'ArrowRight') {
        setSelectedNodeIndex((prev) => (prev !== null ? Math.min(PROCESS_NODES.length - 1, prev + 1) : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIndex]);

  const isFlattened = selectedNodeIndex !== null;

  return (
    <motion.div 
      key="services"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 max-w-7xl mx-auto select-none min-h-0"
    >
      {/* Main Process Content Container - Non-scrollable */}
      <div className="flex-1 flex flex-col justify-center my-auto py-1 sm:py-2 relative w-full overflow-hidden min-h-0">
        
        {/* Category Headers Row - Placed ON TOP of stage cards */}
        <motion.div 
          layout
          className={`w-full grid grid-cols-7 gap-1 sm:gap-2 text-center tracking-widest lowercase shrink-0 transition-all duration-300 ${
            isFlattened ? 'mb-1 sm:mb-1.5' : 'mb-1.5 sm:mb-2'
          }`}
        >
          {/* Guidance (Spans Nodes 01-03) */}
          <div className="col-span-3 flex flex-col items-center">
            <span className={`tracking-wider transition-all duration-300 ${
              isFlattened 
                ? 'text-[10px] sm:text-mini font-normal opacity-70' 
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
                ? 'text-[10px] sm:text-mini font-normal opacity-70' 
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
                ? 'text-[10px] sm:text-mini font-normal opacity-70' 
                : 'text-mini sm:text-caption md:text-body font-semibold opacity-90'
            }`}>
              presence
            </span>
            <div className={`w-3/4 h-[1px] mt-1 ${isDarkMode ? 'bg-white/20' : 'bg-vintage-charcoal/20'}`} />
          </div>
        </motion.div>

        {/* Timeline Line & Stage Cards Carousel */}
        <motion.div 
          layout
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`relative w-full flex items-center justify-between shrink-0 transition-all duration-400 ${
            isFlattened ? 'py-1 sm:py-1.5 mb-2' : 'py-1 sm:py-2'
          }`}
        >
          {/* Connecting Dotted Horizontal Line */}
          <div 
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
            style={{
              height: '2px',
              backgroundImage: isDarkMode 
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 2px, transparent 2px)' 
                : 'radial-gradient(circle, rgba(30, 30, 30, 0.5) 2px, transparent 2px)',
              backgroundSize: '16px 2px',
              backgroundRepeat: 'repeat-x'
            }}
          />

          {/* 7 Timeline Nodes (Circles when unselected, Flattened pills when selected) */}
          <div className="relative z-10 w-full grid grid-cols-7 gap-[2px] items-center">
            {PROCESS_NODES.map((node, index) => {
              const isSelected = selectedNodeIndex === index;
              const isNext = selectedNodeIndex !== null && index === selectedNodeIndex + 1;

              return (
                <div key={node.id} className="flex justify-center">
                  <motion.button
                    layout
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isNext ? { scale: [1, 1.06, 1] } : { scale: isSelected ? 1.05 : 1 }}
                    transition={isNext ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : { duration: 0.2 }}
                    onClick={() => setSelectedNodeIndex(isSelected ? null : index)}
                    aria-label={node.title}
                    className={`group relative flex flex-col items-center justify-center text-center p-1 cursor-pointer transition-all duration-300 shadow-md w-12 sm:w-16 md:w-20 lg:w-24 ${
                      isFlattened
                        ? 'h-8 sm:h-9 md:h-10 rounded-full border'
                        : 'h-12 sm:h-16 md:h-20 lg:h-24 rounded-full'
                    } ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-white/30 font-bold border-white'
                          : 'bg-vintage-charcoal text-white ring-2 sm:ring-4 ring-vintage-charcoal/30 font-bold border-vintage-charcoal'
                        : isNext
                          ? isDarkMode
                            ? 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-white/30 animate-pulse border-white/40 shadow-lg font-bold'
                            : 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-vintage-charcoal/20 animate-pulse border-vintage-charcoal/40 shadow-lg font-bold'
                          : isDarkMode
                            ? 'bg-white/90 text-vintage-charcoal hover:bg-white hover:ring-2 hover:ring-white/40 border-white/20'
                            : 'bg-white text-vintage-charcoal border border-slate-200 hover:border-vintage-charcoal hover:shadow-lg'
                    }`}
                  >
                    {/* Active Step Display Badge */}
                    {isSelected && (
                      <span className="absolute -top-2.5 sm:-top-3 px-2 py-0.5 text-[8px] sm:text-[9px] font-sans font-extrabold uppercase rounded-full bg-vintage-charcoal text-white dark:bg-white dark:text-vintage-charcoal shadow-md z-20 whitespace-nowrap tracking-wider">
                        Step {node.stepNumber}
                      </span>
                    )}

                    {/* Next Stage Pulsing Step Indicator */}
                    {isNext && !isSelected && (
                      <span className="absolute -top-2.5 sm:-top-3 px-1.5 py-0.5 text-[7px] sm:text-[8px] font-sans font-bold uppercase rounded-full bg-vintage-charcoal/80 text-white dark:bg-white/90 dark:text-vintage-charcoal shadow-md animate-pulse z-20 whitespace-nowrap">
                        Step {node.stepNumber}
                      </span>
                    )}

                    {/* Node Text */}
                    <div className="flex flex-col items-center justify-center leading-tight">
                      {node.lines.map((line, i) => (
                        <span 
                          key={i} 
                          className={`font-sans tracking-tight select-none ${
                            isFlattened 
                              ? 'text-[7px] sm:text-[9px] md:text-mini font-bold line-clamp-1'
                              : 'font-semibold text-[8px] sm:text-[10px] md:text-mini lg:text-caption'
                          }`}
                        >
                          {line}
                        </span>
                      ))}
                    </div>

                    {/* Step indicator badge on hover when unselected and non-next */}
                    {!isSelected && !isNext && !isFlattened && (
                      <span className="absolute -bottom-2 sm:-bottom-3 px-1.5 py-0.5 text-[7px] sm:text-[9px] font-sans font-bold uppercase rounded-full bg-vintage-charcoal text-white dark:bg-white dark:text-vintage-charcoal shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Step {node.stepNumber}
                      </span>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* DETAILS SECTION IN THE SPACE CREATED BELOW BY SLIDING UP */}
        <AnimatePresence mode="wait">
          {currentNode !== null && (
            <motion.div
              key={currentNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`flex-1 flex flex-col justify-start p-4 sm:p-5 rounded-none border overflow-hidden space-y-3 sm:space-y-4 min-h-0 ${
                isDarkMode 
                  ? 'bg-white/[0.04] border-white/15 text-bright-gray' 
                  : 'bg-vintage-charcoal/[0.03] border-space-sparkle/15 text-vintage-charcoal'
              }`}
            >
              {/* Section 1: Description */}
              <div>
                <h3 className="text-mini sm:text-caption font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                  description
                </h3>
                <p className="text-caption sm:text-body font-light leading-relaxed opacity-90 border-l-2 border-space-sparkle/30 pl-3">
                  {currentNode.description}
                </p>
              </div>

              {/* Section 2: Key Deliverables */}
              <div>
                <h3 className="text-mini sm:text-caption font-semibold uppercase tracking-wider opacity-70 mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-space-sparkle" />
                  <span>key deliverables</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
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

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-[11px] sm:text-mini font-light opacity-75 tracking-wide italic">
          Purpose-built responses for one-of-a-kind briefs
        </p>
      </div>
    </motion.div>
  );
};
