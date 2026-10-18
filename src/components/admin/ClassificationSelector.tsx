/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { MemberCategory } from '@/types';

interface ClassificationSelectorProps {
  selected: MemberCategory[];
  onChange: (categories: MemberCategory[]) => void;
  className?: string;
}

const CLASSIFICATIONS: { key: MemberCategory; label: string; desc: string }[] = [
  { key: 'designers', label: 'Designers', desc: 'Architects, Interior Designers, BIM' },
  { key: 'managers', label: 'Managers', desc: 'Project Leads, HR, Client Relations' },
  { key: 'builders', label: 'Builders', desc: 'Site Engineers, Construction Supervisors' },
];

export const ClassificationSelector: React.FC<ClassificationSelectorProps> = ({
  selected = [],
  onChange,
  className = '',
}) => {
  const toggle = (cat: MemberCategory) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-caption font-semibold opacity-90">
          Professional Classifications <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {CLASSIFICATIONS.map(({ key, label, desc }) => {
          const isChecked = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`p-3 text-left rounded-lg border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isChecked
                  ? 'border-space-sparkle bg-space-sparkle/10 dark:bg-space-sparkle/20 ring-1 ring-space-sparkle'
                  : 'border-black/10 dark:border-white/10 bg-transparent hover:border-black/20 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold text-caption uppercase tracking-wider">{label}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-space-sparkle text-white'
                      : 'border border-black/30 dark:border-white/30'
                  }`}
                >
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </div>
              </div>
              <p className="text-micro opacity-60 leading-tight">{desc}</p>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-micro text-amber-500 font-light">
          Note: At least one classification is recommended so this member appears on category pages.
        </p>
      )}
    </div>
  );
};
