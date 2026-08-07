'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, X, Play, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Project, Member } from '../types';
import { useTheme } from '../lib/theme-context';
import { ROUTES, memberRoute } from '../lib/routes';
import { Button } from './Button';
import { Accordion } from './Accordion';
import { BreadcrumbButton } from './BreadcrumbButton';
import { isUnsplashUrl, unsplashLoader } from '../lib/imageLoaders';

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
  const searchParams = useSearchParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const fromParam = searchParams.get('from') || searchParams.get('filter');
  const filterName = fromParam || project.subcategory || project.mainCategory || project.category || 'All Works';
  const isAllWorks = filterName === 'All' || filterName === 'All Works' || filterName === 'works';
  const backLabel = isAllWorks ? 'Back to all works' : `Back to ${filterName}`;
  const backHref = isAllWorks ? ROUTES.works : `${ROUTES.works}/${encodeURIComponent(filterName)}`;

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
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [coords, setCoords] = useState({
    columnLeft: 0,
    columnTop: 0,
    columnWidth: 0,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
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

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    if (columnRef.current) {
      observer.observe(columnRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      observer.disconnect();
    };
  }, []);

  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set());

  // Reset slide index when project changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setLoadedSlides(new Set());
  }, [project.id]);

  // Auto-scroll image/video carousel every 5 seconds (stops at the last image / penultimate item if there's a video)
  useEffect(() => {
    const hasVideo = mediaItems.some(item => item.type === 'video');
    const lastImageIndex = hasVideo ? mediaItems.length - 2 : mediaItems.length - 1;

    if (currentSlideIndex >= lastImageIndex || mediaItems[currentSlideIndex]?.type === 'video') {
      return;
    }

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlideIndex((prev) => {
        if (prev < lastImageIndex) {
          return prev + 1;
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlideIndex, mediaItems]);

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setCurrentSlideIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setCurrentSlideIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
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
  }, [mediaItems.length]);

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

  return (
    <motion.div 
      id={`project-detail-${project.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full px-4 sm:px-8 py-2 select-none flex flex-col flex-1 min-h-0 h-full justify-between ${isVideoActive && isDesktop ? '' : 'overflow-hidden'}`}
    >
      <BreadcrumbButton
        label={backLabel}
        href={backHref}
      />

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pb-1 ${isVideoActive && isDesktop ? '' : 'overflow-hidden'}`}>
        
        {/* Carousel & CTA Container */}
        <div ref={columnRef} className={`lg:col-span-7 lg:order-2 flex flex-col justify-between h-full min-h-0 space-y-3 ${isVideoActive && isDesktop ? '' : 'overflow-hidden'}`}>
          
          <div className={`space-y-3 w-full relative flex-1 min-h-0 flex flex-col justify-center ${isVideoActive && isDesktop ? '' : 'overflow-hidden'}`}>
            <AnimatePresence>
              {isVideoActive && isDesktop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[100] cursor-pointer backdrop-blur-sm bg-black/85"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(0);
                  }}
                />
              )}
            </AnimatePresence>

            <div className="relative aspect-video w-full max-h-full">
              <motion.div 
                className="absolute inset-0 overflow-hidden bg-black/10 rounded-lg group flex items-center justify-center cursor-default"
                animate={{
                  width: isVideoActive && isDesktop ? targetWidth : '100%',
                  height: isVideoActive && isDesktop ? targetHeight : '100%',
                  x: isVideoActive && isDesktop ? xRelative : 0,
                  y: isVideoActive && isDesktop ? yRelative : 0,
                  zIndex: isVideoActive && isDesktop ? 110 : 10,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 120, mass: 0.9 }}
              >
                {mediaItems[currentSlideIndex].type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                    {(() => {
                      const embedUrl = getYouTubeEmbedUrl(mediaItems[currentSlideIndex].url);
                      if (embedUrl) {
                        return (
                          <iframe
                            src={embedUrl}
                            title="Project Video"
                            className="w-full h-full border-0"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      }
                      return (
                        <video 
                          src={mediaItems[currentSlideIndex].url}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          playsInline
                        />
                      );
                    })()}
                    {/* Premium Duration Indicator Badge */}
                    {mediaItems[currentSlideIndex].duration && !(isVideoActive && isDesktop) && (
                      <div className="absolute top-4 left-4 bg-black/60 text-white text-micro font-sans tracking-widest uppercase py-1 px-2.5 rounded backdrop-blur-sm z-10 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>VIDEO • {mediaItems[currentSlideIndex].duration}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-full overflow-hidden bg-black/5">
                    {!loadedSlides.has(currentSlideIndex) && (
                      <div className="absolute inset-0 bg-neutral-400/20 animate-pulse" />
                    )}
                    <AnimatePresence initial={false} custom={direction}>
                      <MotionImage
                        key={currentSlideIndex}
                        custom={direction}
                        src={mediaItems[currentSlideIndex].url}
                        alt={`${project.title} slide ${currentSlideIndex + 1}`}
                        fill
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        loader={isUnsplashUrl(mediaItems[currentSlideIndex].url) ? unsplashLoader : undefined}
                        className="object-cover"
                        onLoad={() => setLoadedSlides((prev) => new Set(prev).add(currentSlideIndex))}
                        initial={{ x: direction > 0 ? '100%' : '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: direction > 0 ? '-100%' : '100%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </AnimatePresence>
                  </div>
                )}
                
                {/* Left/Right Buttons */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                >
                  <ChevronLeft size={20} />
                </button>
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
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

          {/* Specific CTA for project view */}
          <div className="pt-2 border-t border-space-sparkle/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full text-center sm:text-left shrink-0">
            <div className="w-full sm:w-auto">
              <span className="text-micro font-archivo uppercase tracking-widest opacity-50 block">Inspired by this build?</span>
              <span className="text-mini font-semibold">Qualify your project with us today</span>
            </div>
            <Button
              type="filled"
              label="Start Consultation"
              href={ROUTES.discoverySession}
              fullWidth={true}
              className="sm:w-auto font-medium py-1.5 text-mini"
            />
          </div>

        </div>

        {/* High-End Architectural Writeup & Specs */}
        <div className="lg:col-span-5 lg:order-1 flex flex-col justify-between h-full min-h-0 overflow-hidden space-y-2 py-0.5">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-mini uppercase tracking-widest font-sans text-vintage-charcoal/60 dark:text-bright-gray/60 shrink-0">
              <span className="font-medium">
                {project.year}
              </span>
              <span className="opacity-60 select-none">•</span>
              <span className="font-medium">
                {project.category}
              </span>
              <span className="opacity-60 select-none">•</span>
              <span className="font-medium">
                {project.status}
              </span>
            </div>

            <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight shrink-0">
              {project.title}
            </h1>

            <div className="flex items-center space-x-2 text-mini font-sans opacity-60 shrink-0">
              <MapPin size={12} />
              <span>{project.location}</span>
            </div>

            {/* Scrollable container for project full writeup */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1.5">
              <p className="text-caption sm:text-body leading-relaxed font-light opacity-90 whitespace-pre-line text-justify">
                {project.fullWriteup}
              </p>
            </div>

            {/* Project Overview Accordion */}
            <Accordion key={`overview-${project.id}`} title="Project Overview" isDarkMode={isDarkMode} size="sm" className="shrink-0">
              <div className="pb-2 pt-1 text-mini pl-[30px] max-h-[220px] overflow-y-auto">
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
              </div>
            </Accordion>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export const ProjectDetail: React.FC<ProjectDetailProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <ProjectDetailContent {...props} />
    </Suspense>
  );
};
