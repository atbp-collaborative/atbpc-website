'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, FolderKanban, Users } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import { ROUTES } from '@/lib/navigation/routes';

export default function NotFound() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-8 text-center select-none transition-colors duration-300 ${
        isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
      }`}
    >
      <div className="max-w-md w-full space-y-6">
        {/* Monogram / Brand Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-space-sparkle text-bright-gray flex items-center justify-center font-bold text-micro tracking-tighter shadow-md">
            ATBP
          </div>
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
            404 • Page Not Found
          </span>
          <h1 className="text-h1 sm:text-[2.5rem] font-major font-bold tracking-tight lowercase">
            structure not found
          </h1>
          <p className="text-caption sm:text-mini font-light opacity-75 max-w-sm mx-auto leading-relaxed">
            The page or project blueprint you are looking for has been relocated, archived, or does not exist.
          </p>
        </div>

        {/* Quick Nav Options */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={ROUTES.home} className="w-full sm:w-auto">
            <Button type="filled" className="w-full !py-2.5 !px-5 text-caption font-medium">
              <Home size={15} className="mr-2 inline" /> Return Home
            </Button>
          </Link>
          <Link href={ROUTES.works} className="w-full sm:w-auto">
            <Button type="outline" className="w-full !py-2.5 !px-5 text-caption font-medium">
              <FolderKanban size={15} className="mr-2 inline" /> View Works
            </Button>
          </Link>
        </div>

        {/* Footer Subtext */}
        <div className="pt-6 border-t border-black/10 dark:border-white/10">
          <Link
            href={ROUTES.contact}
            className="text-micro text-space-sparkle hover:underline inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
          >
            <span>Need assistance? Get in touch with our studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
