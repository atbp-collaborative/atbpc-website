'use client';

import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Mail,
  Facebook,
  AtSign,
  Instagram,
  Youtube,
  MapPin,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from '@/lib/theme-context';
import { ROUTES } from '@/lib/navigation/routes';
import { getContactInfo } from '@/lib/services/contact-info';
import { ContactInfo } from '@/dummy-data/contact-info';
import { useFormViewport } from '@/hooks/useFormViewport';
import { Button } from '@/components/primitives/Button';

function VintageTelephoneIcon({ size = 14, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Handset */}
      <path d="M3 4h4v3H3z" />
      <path d="M17 4h4v3h-4z" />
      <path d="M7 5.5h10" />

      {/* Telephone Base Silhouette */}
      <path d="M5 9.5h14l1.5 9.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2L5 9.5z" />

      {/* Center Circle */}
      <circle cx="12" cy="15.5" r="2.5" />
    </svg>
  );
}

function BuildingIcon({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      width={size * (120 / 80)}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12,40 v25 h26 l4,-30 h-4 v-2 l2,-2 l3,-3 v-4 h34 v4 l3,3 l2,2 v2 h-4 l4,30 h26 v-25 h-22 l-2,-14 v-3 l-4,-3 h-28 l-4,3 v3 l-2,14 z M52,65 v-10 a8,8 0 0,1 16,0 v10 z M48,50 v-5 h6 v-5 h12 v5 h6 v5 z M48,25 v-8 h24 v8 z M56,12 l4,-4 l4,4 z"
      />
    </svg>
  );
}

const OfficeMap = dynamic(() => import('@/components/blocks/OfficeMap').then((mod) => mod.OfficeMap), {
  ssr: false,
});

export default function ContactInfoPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [CONTACT_INFO, setContactInfo] = useState<ContactInfo | null>(null);
  const isHeightConstrained = useFormViewport(750);

  useEffect(() => {
    let mounted = true;
    getContactInfo().then((data) => {
      if (mounted) setContactInfo(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!CONTACT_INFO) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-0">
        <Loader2 className="animate-spin text-space-sparkle opacity-60" size={32} />
      </div>
    );
  }

  const viberCleanNumber = encodeURIComponent(CONTACT_INFO.mobile.replace(/\s+/g, ''));

  return (
    <div 
      className="w-full h-full overflow-hidden flex flex-col lg:flex-row items-stretch select-none relative"
    >
      <button
        onClick={() => router.push(ROUTES.contact)}
        className="absolute top-4 left-4 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-mini font-medium backdrop-blur-md transition-all cursor-pointer shadow-lg"
      >
        <ArrowLeft size={14} />
        <span>Contact Overview</span>
      </button>

      <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden shrink-0">
        <OfficeMap isDarkMode={isDarkMode} />
      </div>

      <div className={`w-full lg:w-1/2 h-1/2 lg:h-full ${
        isHeightConstrained ? 'p-3 sm:p-5 lg:p-6 xl:p-8' : 'p-5 sm:p-8 lg:p-10 xl:p-12 2xl:p-14'
      } flex flex-col justify-between overflow-y-auto`}>
        
        {/* Writeups Container */}
        <div className="flex-1 flex flex-col justify-start items-center space-y-4 sm:space-y-6 min-h-0 w-full">
          
          {/* Address Section */}
          <div className="space-y-2 w-full">
            <div className="text-space-sparkle mb-2.5 opacity-95">
              <BuildingIcon size={isHeightConstrained ? 84 : 105} />
            </div>

            <div className="flex items-center space-x-2 text-space-sparkle">
              <MapPin size={18} className="shrink-0" />
              <h2 className="font-sans text-body font-bold tracking-tight">The Case Study House</h2>
            </div>

            <div className="space-y-1 pl-6">
              <span className="opacity-50 block uppercase text-micro font-archivo tracking-widest font-semibold">Address</span>
              <div className="font-normal text-mini sm:text-caption leading-relaxed block opacity-85 space-y-0.5">
                {CONTACT_INFO.addressLines && CONTACT_INFO.addressLines.length > 0 ? (
                  CONTACT_INFO.addressLines.map((line, idx) => (
                    <p key={idx} className="m-0 leading-snug">{line}</p>
                  ))
                ) : (
                  <p className="m-0 leading-snug">{CONTACT_INFO.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Channels Section */}
          <div className="space-y-3.5 pt-3 border-t border-space-sparkle/10 w-full">
            <span className="text-micro sm:text-mini font-sans uppercase text-space-sparkle font-bold block tracking-widest">CONTACT & CHANNELS</span>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 ${isHeightConstrained ? 'gap-y-3.5 gap-x-4 text-micro sm:text-mini' : 'gap-y-5 sm:gap-y-6 lg:gap-y-5 xl:gap-y-6 gap-x-4 sm:gap-x-6 text-mini sm:text-caption'}`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                  <VintageTelephoneIcon size={14} className="text-space-sparkle" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">Landline</span>
                  <span className="font-medium truncate block">{CONTACT_INFO.landline}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                  <Smartphone size={14} className="text-space-sparkle" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">Mobile & Viber Contact</span>
                  <a 
                    href={`viber://chat?number=${viberCleanNumber}`}
                    className="font-medium hover:text-space-sparkle transition-colors underline truncate block"
                    title="Open in Viber"
                  >
                    {CONTACT_INFO.mobile}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                  <Mail size={14} className="text-space-sparkle" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">Official Inquiries</span>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`} 
                    className="font-medium hover:text-space-sparkle transition-colors underline truncate block"
                    title="Send email"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                  <Facebook size={14} className="text-space-sparkle" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">Facebook</span>
                  <a 
                    href={CONTACT_INFO.socials.facebook.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-space-sparkle transition-colors underline truncate block"
                  >
                    {CONTACT_INFO.socials.facebook.label}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                  <AtSign size={14} className="text-space-sparkle" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">Threads</span>
                  <a 
                    href={CONTACT_INFO.socials.threads.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-space-sparkle transition-colors underline block"
                  >
                    {CONTACT_INFO.socials.threads.label}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                  <Instagram size={14} className="text-space-sparkle" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">Instagram</span>
                  <a 
                    href={CONTACT_INFO.socials.instagram.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-space-sparkle transition-colors underline block"
                  >
                    {CONTACT_INFO.socials.instagram.label}
                  </a>
                </div>
              </div>

              {CONTACT_INFO.socials.youtube && (
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                    <Youtube size={14} className="text-space-sparkle" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="opacity-50 block uppercase text-micro font-archivo tracking-wider font-semibold">YouTube</span>
                    <a 
                      href={CONTACT_INFO.socials.youtube.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-space-sparkle transition-colors underline block"
                    >
                      {CONTACT_INFO.socials.youtube.label}
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* CTA Buttons - 75% width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full lg:w-[75%] shrink-0 pt-2 mt-auto">
          <Button
            type="filled"
            label="Schedule a Discovery Session"
            href={ROUTES.discoverySession}
            fullWidth={true}
            className="font-medium py-2.5 text-micro sm:text-mini tracking-wider !bg-[#466263] hover:!bg-[#3b5152] !text-[#EDEFEF] shadow-sm"
          />
          <Button
            type="filled"
            label="Request a Proposal"
            href={ROUTES.requestForProposal}
            fullWidth={true}
            className="font-medium py-2.5 text-micro sm:text-mini tracking-wider !bg-[#466263] hover:!bg-[#3b5152] !text-[#EDEFEF] shadow-sm"
          />
        </div>

      </div>
    </div>
  );
}
