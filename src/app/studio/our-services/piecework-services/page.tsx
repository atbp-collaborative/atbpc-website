'use client';

import React from 'react';
import { motion } from 'motion/react';
import { STUDIO_SUBPAGES_DATA } from '../../placeholder';

export default function PieceworkServicesPage() {
  const data = STUDIO_SUBPAGES_DATA['piecework-services'];

  // Use the first 3 pillars for the cards
  const cards = data.pillars.slice(0, 3);

  return (
    <motion.div
      key="piecework-services"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-space-sparkle/10 pb-2 mb-2">
        <span className="text-mini font-semibold tracking-widest uppercase opacity-60">
          {data.section}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center min-h-0 my-auto py-1">
        <div className="space-y-6 w-full">
          {/* Title & Tagline */}
          <div className="space-y-1.5 text-left">
            <h1 className="font-sans text-h2 sm:text-h1 md:text-hero font-bold tracking-tight lowercase">
              {data.title}
            </h1>
            <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
              {data.tagline}
            </p>
          </div>

          {/* Three Cards Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-4">
            {cards.map((card, idx) => (
              <div 
                key={idx} 
                className="flex flex-col p-6 border border-space-sparkle/20 bg-white/5 dark:bg-black/10 hover:bg-space-sparkle/5 dark:hover:bg-space-sparkle/20 transition-colors duration-300 rounded-sm"
              >
                <h3 className="font-sans text-body font-bold tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-caption font-light opacity-85 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.title}
        </p>
      </div>
    </motion.div>
  );
}
