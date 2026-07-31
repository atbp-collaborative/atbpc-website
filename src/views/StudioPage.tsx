'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CAROUSEL_IMAGES = [
  {
    url: '/images/hero_modern_villa_1783495183350.jpg',
    title: 'Your Home',
  },
  {
    url: '/images/condo_fitout_interior_1783495200802.jpg',
    title: 'Your Business',
  },
  {
    url: '/images/production_drawings_1783495233053.jpg',
    title: 'Your Office',
  },
  {
    url: '/images/retail_boutique_1783495217375.jpg',
    title: 'Your Home',
  },
  {
    url: '/images/kiosk_coffee_bar_1783495252161.jpg',
    title: 'Your Business',
  },
];

export const StudioPage: React.FC = () => {
  const [heroActiveIndex, setHeroActiveIndex] = useState<number>(0);

  // Auto-play interval for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroActiveIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentIndex = heroActiveIndex % CAROUSEL_IMAGES.length;
  const currentItem = CAROUSEL_IMAGES[currentIndex];

  return (
    <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden select-none bg-black text-white">
      {/* FULL PAGE SPREAD IMAGE CAROUSEL */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentItem.url}
            alt={currentItem.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* HERO CONTENT OVERLAY (CENTERED) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto space-y-4 sm:space-y-6 pointer-events-none">
        
        {/* HERO TITLE ROTATION */}
        <div className="overflow-hidden min-h-[60px] sm:min-h-[90px] md:min-h-[110px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentItem.title + currentIndex}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white capitalize drop-shadow-md"
            >
              {currentItem.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* HERO SUBSECTION - COMPANY SLOGAN */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-base md:text-lg font-medium text-white/90 tracking-wider font-sans lowercase"
        >
          designed with values. managed with integrity. built with culture.
        </motion.p>

        {/* PLACEHOLDER SUBTEXT (TWO LINES) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[11px] sm:text-xs md:text-sm font-light text-white/70 leading-relaxed tracking-wide max-w-2xl font-sans"
        >
          ATBP Collaborative delivers bespoke architectural design, master planning, and structural craft.
          <br className="hidden sm:inline" />
          Bridging visionary spatial concepts with honest Philippines building execution across all scales.
        </motion.p>
      </div>

      {/* DOT SLASH CONTROLS AT BOTTOM CENTER */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-3 text-white/80 font-mono text-xs sm:text-sm tracking-widest select-none bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
        <span className="opacity-60 text-white font-semibold">./</span>
        {CAROUSEL_IMAGES.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="opacity-30 text-white font-light">/</span>}
              <button
                onClick={() => setHeroActiveIndex(idx)}
                className={`transition-all duration-300 cursor-pointer flex items-center space-x-1 ${
                  isActive
                    ? 'text-white font-bold opacity-100 scale-110'
                    : 'text-white/60 hover:text-white hover:opacity-90'
                }`}
                aria-label={`Slide ${idx + 1}`}
              >
                <span className={`inline-block transition-transform duration-300 ${isActive ? 'text-space-sparkle text-sm' : 'text-[10px] opacity-40'}`}>
                  •
                </span>
                <span>0{idx + 1}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
