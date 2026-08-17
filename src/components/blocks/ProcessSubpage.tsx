'use client';

import React from 'react';
import { StudioSubpageData } from '@/dummy-data/our-services';
import { ProcessStage } from '@/components/blocks/process-stage';
import { PROCESS_NODES, CATEGORY_GROUPS } from '@/dummy-data/process';

interface ProcessSubpageProps {
  data: StudioSubpageData;
}

export const ProcessSubpage: React.FC<ProcessSubpageProps> = ({ data }) => {
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
          <p className="text-caption sm:text-body font-light leading-relaxed opacity-85 max-w-3xl pt-0.5">
            {data.description}
          </p>
        )}
      </div>

      {/* Center Section: ProcessStage */}
      <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0 py-1">
        <ProcessStage nodes={PROCESS_NODES} categoryGroups={CATEGORY_GROUPS} />
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
