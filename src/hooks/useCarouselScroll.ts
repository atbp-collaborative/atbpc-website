import { useCallback, useEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD = 5;

interface UseCarouselScrollOptions {
  // When this value changes (e.g. the active filter), the carousel jumps
  // back to the start and re-measures its scroll bounds. Needed because a
  // shrinking item count changes scrollWidth without changing the
  // container's own size, which ResizeObserver alone wouldn't catch.
  resetKey?: unknown;
}

// Native-scroll carousel controls: bounded (non-looping) prev/next buttons,
// shift+wheel horizontal scroll, and mouse drag-to-scroll. Replaces the old
// clone-and-teleport infinite-scroll approach.
export function useCarouselScroll<T extends HTMLElement>({ resetKey }: UseCarouselScrollOptions = {}) {
  const [node, setNode] = useState<T | null>(null);
  const carouselRef = useCallback((el: T | null) => setNode(el), []);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setCanScrollPrev(node.scrollLeft > 1);
    setCanScrollNext(node.scrollLeft < max - 1);
  }, [node]);

  // Re-measure when the node mounts/resizes or the user scrolls it.
  useEffect(() => {
    if (!node) return;
    updateScrollState();

    const onScroll = () => updateScrollState();
    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    };

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(node);
    // ResizeObserver only reports the container's own box size, not its
    // scrollWidth — a child count change (e.g. cards mounting once a
    // JS-measured width becomes available) needs this to be caught too.
    const mutationObserver = new MutationObserver(updateScrollState);
    mutationObserver.observe(node, { childList: true, subtree: true });
    node.addEventListener('scroll', onScroll, { passive: true });
    // Non-passive so shift+wheel can preventDefault the page's default scroll.
    node.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      node.removeEventListener('scroll', onScroll);
      node.removeEventListener('wheel', onWheel);
    };
  }, [node, updateScrollState]);

  // Content (e.g. filter) changed: jump back to the start rather than
  // leaving the view scrolled into what may now be out-of-range content.
  useEffect(() => {
    if (!node) return;
    node.scrollLeft = 0;
    updateScrollState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, resetKey]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!node) return;
    const child = node.firstElementChild as HTMLElement | null;
    const amount = (child ? child.getBoundingClientRect().width + 2 : 380) * (direction === 'left' ? -1 : 1);
    node.scrollBy({ left: amount, behavior: 'smooth' });
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
  }, [node]);

  // Tracks an in-progress mouse drag so a real drag can both scroll the
  // container and suppress the click it would otherwise leave behind on
  // release. Held in a ref (not state/plain vars) since it must survive the
  // re-render that setIsDragging triggers mid-drag, and updates need to be
  // read synchronously by the very next pointermove/click.
  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });

  const handlePointerDown = (e: React.PointerEvent<T>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !node) return;
    drag.current = { active: true, startX: e.clientX, startScrollLeft: node.scrollLeft, moved: false };
    setIsDragging(true);
    // No setPointerCapture here: capturing immediately makes the browser
    // retarget the click event a plain click ends in (per the Pointer
    // Events spec) to this container instead of whatever's under the
    // cursor, silently swallowing clicks on card links. Capture is only
    // acquired once a real drag is confirmed, below.
  };

  const handlePointerMove = (e: React.PointerEvent<T>) => {
    if (!drag.current.active || !node) return;
    const delta = e.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(delta) > DRAG_THRESHOLD) {
      drag.current.moved = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Ignore: capture can fail if the pointer is no longer active.
      }
    }
    if (drag.current.moved) {
      node.scrollLeft = drag.current.startScrollLeft - delta;
    }
  };

  const endDrag = (e: React.PointerEvent<T>) => {
    drag.current.active = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore: capture may already be released or was never acquired.
    }
  };

  const handleClickCapture = (e: React.MouseEvent<T>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return {
    carouselRef,
    canScrollPrev,
    canScrollNext,
    isDragging,
    handleScroll,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture: handleClickCapture,
    },
  };
}
