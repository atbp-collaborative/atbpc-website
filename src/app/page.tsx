'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFade } from '../components/ImageWithFade';

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

export default function HeroPage() {
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
          <ImageWithFade
            src={currentItem.url}
            alt={currentItem.title}
            fill
            sizes="100vw"
            priority={currentIndex === 0}
            className="object-cover"
          />
          {/* Subtle dark gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* HERO CONTENT OVERLAY (CENTERED) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto space-y-4 sm:space-y-6 pointer-events-none">

        {/* HERO TITLE ROTATION */}
        <div className="overflow-hidden min-h-[45px] sm:min-h-[60px] md:min-h-[90px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentItem.title + currentIndex}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-display font-bold tracking-tight text-white capitalize drop-shadow-md"
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
          className="text-mini sm:text-caption md:text-body font-medium text-white/90 tracking-wider font-sans lowercase"
        >
          designed with values. managed with integrity. built with culture.
        </motion.p>

        {/* PLACEHOLDER SUBTEXT (TWO LINES) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-micro sm:text-mini font-light text-white/70 leading-relaxed tracking-wide max-w-2xl font-sans"
        >
          ATBP Collaborative delivers bespoke architectural design, master planning, and structural craft.
          <br className="hidden sm:inline" />
          Bridging visionary spatial concepts with honest Philippines building execution across all scales.
        </motion.p>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 px-3 py-2">
        {CAROUSEL_IMAGES.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setHeroActiveIndex(idx)}
              className={`transition-all duration-500 cursor-pointer h-1.5 sm:h-2 rounded-full ${
                isActive ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
