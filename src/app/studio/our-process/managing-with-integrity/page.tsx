'use client';

import React from 'react';
import { motion } from 'motion/react';
import { STUDIO_SUBPAGES_DATA } from '../../placeholder';
import { ImageWithFade } from '../../../../components/ImageWithFade';

export default function ManagingWithIntegrityPage() {
  const data = STUDIO_SUBPAGES_DATA['managing-with-integrity'];

  return (
    <motion.div
      key="managing-with-integrity"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      <div className="shrink-0 flex items-center justify-between border-b border-space-sparkle/10 pb-2 mb-2">
        <span className="text-mini font-semibold tracking-widest uppercase opacity-60">
          {data.section}
        </span>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 justify-center items-center min-h-0 my-auto py-1">
        <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-sm border border-space-sparkle/20">
          <ImageWithFade
            src="/images/contact_headquarters_img_1785470005846.jpg"
            alt="Managing with Integrity"
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
            <p>We champion full transparency throughout the lifecycle of every project. By enforcing open-book budgeting and uncompromised quality standards, we protect our clients' investments and deliver spaces exactly as envisioned, without hidden surprises.</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.title}
        </p>
      </div>
    </motion.div>
  );
}
