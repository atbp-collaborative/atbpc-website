import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Member } from '../types';
import { Button } from './Button';
import { AtbpLogo } from './AtbpLogo';

import { WORKS_NAV_STRUCTURE } from './WorksDropdown';
import { STUDIO_NAV_STRUCTURE } from './StudioDropdown';
import { CONTACT_NAV_STRUCTURE } from './ContactDropdown';

interface MobileDrawerProps {
  isDarkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProject: Project | null;
  selectedMember: Member | null;
  setSelectedProject: (proj: Project | null) => void;
  setSelectedMember: (mem: Member | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  projectFilter?: string;
  setProjectFilter: (filter: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isDarkMode,
  activeTab,
  setActiveTab,
  selectedProject,
  selectedMember,
  setSelectedProject,
  setSelectedMember,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  projectFilter = 'All',
  setProjectFilter,
}) => {
  let isStudioLandingActive = activeTab === 'home';
  let isWorksActive = activeTab === 'works';
  let isStudioActive = activeTab === 'our-services' || activeTab === 'our-people' || activeTab === 'services';
  let isContactActive = activeTab === 'contact' || activeTab === 'career' || activeTab === 'supplier' || activeTab === 'suppliers' || activeTab === 'builder' || activeTab === 'builders';

  if (selectedProject) {
    isStudioLandingActive = false;
    isWorksActive = true;
    isStudioActive = false;
    isContactActive = false;
  } else if (selectedMember) {
    isStudioLandingActive = false;
    isWorksActive = false;
    isStudioActive = true;
    isContactActive = false;
  }

  // Accordion expansion state: only one category expanded at a time
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedWorksCategory, setExpandedWorksCategory] = useState<string | null>(null);

