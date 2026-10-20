/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Check, ChevronDown, Search } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface ComboboxOption {
  id: string;
  label: string;
  sublabel?: string;
  category?: string;
}

interface ComboboxMultiSelectProps {
  options: ComboboxOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ComboboxMultiSelect: React.FC<ComboboxMultiSelectProps> = ({
  options = [],
  selectedIds = [],
  onChange,
  placeholder = '[ Select Options ]',
  searchPlaceholder = 'Search...',
  disabled = false,
  className = '',
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input on dropdown open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Selected option objects
  const selectedOptions = useMemo(() => {
    return selectedIds
      .map((id) => options.find((opt) => opt.id === id || opt.label === id))
      .filter((opt): opt is ComboboxOption => Boolean(opt));
  }, [selectedIds, options]);

  // Filtered dropdown options
  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const matchSearch =
        !q ||
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
        (opt.category && opt.category.toLowerCase().includes(q));
      return matchSearch;
    });
  }, [options, searchQuery]);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeChip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((item) => item !== id));
  };

  const inputClasses = `w-full min-h-[38px] text-caption px-3 py-1.5 rounded-lg border outline-none transition-all flex items-center justify-between cursor-pointer ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white hover:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal hover:border-space-sparkle'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="relative space-y-2" ref={containerRef}>
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && setIsOpen((prev) => !prev);
          }
        }}
        className={inputClasses}
      >
        <span className="opacity-60 text-mini truncate">
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Selected Chips */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-micro font-medium uppercase tracking-wider border transition-colors ${
                isDarkMode
                  ? 'bg-space-sparkle/20 border-space-sparkle/40 text-space-sparkle'
                  : 'bg-space-sparkle/10 border-space-sparkle/30 text-space-sparkle'
              }`}
            >
              <span>{opt.label}</span>
              <button
                type="button"
                onClick={(e) => removeChip(opt.id, e)}
                className="hover:opacity-80 transition-opacity cursor-pointer p-0.5"
                title={`Remove ${opt.label}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border shadow-lg ${
            isDarkMode
              ? 'bg-vintage-charcoal border-white/10 text-white'
              : 'bg-white border-black/10 text-vintage-charcoal'
          }`}
        >
          {/* Search Box */}
          <div className="p-2 border-b border-black/5 dark:border-white/5 sticky top-0 bg-inherit z-10">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-mini pl-8 pr-3 py-1.5 rounded-md border outline-none ${
                  isDarkMode
                    ? 'bg-black/20 border-white/10 text-white placeholder-white/30 focus:border-space-sparkle'
                    : 'bg-black/5 border-black/10 text-vintage-charcoal placeholder-black/30 focus:border-space-sparkle'
                }`}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="p-1 space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleOption(opt.id)}
                    className={`w-full px-3 py-2 rounded text-left text-mini flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-space-sparkle/20 text-space-sparkle'
                          : 'bg-space-sparkle/10 text-space-sparkle font-medium'
                        : isDarkMode
                          ? 'hover:bg-white/5 text-bright-gray'
                          : 'hover:bg-black/5 text-vintage-charcoal'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-micro font-mono opacity-50 uppercase">
                            ({opt.sublabel})
                          </span>
                        )}
                      </div>
                      {opt.category && (
                        <span className="text-micro opacity-40 block capitalize">
                          {opt.category}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check size={14} className="shrink-0 text-space-sparkle" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-micro opacity-50">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
