'use client';

import React from 'react';
import { motion } from 'motion/react';

export interface LandingCard {
  id: string;
  title: string;
  tagline: string;
  subtext?: string;
  image: string;
  onSelect: () => void;
  tags?: string[];
}

interface LandingPageProps {
  cards: LandingCard[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ cards }) => {
  return (
    <div className="w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center w-full min-h-0 h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-[2px] flex-1 h-full min-h-0 items-stretch group/cardsContainer">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={card.onSelect}
              className="group/card relative flex-1 min-h-0 md:hover:flex-[1.45] w-full overflow-hidden rounded-none border-0 cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cardsContainer:opacity-75 hover:!opacity-100"
            >
              {/* Full-bleed background image occupying whole card */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover/card:scale-[1.03]"
                referrerPolicy="no-referrer"
              />

              {/* Dark gradient overlay for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 group-hover/card:from-black/90 group-hover/card:via-black/55 group-hover/card:to-black/30 transition-colors duration-500" />

              {/* Card Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end items-start text-left z-10">
                {/* Card Title - Lowercase */}
                <h2 className="font-sans text-h2 sm:text-h1 md:text-display font-semibold tracking-wider text-white lowercase drop-shadow-md">
                  {card.title}
                </h2>

                {/* Subtext tagline overlay */}
                {card.tags ? (
                  <p className="text-mini sm:text-caption font-normal text-white/80 tracking-wider leading-relaxed font-sans mt-1">
                    {card.tags.join(' ◦ ')}
                  </p>
                ) : (
                  <p className="text-mini sm:text-caption font-light text-white/90 italic mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ease-out leading-relaxed tracking-wide">
                    {card.tagline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
