'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Accordion } from '@/components/primitives/Accordion';
import { CheckCircle2 } from 'lucide-react';
import type { ProcessNode } from '@/dummy-data/process';

interface ProcessAccordionProps {
  nodes: ProcessNode[];
  categoryGroups: { key: ProcessNode['category']; label: string }[];
}

export const ProcessAccordion: React.FC<ProcessAccordionProps> = ({ nodes, categoryGroups }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full flex flex-col space-y-6">
      {categoryGroups.map((group) => {
        const groupNodes = nodes.filter((n) => n.category === group.key);
        if (groupNodes.length === 0) return null;

        return (
          <div key={group.key} className="flex flex-col">
            <h3 className="text-mini font-semibold uppercase tracking-widest opacity-70 mb-3 px-1">
              {group.label}
            </h3>
            <div className="flex flex-col space-y-2">
              {groupNodes.map((node) => (
                <Accordion
                  key={node.id}
                  title={`Step ${node.stepNumber} - ${node.title}`}
                  isDarkMode={isDarkMode}
                  size="sm"
                >
                  <div className="pl-6 pr-2 pb-4 pt-1 space-y-4">
                    <div>
                      <p className="text-caption font-light leading-relaxed opacity-90">
                        {node.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-micro font-semibold uppercase tracking-wider opacity-70 mb-2">
                        key deliverables
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {node.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-caption font-light opacity-90">
                            <CheckCircle2 size={16} className="text-space-sparkle shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Accordion>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
