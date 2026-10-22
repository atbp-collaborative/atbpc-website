/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface ComboboxSelectOption {
  id: string;
  label: string;
  sublabel?: string;
  category?: string;
}

interface ComboboxSelectProps {
  options: ComboboxSelectOption[];
  value: string;
  onChange: (value: string, option?: ComboboxSelectOption) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export const ComboboxSelect: React.FC<ComboboxSelectProps> = ({
  options = [],
  value = '',
  onChange,
  placeholder = '[ Select Option ]',
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

  // Selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.id === value || opt.label === value);
  }, [options, value]);

  // Filtered dropdown options
  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return options;
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchSublabel = opt.sublabel && opt.sublabel.toLowerCase().includes(q);
      const matchCat = opt.category && opt.category.toLowerCase().includes(q);
      return matchLabel || matchSublabel || matchCat;
    });
  }, [options, searchQuery]);

  // Group options by category if provided
  const groupedOptions = useMemo(() => {
    const groups: { [cat: string]: ComboboxSelectOption[] } = {};
    const uncat: ComboboxSelectOption[] = [];

    filteredOptions.forEach((opt) => {
      if (opt.category) {
        if (!groups[opt.category]) groups[opt.category] = [];
        groups[opt.category].push(opt);
      } else {
        uncat.push(opt);
      }
    });

    return { groups, uncat };
  }, [filteredOptions]);

  const handleSelect = (option: ComboboxSelectOption) => {
    onChange(option.id, option);
    setSearchQuery(''); // Clear the search field immediately on selection
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const inputClasses = `w-full min-h-[38px] text-caption px-3 py-1.5 rounded-lg border outline-none transition-all flex items-center justify-between cursor-pointer ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white hover:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal hover:border-space-sparkle'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className={inputClasses}
      >
        <div className="flex items-center gap-2 truncate flex-1 mr-2">
          {selectedOption ? (
            <span className="truncate font-medium text-caption">
              {selectedOption.label}
              {selectedOption.sublabel && (
                <span className="opacity-60 text-micro font-mono ml-1.5">
                  ({selectedOption.sublabel})
                </span>
              )}
            </span>
          ) : (
            <span className="opacity-40 select-none text-caption">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-60">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:opacity-100 hover:text-red-400 transition-colors"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 ${
            isDarkMode
              ? 'bg-vintage-charcoal border-white/15 text-bright-gray'
              : 'bg-white border-black/15 text-vintage-charcoal'
          }`}
        >
          {/* Search Input Box */}
          <div className="p-2 border-b border-black/5 dark:border-white/5 relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full text-caption pl-8 pr-3 py-1.5 rounded-lg border outline-none ${
                isDarkMode
                  ? 'border-white/10 bg-white/5 text-white placeholder-white/40 focus:border-space-sparkle'
                  : 'border-black/10 bg-black/5 text-vintage-charcoal placeholder-black/40 focus:border-space-sparkle'
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-micro opacity-50">
                No matching roles found
              </div>
            ) : (
              <>
                {/* Categorized groups */}
                {Object.entries(groupedOptions.groups).map(([cat, opts]) => (
                  <div key={cat} className="space-y-0.5">
                    <div className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider opacity-50 font-semibold">
                      {cat}
                    </div>
                    {opts.map((opt) => {
                      const isSelected = opt.id === value || opt.label === value;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelect(opt)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-caption cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-space-sparkle text-white font-medium'
                              : isDarkMode
                              ? 'hover:bg-white/10'
                              : 'hover:bg-black/5'
                          }`}
                        >
                          <div className="flex flex-col truncate pr-2">
                            <span className="truncate">{opt.label}</span>
                            {opt.sublabel && (
                              <span
                                className={`text-[10px] font-mono ${
                                  isSelected ? 'text-white/80' : 'opacity-50'
                                }`}
                              >
                                {opt.sublabel}
                              </span>
                            )}
                          </div>
                          {isSelected && <Check size={14} className="shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Uncategorized options */}
                {groupedOptions.uncat.map((opt) => {
                  const isSelected = opt.id === value || opt.label === value;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(opt)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-caption cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-space-sparkle text-white font-medium'
                          : isDarkMode
                          ? 'hover:bg-white/10'
                          : 'hover:bg-black/5'
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span
                            className={`text-[10px] font-mono ${
                              isSelected ? 'text-white/80' : 'opacity-50'
                            }`}
                          >
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check size={14} className="shrink-0" />}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
