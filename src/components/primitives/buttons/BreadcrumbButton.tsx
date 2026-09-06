'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbButtonProps {
  label: string;
  className?: string;
  /** Fixed destination — renders a real Link. Use onClick instead when the target depends on browser history (e.g. router.back()). */
  href?: string;
  onClick?: () => void;
}

export const BreadcrumbButton: React.FC<BreadcrumbButtonProps> = ({
  label,
  href,
  onClick,
  className = '',
}) => {
  const innerClassName = "flex items-center space-x-2 text-caption uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer";

  return (
    <div className={`flex items-center justify-start gap-4 shrink-0 ${className}`}>
      {href ? (
        <Link href={href} onClick={onClick} className={innerClassName}>
          <ChevronLeft size={16} />
          <span>{label}</span>
        </Link>
      ) : (
        <button onClick={onClick} className={innerClassName}>
          <ChevronLeft size={16} />
          <span>{label}</span>
        </button>
      )}
    </div>
  );
};
