'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LandingCard } from './LandingPage';
import { useTheme } from '../lib/theme-context';

interface SubLandingPageProps {
  cards: LandingCard[];
  title?: string;
  subtitle?: string;
  isHeaderSticky?: boolean;
}

export const SubLandingPage: React.FC<SubLandingPageProps> = ({ cards, title, subtitle, isHeaderSticky }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden px-4 sm:px-8 pb-4 ${isHeaderSticky ? 'pt-4 sm:pt-6' : 'pt-16 sm:pt-20'}`}>
      {/* Top Header Section (Positioned comfortably lower than top website header) */}
      {(title || subtitle) && (
        <div className="mb-4 shrink-0 pb-3">
          {title && (
            <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight leading-none lowercase">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Cards Grid / Flex Container */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 sm:gap-4 h-full min-h-0 items-stretch overflow-y-auto md:overflow-hidden group/subCards">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={card.onSelect}
            className={`group/card relative flex-1 min-h-[260px] md:min-h-0 flex flex-col justify-between p-5 sm:p-6 rounded-none border cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.25] overflow-hidden ${
              isDarkMode
                ? 'bg-vintage-charcoal/40 border-space-sparkle/40 hover:border-bright-gray/30 hover:bg-vintage-charcoal/80'
                : 'bg-white/60 border-vintage-charcoal/15 hover:border-space-sparkle/40 hover:bg-white'
            }`}
          >
            {/* Header Block (Card Title & Subtext - NO chips, NO numbers, NO arrow button, NO border-radius) */}
            <div className="shrink-0 space-y-1.5 z-10 mb-4">
              <h2 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight lowercase leading-snug">
                {card.title}
              </h2>

              <p className="text-caption font-light opacity-80 lowercase leading-relaxed">
                {card.subtext || card.tagline}
              </p>
            </div>

            {/* Image Container (Sharp square edges - NO border radius) */}
            <div className="relative flex-1 w-full min-h-[140px] rounded-none overflow-hidden border border-black/10 shadow-inner group-hover/card:shadow-lg transition-shadow duration-500">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover/card:opacity-30 transition-opacity duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
