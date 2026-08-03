'use client';

import React from 'react';

interface CtaButtonProps {
  icon: React.ReactNode;
  lines: [string, string];
  title: string;
  onClick: () => void;
  isHeaderTransparent: boolean;
  isDarkMode: boolean;
  variant: 'solid' | 'outline';
  /** Full literal class, e.g. "group-hover:max-w-[140px]" (must be a complete class for Tailwind's scanner to pick it up) */
  expandedMaxWidthClass: string;
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  icon,
  lines,
  title,
  onClick,
  isHeaderTransparent,
  isDarkMode,
  variant,
  expandedMaxWidthClass,
}) => {
  const colorClasses =
    variant === 'solid'
      ? isHeaderTransparent
        ? 'bg-white text-vintage-charcoal hover:bg-white/95'
        : 'bg-space-sparkle text-bright-gray hover:bg-space-sparkle/90'
      : isHeaderTransparent
        ? 'border border-white/50 text-white hover:bg-white/15'
        : isDarkMode
          ? 'border border-bright-gray/30 text-bright-gray hover:bg-white/10'
          : 'border border-space-sparkle/30 text-space-sparkle hover:bg-space-sparkle/10';

  return (
    <button
      onClick={onClick}
      title={title}
      className={`group hidden md:flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-full transition-all duration-300 ease-in-out cursor-pointer select-none shrink-0 overflow-hidden shadow-sm hover:w-auto hover:px-3.5 ${colorClasses}`}
    >
      <div className="flex items-center justify-center">
        <span
          className={`max-w-0 ${expandedMaxWidthClass} opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap flex flex-col items-end text-right text-[9px] font-semibold uppercase tracking-wider leading-tight group-hover:mr-2`}
        >
          <span>{lines[0]}</span>
          <span>{lines[1]}</span>
        </span>
        {icon}
      </div>
    </button>
  );
};
