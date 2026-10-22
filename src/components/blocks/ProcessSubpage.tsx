'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { StudioSubpageData } from '@/lib/dummy-data/our-services/services-data';
import { ProcessStage, ProcessAccordion } from '@/components/blocks/process-stage';
import { 
  BASE_PROCESS_NODES, 
  CATEGORY_GROUPS,
  ProcessNode
} from '@/lib/dummy-data/our-process/process-data';
import { useTheme } from '@/context/ThemeContext';
import { StageGroup } from '@/types';
import { getStageGroupsData } from '@/services/dummy-data.service';

interface ProcessSubpageProps {
  data: StudioSubpageData;
  stageGroups?: StageGroup[];
}

export const ProcessSubpage: React.FC<ProcessSubpageProps> = ({ data, stageGroups: initialStageGroups }) => {
  const { isDarkMode } = useTheme();
  const [stageGroups, setStageGroups] = useState<StageGroup[] | undefined>(initialStageGroups);

  useEffect(() => {
    if (!initialStageGroups) {
      getStageGroupsData(data.id).then((groups) => {
        if (groups && groups.length > 0) {
          setStageGroups(groups);
        }
      }).catch((err) => {
        console.warn('Failed to load dynamic stage groups:', err);
      });
    }
  }, [data.id, initialStageGroups]);

  const { nodes, categoryGroups } = useMemo(() => {
    if (stageGroups && stageGroups.length > 0) {
      let cumulativeCol = 1;
      const mappedGroups: { key: any; label: string; colStart: number; colSpan: number }[] = [];
      const mappedNodes: ProcessNode[] = [];

      stageGroups.forEach((group) => {
        const groupStages = group.stages || [];
        const span = groupStages.length;
        mappedGroups.push({
          key: group.name,
          label: group.name,
          colStart: cumulativeCol,
          colSpan: span > 0 ? span : 1,
        });
        cumulativeCol += span;

        groupStages.forEach((st) => {
          mappedNodes.push({
            id: st.id,
            stepNumber: st.stepNumber,
            category: group.name as any,
            title: st.title,
            lines: [st.title],
            subtitle: st.subtitle,
            description: st.description,
            deliverables: st.deliverables,
            duration: st.duration,
          });
        });
      });

      if (mappedNodes.length > 0) {
        return { nodes: mappedNodes, categoryGroups: mappedGroups };
      }
    }

    return {
      nodes: BASE_PROCESS_NODES,
      categoryGroups: CATEGORY_GROUPS,
    };
  }, [stageGroups]);

  return (
    <div
      className="w-full max-w-7xl mx-auto h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1 relative"
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
