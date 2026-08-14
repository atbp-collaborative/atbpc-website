'use client';

import React from 'react';
import Link from 'next/link';

interface CtaButtonProps {
  icon?: React.ReactNode;
  lines: [string, string];
  title?: string;
  href: string;
  /** Optional extra handler, e.g. closing the mobile drawer on navigate. Fires alongside the Link navigation. */
  onClick?: () => void;
  isHeaderTransparent?: boolean;
  isDarkMode: boolean;
  variant: 'solid' | 'outline';
  /** 'pill' = desktop icon button that expands to reveal text on hover. 'full' = mobile full-width block with text always visible. */
  layout?: 'pill' | 'full';
  /** Full literal class, e.g. "group-hover:max-w-[140px]" — required for layout="pill" (must be a complete class for Tailwind's scanner to pick it up) */
  expandedMaxWidthClass?: string;
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  icon,
  lines,
  title,
  href,
  onClick,
  isHeaderTransparent = false,
  isDarkMode,
  variant,
  layout = 'pill',
  expandedMaxWidthClass = '',
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

  // Pill (desktop) always has a shadow; full-width (mobile) only shadows the solid variant.
  const shadowClass = layout === 'pill' || variant === 'solid' ? 'shadow-sm' : '';

  if (layout === 'full') {
    return (
      <Link
        href={href}
        onClick={onClick}
        title={title}
        className={`w-full flex flex-col items-center justify-center py-2 px-4 rounded-none font-sans font-semibold text-caption uppercase tracking-wider leading-tight transition-all cursor-pointer text-center ${shadowClass} ${colorClasses}`}
      >
        <span>{lines[0]}</span>
        <span>{lines[1]}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      title={title}
      className={`group hidden md:flex items-center justify-center min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-0 hover:px-3.5 rounded-full transition-all duration-[700ms] delay-300 hover:delay-0 ease-in-out cursor-pointer select-none shrink-0 overflow-hidden ${shadowClass} ${colorClasses}`}
    >
      <div className="flex items-center justify-center">
        <span
          className={`max-w-0 ${expandedMaxWidthClass} opacity-0 group-hover:opacity-100 transition-all duration-[700ms] delay-300 group-hover:delay-0 ease-out overflow-hidden whitespace-nowrap flex flex-col items-end text-right font-sans text-micro font-semibold uppercase tracking-wider leading-tight group-hover:mr-2`}
        >
          <span>{lines[0]}</span>
          <span>{lines[1]}</span>
        </span>
        {icon}
      </div>
    </Link>
  );
};
