import React from 'react';

interface SnakeBorderProps {
  active: boolean;
  /** Corner radius in px — should match the wrapped element's border-radius (rounded-xl = 12px). */
  radius?: number;
}

const SEGMENT_COUNT = 10;
const DURATION_S = 3;

/**
 * A chain of dots that continuously loops around its parent's own border shape
 * (via CSS offset-path, so it always hugs the parent's real rendered size —
 * no manual box-size math). Renders nothing once `active` is false.
 *
 * `img, canvas, video, svg { pointer-events: none !important }` is set globally
 * in globals.css for screenshot protection, so this is built with plain <span>s
 * rather than an SVG overlay.
 */
export const SnakeBorder: React.FC<SnakeBorderProps> = ({ active, radius = 12 }) => {
  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
        const delay = -((i * DURATION_S) / SEGMENT_COUNT);
        const fade = 1 - i / SEGMENT_COUNT;
        return (
          <span
            key={i}
            className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-space-sparkle"
            style={{
              offsetPath: `inset(0 round ${radius}px)`,
              offsetDistance: '0%',
              animation: `snake-move ${DURATION_S}s linear infinite`,
              animationDelay: `${delay}s`,
              opacity: 0.2 + fade * 0.8,
            }}
          />
        );
      })}
    </div>
  );
};
