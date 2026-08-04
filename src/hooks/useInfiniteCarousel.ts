import { useEffect, useRef, RefObject } from 'react';

interface UseInfiniteCarouselProps {
  displayCount: number;
  originalCount: number;
}

export function useInfiniteCarousel<T extends HTMLElement>({ displayCount, originalCount }: UseInfiniteCarouselProps) {
  const carouselRef = useRef<T>(null);

  useEffect(() => {
    if (carouselRef.current && displayCount > 0 && originalCount > 0) {
      const container = carouselRef.current;
      const singleSetWidth = container.scrollWidth / (displayCount / originalCount);
      container.scrollLeft = singleSetWidth;
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
    if (!carouselRef.current || displayCount === 0 || originalCount === 0) return;
    const container = carouselRef.current;
    const totalWidth = container.scrollWidth;
    const singleSetWidth = totalWidth / (displayCount / originalCount);
    
    if (container.scrollLeft < 30) {
      container.scrollLeft += singleSetWidth;
    } else if (container.scrollLeft >= singleSetWidth * (displayCount / originalCount - 1) - 30) {
      container.scrollLeft -= singleSetWidth;
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
