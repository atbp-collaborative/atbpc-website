'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LandingCard } from '@/components/blocks/LandingPage';
import { useTheme } from '@/lib/theme-context';
import { ImageWithFade } from '@/components/primitives/ImageWithFade';

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
      <div className="flex-1 flex flex-col xl:flex-row gap-[2px] h-full min-h-0 items-stretch overflow-y-auto xl:overflow-hidden group/subCards">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={card.onSelect}
            className={`group/card relative flex-1 min-h-[260px] xl:min-h-0 rounded-none border cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hover:flex-[1.25] overflow-hidden ${
              isDarkMode
                ? 'bg-vintage-charcoal/40 border-space-sparkle/40 hover:border-bright-gray/30'
                : 'bg-white/60 border-vintage-charcoal/15 hover:border-space-sparkle/40'
            }`}
          >
            {/* Full-bleed Image (fills the whole card) */}
            <ImageWithFade
              src={card.image}
              alt={card.title}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />

            {/* Title & Subtext overlaid at the bottom of the image */}
            <div className="absolute inset-x-0 bottom-0 z-10 space-y-1.5 p-5 sm:p-6">
              <h2 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight lowercase leading-snug text-white">
                {card.title}
              </h2>

              <p className="text-caption font-light italic opacity-90 lowercase leading-relaxed text-white">
                {card.subtext || card.tagline}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
