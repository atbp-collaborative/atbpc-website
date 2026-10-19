/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { AtbpLogo } from '@/components/global/AtbpLogo';
import { ROUTES } from '@/lib/navigation/routes';

interface DraftNoticeProps {
  pageTitle: string;
  subtitle?: string;
}

export const DraftNotice: React.FC<DraftNoticeProps> = ({ pageTitle, subtitle }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex-1 w-full min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center select-none animate-fadeIn">
      <div className="max-w-xl flex flex-col items-center space-y-6">
        <AtbpLogo isDarkMode={isDarkMode} className="h-9 w-auto opacity-80 mb-2" />

        <div className="space-y-2">
          <p className="text-micro sm:text-caption tracking-widest uppercase opacity-50 font-light">
            Studio Section Notice
          </p>
          <h1 className="text-2xl sm:text-4xl font-serif font-light tracking-wide lowercase">
            {pageTitle}
          </h1>
          {subtitle && (
            <p className="text-caption sm:text-subtext font-light opacity-60 max-w-md mx-auto italic">
              "{subtitle}"
            </p>
          )}
        </div>

        <div className="w-12 h-px bg-space-sparkle/30 my-2" />

        <p className="text-caption sm:text-subtext font-light opacity-75 max-w-md leading-relaxed">
          This section is currently in draft mode and undergoing updates by ATBP Collaborative.
          Please check back shortly or explore our completed works.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href={ROUTES.home}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-caption tracking-wider uppercase transition-all duration-300 border ${
              isDarkMode
                ? 'border-space-sparkle/40 hover:bg-white/10 text-bright-gray'
                : 'border-space-sparkle/30 hover:bg-vintage-charcoal/10 text-vintage-charcoal'
            }`}
          >
            <ArrowLeft size={16} />
            Return Home
          </Link>

          <Link
            href={ROUTES.works}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-caption tracking-wider uppercase transition-all duration-300 ${
              isDarkMode
                ? 'bg-bright-gray text-vintage-charcoal hover:bg-white'
                : 'bg-vintage-charcoal text-bright-gray hover:bg-black'
            }`}
          >
            <Compass size={16} />
            Explore Works
          </Link>
        </div>
      </div>
    </div>
  );
};
