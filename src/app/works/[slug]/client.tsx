'use client';

import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, ArrowLeft, ChevronLeft, ChevronRight, MapPin, Play, ArrowUpRight, X } from 'lucide-react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectById, getProjects } from '@/lib/services/projects';
import { getMembers } from '@/lib/services/members';
import { Project, Member } from '@/types';
import { useTheme } from '@/lib/theme-context';
import { ROUTES, projectRoute, memberRoute } from '@/lib/navigation/routes';
import { WORKS_CATEGORIES } from '@/dummy-data/works';
import { filterCategories, categoryNavItems, getFilterIcon } from '@/lib/data/typologies';
import { useCarouselScroll } from '@/hooks/useCarouselScroll';

import { Button } from '@/components/primitives/Button';
import { Accordion } from '@/components/primitives/Accordion';
import { BreadcrumbButton } from '@/components/primitives/BreadcrumbButton';
import { ImageWithFade } from '@/components/primitives/ImageWithFade';
import { isUnsplashUrl, unsplashLoader } from '@/lib/imageLoaders';
import { ProjectCard } from '@/components/blocks/ProjectCard';

// motion needs a ref-forwarding component to animate; next/image forwards
// its ref to the underlying <img>, so this keeps the existing slide-transform
// animation working the same way the old motion.img did.
const MotionImage = motion.create(Image);

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`;
  }
  return null;
}


interface ProjectDetailProps {
  project: Project;
  members: Member[];
}

function ProjectDetailContent({
  project,
  members,
}: ProjectDetailProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const filterName = project.subcategory || project.mainCategory || project.category || 'All Works';
  const isAllWorks = filterName === 'All' || filterName === 'All Works' || filterName === 'works';
  const backLabel = isAllWorks ? 'Back to all works' : `Back to ${filterName}`;

  const contributors = useMemo(() => {
    return members.filter((member) =>
      member.involvement.some((inv) => inv.projectId === project.id)
    );
  }, [project.id, members]);

  const mediaItems = useMemo(() => {
    const items: Array<{ type: 'image' | 'video'; url: string; duration?: string }> = [];
    project.images.forEach((img) => {
      items.push({ type: 'image', url: img });
    });
    if (project.video) {
      items.push({ type: 'video', url: project.video, duration: '0:07' });
    }
    return items;
  }, [project.video, project.images]);

  const columnRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    columnLeft: 0,
    columnTop: 0,
    columnWidth: 0,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [isDesktop, setIsDesktop] = useState(true);
  const [isXL, setIsXL] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsXL(window.innerWidth >= 1280);
      if (columnRef.current) {
        const rect = columnRef.current.getBoundingClientRect();
        // Keep track of viewport-relative coordinates
        setCoords({
          columnLeft: rect.left,
          columnTop: rect.top,
          columnWidth: rect.width,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentSlideIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0 });
    }
  }, [project.id]);

  // Auto-scroll image/video carousel every 5 seconds (stops at the last image / penultimate item if there's a video)
  useEffect(() => {
    const hasVideo = mediaItems.some(item => item.type === 'video');
    const lastImageIndex = hasVideo ? mediaItems.length - 2 : mediaItems.length - 1;

    if (currentSlideIndex >= lastImageIndex || mediaItems[currentSlideIndex]?.type === 'video') {
      return;
    }

    const timer = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = currentSlideIndex + 1;
        const slide = carouselRef.current.children[nextIndex] as HTMLElement;
        if (slide) {
          carouselRef.current.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlideIndex, mediaItems]);

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!carouselRef.current) return;
    
    let nextIndex = currentSlideIndex + 1;
    if (nextIndex >= mediaItems.length) {
      nextIndex = 0; // Wrap to start
    }
    const slide = carouselRef.current.children[nextIndex] as HTMLElement;
    if (slide) {
      carouselRef.current.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    }
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!carouselRef.current) return;
    if (currentSlideIndex === 0) return; // Do not scroll left from item 1
    
    const prevIndex = currentSlideIndex - 1;
    const slide = carouselRef.current.children[prevIndex] as HTMLElement;
    if (slide) {
      carouselRef.current.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (index !== currentSlideIndex) {
        setCurrentSlideIndex(index);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex]);

  const isVideoActive = mediaItems[currentSlideIndex]?.type === 'video';

  const maxAvailableHeight = coords.windowHeight * 0.9;
  const maxAvailableWidth = coords.windowWidth * 0.9;

  const targetWidth = useMemo(() => {
    const widthByHeight = maxAvailableHeight * (16 / 9);
    return Math.min(maxAvailableWidth, widthByHeight);
  }, [maxAvailableWidth, maxAvailableHeight]);

  const targetHeight = useMemo(() => {
    return targetWidth * (9 / 16);
  }, [targetWidth]);

  const xRelative = useMemo(() => {
    const targetLeft = (coords.windowWidth - targetWidth) / 2;
    return targetLeft - coords.columnLeft;
  }, [coords.windowWidth, targetWidth, coords.columnLeft]);

  const yRelative = useMemo(() => {
    const targetTop = (coords.windowHeight - targetHeight) / 2;
    return targetTop - coords.columnTop;
  }, [coords.windowHeight, targetHeight, coords.columnTop]);

  const renderProjectSpecs = () => (
    <div className="flex flex-col space-y-4">
      {project.specs.area && (
        <div>
          <span className="opacity-50 block uppercase text-caption font-semibold tracking-wider mb-1">Floor Area</span>
          <span className="font-medium text-mini">{project.specs.area}</span>
        </div>
      )}
      <div>
        <span className="opacity-50 block uppercase text-caption font-semibold tracking-wider mb-1">Contract Type</span>
        <span className="font-medium text-mini block capitalize">{project.specs.scope}</span>
      </div>
      {project.specs.materials && (
        <div>
          <span className="opacity-50 block uppercase text-caption font-semibold tracking-wider mb-1">Featured Materials</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.specs.materials.map((m, i) => (
              <span key={i} className={`px-2 py-0.5 rounded-none text-micro font-sans ${
                isDarkMode ? 'bg-space-sparkle/10 text-bright-gray' : 'bg-space-sparkle/5 text-vintage-charcoal'
              }`}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
      {contributors.length > 0 && (
        <div className="pt-0.5">
          <span className="opacity-50 block uppercase text-caption font-semibold tracking-wider mb-1.5">Project Contributors</span>
          <ul className="space-y-1.5">
            {contributors.map((member) => (
              <li key={member.id} className="flex items-start space-x-2 font-light opacity-90">
                <span className="text-space-sparkle font-semibold mt-0.5">•</span>
                <Link
                  href={memberRoute(member.id)}
                  className={`text-left hover:text-space-sparkle hover:underline transition-all focus:outline-none cursor-pointer flex items-center gap-1 font-medium ${
                    isDarkMode ? "text-bright-gray/90" : "text-vintage-charcoal/90"
                  }`}
                >
                  <span>{member.name.replace(/,\s*$/, '')}</span>
                  <ArrowUpRight size={12} className="opacity-65 text-space-sparkle shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div 
      id={`project-detail-${project.id}`}
      className={`w-full px-4 sm:px-8 py-2 select-none flex flex-col lg:flex-1 lg:min-h-0 h-auto lg:h-full justify-start overflow-y-auto ${isVideoActive && isDesktop ? 'lg:overflow-visible' : 'lg:overflow-hidden'}`}
    >
      <BreadcrumbButton
        label={backLabel}
        className="mt-6 sm:mt-8 mb-4 sm:mb-5"
        onClick={() => router.back()}
      />

      <div className={`grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-4 gap-6 lg:flex-1 lg:min-h-0 pb-1 ${isVideoActive && isDesktop ? 'lg:overflow-visible' : 'lg:overflow-hidden'}`}>
        
        {/* Carousel & CTA Container */}
        <div ref={columnRef} className={`lg:col-span-7 lg:order-2 xl:col-span-2 xl:order-3 flex flex-col justify-start lg:h-full lg:min-h-0 space-y-3 ${isVideoActive && isDesktop ? 'lg:overflow-visible' : 'lg:overflow-hidden'}`}>
          
          <div className={`space-y-3 w-full relative lg:flex-1 lg:min-h-0 flex flex-col justify-start ${isVideoActive && isDesktop ? 'lg:overflow-visible' : 'lg:overflow-hidden'}`}>
            
              {isVideoActive && isDesktop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[100] cursor-pointer backdrop-blur-sm bg-black/85"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(0);
                  }}
                />
              )}
            

            <div className="relative aspect-video w-full max-h-full">
              <motion.div 
                className="absolute inset-0 overflow-hidden bg-space-sparkle/10 rounded-lg group flex items-center justify-center cursor-default"
                animate={{
                  width: isVideoActive && isDesktop ? targetWidth : '100%',
                  height: isVideoActive && isDesktop ? targetHeight : '100%',
                  x: isVideoActive && isDesktop ? xRelative : 0,
                  y: isVideoActive && isDesktop ? yRelative : 0,
                  zIndex: isVideoActive && isDesktop ? 110 : 10,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 120, mass: 0.9 }}
              >
                  <div className="relative w-full h-full overflow-hidden bg-space-sparkle/5">
                    <div 
                      ref={carouselRef}
                      className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full h-full"
                      onScroll={handleScroll}
                    >
                      {mediaItems.map((item, idx) => (
                        <div key={idx} className="flex-none w-full h-full snap-center relative">
                          {item.type === 'video' ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
                              {(() => {
                                const embedUrl = getYouTubeEmbedUrl(item.url);
                                if (embedUrl) {
                                  return (
                                    <iframe
                                      src={embedUrl}
                                      title="Project Video"
                                      className={`w-full h-full border-0 ${!isDesktop ? 'pointer-events-none' : ''}`}
                                      allow="autoplay; encrypted-media; picture-in-picture"
                                      allowFullScreen
                                    />
                                  );
                                }
                                return (
                                  <video 
                                    src={item.url}
                                    className="w-full h-full object-cover pointer-events-none"
                                    autoPlay
                                    loop
                                    playsInline
                                  />
                                );
                              })()}
                            </div>
                          ) : (
                            <Image
                              src={item.url}
                              alt={`${project.title} slide ${idx + 1}`}
                              fill
                              sizes="(min-width: 1024px) 58vw, 100vw"
                              loader={isUnsplashUrl(item.url) ? unsplashLoader : undefined}
                              className="object-cover pointer-events-none"
                              draggable={false}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Left/Right Buttons */}
                  {currentSlideIndex !== 0 && (
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                {(() => {
                  const hasVideo = mediaItems.some(item => item.type === 'video');
                  const isLastImageBeforeVideo = hasVideo && currentSlideIndex === mediaItems.length - 2;

                  if (isLastImageBeforeVideo) {
                    return (
                      <button
                        onClick={nextSlide}
                        className="group/btn absolute right-4 top-1/2 -translate-y-1/2 h-9 pl-3 pr-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all duration-300 ease-in-out shadow-lg z-10 cursor-pointer flex items-center animate-pulse hover:animate-none"
                      >
                        <span className="max-w-[100px] mr-2 group-hover/btn:max-w-0 group-hover/btn:mr-0 overflow-hidden text-micro font-archivo uppercase tracking-widest font-bold whitespace-nowrap opacity-100 group-hover/btn:opacity-0 transition-all duration-300 select-none">
                          Watch Video
                        </span>
                        <Play size={16} fill="currentColor" className="flex-shrink-0" />
                      </button>
                    );
                  }

                  return (
                    <button 
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  );
                })()}
              </motion.div>
            </div>

            {/* Slider Bullets */}
            <div className="flex justify-center items-center px-2 shrink-0">
              <div className="flex items-center space-x-2">
                {mediaItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentSlideIndex === idx 
                        ? 'bg-space-sparkle scale-125' 
                        : 'bg-space-sparkle/30 hover:bg-space-sparkle/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column CTA (LG/XL only) */}
          <div className={`hidden lg:flex flex-col justify-start gap-3 w-full shrink-0 border-t border-space-sparkle/10 pt-4 pb-1 ${isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'}`}>
            <span className="font-sans text-caption font-semibold tracking-tight opacity-80 uppercase text-left">Inspired by this project?</span>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                type="filled"
                label="Schedule discovery"
                href={ROUTES.discoverySession}
                className="font-medium py-2 text-mini flex-1"
              />
              <Button
                type="filled"
                label="Request proposal"
                onClick={() => router.push(ROUTES.contact)}
                className="font-medium py-2 text-mini flex-1"
              />
            </div>
          </div>
        </div>

        {/* High-End Architectural Writeup & Specs */}
        <div 
          className={`lg:col-span-5 lg:order-1 xl:col-span-2 xl:order-1 flex flex-col justify-start lg:h-full lg:min-h-0 py-0.5 ${
            isVideoActive && isDesktop 
              ? 'lg:overflow-visible' 
              : 'lg:overflow-y-auto no-scrollbar lg:relative'
          }`}
          style={isXL && coords.columnWidth > 0 ? { height: coords.columnWidth * (9 / 16) } : undefined}
        >
          {/* Sticky Header */}
          <div className={`lg:sticky lg:top-0 lg:z-10 pb-3 flex flex-col shrink-0 ${isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'}`}>
            <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight shrink-0">
              {project.title}
            </h1>

            <div className="flex items-center space-x-2 text-mini font-sans opacity-60 shrink-0 mt-1">
              <MapPin size={12} />
              <span>{project.location}</span>
            </div>
          </div>

          {/* Main Content Area (Writeup & Specs) */}
          <div className="flex flex-col xl:flex-row gap-6 w-full lg:min-h-0 overflow-visible mt-2 mb-4">
            {/* Writeup */}
            <div className="w-full xl:w-[60%] shrink-0">
              <p className="text-caption sm:text-body leading-relaxed font-light opacity-90 whitespace-pre-line text-justify">
                {project.fullWriteup}
              </p>
            </div>

            {/* Specs / Overview */}
            <div className="w-full xl:w-[40%] shrink-0">
              {/* Project Overview (Standard for >= xl) */}
              <div className="hidden xl:block">
                <h3 className="font-sans text-body font-semibold tracking-tight mb-2 opacity-80 uppercase">Project Overview</h3>
                <div className="pb-2 pt-1 text-mini pl-[5px]">
                  {renderProjectSpecs()}
                </div>
              </div>

              {/* Project Overview (Accordion for < xl) */}
              <div className="block xl:hidden">
                <Accordion title="Project Overview" isDarkMode={isDarkMode} size="sm" defaultOpen={false}>
                  <div className="pb-2 pt-1 text-mini pl-[5px]">
                    {renderProjectSpecs()}
                  </div>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Mobile CTA (shown only on mobile < 1024px) */}
          <div className={`flex lg:hidden flex-col justify-start gap-3 w-full shrink-0 border-t border-space-sparkle/10 pt-4 pb-1 ${isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'}`}>
            <span className="font-sans text-caption font-semibold tracking-tight opacity-80 uppercase text-center">Inspired by this project?</span>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                type="filled"
                label="Schedule discovery"
                href={ROUTES.discoverySession}
                className="font-medium py-2 text-mini flex-1"
              />
              <Button
                type="filled"
                label="Request proposal"
                onClick={() => router.push(ROUTES.contact)}
                className="font-medium py-2 text-mini flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page CTA (Tablet only: md to lg) - Now hidden as tablet stacks like mobile */}
      <div className={`hidden flex-row justify-between items-center w-full shrink-0 border-t border-space-sparkle/10 pt-4 pb-1 mt-auto gap-4 ${isDarkMode ? 'bg-vintage-charcoal' : 'bg-bright-gray'}`}>
        <span className="font-sans text-caption font-semibold tracking-tight opacity-80 uppercase shrink-0">Inspired by this project?</span>
        <div className="flex flex-row gap-3 min-w-[300px] w-auto">
          <Button
            type="filled"
            label="Schedule discovery"
            href={ROUTES.discoverySession}
            className="font-medium py-2 text-mini flex-1"
          />
          <Button
            type="filled"
            label="Request proposal"
            onClick={() => router.push(ROUTES.contact)}
            className="font-medium py-2 text-mini flex-1"
          />
        </div>
      </div>
    </div>
  );
}

