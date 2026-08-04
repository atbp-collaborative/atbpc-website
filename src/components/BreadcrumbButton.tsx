'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const BreadcrumbButton: React.FC<BreadcrumbButtonProps> = ({
  label,
  onClick,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-start gap-4 shrink-0 mb-4 sm:mb-5 ${className}`}>
      <button
        onClick={onClick}
        className="flex items-center space-x-2 text-caption uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft size={16} />
        <span>{label}</span>
      </button>
    </div>
  );
};
