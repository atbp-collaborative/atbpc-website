'use client';

import React from 'react';
import { Home, FolderKanban } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { ROUTES } from '@/lib/navigation/routes';
import { StatusNoticeView } from '@/components/global/StatusNoticeView';
import { useTheme } from '@/context/ThemeContext';

export default function NotFound() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`fixed inset-0 z-40 overflow-y-auto transition-colors duration-300 ${
        isDarkMode ? 'bg-vintage-charcoal text-bright-gray' : 'bg-bright-gray text-vintage-charcoal'
      }`}
    >
      <StatusNoticeView
        headline="oops.. dead end!"
        subtext="Let's reroute you to something we actually designed, managed, and built."
        actions={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-md">
            <Button
              href={ROUTES.home}
              type="filled"
              className="w-full sm:w-auto !py-2.5 !px-5 text-caption font-medium"
            >
              <Home size={15} className="mr-2 inline" /> Return Home
            </Button>
            <Button
              href={ROUTES.works}
              type="filled"
              className="w-full sm:w-auto !py-2.5 !px-5 text-caption font-medium"
            >
              <FolderKanban size={15} className="mr-2 inline" /> View Works
            </Button>
          </div>
        }
      />
    </div>
  );
}
