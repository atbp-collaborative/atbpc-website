/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { RoleCategoryFilter, RoleTrackFilter } from '@/hooks/admin/useAdminRoles';
import { RoleCategory, RoleTrack } from '@/types';

interface RolesFilterBarProps {
  categoryFilter: RoleCategoryFilter;
  setCategoryFilter: (cat: RoleCategoryFilter) => void;
  trackFilter: RoleTrackFilter;
  setTrackFilter: (track: RoleTrackFilter) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryCounts: Record<RoleCategoryFilter, number>;
  trackCounts: Record<RoleTrackFilter, number>;
}

export const RolesFilterBar: React.FC<RolesFilterBarProps> = ({
  categoryFilter,
  setCategoryFilter,
  trackFilter,
  setTrackFilter,
  searchTerm,
  setSearchTerm,
  categoryCounts,
  trackCounts,
}) => {
  const { isDarkMode } = useTheme();

  const categories: { key: RoleCategoryFilter; label: string }[] = [
    { key: 'all', label: 'All Categories' },
    { key: 'designers', label: 'Designers' },
    { key: 'managers', label: 'Managers' },
    { key: 'builders', label: 'Builders' },
  ];

  const tracks: { key: RoleTrackFilter; label: string }[] = [
    { key: 'all', label: 'All Tracks' },
    { key: 'professionals', label: 'Professionals' },
    { key: 'internship', label: 'Internship / Apprenticeship' },
  ];

  const hasActiveFilters = categoryFilter !== 'all' || trackFilter !== 'all' || searchTerm !== '';

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setTrackFilter('all');
    setSearchTerm('');
  };

  return (
    <div
      className={`p-4 rounded-xl border space-y-4 ${
        isDarkMode
          ? 'bg-vintage-charcoal/60 border-white/10'
          : 'bg-white border-black/10 shadow-xs'
      }`}
    >
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles, codes (e.g. HRDT-03), departments, or persons..."
            className={`w-full pl-10 pr-9 py-2.5 rounded-lg border text-caption outline-none transition-all ${
              isDarkMode
                ? 'bg-vintage-charcoal/80 border-bright-gray/20 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
                : 'bg-white border-vintage-charcoal/20 text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-micro font-mono uppercase tracking-wider transition-colors shrink-0 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/15 text-white/80'
                : 'bg-black/5 hover:bg-black/10 text-vintage-charcoal'
            }`}
          >
            <X size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* Filter Chips Groups */}
      <div className="space-y-3 pt-1 border-t border-black/5 dark:border-white/5">
        {/* Career Track Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-micro font-mono uppercase tracking-wider opacity-60 flex items-center gap-1 mr-1">
            <Filter size={12} /> Career Track:
          </span>
          {tracks.map((track) => {
            const isSelected = trackFilter === track.key;
            const count = trackCounts[track.key] ?? 0;
            return (
              <button
                key={track.key}
                onClick={() => setTrackFilter(track.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-caption transition-all cursor-pointer ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-purple-600/90 text-white shadow-xs font-medium'
                      : 'bg-purple-700 text-white shadow-xs font-medium'
                    : isDarkMode
                    ? 'bg-white/5 text-bright-gray/70 hover:bg-white/10 hover:text-white border border-white/5'
                    : 'bg-black/5 text-vintage-charcoal/70 hover:bg-black/10 hover:text-vintage-charcoal border border-black/5'
                }`}
              >
                <span>{track.label}</span>
                <span
                  className={`text-micro px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isDarkMode
                      ? 'bg-white/10 text-bright-gray/60'
                      : 'bg-black/10 text-vintage-charcoal/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-micro font-mono uppercase tracking-wider opacity-60 flex items-center gap-1 mr-1">
            <Filter size={12} /> Role Category:
          </span>
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat.key;
            const count = categoryCounts[cat.key] ?? 0;
            return (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-caption transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-space-sparkle text-white shadow-xs font-medium'
                    : isDarkMode
                    ? 'bg-white/5 text-bright-gray/70 hover:bg-white/10 hover:text-white border border-white/5'
                    : 'bg-black/5 text-vintage-charcoal/70 hover:bg-black/10 hover:text-vintage-charcoal border border-black/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-micro px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isDarkMode
                      ? 'bg-white/10 text-bright-gray/60'
                      : 'bg-black/10 text-vintage-charcoal/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
