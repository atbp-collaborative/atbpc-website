/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { Shield, Users, FolderKanban } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export type RolesViewMode = 'roles' | 'persons' | 'project-roles';

interface RolesViewTabsProps {
  viewMode: RolesViewMode;
  setViewMode: (mode: RolesViewMode) => void;
  rolesCount: number;
  personsCount: number;
  projectRolesCount: number;
}

export const RolesViewTabs: React.FC<RolesViewTabsProps> = ({
  viewMode,
  setViewMode,
  rolesCount,
  personsCount,
  projectRolesCount,
}) => {
  const { isDarkMode } = useTheme();

  const tabs: {
    key: RolesViewMode;
    label: string;
    icon: React.ElementType;
    count?: number;
    description: string;
  }[] = [
    {
      key: 'roles',
      label: 'By Role',
      icon: Shield,
      count: rolesCount,
      description: 'Roles & assigned persons',
    },
    {
      key: 'persons',
      label: 'By Person',
      icon: Users,
      count: personsCount,
      description: 'Persons & their active roles',
    },
    {
      key: 'project-roles',
      label: 'By Project Role',
      icon: FolderKanban,
      count: projectRolesCount,
      description: 'Roles from the project roles database',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-2">
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-caption transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? isDarkMode
                    ? 'bg-vintage-charcoal text-white shadow-sm font-semibold border border-space-sparkle/40'
                    : 'bg-white text-vintage-charcoal shadow-sm font-semibold border border-black/10'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon
                size={16}
                className={isActive ? 'text-space-sparkle' : 'opacity-70'}
              />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-micro px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-space-sparkle/20 text-space-sparkle'
                      : 'bg-black/10 dark:bg-white/10 opacity-70'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-micro font-mono uppercase tracking-wider opacity-60 self-center hidden md:block">
        {tabs.find((t) => t.key === viewMode)?.description}
      </div>
    </div>
  );
};
