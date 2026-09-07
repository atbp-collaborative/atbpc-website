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
import { CONTACT_INFO } from '@/lib/dummy-data/contact/contact-info';

const TAGLINE_PHRASES = [
  { verb: 'designing', noun: 'values' },
  { verb: 'managing', noun: 'integrity' },
  { verb: 'building', noun: 'culture' },
] as const;

export default function UnderConstruction() {
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bright-gray dark:bg-vintage-charcoal text-vintage-charcoal dark:text-bright-gray px-4 py-8 pb-32 md:pb-8 transition-colors duration-300 relative">
      
      <div className="w-full max-w-3xl flex flex-col items-center text-center mt-[-4rem]">
        
        {/* Mobile View: Logo & Tagline */}
        <div className="flex md:hidden flex-col items-center justify-center w-full mb-12">
          {/* Logo */}
          <div className="mt-12">
            <div className="dark:hidden block">
              <Image
                src="/logo-charcoal.svg"
                alt="ATBP Collaborative Logo"
                width={270}
                height={270}
                priority
                className="mx-auto object-contain w-32 h-32 sm:w-40 sm:h-40"
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src="/logo-white.svg"
                alt="ATBP Collaborative Logo (Dark Mode)"
                width={270}
                height={270}
                priority
                className="mx-auto object-contain w-32 h-32 sm:w-40 sm:h-40"
              />
            </div>
          </div>
          {/* Tagline */}
          <div className="text-base sm:text-lg font-sans lowercase tracking-wider flex flex-col items-center justify-center -mt-8 sm:-mt-10">
            {animatedTagline}
          </div>
        </div>

        {/* Desktop View: Split Layout */}
        <div className="hidden md:flex flex-row items-center w-full mb-0 mt-12 lg:mt-16">
          {/* Left Side: Logo */}
          <div className="flex-1 flex justify-end pr-12">
            <div>
              <div className="dark:hidden block">
                <Image
                  src="/logo-charcoal.svg"
                  alt="ATBP Collaborative Logo"
                  width={270}
                  height={270}
                  priority
                  className="mx-auto object-contain w-[200px] h-[200px]"
                />
              </div>
              <div className="hidden dark:block">
                <Image
                  src="/logo-white.svg"
                  alt="ATBP Collaborative Logo (Dark Mode)"
                  width={270}
                  height={270}
                  priority
                  className="mx-auto object-contain w-[200px] h-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-32 bg-vintage-charcoal/20 dark:bg-white/20 shrink-0"></div>

          {/* Right Side: Animated Tagline */}
          <div className="flex-1 flex justify-start pl-12">
            <div className="text-xl lg:text-[1.15rem] font-sans lowercase tracking-wider flex flex-col items-start justify-center">
              {animatedTagline}
            </div>
          </div>
        </div>

        {/* Main Notice */}
        <h1 className="text-lg md:text-3xl font-bold font-sans mb-4 tracking-tight">Hello!</h1>
        <div className="w-3/4 md:w-4/5 text-caption opacity-80 mb-10 font-minor font-light leading-relaxed text-center">
          <p>We're still working on the finer details and we will be launching in October 2026.</p>
          <p>For inquiries, you may reach out through any of these channels.</p>
        </div>

        {/* Social Media & Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6 max-w-[140px] md:max-w-none mx-auto">
          {/* Email */}
          <a href={`mailto:${CONTACT_INFO.email}`} title="Email" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
            <Mail size={24} />
          </a>
          
          {/* SMS */}
          <a href={`sms:${mobileClean}`} title="SMS" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
            <MessageSquare size={24} />
          </a>

          {/* iMessage */}
          <a href={`sms:${mobileClean}`} title="iMessage" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
            <MessageCircle size={24} />
          </a>

          {/* WhatsApp */}
          <a href={`https://wa.me/${mobileClean.replace('+', '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
            <PhoneCall size={24} />
          </a>

          {/* Facebook */}
          {CONTACT_INFO.socials?.facebook && (
            <a href={CONTACT_INFO.socials.facebook.url} target="_blank" rel="noopener noreferrer" title="Facebook" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
              <Facebook size={24} />
            </a>
          )}
          
          {/* Instagram */}
          {CONTACT_INFO.socials?.instagram && (
            <a href={CONTACT_INFO.socials.instagram.url} target="_blank" rel="noopener noreferrer" title="Instagram" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
              <Instagram size={24} />
            </a>
          )}
          
          {/* Threads */}
          {CONTACT_INFO.socials?.threads && (
            <a href={CONTACT_INFO.socials.threads.url} target="_blank" rel="noopener noreferrer" title="Threads" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
              <AtSign size={24} />
            </a>
          )}
          
          {/* YouTube */}
          {CONTACT_INFO.socials?.youtube && (
            <a href={CONTACT_INFO.socials.youtube.url} target="_blank" rel="noopener noreferrer" title="YouTube" className="opacity-70 hover:opacity-100 hover:text-space-sparkle transition-all">
              <Youtube size={24} />
            </a>
          )}
        </div>

        {/* Copyright */}
        <p className="text-xs opacity-50 font-minor mb-24 md:mb-32">
          &copy; {new Date().getFullYear()} ATBP Collaborative
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center px-6">
        <div className="text-[11px] opacity-50 font-minor max-w-5xl mx-auto leading-relaxed">
          <p>ATBP Collaborative is a proudly Filipino-owned and managed professional practice providing comprehensive architecture, architectural interior, engineering, and building construction solutions.</p>
          <p>We are fully registered and licensed by the Professional Regulation Commission Board of Architecture (PRC-BOA) under License Nos. 0054827 & 0045492.</p>
        </div>
      </div>

    </div>
  );
}
