'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../lib/theme-context';

interface ContactFormPageProps {
  title: string;
  subtitle: string;
  formsUrl: string;
  embedTitle: string;
}

export const ContactFormPage: React.FC<ContactFormPageProps> = ({ title, subtitle, formsUrl, embedTitle }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      key={embedTitle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden px-4 sm:px-8 pb-4 pt-4 sm:pt-6"
    >
      <div className="mb-4 shrink-0 pb-3 text-center">
        <h1 className="font-sans text-h2 sm:text-h1 font-bold tracking-tight leading-none lowercase">
          {title}
        </h1>
        <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
          {subtitle}
        </p>
      </div>

      <div className={`flex-1 min-h-0 w-full max-w-3xl self-center overflow-hidden rounded-none border shadow-inner ${
        isDarkMode ? 'border-space-sparkle/20' : 'border-space-sparkle/10'
      }`}>
        <iframe
          src={formsUrl}
          className="w-full h-full border-0"
          allowFullScreen
          title={embedTitle}
        />
      </div>
    </motion.div>
  );
};
