'use client';

import React, { useMemo } from 'react';
import { StudioSubpageData } from '@/dummy-data/our-services';
import { ProcessStage, ProcessAccordion } from '@/components/blocks/process-stage';
import { 
  PROCESS_NODES, 
  PROCESS_NODES_DESIGNING, 
  PROCESS_NODES_MANAGING, 
  PROCESS_NODES_BUILDING, 
  CATEGORY_GROUPS,
  ProcessNode
} from '@/dummy-data/process';
import { useTheme } from '@/lib/theme-context';

interface ProcessSubpageProps {
  data: StudioSubpageData;
}

export const ProcessSubpage: React.FC<ProcessSubpageProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  const nodes = useMemo(() => {
    switch (data.id) {
      case 'designing-with-values':
        return PROCESS_NODES_DESIGNING;
      case 'managing-with-integrity':
        return PROCESS_NODES_MANAGING;
      case 'building-with-culture':
        return PROCESS_NODES_BUILDING;
      default:
        return PROCESS_NODES;
    }
  }, [data.id]);

  return (
    <div
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1 relative"
    >
      {/* Top Left Header Section: Fixed at top */}
      <div 
        className="shrink-0 text-left pt-1 sm:pt-2 pb-2 space-y-1 transition-colors duration-300"
      >
        <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight lowercase leading-tight">
          {data.title}
        </h1>
        {data.tagline && (
          <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
            {data.tagline}
          </p>
        )}
      </div>

      {data.description && (
        <p className="hidden lg:block text-caption font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 shrink-0 mb-6 lg:mb-0">
          {data.description}
        </p>
      )}

      {/* Center Section: Scrollable on mobile/tablet, hidden overflow on desktop */}
      <div className="flex-1 flex flex-col justify-start items-center w-full min-h-0 py-1 overflow-y-auto lg:overflow-hidden no-scrollbar">
        <div className="hidden lg:flex w-full h-full">
          <div className="my-auto w-full"><ProcessStage nodes={nodes} categoryGroups={CATEGORY_GROUPS} /></div>
        </div>
        <div className="flex lg:hidden flex-col w-full pb-8 space-y-6">
          {data.description && (
            <p className="text-caption font-light leading-relaxed opacity-85 max-w-3xl">
              {data.description}
            </p>
          )}
          <ProcessAccordion nodes={nodes} categoryGroups={CATEGORY_GROUPS} />
        </div>
      </div>

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-4 lg:mt-1 pb-4 lg:pb-0 transition-colors duration-300">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          {data.subtext}
        </p>
      </div>
    </div>
  );
};
