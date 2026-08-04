import { useEffect, useRef, RefObject } from 'react';

interface UseInfiniteCarouselProps {
  displayCount: number;
  originalCount: number;
}

export function useInfiniteCarousel<T extends HTMLElement>({ displayCount, originalCount }: UseInfiniteCarouselProps) {
  const carouselRef = useRef<T>(null);
  const isAdjustingRef = useRef(false);

  useEffect(() => {
    if (carouselRef.current && displayCount > 0 && originalCount > 0) {
      const container = carouselRef.current;
      const totalWidth = container.scrollWidth;
      const sets = Math.round(displayCount / originalCount);
      const singleSetWidth = totalWidth / sets;
      const middleSet = Math.floor(sets / 2);
      container.scrollLeft = singleSetWidth * middleSet;
    }
  }, [displayCount, originalCount]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const child = container.firstElementChild as HTMLElement;
      const scrollAmount = (child ? child.getBoundingClientRect().width + 2 : 380) * (direction === 'left' ? -1 : 1);
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current || displayCount === 0 || originalCount === 0 || isAdjustingRef.current) return;
    const container = carouselRef.current;
    const totalWidth = container.scrollWidth;
    const sets = Math.round(displayCount / originalCount);
    if (sets <= 1) return;

    const singleSetWidth = totalWidth / sets;
    const threshold = 50;

    if (container.scrollLeft <= threshold) {
      isAdjustingRef.current = true;
      container.scrollLeft += singleSetWidth * Math.floor(sets / 2);
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    } else if (container.scrollLeft >= totalWidth - container.clientWidth - threshold) {
      isAdjustingRef.current = true;
      container.scrollLeft -= singleSetWidth * Math.floor(sets / 2);
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handleScroll('left');
      } else if (e.key === 'ArrowRight') {
        handleScroll('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    carouselRef,
    handleScroll,
    handleCarouselScroll,
  };
}
