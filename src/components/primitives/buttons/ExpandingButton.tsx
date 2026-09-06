'use client';

import React from 'react';
import Link from 'next/link';

export interface ExpandingButtonProps {
  icon?: React.ReactNode;
  /** Pass either a single line of text or two lines */
  text?: string;
  lines?: [string, string];
  title?: string;
  /** If provided, renders as Link. Otherwise button */
  href?: string;
  onClick?: (e?: any) => void;
  isHeaderTransparent?: boolean;
  isDarkMode?: boolean;
  variant?: 'solid' | 'outline' | 'custom';
  /** 'pill' = expanding icon, 'full' = stacked text, 'collapse' = starts expanded and collapses on hover */
  layout?: 'pill' | 'full' | 'collapse';
  /** e.g. "group-hover:max-w-[140px]" for pill, or "max-w-[100px]" for collapse */
  expandedMaxWidthClass?: string;
  className?: string;
}

export const ExpandingButton: React.FC<ExpandingButtonProps> = ({
  icon,
  text,
  lines,
  title,
  href,
  onClick,
  isHeaderTransparent = false,
  isDarkMode = false,
  variant = 'solid',
  layout = 'pill',
  expandedMaxWidthClass = '',
  className = '',
}) => {
  let colorClasses = '';
  if (variant === 'solid') {
    colorClasses = isHeaderTransparent
      ? 'bg-white text-vintage-charcoal hover:bg-white/95'
      : 'bg-space-sparkle text-bright-gray hover:bg-space-sparkle/90';
  } else if (variant === 'outline') {
    colorClasses = isHeaderTransparent
      ? 'border border-white/50 text-white hover:bg-white/15'
      : isDarkMode
        ? 'border border-bright-gray/30 text-bright-gray hover:bg-white/10'
        : 'border border-space-sparkle/30 text-space-sparkle hover:bg-space-sparkle/10';
  }

  const shadowClass = layout === 'pill' || variant === 'solid' ? 'shadow-sm' : '';

  const renderContent = () => {
    if (layout === 'full') {
      return (
        <>
          {lines ? (
            <>
              <span>{lines[0]}</span>
              <span>{lines[1]}</span>
            </>
          ) : (
            <span>{text}</span>
          )}
        </>
      );
    }

    if (layout === 'collapse') {
      return (
        <>
          <span
            className={`${expandedMaxWidthClass} mr-2 group-hover:max-w-0 group-hover:mr-0 overflow-hidden text-micro font-archivo uppercase tracking-widest font-bold whitespace-nowrap opacity-100 group-hover:opacity-0 transition-all duration-300 select-none`}
          >
            {text}
          </span>
          {icon}
        </>
      );
    }

    // layout === 'pill'
    return (
      <div className="flex items-center justify-center">
        <span
          className={`max-w-0 ${expandedMaxWidthClass} opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 group-hover:delay-0 ease-out overflow-hidden whitespace-nowrap flex flex-col items-end text-right font-sans text-micro font-semibold uppercase tracking-wider leading-tight group-hover:mr-2`}
        >
          {lines ? (
            <>
              <span>{lines[0]}</span>
              <span>{lines[1]}</span>
            </>
          ) : (
            <span>{text}</span>
          )}
        </span>
        {icon}
      </div>
    );
  };

  const getContainerClasses = () => {
    if (layout === 'full') {
      return `w-full flex flex-col items-center justify-center py-2 px-4 rounded-none font-sans font-semibold text-caption uppercase tracking-wider leading-tight transition-all cursor-pointer text-center ${shadowClass} ${colorClasses} ${className}`;
    }
    if (layout === 'collapse') {
      return `group flex items-center justify-center h-9 pl-3 pr-2.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer select-none shrink-0 ${shadowClass} ${colorClasses} ${className}`;
    }
    // pill
    return `group hidden md:flex items-center justify-center min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-0 hover:px-3.5 rounded-full transition-all duration-[700ms] delay-300 hover:delay-0 ease-in-out cursor-pointer select-none shrink-0 overflow-hidden ${shadowClass} ${colorClasses} ${className}`;
  };

  if (href) {
    return (
      <Link href={href} onClick={onClick} title={title} className={getContainerClasses()}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} title={title} className={getContainerClasses()}>
      {renderContent()}
    </button>
  );
};
