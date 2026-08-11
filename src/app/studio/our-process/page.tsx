'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ProcessStage } from '@/components/blocks/process-stage';
import { PROCESS_NODES, CATEGORY_GROUPS } from '@/dummy-data/process';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ServicesPage() {
  useDocumentTitle('Our Process');
  return (
    <motion.div 
      key="our-process"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 select-none min-h-0"
    >
      <ProcessStage nodes={PROCESS_NODES} categoryGroups={CATEGORY_GROUPS} />

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 tracking-wide italic">
          Purpose-built responses for one-of-a-kind briefs
        </p>
      </div>
    </motion.div>
  );
}
