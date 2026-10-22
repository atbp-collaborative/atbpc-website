'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail,
  MessageSquare,
  MessageCircle,
  PhoneCall,
  AtSign
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/global/ThemeToggle';
import { CONTACT_INFO } from '@/lib/dummy-data/contact/contact-info';

const TAGLINE_PHRASES = [
  { verb: 'designing', noun: 'values' },
  { verb: 'managing', noun: 'integrity' },
  { verb: 'building', noun: 'culture' },
] as const;

export interface StatusNoticeViewProps {
  headline: React.ReactNode;
  subtext: React.ReactNode;
  actions?: React.ReactNode;
  isEmbedded?: boolean;
  showContactLinks?: boolean;
  showDisclaimer?: boolean;
  className?: string;
}

export const StatusNoticeView: React.FC<StatusNoticeViewProps> = ({
  headline,
  subtext,
  actions,
  isEmbedded = false,
  showContactLinks = true,
  showDisclaimer = true,
  className = '',
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TAGLINE_PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Format mobile number for links
  const mobileClean = CONTACT_INFO.mobile ? CONTACT_INFO.mobile.replace(/\s+/g, '') : '';

  const animatedTagline = TAGLINE_PHRASES.map((phrase, index) => {
    const isActive = activeIndex === index;
    return (
      <span
        key={phrase.verb}
        className="transition-all ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center"
        style={{
          transitionDuration: '4000ms',
          opacity: isActive ? 1 : 0.3,
          transform: isActive ? 'scale(1)' : 'scale(0.96)',
          transformOrigin: 'left center'
        }}
      >
        <span className="font-light whitespace-nowrap">{phrase.verb} with</span>&nbsp;<strong>{phrase.noun}</strong>
        <span className="opacity-50">.</span>
      </span>
    );
  });

  return (
    <div
      className={`w-full flex flex-col items-center justify-center transition-colors duration-300 relative ${
        isDarkMode
          ? 'bg-vintage-charcoal text-bright-gray'
          : 'bg-bright-gray text-vintage-charcoal'
      } ${
        isEmbedded
          ? 'flex-1 py-12 md:py-20 min-h-[70vh]'
          : 'min-h-screen py-8 pb-32 md:pb-8'
      } ${className}`}
    >
      {/* Optional Top-Right Theme Toggle on Standalone Status Pages */}
      {!isEmbedded && (
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      )}

      <div className={`w-full max-w-3xl flex flex-col items-center text-center ${isEmbedded ? '' : 'mt-[-4rem]'}`}>
        
        {/* Mobile View: Logo & Tagline */}
        <div className="flex md:hidden flex-col items-center justify-center w-full mb-12">
          {/* Logo */}
          <div className="mt-6">
            <Image
              src={isDarkMode ? '/logo-white.svg' : '/logo-charcoal.svg'}
              alt={`ATBP Collaborative Logo${isDarkMode ? ' (Dark Mode)' : ''}`}
              width={270}
              height={270}
              priority
              className="mx-auto object-contain w-32 h-32 sm:w-40 sm:h-40"
            />
          </div>
          {/* Tagline */}
          <div className="text-base sm:text-lg font-sans lowercase tracking-wider flex flex-col items-center justify-center -mt-8 sm:-mt-10">
            {animatedTagline}
          </div>
        </div>

        {/* Desktop View: Split Layout */}
        <div className="hidden md:flex flex-row items-center w-full mb-0 mt-8 lg:mt-12">
          {/* Left Side: Logo */}
          <div className="flex-1 flex justify-end pr-12">
            <div>
              <Image
                src={isDarkMode ? '/logo-white.svg' : '/logo-charcoal.svg'}
                alt={`ATBP Collaborative Logo${isDarkMode ? ' (Dark Mode)' : ''}`}
                width={270}
                height={270}
                priority
                className="mx-auto object-contain w-[180px] h-[180px] lg:w-[200px] lg:h-[200px]"
              />
            </div>
          </div>

          {/* Divider */}
          <div className={`w-px h-32 shrink-0 ${isDarkMode ? 'bg-white/20' : 'bg-vintage-charcoal/20'}`}></div>

          {/* Right Side: Animated Tagline */}
          <div className="flex-1 flex justify-start pl-12">
            <div className="text-xl lg:text-[1.15rem] font-sans lowercase tracking-wider flex flex-col items-start justify-center">
              {animatedTagline}
            </div>
          </div>
        </div>

        {/* Main Notice */}
        <h1 className="text-lg md:text-3xl lg:text-5xl font-bold font-sans mb-4 tracking-tight lowercase">
          {headline}
        </h1>
        <div className="w-3/4 md:w-4/5 text-caption opacity-80 mb-8 font-minor font-light leading-relaxed text-center">
          {typeof subtext === 'string' ? <p>{subtext}</p> : subtext}
        </div>

        {/* Optional Action Buttons (e.g. Return Home & View Works) */}
        {actions && (
          <div className="w-full flex justify-center mb-8">
            {actions}
          </div>
        )}

        {/* Social Media & Contact Links */}
        {showContactLinks && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6 w-full px-4 mx-auto">
            {/* Email */}
            <a href={`mailto:${CONTACT_INFO.email}`} title="Email" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
              <Mail size={24} />
            </a>
            
            {/* SMS */}
            <a href={`sms:${mobileClean}`} title="SMS" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
              <MessageSquare size={24} />
            </a>

            {/* iMessage */}
            <a href={`sms:${mobileClean}`} title="iMessage" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
              <MessageCircle size={24} />
            </a>

            {/* WhatsApp */}
            <a href={`https://wa.me/${mobileClean.replace('+', '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
              <PhoneCall size={24} />
            </a>

            {/* Facebook */}
            {CONTACT_INFO.socials?.facebook && (
              <a href={CONTACT_INFO.socials.facebook.url} target="_blank" rel="noopener noreferrer" title="Facebook" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
                <Facebook size={24} />
              </a>
            )}
            
            {/* Instagram */}
            {CONTACT_INFO.socials?.instagram && (
              <a href={CONTACT_INFO.socials.instagram.url} target="_blank" rel="noopener noreferrer" title="Instagram" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
                <Instagram size={24} />
              </a>
            )}
            
            {/* Threads */}
            {CONTACT_INFO.socials?.threads && (
              <a href={CONTACT_INFO.socials.threads.url} target="_blank" rel="noopener noreferrer" title="Threads" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
                <AtSign size={24} />
              </a>
            )}
            
            {/* YouTube */}
            {CONTACT_INFO.socials?.youtube && (
              <a href={CONTACT_INFO.socials.youtube.url} target="_blank" rel="noopener noreferrer" title="YouTube" className="inline-block opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all outline-none focus-visible:ring-2 focus-visible:ring-gray-400/50 [-webkit-tap-highlight-color:transparent]">
                <Youtube size={24} />
              </a>
            )}
          </div>
        )}

        {/* Copyright */}
        <p className="text-xs opacity-50 font-minor mb-8 md:mb-12">
          &copy; {new Date().getFullYear()} ATBP Collaborative
        </p>
      </div>

      {/* Standalone footer disclaimer only when not embedded */}
      {!isEmbedded && showDisclaimer && (
        <div className="absolute bottom-6 left-0 w-full text-center px-6">
          <div className="text-[11px] opacity-50 font-minor max-w-5xl mx-auto leading-relaxed space-y-1">
            <p>ATBP Collaborative is a proudly Filipino-owned and managed professional practice providing comprehensive architecture, architectural interior, engineering, and building construction solutions.</p>
            <p>We are fully registered and licensed by the Professional Regulation Commission Board of Architecture (PRC-BOA) under License Nos. 0054827 & 0045492.</p>
          </div>
        </div>
      )}

    </div>
  );
};
