'use client';

import React from 'react';
import { motion } from 'motion/react';
import { STUDIO_SUBPAGES_DATA } from '../../placeholder';
import { ImageWithFade } from '../../../../components/ImageWithFade';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

export default function DesigningWithValuesPage() {
  useDocumentTitle('Designing with Values');
  const data = STUDIO_SUBPAGES_DATA['designing-with-values'];

  return (
    <motion.div
      key="designing-with-values"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      <div className="flex-1 flex flex-col md:flex-row gap-8 justify-center items-center min-h-0 my-auto py-1">
        <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-sm border border-space-sparkle/20">
          <ImageWithFade
            src="/images/contact_case_study_house_img_1785469986420.jpg"
            alt="Designing with Values"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale contrast-125 hover:grayscale-0 transition-transform duration-700 ease-in-out hover:scale-105"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="font-sans text-h2 sm:text-h1 md:text-hero font-bold tracking-tight lowercase">
            {data.title}
          </h1>
          <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
            {data.tagline}
          </p>
          <div className="text-caption sm:text-body font-light leading-relaxed opacity-85 space-y-3">
            <p>{data.description}</p>
            <p>Every decision we make in the design phase is guided by a commitment to environmental stewardship and human-centric ergonomics. We strive to build enduring structures that act as positive forces within their respective ecologies and communities.</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 text-center pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.title}
        </p>
      </div>
    </motion.div>
  );
}
