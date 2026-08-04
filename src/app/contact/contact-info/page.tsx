'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MessageSquare,
  Mail,
  Facebook,
  AtSign,
  Instagram,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from '../../../lib/theme-context';
import { ROUTES } from '../../../lib/routes';
import { CONTACT_INFO } from '../../../content/contact';

const OfficeMap = dynamic(() => import('../../../components/OfficeMap').then((mod) => mod.OfficeMap), {
  ssr: false,
});

export default function ContactInfoPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <motion.div 
      key="contact-info"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full overflow-hidden flex flex-col lg:flex-row items-stretch select-none relative"
    >
      <button
        onClick={() => router.push(ROUTES.contact)}
        className="absolute top-4 left-4 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-mini font-medium backdrop-blur-md transition-all cursor-pointer shadow-lg"
      >
        <ArrowLeft size={14} />
        <span>Contact Overview</span>
      </button>

      <div className="w-full lg:w-[50%] xl:w-[55%] shrink-0 h-[300px] sm:h-[380px] lg:h-full relative overflow-hidden">
        <OfficeMap isDarkMode={isDarkMode} />
      </div>

      <div className="w-full lg:w-[50%] xl:w-[45%] p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center space-y-4 sm:space-y-6 max-w-xl mx-auto lg:mx-0 overflow-y-auto lg:overflow-hidden">
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-space-sparkle">
            <MapPin size={18} className="shrink-0" />
            <h2 className="font-sans text-body font-bold tracking-tight">The Case Study House</h2>
          </div>

          <div className="space-y-0.5 pl-6">
            <span className="opacity-50 block uppercase text-[10px] tracking-widest font-semibold">Address</span>
            <span className="font-normal text-mini sm:text-caption leading-relaxed block text-justify opacity-85">
              {CONTACT_INFO.address}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-space-sparkle/10">
          <span className="text-[10px] sm:text-mini font-sans uppercase text-space-sparkle font-bold block tracking-widest">CONTACT & CHANNELS</span>
          
          <div className="space-y-2.5 text-mini sm:text-caption">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Phone size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Landline</span>
                <span className="font-medium text-mini sm:text-caption">{CONTACT_INFO.landline}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <MessageSquare size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Mobile & Viber Contact</span>
                <span className="font-medium text-mini sm:text-caption">{CONTACT_INFO.mobile}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Mail size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Official Inquiries</span>
                <span className="font-medium block text-mini sm:text-caption">{CONTACT_INFO.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Facebook size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Facebook</span>
                <a href={CONTACT_INFO.socials.facebook.url} className="font-medium hover:text-space-sparkle transition-colors underline block text-mini sm:text-caption">{CONTACT_INFO.socials.facebook.label}</a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <AtSign size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Threads</span>
                <a href={CONTACT_INFO.socials.threads.url} className="font-medium hover:text-space-sparkle transition-colors underline block text-mini sm:text-caption">{CONTACT_INFO.socials.threads.label}</a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Instagram size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Instagram</span>
                <a href={CONTACT_INFO.socials.instagram.url} className="font-medium hover:text-space-sparkle transition-colors underline block text-mini sm:text-caption">{CONTACT_INFO.socials.instagram.label}</a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
