'use client';

import React from 'react';
import { StudioSubpageData } from '@/dummy-data/our-services';
import { ImageWithFade } from '@/components/primitives/ImageWithFade';

interface StudioServicesPageProps {
  data: StudioSubpageData;
}

export const StudioServicesPage: React.FC<StudioServicesPageProps> = ({
  data,
}) => {
  return (
    <div
      className="w-full h-full px-4 sm:px-8 md:px-12 py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      {/* Top Section / Header if image is present */}
      {data.image && (
        <div className="shrink-0 flex items-center justify-between border-b border-space-sparkle/10 pb-2 mb-2">
          <span className="text-mini font-semibold tracking-widest uppercase opacity-60">
            {data.section}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      {data.image ? (
        <div className="flex-1 flex flex-col md:flex-row gap-8 justify-center items-stretch min-h-0 py-1">
          <div className="relative w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-full overflow-hidden rounded-sm border border-space-sparkle/20 shrink-0">
            <ImageWithFade
              src={data.image}
              alt={data.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale contrast-125 hover:grayscale-0 transition-transform duration-700 ease-in-out hover:scale-105"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 overflow-y-auto">
            <h1 className="font-sans text-h2 sm:text-h1 md:text-hero font-bold tracking-tight lowercase">
              {data.title}
            </h1>
            <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
              {data.tagline}
            </p>
            <div className="text-caption sm:text-body font-light leading-relaxed opacity-85 space-y-3">
              <p>{data.description}</p>
              {data.extraDescription && <p>{data.extraDescription}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center min-h-0 my-auto py-1">
          <div className="space-y-3 max-w-5xl mx-auto w-full">
            {/* Title & Tagline */}
            <div className="space-y-1.5 text-left">
              <h1 className="font-sans text-h2 sm:text-h1 md:text-hero font-bold tracking-tight lowercase">
                {data.title}
              </h1>
              <p className="text-mini sm:text-caption font-semibold tracking-wider opacity-80 uppercase text-space-sparkle">
                {data.tagline}
              </p>
              <div className="text-caption sm:text-body font-light leading-relaxed opacity-85 max-w-3xl pt-1 space-y-3">
                <p>{data.description}</p>
                {data.extraDescription && <p>{data.extraDescription}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Subtext */}
      <div className={`shrink-0 text-center pt-2 mt-1 ${data.image ? 'border-t border-space-sparkle/10' : ''}`}>
        <p className="text-micro sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          ATBP Collaborative ◦ {data.subtext}
        </p>
      </div>
    </div>
  );
};
