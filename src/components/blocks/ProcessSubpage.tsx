'use client';

import React from 'react';
import { StudioSubpageData } from '@/dummy-data/our-services';
import { ProcessStage, ProcessAccordion } from '@/components/blocks/process-stage';
import { PROCESS_NODES, CATEGORY_GROUPS } from '@/dummy-data/process';
import { useTheme } from '@/lib/theme-context';

interface ProcessSubpageProps {
  data: StudioSubpageData;
}

export const ProcessSubpage: React.FC<ProcessSubpageProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

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
        <p className="text-caption font-light leading-relaxed opacity-85 max-w-3xl pt-0.5 shrink-0 mb-6 md:mb-0">
          {data.description}
        </p>
      )}

      {/* Center Section: Scrollable on mobile, hidden overflow on desktop */}
      <div className="flex-1 flex flex-col justify-start md:justify-center items-center w-full min-h-0 py-1 overflow-y-auto md:overflow-hidden no-scrollbar">
        <div className="hidden md:flex w-full h-full">
          <div className="my-auto w-full"><ProcessStage nodes={PROCESS_NODES} categoryGroups={CATEGORY_GROUPS} /></div>
        </div>
        <div className="flex md:hidden w-full pb-8">
          <ProcessAccordion nodes={PROCESS_NODES} categoryGroups={CATEGORY_GROUPS} />
        </div>
      </div>

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-4 md:mt-1 pb-4 md:pb-0 md:pb-2 transition-colors duration-300">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.subtext}
        </p>
      </div>
    </div>
  );
};
