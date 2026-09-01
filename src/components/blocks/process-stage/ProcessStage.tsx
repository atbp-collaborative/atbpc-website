'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import type { ProcessNode } from '@/dummy-data/process';

interface ProcessStageProps {
  nodes: ProcessNode[];
  categoryGroups: { key: ProcessNode['category']; label: string; colStart: number; colSpan: number }[];
}

export const ProcessStage = ({ nodes, categoryGroups }: ProcessStageProps) => {
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
    } else if (selectedNodeIndex < nodes.length - 1) {
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
        } else if (selectedNodeIndex < nodes.length - 1) {
          setDirection(1);
          setSelectedNodeIndex(selectedNodeIndex + 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIndex, nodes.length]);

  const isFlattened = selectedNodeIndex !== null;
  const currentNode = selectedNodeIndex !== null ? nodes[selectedNodeIndex] : null;

  const getNodeClassName = (isSelected: boolean, isNext: boolean, isFlattened: boolean, isDarkMode: boolean) => {
    if (isFlattened) {
      return `group relative flex flex-col items-center justify-center text-center p-1 cursor-pointer transition-all duration-200 mx-auto w-full min-h-[3rem] z-10`;
    }

    const base = `group relative flex flex-col items-center justify-center text-center p-1 cursor-pointer transition-all duration-200 shadow-md rounded-full border mx-auto aspect-square w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24`;
    
    if (isSelected) {
      return `${base} opacity-100 z-10 ${isDarkMode ? 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-white/30 font-bold border-white' : 'bg-vintage-charcoal text-white ring-2 sm:ring-4 ring-vintage-charcoal/30 font-bold border-vintage-charcoal'}`;
    }
    
    if (isNext) {
      return `${base} z-10 ${isDarkMode ? 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-white/30 border-white/40 shadow-lg font-bold' : 'bg-white text-vintage-charcoal ring-2 sm:ring-4 ring-vintage-charcoal/20 border-vintage-charcoal/40 shadow-lg font-bold'}`;
    }
    
    return `${base} opacity-100 ${isDarkMode ? 'bg-white/90 text-vintage-charcoal hover:bg-white hover:ring-2 hover:ring-white/40 border-white/20' : 'bg-white text-vintage-charcoal border border-slate-200 hover:border-vintage-charcoal hover:shadow-lg'}`;
  };

  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
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
      className="w-full flex flex-col relative overflow-hidden min-h-0 h-full justify-start mt-4 sm:mt-8"
    >
      {/* Category Headers Row */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
        className={`w-full grid grid-cols-7 gap-1 sm:gap-2 text-center tracking-widest lowercase shrink-0 ${
          isFlattened ? 'mb-2 sm:mb-2.5' : 'mb-3 sm:mb-4'
        }`}
      >
        {categoryGroups.map((group) => {
          const isActiveGroup = currentNode?.category === group.key;
          const isVisible = !isFlattened || isActiveGroup;

          const gridColumn = isFlattened && isActiveGroup && selectedNodeIndex !== null
            ? `${selectedNodeIndex + 1} / span 1`
            : `${group.colStart} / span ${group.colSpan}`;

          return (
            <motion.div
              layout
              key={group.key}
              style={{ 
                gridColumn, 
                opacity: isVisible ? 1 : 0, 
                pointerEvents: isVisible ? 'auto' : 'none',
                zIndex: isActiveGroup ? 10 : 0
              }}
              className="flex flex-col items-center transition-opacity duration-300"
            >
              <span className={`tracking-wider transition-all duration-300 truncate ${
                isFlattened
                  ? 'text-micro sm:text-mini font-normal opacity-70'
                  : 'text-mini sm:text-caption md:text-body font-semibold opacity-90'
              }`}>
                {group.label}
              </span>
              <div className={`w-3/4 h-[1px] mt-1 ${isDarkMode ? 'bg-white/20' : 'bg-vintage-charcoal/20'}`} />
            </motion.div>
          );
        })}
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
            isFlattened ? 'opacity-0' : 'opacity-60'
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
          {nodes.map((node, index) => {
            const isSelected = selectedNodeIndex === index;
            const isNext = selectedNodeIndex !== null && index === selectedNodeIndex + 1;
            const distance = selectedNodeIndex !== null ? Math.abs(index - selectedNodeIndex) : -1;

            const getTextColorClass = (dist: number, isDark: boolean) => {
              if (dist === 0) return isDark ? 'text-white font-bold opacity-100' : 'text-vintage-charcoal font-bold opacity-100';
              if (dist === 1) return isDark ? 'text-white/60 font-semibold opacity-100' : 'text-vintage-charcoal/60 font-semibold opacity-100';
              if (dist >= 2) return isDark ? 'text-white/30 font-normal opacity-100' : 'text-vintage-charcoal/30 font-normal opacity-100';
              return ''; // Default when not flattened
            };

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
                      initial={isFlattened ? { scale: 0.9, opacity: 0 } : { scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={
                        isFlattened
                          ? `mb-1.5 px-4 sm:px-5 py-1 sm:py-1.5 text-mini sm:text-caption font-sans font-bold uppercase rounded-full shadow-md z-20 whitespace-nowrap tracking-wider ${isDarkMode ? 'bg-white text-vintage-charcoal' : 'bg-vintage-charcoal text-white'}`
                          : `absolute -top-2.5 sm:-top-3 px-2 py-0.5 text-micro font-sans font-extrabold uppercase rounded-full shadow-md z-20 whitespace-nowrap tracking-wider ${isDarkMode ? 'bg-white text-vintage-charcoal' : 'bg-vintage-charcoal text-white'}`
                      }
                    >
                      Step {node.stepNumber}
                    </motion.span>
                  )}

                  {/* Node Text */}
                  <div className={`flex flex-col items-center justify-center leading-tight w-full px-1 transition-opacity duration-300 ${
                    isFlattened 
                      ? getTextColorClass(distance, isDarkMode)
                      : ''
                  }`}>
                    {getLinesForNode(node, isFlattened).map((line, i) => (
                      <span 
                        key={i} 
                        className={`font-sans tracking-tight select-none w-full text-center ${
                          isFlattened 
                            ? '' // Sizing/weight handled by getTextColorClass wrapper
                            : 'font-semibold text-micro md:text-mini lg:text-caption'
                        }`}
                      >
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Step indicator badge on hover when unselected and non-next */}
                  {!isSelected && !isNext && !isFlattened && (
                    <span className={`absolute -top-2.5 sm:-top-3 px-1.5 py-0.5 text-micro font-sans font-bold uppercase rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap ${isDarkMode ? 'bg-white text-vintage-charcoal' : 'bg-vintage-charcoal text-white'}`}>
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
          className={`w-full h-full flex flex-col justify-between p-4 sm:p-5 rounded-none overflow-hidden relative ${
            isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {currentNode && (
              <motion.div
                key={currentNode.id}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full flex flex-col justify-between space-y-2 sm:space-y-3 overflow-hidden"
              >
                {/* Section 1: Description */}
                <div className="shrink-0">
                  <p className="text-caption sm:text-body font-light leading-relaxed opacity-90">
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
