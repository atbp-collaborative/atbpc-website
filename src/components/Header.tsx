import React, { useState } from 'react';
import { Menu, X, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Member } from '../types';
import { Button } from './Button';
import { StudioDropdown } from './StudioDropdown';
import { ContactDropdown } from './ContactDropdown';
import { WorksDropdown } from './WorksDropdown';
import { AtbpLogo } from './AtbpLogo';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode?: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  selectedMember: Member | null;
  setSelectedMember: (mem: Member | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  projectFilter: string;
  setProjectFilter: (filter: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  activeTab,
  setActiveTab,
  selectedProject,
  setSelectedProject,
  selectedMember,
  setSelectedMember,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  projectFilter,
  setProjectFilter,
}) => {
  const [isWorksHovered, setIsWorksHovered] = useState<boolean>(false);
  const [isAboutHovered, setIsAboutHovered] = useState<boolean>(false);
  const [isContactHovered, setIsContactHovered] = useState<boolean>(false);

  const isWorksLanding = activeTab === 'works' && projectFilter === 'All' && !selectedProject && !selectedMember;
  const isStudioLanding = (activeTab === 'home' || activeTab === 'studio') && !selectedProject && !selectedMember;
  const isContactLanding = [
    'contact',
    'case-study-house',
    'grow-with-us',
    'partner-with-us',
  ].includes(activeTab) && !selectedProject && !selectedMember;

  const isHeaderTransparent = (isStudioLanding || isWorksLanding || isContactLanding) && !selectedProject;
  
  const isStudioSubpage = [
    'comprehensive-services',
    'piecework-services',
    'designing-with-values',
    'managing-with-integrity',
    'building-with-culture',
  ].includes(activeTab);

  let isWorksActive = activeTab === 'works';
  let isStudioActive = activeTab === 'our-services' || activeTab === 'our-people' || activeTab.startsWith('our-people-') || activeTab === 'services' || isStudioSubpage;
  let isContactActive = [
    'contact',
    'case-study-house',
    'grow-with-us',
    'partner-with-us',
    'contact-info',
    'career',
    'supplier',
    'builder',
    'consultant',
  ].includes(activeTab);

  if (selectedProject) {
    isWorksActive = true;
    isStudioActive = false;
    isContactActive = false;
  } else if (selectedMember) {
    isWorksActive = false;
    isStudioActive = true;
    isContactActive = false;
  }

  const handleLogoClick = () => {
    setActiveTab('home');
    setSelectedProject(null);
    setSelectedMember(null);
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setSelectedProject(null);
    setSelectedMember(null);
  };

  return (
    <header 
      id="main-header"
      className={`${
        isHeaderTransparent
          ? 'absolute top-0 left-0 w-full z-40 bg-transparent border-none text-white'
          : `sticky top-0 z-40 backdrop-blur-md transition-colors border-b ${
              isDarkMode 
                ? 'bg-vintage-charcoal/90 border-space-sparkle/20 text-bright-gray' 
                : 'bg-bright-gray/90 border-space-sparkle/10 text-vintage-charcoal'
            }`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-12 lg:space-x-16">
          <div className="flex items-center cursor-pointer select-none" onClick={handleLogoClick}>
            <AtbpLogo 
              isDarkMode={isDarkMode}
              isHeaderTransparent={isHeaderTransparent}
              className="h-7 w-auto transition-opacity hover:opacity-90"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-caption font-light tracking-widest uppercase relative">
            <div 
              onMouseEnter={() => setIsWorksHovered(true)}
              onMouseLeave={() => setIsWorksHovered(false)}
            >
              <div 
                onClick={() => {
                  setProjectFilter('All');
                  setActiveTab('works');
                  setSelectedProject(null);
                  setSelectedMember(null);
                  setIsWorksHovered(false);
                }}
                className={`transition-all duration-300 relative py-1 min-w-[70px] text-center cursor-pointer select-none ${
                  isHeaderTransparent
                    ? isWorksActive 
                      ? 'text-white font-medium' 
                      : 'text-white/70 hover:text-white'
                    : isWorksActive 
                      ? 'text-space-sparkle font-medium' 
                      : 'text-inherit hover:text-vintage-charcoal dark:hover:text-bright-gray'
                }`}
              >
                <span className="relative block h-4 overflow-hidden">
                  <motion.span
                    className="flex flex-col items-center"
                    animate={{ y: (isWorksHovered || isWorksActive) ? -16 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block h-4 leading-4 normal-case font-light">Works</span>
                    <span className={`block h-4 leading-4 normal-case ${
                      isHeaderTransparent
                        ? isWorksActive ? 'text-white font-medium' : 'text-white'
                        : isWorksActive
                          ? isDarkMode ? 'text-bright-gray font-medium' : 'text-space-sparkle font-medium'
                          : isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
                    }`}>Gawâ</span>
                  </motion.span>
                </span>
                {isWorksActive && (
                  <span className={`absolute bottom-0 left-[30%] w-[40%] h-[2px] rounded ${isHeaderTransparent ? 'bg-white' : 'bg-space-sparkle'}`}></span>
                )}
              </div>

              {/* WORKS DROPDOWN MENU */}
              <AnimatePresence>
                {isWorksHovered && (
                  <WorksDropdown
                    isDarkMode={isDarkMode}
                    currentFilter={projectFilter}
                    onFilterSelect={(filter) => {
                      setProjectFilter(filter);
                      setActiveTab('works');
                      setSelectedProject(null);
                      setSelectedMember(null);
                      setIsWorksHovered(false);
                    }}
                    onClose={() => setIsWorksHovered(false)}
                  />
                )}
              </AnimatePresence>
            </div>
            <div 
              onMouseEnter={() => setIsAboutHovered(true)}
              onMouseLeave={() => setIsAboutHovered(false)}
            >
              <div 
                onClick={() => handleNavClick('our-services')}
                className={`transition-all duration-300 relative py-1 text-center cursor-pointer normal-case ${
                  isHeaderTransparent
                    ? isStudioActive 
                      ? 'text-white font-medium' 
                      : 'text-white/70'
                    : isStudioActive 
                      ? 'text-space-sparkle font-medium' 
                      : 'text-inherit hover:text-vintage-charcoal dark:hover:text-bright-gray'
                }`}
              >
                <span className="relative block h-4 overflow-hidden">
                  <motion.span
                    className="flex flex-col items-center"
                    animate={{ y: (isAboutHovered || isStudioActive) ? -16 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block h-4 leading-4 font-light">Studio</span>
                    <span className={`block h-4 leading-4 ${
                      isHeaderTransparent
                        ? isStudioActive ? 'text-white font-medium' : 'text-white'
                        : isStudioActive
                          ? isDarkMode ? 'text-bright-gray font-medium' : 'text-space-sparkle font-medium'
                          : isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
                    }`}>Kamí</span>
                  </motion.span>
                </span>
                {isStudioActive && (
                  <span className={`absolute bottom-0 left-[30%] w-[40%] h-[2px] rounded ${isHeaderTransparent ? 'bg-white' : 'bg-space-sparkle'}`}></span>
                )}
              </div>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {isAboutHovered && (
                  <StudioDropdown
                    activeTab={activeTab}
                    isDarkMode={isDarkMode}
                    onNavClick={handleNavClick}
                    onClose={() => setIsAboutHovered(false)}
                  />
                )}
              </AnimatePresence>
            </div>
            <div 
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={() => setIsContactHovered(false)}
            >
              <div 
                onClick={() => handleNavClick('contact')}
                className={`transition-all duration-300 relative py-1 text-center cursor-pointer normal-case min-w-[80px] ${
                  isHeaderTransparent
                    ? isContactActive 
                      ? 'text-white font-medium' 
                      : 'text-white/70'
                    : isContactActive 
                      ? 'text-space-sparkle font-medium' 
                      : 'text-inherit hover:text-vintage-charcoal dark:hover:text-bright-gray'
                }`}
              >
                <span className="relative block h-4 overflow-hidden">
                  <motion.span
                    className="flex flex-col items-center"
                    animate={{ y: (isContactHovered || isContactActive) ? -16 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block h-4 leading-4 font-light">Contact</span>
                    <span className={`block h-4 leading-4 ${
                      isHeaderTransparent
                        ? isContactActive ? 'text-white font-medium' : 'text-white'
                        : isContactActive
                          ? isDarkMode ? 'text-bright-gray font-medium' : 'text-space-sparkle font-medium'
                          : isDarkMode ? 'text-bright-gray' : 'text-vintage-charcoal'
                    }`}>Kumustá</span>
                  </motion.span>
                </span>
                {isContactActive && (
                  <span className={`absolute bottom-0 left-[30%] w-[40%] h-[2px] rounded ${isHeaderTransparent ? 'bg-white' : 'bg-space-sparkle'}`}></span>
                )}
              </div>

              {/* CONTACT DROPDOWN MENU */}
              <AnimatePresence>
                {isContactHovered && (
                  <ContactDropdown
                    activeTab={activeTab}
                    isDarkMode={isDarkMode}
                    onNavClick={handleNavClick}
                    onClose={() => setIsContactHovered(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Action Area */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 mr-0 pr-0">
          {/* CTA Button 1: Schedule a Discovery Meeting */}
          <button 
            onClick={() => handleNavClick('intake')}
            title="Schedule a Discovery Meeting"
            className={`group hidden md:flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-full transition-all duration-300 ease-in-out cursor-pointer select-none shrink-0 overflow-hidden shadow-sm hover:w-auto hover:px-3.5 ${
              isHeaderTransparent
                ? 'bg-white text-vintage-charcoal hover:bg-white/95'
                : 'bg-space-sparkle text-bright-gray hover:bg-space-sparkle/90'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="max-w-0 group-hover:max-w-[140px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap flex flex-col items-end text-right text-[9px] font-semibold uppercase tracking-wider leading-tight group-hover:mr-2">
                <span>Schedule a</span>
                <span>Discovery Meeting</span>
              </span>
              <Calendar size={18} className="shrink-0" />
            </div>
          </button>

          {/* CTA Button 2: Request a Proposal */}
          <button 
            onClick={() => handleNavClick('intake')}
            title="Request a Proposal"
            className={`group hidden md:flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-full transition-all duration-300 ease-in-out cursor-pointer select-none shrink-0 overflow-hidden hover:w-auto hover:px-3.5 ${
              isHeaderTransparent
                ? 'border border-white/50 text-white hover:bg-white/15'
                : isDarkMode
                  ? 'border border-bright-gray/30 text-bright-gray hover:bg-white/10'
                  : 'border border-space-sparkle/30 text-space-sparkle hover:bg-space-sparkle/10'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="max-w-0 group-hover:max-w-[120px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap flex flex-col items-end text-right text-[9px] font-semibold uppercase tracking-wider leading-tight group-hover:mr-2">
                <span>Request a</span>
                <span>Proposal</span>
              </span>
              <FileText size={18} className="shrink-0" />
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 cursor-pointer ${isHeaderTransparent ? 'text-white' : 'text-inherit'}`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
