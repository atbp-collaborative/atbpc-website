/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PublicationToggleProps {
  isDraft: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const PublicationToggle: React.FC<PublicationToggleProps> = ({
  isDraft,
  onToggle,
  showIcon = true,
  size = 'md',
  disabled = false,
}) => {
  const isSm = size === 'sm';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onToggle(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={isDraft ? 'Click to Publish' : 'Click to hide as Draft'}
      className={`inline-flex items-center gap-1.5 font-medium tracking-wide transition-all rounded-full border cursor-pointer select-none ${
        isSm ? 'px-2 py-0.5 text-micro' : 'px-3 py-1 text-mini'
      } ${
        isDraft
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isDraft ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
        }`}
      />
      {showIcon && (
        <span>
          {isDraft ? <EyeOff size={isSm ? 10 : 12} /> : <Eye size={isSm ? 10 : 12} />}
        </span>
      )}
      <span className="uppercase tracking-wider">{isDraft ? 'Draft' : 'Published'}</span>
    </button>
  );
};
