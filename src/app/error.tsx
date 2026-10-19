'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import { ROUTES } from '@/lib/navigation/routes';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    console.error('[ErrorBoundary caught error]:', error);
  }, [error]);

  return (
    <div
      className={`min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-8 text-center select-none transition-colors duration-300 ${
        isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
      }`}
    >
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center shadow-xs">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-micro font-mono uppercase tracking-widest text-amber-500 font-semibold block">
            System Notice • Unexpected State
          </span>
          <h1 className="text-h1 sm:text-[2.25rem] font-major font-bold tracking-tight lowercase">
            something went off course
          </h1>
          <p className="text-caption sm:text-mini font-light opacity-75 max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while loading this view. You can reload the segment or return to the main directory.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono opacity-40">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="filled"
            onClick={() => reset()}
            className="w-full sm:w-auto !py-2.5 !px-5 text-caption font-medium"
          >
            <RotateCcw size={15} className="mr-2 inline" /> Try Again
          </Button>
          <Link href={ROUTES.home} className="w-full sm:w-auto">
            <Button
              type="outline"
              className="w-full sm:w-auto !py-2.5 !px-5 text-caption font-medium"
            >
              <Home size={15} className="mr-2 inline" /> Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
