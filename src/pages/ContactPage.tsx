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
import { OfficeMap } from '../components/OfficeMap';

interface ContactPageProps {
  isDarkMode: boolean;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const MAIN_CONTACT_CARDS = [
  {
    id: 'locate',
    tab: 'case-study-house',
    title: 'case study house',
    tagline: 'locate & communicate ◦ parañaque city',
    description: 'Our studio headquarters, address, interactive map, and contact coordinates.',
    tags: ['Discovery Meeting', 'Locate & Communicate'],
    image: '/src/assets/images/contact_headquarters_img_1785470005846.jpg',
  },
  {
    id: 'careers',
    tab: 'grow-with-us',
    title: 'grow with us',
    tagline: 'careers ◦ internship, apprenticeship & licensing',
    description: 'Join our collaborative ecosystem. Opportunities for emerging architects and design leaders.',
    tags: ['Internship Program', 'Apprenticeship Program', 'Licensed Programs'],
    image: '/src/assets/images/contact_careers_img_1785470018782.jpg',
  },
  {
    id: 'partners',
    tab: 'partner-with-us',
    title: 'partner with us',
    tagline: 'collaborations ◦ suppliers, consultants & builders',
    description: 'Collaborate with ATBP as a material supplier, engineering consultant, or trade builder.',
    tags: ['Suppliers', 'Consultants', 'Builders'],
    image: '/src/assets/images/contact_partners_img_1785470031164.jpg',
  },
];

const CASE_STUDY_HOUSE_CARDS = [
  {
    id: 'discovery',
    tab: 'intake',
    title: 'schedule a discovery meeting',
    tagline: 'intake, spatial goals & consultation',
    description: 'Start a dialogue with ATBP Collaborative for project planning, site feasibility, and design inquiries.',
    tags: ['Project Intake', 'Design Brief', 'Spatial Requirements'],
    image: '/src/assets/images/studio_services_img_1785469964556.jpg',
  },
  {
    id: 'locate-map',
    tab: 'contact-info',
    title: 'locate & communicate',
    tagline: 'headquarters, address & contact channels',
    description: 'Interactive office map, physical address in Parañaque City, landline, mobile, Viber & social channels.',
    tags: ['Parañaque City', 'Interactive Map', 'Viber & Email'],
    image: '/src/assets/images/contact_headquarters_img_1785470005846.jpg',
  },
];

const GROW_WITH_US_CARDS = [
  {
    id: 'internship',
    tab: 'career',
    title: 'internship program',
    tagline: 'student fellowship & studio immersion',
    description: 'Immersion program for architecture and design students to engage in active project workflows and research.',
    tags: ['Student Fellowship', 'Spatial Practice', 'Research'],
    image: '/src/assets/images/contact_careers_img_1785470018782.jpg',
  },
  {
    id: 'apprenticeship',
    tab: 'career',
    title: 'apprenticeship program',
    tagline: 'junior architect & graduate mentorship',
    description: 'Comprehensive mentorship path for architecture graduates preparing for professional licensure and site management.',
    tags: ['Junior Architect', 'Licensure Support', 'Site Experience'],
    image: '/src/assets/images/studio_people_img_1785469993286.jpg',
  },
  {
    id: 'licensed',
    tab: 'career',
    title: 'licensed programs',
    tagline: 'full-time practice & project leads',
    description: 'Leadership roles for registered architects, spatial strategists, and project directors driving studio commissions.',
    tags: ['Registered Architect', 'Project Director', 'Design Lead'],
    image: '/src/assets/images/production_drawings_1783495233053.jpg',
  },
];

const PARTNER_WITH_US_CARDS = [
  {
    id: 'suppliers',
    tab: 'supplier',
    title: 'suppliers',
    tagline: 'materials, finishes & architectural hardware',
    description: 'Register material samples, architectural fixtures, sustainable building assemblies, and trade products with ATBP.',
    tags: ['Material Specification', 'Bespoke Finishes', 'Hardware'],
    image: '/src/assets/images/contact_partners_img_1785470031164.jpg',
  },
  {
    id: 'consultants',
    tab: 'consultant',
    title: 'consultants',
    tagline: 'engineering, mepfs & specialist review',
    description: 'Collaborate as a structural engineer, MEPFS specialist, environmental analyst, or technical peer reviewer.',
    tags: ['Structural', 'MEPFS', 'Environmental Review'],
    image: '/src/assets/images/studio_process_img_1785469980353.jpg',
  },
  {
    id: 'builders',
    tab: 'builder',
    title: 'builders',
    tagline: 'master contractors & specialized trade guilds',
    description: 'Partner as a general contractor, specialized mason, steel fabricator, or custom joinery artisan on studio builds.',
    tags: ['General Contractors', 'Masonry & Steel', 'Joinery Artisans'],
    image: '/src/assets/images/retail_boutique_1783495217375.jpg',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({ 
  isDarkMode, 
  activeTab = 'contact', 
  setActiveTab 
}) => {
  const renderCardsLanding = (
    cards: Array<{ id: string; tab: string; title: string; tagline: string; tags: string[]; image: string }>,
    keyName: string
  ) => (
    <motion.div 
      key={keyName}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full select-none flex flex-col flex-1 min-h-0 overflow-hidden"
    >
      <div className="flex-1 flex flex-col justify-center w-full min-h-0 h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-[2px] flex-1 h-full min-h-0 items-stretch group/cardsContainer">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActiveTab?.(card.tab)}
              className="group/card relative flex-1 min-h-0 md:hover:flex-[1.45] w-full overflow-hidden rounded-none border-0 cursor-pointer transition-all duration-500 ease-out group-hover/cardsContainer:opacity-75 hover:!opacity-100"
            >
              {/* Full-bleed background image occupying whole card */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Dark gradient overlay for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 group-hover/card:from-black/90 group-hover/card:via-black/55 group-hover/card:to-black/30 transition-colors duration-500" />

              {/* Card Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end items-start text-left z-10 space-y-1.5">
                {/* Card Title - Lowercase */}
                <h2 className="font-sans text-h2 sm:text-h1 md:text-display font-semibold tracking-wider text-white lowercase drop-shadow-md">
                  {card.title}
                </h2>

                {/* Subtext tagline */}
                <p className="text-mini sm:text-caption font-normal text-white/80 tracking-wider leading-relaxed font-sans">
                  {card.tags.join(' ◦ ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (activeTab === 'contact') {
    return renderCardsLanding(MAIN_CONTACT_CARDS, 'contact-main-landing');
  }

  if (activeTab === 'case-study-house') {
    return renderCardsLanding(CASE_STUDY_HOUSE_CARDS, 'case-study-house-landing');
  }

  if (activeTab === 'grow-with-us') {
    return renderCardsLanding(GROW_WITH_US_CARDS, 'grow-with-us-landing');
  }

  if (activeTab === 'partner-with-us') {
    return renderCardsLanding(PARTNER_WITH_US_CARDS, 'partner-with-us-landing');
  }

  // Detailed Contact View (Map + Address + Coordinates)
  return (
    <motion.div 
      key="contact-info"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full overflow-hidden flex flex-col lg:flex-row items-stretch select-none relative"
    >
      {/* Back to Contact Landing button */}
      {setActiveTab && (
        <button
          onClick={() => setActiveTab('contact')}
          className="absolute top-4 left-4 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-mini font-medium backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft size={14} />
          <span>Contact Overview</span>
        </button>
      )}

      {/* Map spread left */}
      <div className="w-full lg:w-[50%] xl:w-[55%] shrink-0 h-[300px] sm:h-[380px] lg:h-full relative overflow-hidden">
        <OfficeMap isDarkMode={isDarkMode} />
      </div>

      {/* Right Column Content - Centered & Compact */}
      <div className="w-full lg:w-[50%] xl:w-[45%] p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center space-y-4 sm:space-y-6 max-w-xl mx-auto lg:mx-0 overflow-y-auto lg:overflow-hidden">
        
        {/* The Case Study House + Address */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-space-sparkle">
            <MapPin size={18} className="shrink-0" />
            <h2 className="font-sans text-body font-bold tracking-tight">The Case Study House</h2>
          </div>

          <div className="space-y-0.5 pl-6">
            <span className="opacity-50 block uppercase text-[10px] tracking-widest font-semibold">Address</span>
            <span className="font-normal text-mini sm:text-caption leading-relaxed block text-justify opacity-85">
              P4, B2, L1, N402 Lovebird Lane corner Eagle Drive, Countryside Village, Barangay Sun Valley, City of Parañaque, National Capital Region, Philippines.
            </span>
          </div>
        </div>

        {/* Contact Coordinates & Social Media Stacked */}
        <div className="space-y-3 pt-3 border-t border-space-sparkle/10">
          <span className="text-[10px] sm:text-mini font-sans uppercase text-space-sparkle font-bold block tracking-widest">CONTACT & CHANNELS</span>
          
          <div className="space-y-2.5 text-mini sm:text-caption">
            {/* Landline */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Phone size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Landline</span>
                <span className="font-medium text-mini sm:text-caption">+632 8257-0968</span>
              </div>
            </div>

            {/* Mobile & Viber */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <MessageSquare size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Mobile & Viber Contact</span>
                <span className="font-medium text-mini sm:text-caption">+63 917 165 4827</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Mail size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Official Inquiries</span>
                <span className="font-medium block text-mini sm:text-caption">enquire@atbpcollaborative.com</span>
              </div>
            </div>

            {/* Social Media Stacked */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Facebook size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Facebook</span>
                <a href="#fb" className="font-medium hover:text-space-sparkle transition-colors underline block text-mini sm:text-caption">ATBP Collaborative</a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <AtSign size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Threads</span>
                <a href="#threads" className="font-medium hover:text-space-sparkle transition-colors underline block text-mini sm:text-caption">@atbp.collaborative</a>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${isDarkMode ? 'bg-space-sparkle/10' : 'bg-space-sparkle/5'}`}>
                <Instagram size={14} className="text-space-sparkle" />
              </div>
              <div className="space-y-0.5">
                <span className="opacity-50 block uppercase text-[10px] tracking-wider font-semibold">Instagram</span>
                <a href="#ig" className="font-medium hover:text-space-sparkle transition-colors underline block text-mini sm:text-caption">@atbp.collaborative</a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};