const ProjectDetail: React.FC<ProjectDetailProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <ProjectDetailContent {...props} />
    </Suspense>
  );
};

export default function WorksSlugClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const decodedSlug = decodeURIComponent(slug);
    Promise.all([getProjectById(decodedSlug), getMembers(), getProjects()]).then(([proj, mems, allProj]) => {
      setProject(proj || null);
      setMembers(mems);
      setProjects(allProj);
      setIsLoading(false);
    });
  }, [slug]);



  const projectFilter = decodeURIComponent(slug) || 'All';
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

  const { carouselRef, canScrollPrev, canScrollNext, dragHandlers, handleScroll } = useCarouselScroll<HTMLDivElement>({
    resetKey: projectFilter,
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
    <div 
      className="w-full px-4 sm:px-8 select-none flex flex-col flex-1 min-h-0 h-full py-2 sm:py-3 overflow-hidden justify-between space-y-3"
    >
      <div className="flex-1 flex flex-col min-h-0 h-full justify-between space-y-3 sm:space-y-4 w-full overflow-hidden">
        {/* Top Area: Page Title & Subtext in ONE LINE (Aligned Left) + Homepage Carousel Dots */}
        <div className="shrink-0 pb-2 border-b border-space-sparkle/10 flex flex-row items-center justify-between w-full gap-4 overflow-hidden">
          {/* Page Title & Subtext stacked on mobile/tablet, inline on desktop */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-y-1 lg:gap-x-3.5 min-w-0 flex-1 text-left">
            <h2 className="font-sans text-h2 sm:text-h1 font-semibold tracking-tight lowercase shrink-0 leading-none">
              {activeMainCard ? activeMainCard.title : projectFilter.toLowerCase()}
            </h2>
            {/* Desktop tagline */}
            <span className="hidden lg:inline text-caption lg:text-body font-light opacity-80 italic leading-none tracking-wide truncate">
              {activeMainCard ? activeMainCard.tagline : 'a collection of our work'}
            </span>
            {/* Mobile selected Typology */}
            <span className="inline lg:hidden text-caption font-light opacity-80 italic leading-none tracking-wide truncate">
              {projectFilter === 'All' || (activeMainCard && projectFilter === activeMainCard.id)
                ? (activeMainCard ? activeMainCard.tagline : 'a collection of our work')
                : projectFilter}
            </span>
          </div>

          {/* Right: Category Quick-Jump Navigation Tabs */}
          <div className="flex flex-nowrap items-center justify-end gap-1.5 sm:gap-2 shrink-0 self-start md:self-auto overflow-x-auto no-scrollbar max-w-[50%] md:max-w-full">
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
                        ? 'max-w-0 md:max-w-[120px] opacity-0 md:opacity-100 mr-0 md:mr-1.5' 
                        : 'max-w-0 md:group-hover:max-w-[120px] opacity-0 md:group-hover:opacity-100 md:group-hover:mr-1.5'
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

          {/* Typology Category (Sticky on mobile) */}
          <div className={`sticky top-[48px] md:top-auto md:relative z-20 flex flex-row items-center justify-between gap-2.5 pt-2 pb-2 md:pb-0 shrink-0 w-full overflow-hidden ${
            isDarkMode ? 'bg-vintage-charcoal md:bg-transparent' : 'bg-bright-gray md:bg-transparent'
          }`}>
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
                          // Already on the main category "All" view, do nothing.
                          return;
                        } else if (activeMainCard) {
                          setProjectFilter(activeMainCard.id);
                        } else {
                          // We are at the global level and 'All' is clicked, do nothing.
                          return;
                        }
                      } else {
                        setProjectFilter(category);
                      }
                    }}
                    className={`group relative h-8 sm:h-9 min-w-[34px] sm:min-w-[36px] rounded-full overflow-hidden transition-all duration-300 px-2.5 sm:px-3 flex items-center justify-center shrink-0 cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-space-sparkle/30 text-white font-bold border border-white/30'
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
                          ? 'max-w-0 md:max-w-[200px] opacity-0 md:opacity-100 ml-0 md:ml-1.5' 
                          : 'max-w-0 md:group-hover:max-w-[200px] opacity-0 md:group-hover:opacity-100 md:group-hover:ml-1.5'
                      }`}>
                        {category.toLowerCase()}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Two small arrow buttons for carousel navigation */}
            {filteredProjects.length >= 4 && (
              <div className="hidden md:flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <button
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollPrev}
                  aria-label="Previous Projects"
                  className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 cursor-pointer ${
                    !canScrollPrev ? 'opacity-30 cursor-not-allowed' : ''
                  } ${
                    isDarkMode
                      ? 'bg-white/10 text-white hover:bg-white/25 border border-white/15'
                      : 'bg-black/5 text-vintage-charcoal hover:bg-black/15 border border-space-sparkle/15'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollNext}
                  aria-label="Next Projects"
                  className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 cursor-pointer ${
                    !canScrollNext ? 'opacity-30 cursor-not-allowed' : ''
                  } ${
                    isDarkMode
                      ? 'bg-white/10 text-white hover:bg-white/25 border border-white/15'
                      : 'bg-black/5 text-vintage-charcoal hover:bg-black/15 border border-space-sparkle/15'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full flex-1 min-h-0 flex flex-col items-center group/carousel">
            <div
              ref={carouselRef}
              {...dragHandlers}
              className="w-full h-full overflow-y-auto md:overflow-y-hidden md:overflow-x-auto no-scrollbar overscroll-x-contain flex flex-col md:flex-row gap-[2px] items-stretch py-1 cursor-grab active:cursor-grabbing"
              style={{
                '--max-items-desktop': Math.min(filteredProjects.length, 4.5),
                '--max-items-tablet': Math.min(filteredProjects.length, 3.5),
              } as React.CSSProperties}
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  totalProjects={filteredProjects.length}
                  isDarkMode={isDarkMode}
                  onClick={() => {
                    router.push(projectRoute(project.id));
                  }}
                />
              ))}
            </div>
          </div>


        </div>
    </div>
  );
}









