import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Home, 
  Bed, 
  Utensils, 
  ShoppingBag, 
  Briefcase, 
  Flame,
  Shield,
  Trees,
  Users,
  Building,
  Maximize2,
  Layers,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getProjects } from '../lib/data/projects';
import { Project } from '../types';

const shelterImg = '/images/hero_modern_villa_1783495183350.jpg';
const livelihoodImg = '/images/retail_boutique_1783495217375.jpg';
const communityImg = '/images/production_drawings_1783495233053.jpg';

interface WorksPageProps {
  isDarkMode: boolean;
  projectFilter: string;
  setProjectFilter: (filter: string) => void;
  hoveredCategory: string | null;
  setHoveredCategory: (cat: string | null) => void;
  onProjectSelect: (project: Project) => void;
}

export const WorksPage: React.FC<WorksPageProps> = ({
  isDarkMode,
  projectFilter,
  setProjectFilter,
  hoveredCategory,
  setHoveredCategory,
  onProjectSelect,
}) => {
  // Main Category Landing Cards Data
  const MAIN_CATEGORY_CARDS = [
    {
      id: 'Shelter',
      title: 'shelter',
      tagline: 'for the way you live',
      image: shelterImg,
      subcategories: [
        { name: 'Tiny Living', id: 'Tiny Living' },
        { name: 'Urban Living', id: 'Urban Living' },
        { name: 'Multi-Generational', id: 'Multi-Generational' },
        { name: 'Penthouses', id: 'Penthouses' },
        { name: 'Vacation Homes', id: 'Vacation Homes' },
      ],
    },
    {
      id: 'Livelihood',
      title: 'livelihood',
      tagline: 'where passion takes form',
      image: livelihoodImg,
      subcategories: [
        { name: 'Build & Sell Homes', id: 'Build & Sell Homes' },
        { name: 'Food & Beverage', id: 'Food & Beverage' },
        { name: 'Retail & Lifestyle', id: 'Retail & Lifestyle' },
        { name: 'Workspaces', id: 'Workspaces' },
      ],
    },
    {
      id: 'Community',
      title: 'community',
      tagline: 'we share & communicate',
      image: communityImg,
      subcategories: [
        { name: 'Shared Spaces', id: 'Shared Spaces' },
        { name: 'Shared Places', id: 'Shared Places' },
        { name: 'Sacred Structures', id: 'Sacred Structures' },
      ],
    },
  ];

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  // Filtered projects
  const filteredProjects = projectFilter === 'All'
    ? projects
    : projects.filter(p =>
        p.category === projectFilter ||
        p.mainCategory === projectFilter ||
        p.subcategory === projectFilter
      );

  // Repeat projects for infinite carousel scrolling
  const displayProjects = React.useMemo(() => {
    if (filteredProjects.length === 0) return [];
    const multiplier = filteredProjects.length < 4 ? 6 : 3;
    const result = [];
    for (let i = 0; i < multiplier; i++) {
      result.push(...filteredProjects);
    }
    return result;
  }, [filteredProjects]);

  useEffect(() => {
    if (carouselRef.current && displayProjects.length > 0 && filteredProjects.length > 0) {
      const container = carouselRef.current;
      const singleSetWidth = container.scrollWidth / (displayProjects.length / filteredProjects.length);
      container.scrollLeft = singleSetWidth;
    }
  }, [projectFilter, displayProjects, filteredProjects.length]);

  const handleScrollLeft = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const child = container.firstElementChild as HTMLElement;
      const scrollAmount = child ? child.getBoundingClientRect().width + 2 : 380;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const child = container.firstElementChild as HTMLElement;
      const scrollAmount = child ? child.getBoundingClientRect().width + 2 : 380;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current || displayProjects.length === 0 || filteredProjects.length === 0) return;
    const container = carouselRef.current;
    const totalWidth = container.scrollWidth;
    const singleSetWidth = totalWidth / (displayProjects.length / filteredProjects.length);
    
    if (container.scrollLeft < 30) {
      container.scrollLeft += singleSetWidth;
    } else if (container.scrollLeft >= singleSetWidth * (displayProjects.length / filteredProjects.length - 1) - 30) {
      container.scrollLeft -= singleSetWidth;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handleScrollLeft();
      } else if (e.key === 'ArrowRight') {
        handleScrollRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const carouselRef = useRef<HTMLDivElement>(null);

  // Active main category card for the current project filter
  const activeMainCard = MAIN_CATEGORY_CARDS.find(card => 
    card.id === projectFilter || card.subcategories.some(sub => sub.id === projectFilter)
  );

  const displayFilterCategories = activeMainCard 
    ? ['All', ...activeMainCard.subcategories.map(sub => sub.id)]
    : ['All', ...filterCategories];

  const isLandingPage = projectFilter === 'All';

  return (
    <motion.div 
      key="works"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={
        isLandingPage
          ? "w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden"
          : "max-w-7xl w-full mx-auto px-4 sm:px-6 select-none flex flex-col flex-1 min-h-0 h-full py-2 sm:py-3 overflow-hidden justify-between space-y-3"
      }
    >
      {/* WORKS LANDING PAGE vs CATEGORY PAGE VIEW */}
      {isLandingPage ? (
        /* LANDING PAGE: 3 MAIN CATEGORY CARDS ONLY - NON-SCROLLING */
        <div className="flex-1 flex flex-col justify-center w-full min-h-0 h-full overflow-hidden">
          <div className="flex flex-col md:flex-row gap-[2px] flex-1 h-full min-h-0 items-stretch group/cardsContainer">
            {MAIN_CATEGORY_CARDS.map((card) => (
              <div
                key={card.id}
                onClick={() => setProjectFilter(card.id)}
                className="group/card relative flex-1 min-h-0 md:hover:flex-[1.45] w-full overflow-hidden rounded-none border-0 cursor-pointer transition-all duration-500 ease-out group-hover/cardsContainer:opacity-75 hover:!opacity-100"
              >
                {/* Full-bleed background image occupying whole card */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
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
                  <p className="text-mini sm:text-caption font-light text-white/90 italic mt-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ease-out leading-relaxed tracking-wide">
                    {card.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FILTERED CATEGORY VIEW: Title & Dots on Top, Carousel in Middle, Filter Buttons at Bottom */
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
                onClick={handleScrollLeft}
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
                onClick={handleScrollRight}
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
                <div 
                  key={`${project.id}-${idx}`}
                  onClick={() => onProjectSelect(project)}
                  className={`group relative flex-shrink-0 w-[270px] sm:w-[330px] md:w-[370px] lg:w-[410px] h-full overflow-hidden rounded-none border transition-all duration-500 cursor-pointer snap-start select-none ${
                    isDarkMode ? 'border-space-sparkle/20 bg-vintage-charcoal/40 hover:border-white/40' : 'border-space-sparkle/15 bg-white hover:border-space-sparkle/40'
                  }`}
                >
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-5 z-10 text-left">
                    <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-1 text-left">
                      <h3 className="font-sans text-h3 sm:text-h2 font-semibold text-white tracking-wide leading-tight text-left">
                        {project.title}
                      </h3>
                      
                      <span className="text-caption font-sans text-white/75 block text-left">
                        {project.location}
                      </span>
                    </div>
                  </div>
                </div>
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
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
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
      )}
    </motion.div>
  );
};

