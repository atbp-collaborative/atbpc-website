'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid, Home, Bed, Utensils, ShoppingBag, Briefcase, Flame, Shield, Trees, Users, Building, Maximize2, Layers, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { ProjectDetail } from '../../../components/ProjectDetail';
import { ProjectCard } from '../../../components/ProjectCard';
import { getProjectById, getProjects } from '../../../lib/data/projects';
import { getMembers } from '../../../lib/data/members';
import { Project, Member } from '../../../types';
import { useTheme } from '../../../lib/theme-context';
import { ROUTES, projectRoute } from '../../../lib/routes';
import { WORKS_CATEGORIES } from '../../../content/works';
import { useInfiniteCarousel } from '../../../hooks/useInfiniteCarousel';

export default function WorksCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [slug, setSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    params.then(p => {
      const decodedSlug = decodeURIComponent(p.slug);
      setSlug(decodedSlug);
      Promise.all([getProjectById(decodedSlug), getMembers(), getProjects()]).then(([proj, mems, allProj]) => {
        setProject(proj || null);
        setMembers(mems);
        setProjects(allProj);
        setIsLoading(false);
      });
    });
  }, [params]);

  const filterCategories = [
    'Tiny Living',
    'Urban Living',
    'Multi-Generational',
    'Penthouses',
    'Vacation Homes',
    'Build & Sell Homes',
    'Food & Beverage',
    'Retail & Lifestyle',
    'Workspaces',
    'Shared Spaces',
    'Shared Places',
    'Sacred Structures',
  ];

  const categoryNavItems = [
    { id: 'Shelter', title: 'shelter', icon: <Home size={16} /> },
    { id: 'Livelihood', title: 'livelihood', icon: <Briefcase size={16} /> },
    { id: 'Community', title: 'community', icon: <Users size={16} /> },
  ];

  const getFilterIcon = (cat: string) => {
    switch (cat) {
      case 'All': return <LayoutGrid size={16} />;
      case 'Private': return <Home size={16} />;
      case 'Interiors': return <Layers size={16} />;
      case 'Tiny Living': return <Maximize2 size={16} />;
      case 'Urban Living': return <Home size={16} />;
      case 'Multi-Generational': return <Users size={16} />;
      case 'Penthouses': return <Building size={16} />;
      case 'Vacation Homes': return <Bed size={16} />;
      case 'Build & Sell Homes': return <Home size={16} />;
      case 'Food & Beverage': return <Utensils size={16} />;
      case 'Retail & Lifestyle': return <ShoppingBag size={16} />;
      case 'Workspaces': return <Briefcase size={16} />;
      case 'Shared Spaces': return <Users size={16} />;
      case 'Shared Places': return <Trees size={16} />;
      case 'Sacred Structures': return <Flame size={16} />;
      default: return <LayoutGrid size={16} />;
    }
  };

  const projectFilter = slug || 'All';
  const setProjectFilter = (filter: string) => {
    if (filter === 'All') {
      router.push(ROUTES.works);
    } else {
      router.push(`${ROUTES.works}/${encodeURIComponent(filter)}`);
    }
  };

  const filteredProjects = projectFilter === 'All'
    ? projects
    : projects.filter(p =>
        p.category === projectFilter ||
        p.mainCategory === projectFilter ||
        p.subcategory === projectFilter
      );

  const displayProjects = React.useMemo(() => {
    if (filteredProjects.length === 0) return [];
    const multiplier = filteredProjects.length < 4 ? 6 : 3;
    const result = [];
    for (let i = 0; i < multiplier; i++) {
      result.push(...filteredProjects);
    }
    return result;
  }, [filteredProjects]);

  const { carouselRef, handleScroll, handleCarouselScroll } = useInfiniteCarousel<HTMLDivElement>({
    displayCount: displayProjects.length,
    originalCount: filteredProjects.length,
  });

  if (isLoading) return null;

  if (project) {
    return <ProjectDetail project={project} members={members} />;
  }

  // Check if valid category
  const isValidCategory = filterCategories.includes(projectFilter) || WORKS_CATEGORIES.some(c => c.id === projectFilter);
  if (!isValidCategory && projectFilter !== 'All') {
    notFound();
  }

  const activeMainCard = WORKS_CATEGORIES.find(card => 
    card.id === projectFilter || card.subcategories.some(sub => sub.id === projectFilter)
  );

  const displayFilterCategories = activeMainCard 
    ? ['All', ...activeMainCard.subcategories.map(sub => sub.id)]
    : ['All', ...filterCategories];

  return (
    <motion.div 
      key="works-category"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl w-full mx-auto px-4 sm:px-6 select-none flex flex-col flex-1 min-h-0 h-full py-2 sm:py-3 overflow-hidden justify-between space-y-3"
    >
      <div className="flex-1 flex flex-col min-h-0 h-full justify-between space-y-3 sm:space-y-4 w-full overflow-hidden">
        {/* Top Area: Page Title & Subtext in ONE LINE (Aligned Left) + Homepage Carousel Dots */}
        <div className="shrink-0 pb-2 border-b border-space-sparkle/10 flex flex-row items-center justify-between w-full gap-4 overflow-hidden">
          {/* Page Title & Subtext in one line, left aligned */}
          <div className="flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 gap-y-0.5 min-w-0 flex-1 text-left">
            <h2 className="font-sans text-h2 sm:text-h1 font-semibold tracking-wider lowercase shrink-0 leading-none">
              {activeMainCard ? activeMainCard.title : projectFilter.toLowerCase()}
            </h2>
            <span className="text-caption sm:text-body font-light opacity-80 italic leading-none tracking-wide truncate">
              {activeMainCard ? activeMainCard.tagline : 'a collection of our work'}
            </span>
          </div>

          {/* Two small arrow buttons for carousel navigation */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous Projects"
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 cursor-pointer ${
                isDarkMode 
                  ? 'bg-white/10 text-white hover:bg-white/25 border border-white/15' 
                  : 'bg-black/5 text-vintage-charcoal hover:bg-black/15 border border-space-sparkle/15'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next Projects"
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 cursor-pointer ${
                isDarkMode 
                  ? 'bg-white/10 text-white hover:bg-white/25 border border-white/15' 
                  : 'bg-black/5 text-vintage-charcoal hover:bg-black/15 border border-space-sparkle/15'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Middle Area: Projects Horizontal Carousel (Infinite Scroll) */}
        <div className="relative w-full flex-1 min-h-0 flex items-center group/carousel">
          {/* Carousel Container - Infinite Scrollable, Arrow & Keyboard Controlled */}
          <div 
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="w-full h-full overflow-x-auto no-scrollbar scroll-smooth flex flex-row gap-[2px] items-stretch py-1 snap-x snap-mandatory"
          >
            {displayProjects.map((project, idx) => (
              <ProjectCard
                key={`${project.id}-${idx}`}
                project={project}
                isDarkMode={isDarkMode}
                onClick={() => router.push(projectRoute(project.id))}
              />
            ))}
          </div>
        </div>

        {/* Bottom Area: Interchanged Filter Row (Filter Icons on Left, Category Buttons on Right) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pt-2 border-t border-space-sparkle/10 shrink-0">
          {/* Left: Filter Icons array */}
          <div className="flex flex-row flex-nowrap items-center justify-start gap-1.5 sm:gap-2 text-caption font-medium uppercase tracking-wider overflow-x-auto no-scrollbar max-w-full">
            {displayFilterCategories.map(category => {
              const isSelected = category === 'All'
                ? (projectFilter === 'All' || (activeMainCard && projectFilter === activeMainCard.id))
                : projectFilter === category;
              return (
                <motion.button
                  layout
                  key={category}
                  onClick={() => {
                    if (category === 'All') {
                      if (activeMainCard && projectFilter === activeMainCard.id) {
                        setProjectFilter('All');
                      } else if (activeMainCard) {
                        setProjectFilter(activeMainCard.id);
                      } else {
                        setProjectFilter('All');
                      }
                    } else {
                      setProjectFilter(category);
                    }
                  }}
                  className={`group relative h-8 sm:h-9 min-w-[34px] sm:min-w-[36px] rounded-full overflow-hidden transition-all duration-300 px-2.5 sm:px-3 flex items-center justify-center shrink-0 cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-rose-ebony/30 text-white font-bold border border-white/30'
                        : 'bg-space-sparkle/15 text-space-sparkle font-bold border border-space-sparkle/30'
                      : isDarkMode
                        ? 'text-bright-gray/60 hover:text-white hover:bg-white/5 border border-white/10'
                        : 'text-space-sparkle/60 hover:text-space-sparkle hover:bg-black/5 border border-space-sparkle/15'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="shrink-0 flex items-center justify-center">
                      {getFilterIcon(category)}
                    </span>
                    <span className={`transition-all duration-300 ease-out overflow-hidden whitespace-nowrap font-sans text-mini sm:text-caption tracking-wider lowercase font-semibold ${
                      isSelected 
                        ? 'max-w-[200px] opacity-100 ml-1.5' 
                        : 'max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 group-hover:ml-1.5'
                    }`}>
                      {category.toLowerCase()}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Category Quick-Jump Navigation Tabs (Icons, text slides to left on hover) */}
          <div className="flex flex-nowrap items-center justify-start md:justify-end gap-1.5 sm:gap-2 shrink-0 self-start md:self-auto overflow-x-auto no-scrollbar max-w-full">
            {categoryNavItems.map((cat) => {
              const isCatActive = activeMainCard?.id === cat.id;
              return (
                <motion.button
                  layout
                  key={cat.id}
                  onClick={() => setProjectFilter(cat.id)}
                  className={`group relative h-8 sm:h-9 min-w-[34px] sm:min-w-[36px] rounded-full overflow-hidden transition-all duration-300 px-2.5 sm:px-3 flex items-center justify-center shrink-0 cursor-pointer ${
                    isCatActive
                      ? isDarkMode ? 'bg-white text-vintage-charcoal font-bold' : 'bg-vintage-charcoal text-white font-bold'
                      : isDarkMode ? 'text-bright-gray/60 hover:text-white hover:bg-white/10' : 'text-vintage-charcoal/60 hover:text-vintage-charcoal hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className={`transition-all duration-300 ease-out overflow-hidden whitespace-nowrap font-sans text-mini sm:text-caption tracking-wider lowercase font-semibold ${
                      isCatActive 
                        ? 'max-w-[120px] opacity-100 mr-1.5' 
                        : 'max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 group-hover:mr-1.5'
                    }`}>
                      {cat.title}
                    </span>
                    <span className="shrink-0 flex items-center justify-center">
                      {cat.icon}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
