'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ProcessDiagram } from '../../../components/ProcessDiagram';

export default function ServicesPage() {
  return (
    <motion.div 
      key="services"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 max-w-7xl mx-auto select-none min-h-0"
    >
      <ProcessDiagram />

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-[11px] sm:text-mini font-light opacity-75 tracking-wide italic">
          Purpose-built responses for one-of-a-kind briefs
        </p>
      </div>
    </motion.div>
  );
}
