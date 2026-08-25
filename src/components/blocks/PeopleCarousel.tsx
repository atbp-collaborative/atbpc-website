'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Member, MemberCategory } from '@/types';
import { useTheme } from '@/lib/theme-context';
import { ROUTES, memberRoute, memberCategoryRoute } from '@/lib/navigation/routes';
import { ImageWithFade } from '@/components/primitives/ImageWithFade';
import { useCarouselScroll } from '@/hooks/useCarouselScroll';

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

export const PeopleCarousel: React.FC<PeopleCarouselProps> = ({ members, activeFilter }) => {
  const { isDarkMode } = useTheme();

  const filteredMembers = useMemo(() => {
    if (activeFilter === 'all') return members;
    return members.filter((member) => member.categories.includes(activeFilter));
  }, [activeFilter, members]);

  const { carouselRef, canScrollPrev, canScrollNext, dragHandlers, handleScroll } = useCarouselScroll<HTMLDivElement>({
    resetKey: activeFilter,
  });

  return (
    <div className="w-full flex-1 flex flex-col justify-between md:overflow-hidden select-none">
      <div
        className={`shrink-0 flex items-center justify-between z-20 pb-2.5 mb-2 pt-2 md:pt-0 md:bg-transparent -mx-4 px-4 sm:-mx-8 sm:px-8 md:mx-0 md:px-0 sticky top-[var(--header-height,53px)] md:top-auto md:relative ${
          isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'
        }`}
      >
        <div className="flex items-center justify-start flex-wrap gap-1 sm:gap-2 text-mini sm:text-caption font-medium lowercase tracking-wider">
          {FILTER_OPTIONS.map((filter, index) => {
            const isActive = activeFilter === filter.id;
            return (
              <React.Fragment key={filter.id}>
                {index > 0 && <span className="opacity-30 font-light px-1 sm:px-2">|</span>}
                <Link
                  href={filter.id === 'all' ? ROUTES.ourPeople : memberCategoryRoute(filter.id)}
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
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        <div className="hidden md:flex items-center space-x-1 sm:space-x-2 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollPrev}
            aria-label="Previous member"
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
              !canScrollPrev ? 'opacity-30 cursor-not-allowed' : ''
            } ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-vintage-charcoal/70 hover:text-vintage-charcoal hover:bg-black/5'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollNext}
            aria-label="Next member"
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
              !canScrollNext ? 'opacity-30 cursor-not-allowed' : ''
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

      <div className="flex-1 relative w-full md:overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 opacity-60 text-caption sm:text-body font-light">
            No team members found in this category.
          </div>
        ) : (
          <div
            ref={carouselRef}
            {...dragHandlers}
            className="md:h-full md:overflow-y-hidden md:overflow-x-auto overflow-x-hidden no-scrollbar overscroll-x-contain relative flex flex-col md:flex-row gap-[2px] md:cursor-grab md:active:cursor-grabbing"
          >
            {filteredMembers.map((member) => (
              <Link
                key={member.id}
                href={memberRoute(member.id)}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group shrink-0 w-full h-auto md:w-auto md:h-full"
              >
                <div className="relative w-full h-full aspect-[1.5/1] md:aspect-[2/3] overflow-hidden">
                  <ImageWithFade
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="400px"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-x-0 bottom-0 z-10 space-y-1 p-4 sm:p-5 text-left">
                    <h3 className="font-sans text-body sm:text-h2 font-bold tracking-tight leading-snug text-white group-hover:underline underline-offset-4">
                      {member.name}
                    </h3>
                    <p className="text-caption font-light italic opacity-90 leading-relaxed text-white">
                      {member.role}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
