import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Member } from '../types';
import { getMembers } from '../lib/data/members';

interface OurPeoplePageProps {
  isDarkMode: boolean;
  setSelectedMember: (member: Member) => void;
  initialFilter?: FilterCategory;
}

type FilterCategory = 'all' | 'designers' | 'managers' | 'builders';

const FILTER_OPTIONS: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'designers', label: 'designers' },
  { id: 'managers', label: 'managers' },
  { id: 'builders', label: 'builders' },
];

export const OurPeoplePage: React.FC<OurPeoplePageProps> = ({
  isDarkMode,
  setSelectedMember,
  initialFilter = 'all',
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>(initialFilter);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  React.useEffect(() => {
    setActiveFilter(initialFilter);
    setCurrentIndex(0);
  }, [initialFilter]);

  // Filter members based on category
  const filteredMembers = useMemo(() => {
    if (activeFilter === 'all') return members;
    return members.filter((member) => {
      const roleLower = member.role.toLowerCase();
      const bioLower = (member.bio + ' ' + member.fullBio).toLowerCase();
      
      if (activeFilter === 'designers') {
        return (
          roleLower.includes('architect') ||
          roleLower.includes('designer') ||
          roleLower.includes('bim') ||
          roleLower.includes('drafting')
        );
      }
      if (activeFilter === 'managers') {
        return (
          roleLower.includes('director') ||
          roleLower.includes('manager') ||
          roleLower.includes('founder') ||
          roleLower.includes('partner') ||
          roleLower.includes('hr') ||
          roleLower.includes('finance')
        );
      }
      if (activeFilter === 'builders') {
        return (
          roleLower.includes('construction') ||
          roleLower.includes('builder') ||
          roleLower.includes('engineer') ||
          roleLower.includes('plumber') ||
          roleLower.includes('fabrication') ||
          bioLower.includes('site implementation') ||
          bioLower.includes('building construction')
        );
      }
      return true;
    });
  }, [activeFilter, members]);

  // Handle Carousel Prev / Next
  const handlePrev = () => {
    if (filteredMembers.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? filteredMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (filteredMembers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredMembers.length);
  };

  // Get current visible subset of members (3 for desktop, 2 for tablet, 1 for mobile)
  const visibleMembers = useMemo(() => {
    if (filteredMembers.length === 0) return [];
    const len = filteredMembers.length;
    const count = Math.min(3, len);
    const result: Member[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (currentIndex + i) % len;
      result.push(filteredMembers[idx]);
    }
    return result;
  }, [filteredMembers, currentIndex]);

  return (
    <motion.div 
      key="our-people"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 max-w-7xl mx-auto select-none"
    >
      {/* Top Filter Buttons Row (Centered, Pipe format, No counter indicator) */}
      <div className="shrink-0 flex items-center justify-center relative border-b border-space-sparkle/10 pb-2.5 mb-2">
        {/* Centered Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 text-mini sm:text-caption font-medium lowercase tracking-wider">
          {FILTER_OPTIONS.map((filter, index) => {
            const isActive = activeFilter === filter.id;
            return (
              <React.Fragment key={filter.id}>
                {index > 0 && <span className="opacity-30 font-light px-1 sm:px-2">|</span>}
                <button
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setCurrentIndex(0);
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

        {/* Carousel Navigation Arrows on the right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handlePrev}
            aria-label="Previous member"
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-vintage-charcoal/70 hover:text-vintage-charcoal hover:bg-black/5'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next member"
            className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-vintage-charcoal/70 hover:text-vintage-charcoal hover:bg-black/5'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Carousel Area */}
      <div className="flex-1 flex items-center justify-center my-auto py-2 sm:py-4 relative w-full overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 opacity-60 text-caption sm:text-body font-light">
            No team members found in this category.
          </div>
        ) : (
          <div className="relative w-full flex items-center gap-4 sm:gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFilter}-${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start"
              >
                {visibleMembers.map((member, idx) => (
                  <div
                    key={`${member.id}-${idx}`}
                    onClick={() => {
                      setSelectedMember(member);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer flex flex-col space-y-3 transition-all duration-300"
                  >
                    {/* Borderless Image */}
                    <div className="w-full aspect-[4/5] max-h-[46vh] overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Clickable Text (No boundaries, no card background) */}
                    <div className="flex flex-col space-y-1 text-left">
                      <h3 className="font-sans text-body sm:text-h3 font-bold tracking-tight leading-snug group-hover:underline underline-offset-4">
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
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Subtext Row (2 lines as requested) */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2.5">
        <p className="text-mini sm:text-caption font-light opacity-80 tracking-wide lowercase">
          we are a licensed, registered collaborative trained and experienced to provide you services ...
        </p>
        <p className="text-mini sm:text-caption font-light opacity-80 tracking-wide lowercase mt-0.5">
          ... architecture, engineering, building construction industry, nationwide.
        </p>
      </div>
    </motion.div>
  );
};