  // Sync expanded section with active category when menu is opened or activeTab changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      if (isStudioActive) {
        setExpandedSection('studio');
      } else if (isContactActive) {
        setExpandedSection('contact');
      } else if (isWorksActive) {
        setExpandedSection('works');
      } else {
        setExpandedSection(null);
      }

      // Auto expand the Works category that contains the active link
      const activeGroup = WORKS_NAV_STRUCTURE.find((group) =>
        group.subcategories.some((sub) => sub.id === projectFilter) || group.mainCategory === projectFilter
      );
      if (activeGroup) {
        setExpandedWorksCategory(activeGroup.mainCategory);
      }
    }
  }, [isMobileMenuOpen, activeTab, isStudioActive, isContactActive, isWorksActive, projectFilter]);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedProject(null);
    setSelectedMember(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className={`fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-50 h-full p-6 shadow-2xl flex flex-col justify-between ${
              isDarkMode 
                ? 'bg-vintage-charcoal text-bright-gray border-l border-space-sparkle/20' 
                : 'bg-bright-gray text-vintage-charcoal border-l border-space-sparkle/10'
            }`}
          >
            <div className="space-y-8">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-space-sparkle/10">
                <AtbpLogo isDarkMode={isDarkMode} className="h-6 w-auto" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3">
                <button 
                  onClick={() => handleNavClick('home')}
                  className={`text-left text-caption tracking-widest uppercase py-3 px-4 rounded-none transition-all cursor-pointer ${
                    isStudioLandingActive
                      ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                  }`}
                >
                  Homepage | Bungad
                </button>

                {/* Sub-item 2-level dropdown section for Works */}
                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setProjectFilter('All');
                      handleNavClick('works');
                      setExpandedSection(prev => prev === 'works' ? null : 'works');
                    }}
                    className={`w-full flex items-center justify-between text-left text-caption tracking-widest normal-case py-3 px-4 rounded-none transition-all cursor-pointer ${
                      isWorksActive
                        ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                    }`}
                  >
                    <span>Works | Gawâ</span>
                    <motion.span
                      animate={{ rotate: expandedSection === 'works' ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="ml-2 flex items-center"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedSection === 'works' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 flex flex-col space-y-1.5 border-l border-space-sparkle/15 ml-3 pt-1 pb-2">
                          {WORKS_NAV_STRUCTURE.map((group) => {
                            const isGroupExpanded = expandedWorksCategory === group.mainCategory;

                            return (
                              <div key={group.mainCategory} className="space-y-1">
                                <div
                                  onClick={() => setExpandedWorksCategory(prev => prev === group.mainCategory ? null : group.mainCategory)}
                                  className="flex items-center justify-between py-1.5 px-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none"
                                >
                                  <span className="text-caption font-bold tracking-widest normal-case text-left">
                                    {group.mainCategory}
                                  </span>
                                  <motion.span
                                    animate={{ rotate: isGroupExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.6 }}
                                  >
                                    <ChevronDown size={14} />
                                  </motion.span>
                                </div>

                                <AnimatePresence initial={false}>
                                  {isGroupExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pl-3 flex flex-col space-y-1 border-l border-space-sparkle/20 ml-3 py-1">
                                        {group.subcategories.map((sub) => (
                                          <button
                                            key={sub.id}
                                            onClick={() => {
                                              setProjectFilter(sub.id);
                                              handleNavClick('works');
                                            }}
                                            className="text-left text-mini tracking-wider py-1.5 px-2.5 rounded-none transition-all cursor-pointer opacity-85 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                                          >
                                            {sub.name}
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sub-item dropdown section for Studio */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setExpandedSection(prev => prev === 'studio' ? null : 'studio')}
                    className={`w-full flex items-center justify-between text-left text-caption tracking-widest uppercase py-3 px-4 rounded-none transition-all cursor-pointer ${
                      isStudioActive
                        ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                    }`}
                  >
                    <span>Studio | Kamí</span>
                    <motion.span
                      animate={{ rotate: expandedSection === 'studio' ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="ml-2 flex items-center"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedSection === 'studio' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 flex flex-col space-y-2 border-l border-space-sparkle/15 ml-4 pt-1 pb-2">
                          {STUDIO_NAV_STRUCTURE.map((sec) => (
                            <div key={sec.mainSection} className="space-y-1">
                              <button 
                                onClick={() => handleNavClick(sec.tab)}
                                className="text-left text-caption font-bold tracking-widest py-1 px-2 block w-full hover:bg-black/5 dark:hover:bg-white/5"
                              >
                                {activeTab === sec.tab ? sec.translation : sec.mainSection}
                              </button>
                              <div className="pl-3 flex flex-col space-y-1 border-l border-space-sparkle/10 ml-2">
                                {sec.items.map((item) => (
                                  <button
                                    key={item.tab}
                                    onClick={() => handleNavClick(item.tab)}
                                    className={`text-left text-mini py-0.5 px-2 block cursor-pointer transition-opacity ${
                                      activeTab === item.tab
                                        ? 'font-bold opacity-100'
                                        : 'opacity-80 hover:opacity-100'
                                    }`}
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sub-item dropdown section for Contact */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setExpandedSection(prev => prev === 'contact' ? null : 'contact')}
                    className={`w-full flex items-center justify-between text-left text-caption tracking-widest uppercase py-3 px-4 rounded-none transition-all cursor-pointer ${
                      isContactActive
                        ? isDarkMode ? 'bg-space-sparkle/20 text-white font-bold' : 'bg-space-sparkle/10 text-space-sparkle font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                    }`}
                  >
                    <span>Contact | Kumustá</span>
                    <motion.span
                      animate={{ rotate: expandedSection === 'contact' ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="ml-2 flex items-center"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedSection === 'contact' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 flex flex-col space-y-2 border-l border-space-sparkle/15 ml-4 pt-1 pb-2">
                          {CONTACT_NAV_STRUCTURE.map((grp) => (
                            <div key={grp.mainCategory} className="space-y-1">
                              <button
                                onClick={() => handleNavClick(grp.tab)}
                                className={`text-left text-caption font-bold tracking-widest block py-1 px-2 w-full transition-opacity cursor-pointer ${
                                  activeTab === grp.tab ? 'opacity-100 text-space-sparkle' : 'opacity-90 hover:opacity-100'
                                }`}
                              >
                                {grp.mainCategory}
                              </button>
                              <div className="pl-3 flex flex-col space-y-1 border-l border-space-sparkle/10 ml-2">
                                {grp.subitems.map((sub) => (
                                  <button
                                    key={sub.name}
                                    onClick={() => handleNavClick(sub.tab)}
                                    className="text-left text-mini opacity-80 hover:opacity-100 py-0.5 px-2 block"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </div>

            {/* Drawer Footer / CTA Area */}
            <div className="space-y-2.5 pt-6 border-t border-space-sparkle/10">
              <button 
                onClick={() => handleNavClick('intake')}
                className="w-full flex flex-col items-center justify-center py-2 px-4 rounded-none font-sans font-semibold text-caption uppercase tracking-wider leading-tight transition-all cursor-pointer text-center bg-space-sparkle text-bright-gray hover:bg-space-sparkle/90 shadow-sm"
              >
                <span>Schedule a</span>
                <span>Discovery Meeting</span>
              </button>

              <button 
                onClick={() => handleNavClick('intake')}
                className={`w-full flex flex-col items-center justify-center py-2 px-4 rounded-none font-sans font-semibold text-caption uppercase tracking-wider leading-tight transition-all cursor-pointer text-center border ${
                  isDarkMode
                    ? 'border-bright-gray/30 text-bright-gray hover:bg-white/10'
                    : 'border-space-sparkle/30 text-space-sparkle hover:bg-space-sparkle/10'
                }`}
              >
                <span>Request a</span>
                <span>Proposal</span>
              </button>

              <div className="text-caption text-center font-sans opacity-40 pt-2">
                © 2026 ATBP Collaborative
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
