'use client';

import React, { useState, useMemo, useLayoutEffect, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Member, MemberCategory } from '../types';
import { useTheme } from '../lib/theme-context';
import { ROUTES, memberRoute, memberCategoryRoute } from '../lib/routes';
import { ImageWithFade } from './ImageWithFade';

type FilterCategory = 'all' | MemberCategory;

const FILTER_OPTIONS: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'designers', label: 'designers' },
  { id: 'managers', label: 'managers' },
  { id: 'builders', label: 'builders' },
];

export interface PeopleCarouselProps {
  members: Member[];
  activeFilter: FilterCategory;
}

// Tracks how many cards fit per view and the gap between them, mirroring the
// old `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` / `gap-6 sm:gap-8` breakpoints.
function useCarouselLayout() {
  const [layout, setLayout] = useState({ cardsPerView: 1, gap: 24 });

  useEffect(() => {
    const mqSm = window.matchMedia('(min-width: 640px)');
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setLayout({
        cardsPerView: mqLg.matches ? 3 : mqSm.matches ? 2 : 1,
        gap: mqSm.matches ? 32 : 24,
      });
    };
    update();
    mqSm.addEventListener('change', update);
    mqLg.addEventListener('change', update);
    return () => {
      mqSm.removeEventListener('change', update);
      mqLg.removeEventListener('change', update);
    };
  }, []);

  return layout;
}

function useElementWidth() {
  // A plain ref + effect-with-empty-deps only measures once at mount, which
  // misses this div: it appears later, once the async member fetch resolves.
  // A callback ref re-fires whenever the node actually attaches.
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!node) return;
    const update = () => setWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, width] as const;
}

export const PeopleCarousel: React.FC<PeopleCarouselProps> = ({ members, activeFilter }) => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const filteredMembers = useMemo(() => {
    if (activeFilter === 'all') return members;
    return members.filter((member) => member.categories.includes(activeFilter));
  }, [activeFilter, members]);

  const { cardsPerView, gap } = useCarouselLayout();
  const [viewportRef, containerWidth] = useElementWidth();
  const cardWidth = containerWidth > 0 ? (containerWidth - (cardsPerView - 1) * gap) / cardsPerView : 0;

  const len = filteredMembers.length;
  const canSlide = len > cardsPerView;

  // Pad the real members with clones of the tail/head so sliding past either
  // end reveals the wrap-around content instead of empty space.
  const trackMembers = useMemo(() => {
    if (!canSlide) return filteredMembers;
    return [
      ...filteredMembers.slice(len - cardsPerView),
      ...filteredMembers,
      ...filteredMembers.slice(0, cardsPerView),
    ];
  }, [filteredMembers, canSlide, len, cardsPerView]);

  const [renderPos, setRenderPos] = useState(cardsPerView);
  const [skipTransition, setSkipTransition] = useState(true);

  // Filter or breakpoint changes invalidate the clone padding, so jump back
  // to the start without animating (the content is different, not "sliding").
  useEffect(() => {
    setRenderPos(canSlide ? cardsPerView : 0);
    setSkipTransition(true);
  }, [activeFilter, canSlide, cardsPerView, len]);

  const handlePrev = () => {
    if (!canSlide) return;
    setSkipTransition(false);
    setRenderPos((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!canSlide) return;
    setSkipTransition(false);
    setRenderPos((prev) => prev + 1);
  };

  const handleTrackAnimationComplete = () => {
    if (!canSlide) return;
    if (renderPos === cardsPerView + len) {
      setSkipTransition(true);
      setRenderPos(cardsPerView);
    } else if (renderPos === cardsPerView - 1) {
      setSkipTransition(true);
      setRenderPos(cardsPerView + len - 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none">
      <div className="shrink-0 flex items-center justify-center relative border-b border-space-sparkle/10 pb-2.5 mb-2">
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 text-mini sm:text-caption font-medium lowercase tracking-wider">
          {FILTER_OPTIONS.map((filter, index) => {
            const isActive = activeFilter === filter.id;
            return (
              <React.Fragment key={filter.id}>
                {index > 0 && <span className="opacity-30 font-light px-1 sm:px-2">|</span>}
                <button
                  onClick={() => {
                    router.push(filter.id === 'all' ? ROUTES.ourPeople : memberCategoryRoute(filter.id));
                  }}
                  className={`transition-all duration-200 cursor-pointer ${
                    isActive
                      ? isDarkMode
                        ? 'text-white font-bold opacity-100 underline underline-offset-4'
                        : 'text-vintage-charcoal font-bold opacity-100 underline underline-offset-4'
                      : isDarkMode
                        ? 'text-white/60 hover:text-white opacity-60'
                        : 'text-vintage-charcoal/60 hover:text-vintage-charcoal opacity-60'
                  }`}
                >
                  {filter.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handlePrev}
            disabled={!canSlide}
            aria-label="Previous member"
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
              !canSlide ? 'opacity-30 cursor-not-allowed' : ''
            } ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-vintage-charcoal/70 hover:text-vintage-charcoal hover:bg-black/5'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={!canSlide}
            aria-label="Next member"
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
              !canSlide ? 'opacity-30 cursor-not-allowed' : ''
            } ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-vintage-charcoal/70 hover:text-vintage-charcoal hover:bg-black/5'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center my-auto py-2 sm:py-4 relative w-full overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 opacity-60 text-caption sm:text-body font-light">
            No team members found in this category.
          </div>
        ) : (
          <div ref={viewportRef} className="w-full overflow-hidden relative">
            {containerWidth > 0 && (
              <motion.div
                className="flex items-start"
                style={{ gap: `${gap}px` }}
                animate={{ x: -(renderPos * (cardWidth + gap)) }}
                transition={skipTransition ? { duration: 0 } : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onAnimationComplete={handleTrackAnimationComplete}
              >
                {trackMembers.map((member, idx) => (
                  <div
                    key={`${member.id}-${idx}`}
                    onClick={() => {
                      router.push(memberRoute(member.id));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ flex: `0 0 ${cardWidth}px` }}
                    className="group cursor-pointer flex flex-col space-y-3 transition-all duration-300"
                  >
                    <div className="relative w-full aspect-[4/5] max-h-[46vh] overflow-hidden">
                      <ImageWithFade
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col space-y-1 text-left">
                      <h3 className="font-sans text-body sm:text-h2 font-bold tracking-tight leading-snug group-hover:underline underline-offset-4">
                        {member.name}
                      </h3>
                      <p className="text-caption uppercase tracking-widest font-semibold opacity-75">
                        {member.role}
                      </p>
                      <p className="text-mini font-mono opacity-50">
                        {member.license}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
