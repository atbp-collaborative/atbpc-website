import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getServices } from '../lib/data/services';
import { Service } from '../types';

const getServiceImage = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('comprehensive')) {
    return '/images/hero_modern_villa_1783495183350.jpg';
  }
  if (t.includes('piecework')) {
    return '/images/kiosk_coffee_bar_1783495252161.jpg';
  }
  if (t.includes('general construction')) {
    return '/images/condo_fitout_interior_1783495200802.jpg';
  }
  if (t.includes('retainer')) {
    return '/images/production_drawings_1783495233053.jpg';
  }
  return '/images/hero_modern_villa_1783495183350.jpg';
};

interface OurServicesPageProps {
  isDarkMode: boolean;
}

export const OurServicesPage: React.FC<OurServicesPageProps> = ({ isDarkMode }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  return (
    <motion.div 
      key="our-services"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-2 sm:py-3 flex flex-col justify-between overflow-hidden select-none min-h-0 flex-1"
    >
      {/* Contract Types Cards Grid / Carousel */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full my-auto overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] w-full max-w-7xl mx-auto items-stretch">
          {services.map((service) => {
            const imageUrl = getServiceImage(service.title);
            return (
              <div
                key={service.title}
                className={`flex flex-col border transition-all duration-500 rounded-none overflow-hidden ${
                  isDarkMode 
                    ? 'bg-vintage-charcoal/45 border-space-sparkle/20 hover:border-space-sparkle/40 hover:bg-vintage-charcoal/60' 
                    : 'bg-white border-space-sparkle/10 hover:border-space-sparkle/20 hover:shadow-md'
                }`}
              >
                {/* Image side */}
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-transform duration-700 ease-in-out hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content side */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-1.5">
                  <h3 className={`font-sans text-caption sm:text-body font-bold tracking-tight capitalize ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    {service.title}
                  </h3>
                  <p className="text-[11px] sm:text-mini font-light leading-snug opacity-75 line-clamp-3">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtext Row MOVED BELOW THE CAROUSEL / CARDS */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-[11px] sm:text-mini font-light opacity-75 leading-tight max-w-2xl mx-auto tracking-wide italic">
          Discover our flexible contract types and comprehensive architectural capabilities designed to bring clarity and integrity to your project.
        </p>
      </div>
    </motion.div>
  );
};
