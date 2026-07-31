/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Project } from './types';
import { Member } from './membersData';
import { useContentProtection } from './hooks/useContentProtection';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileDrawer } from './components/MobileDrawer';
import { ProjectDetail } from './components/ProjectDetail';
import { MemberDetail } from './components/MemberDetail';
import { ProposalForm } from './components/ProposalForm';

// Pages
import { StudioPage } from './pages/StudioPage';
import { WorksPage } from './pages/WorksPage';
import { ServicesPage } from './pages/ServicesPage';
import { OurServicesPage } from './pages/OurServicesPage';
import { OurPeoplePage } from './pages/OurPeoplePage';
import { ContactPage } from './pages/ContactPage';
import { CareerPage } from './pages/CareerPage';
import { SupplierPage } from './pages/SupplierPage';
import { BuilderPage } from './pages/BuilderPage';
import { ConsultantPage } from './pages/ConsultantPage';
import { StudioPlaceholderPage } from './pages/StudioPlaceholderPage';

// Helper to determine theme based on local time (Dark mode: 6 PM - 6 AM; Light mode: 6 AM - 6 PM)
const getAutoThemeIsDark = (): boolean => {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 6;
};

export default function App() {
  const [isProtectionEnabled, setIsProtectionEnabled] = useState<boolean>(false);
  const { isShielded } = useContentProtection(isProtectionEnabled);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getAutoThemeIsDark);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [heroActiveIndex, setHeroActiveIndex] = useState<number>(0);
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.className = next ? 'dark' : '';
      return next;
    });
  };

  const handleToggleProtection = () => {
    setIsProtectionEnabled((prev) => !prev);
  };

  // Auto-switch theme based on user's local time/timezone
  useEffect(() => {
    const checkTheme = () => {
      const shouldBeDark = getAutoThemeIsDark();
      setIsDarkMode(shouldBeDark);
      document.documentElement.className = shouldBeDark ? 'dark' : '';
    };

    checkTheme();
    // Check local time every minute to switch theme dynamically
    const interval = setInterval(checkTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeLanding = (activeTab === 'home' || activeTab === 'studio') && !selectedProject && !selectedMember;
  const isWorksLanding = activeTab === 'works' && projectFilter === 'All' && !selectedProject && !selectedMember;
  const isWorksPage = activeTab === 'works' && !selectedProject && !selectedMember;
  const isServicesPage = activeTab === 'services' && !selectedProject && !selectedMember;
  const isPeoplePage = (activeTab === 'our-people' || activeTab.startsWith('our-people-')) && !selectedProject && !selectedMember;
  const isContactPage = [
    'contact',
    'case-study-house',
    'grow-with-us',
    'partner-with-us',
    'contact-info',
  ].includes(activeTab) && !selectedProject && !selectedMember;
  const isCareerPage = activeTab === 'career' && !selectedProject && !selectedMember;
  const isSupplierPage = (activeTab === 'supplier' || activeTab === 'suppliers') && !selectedProject && !selectedMember;
  const isBuilderPage = (activeTab === 'builder' || activeTab === 'builders') && !selectedProject && !selectedMember;
  const isConsultantPage = (activeTab === 'consultant' || activeTab === 'consultants') && !selectedProject && !selectedMember;
  const isStudioSubpage = [
    'comprehensive-services',
    'piecework-services',
    'designing-with-values',
    'managing-with-integrity',
    'building-with-culture',
  ].includes(activeTab) && !selectedProject && !selectedMember;
  const isFullScreenLanding = isHomeLanding || isWorksPage || isServicesPage || isPeoplePage || isContactPage || isCareerPage || isSupplierPage || isBuilderPage || isConsultantPage || isStudioSubpage || !!selectedProject;

  return (
    <div className={`${isFullScreenLanding ? 'h-screen overflow-hidden flex flex-col' : 'min-h-screen'} font-sans transition-colors duration-500 ease-in-out ${
      isDarkMode 
        ? 'bg-vintage-charcoal text-bright-gray' 
        : 'bg-bright-gray text-vintage-charcoal'
    }`}>
      
      {/* HEADER NAVIGATION */}
      <Header
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
      />

      {/* Off-screen Side Drawer Menu */}
      <MobileDrawer
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProject={selectedProject}
        selectedMember={selectedMember}
        setSelectedProject={setSelectedProject}
        setSelectedMember={setSelectedMember}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
      />

      {/* DETAILED PROJECT WORKSPACE (OVERLAY OR TOP-VIEW WHEN SELECTED) */}
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            isDarkMode={isDarkMode}
            onBack={() => setSelectedProject(null)}
            onStartConsultation={() => {
              setActiveTab('intake');
              setSelectedProject(null);
            }}
            onMemberSelect={(member) => {
              setSelectedMember(member);
              setSelectedProject(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : selectedMember ? (
          <MemberDetail
            member={selectedMember}
            isDarkMode={isDarkMode}
            onBack={() => {
              setSelectedMember(null);
              setActiveTab('our-people');
            }}
            onProjectSelect={(project) => {
              setSelectedProject(project);
              setSelectedMember(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <AnimatePresence mode="wait">
            {/* HOMEPAGE TAB */}
            {(activeTab === 'home' || activeTab === 'studio') && (
              <StudioPage
                isDarkMode={isDarkMode}
                setActiveTab={setActiveTab}
                heroActiveIndex={heroActiveIndex}
                setHeroActiveIndex={setHeroActiveIndex}
              />
            )}

            {/* WORKS / PROJECTS ARCHIVE TAB */}
            {activeTab === 'works' && (
              <WorksPage
                isDarkMode={isDarkMode}
                projectFilter={projectFilter}
                setProjectFilter={setProjectFilter}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                onProjectSelect={handleProjectSelect}
              />
            )}

            {/* PROCESS & STAGES TAB */}
            {activeTab === 'services' && (
              <ServicesPage
                isDarkMode={isDarkMode}
                setActiveTab={setActiveTab}
              />
            )}

            {/* OUR SERVICES TAB */}
            {activeTab === 'our-services' && (
              <OurServicesPage
                isDarkMode={isDarkMode}
              />
            )}

            {/* OUR PEOPLE TAB */}
            {isPeoplePage && (
              <OurPeoplePage
                isDarkMode={isDarkMode}
                setSelectedMember={setSelectedMember}
                initialFilter={
                  activeTab === 'our-people-designers'
                    ? 'designers'
                    : activeTab === 'our-people-managers'
                    ? 'managers'
                    : activeTab === 'our-people-builders'
                    ? 'builders'
                    : 'all'
                }
              />
            )}

            {/* INTAKE SURVEY FORM / QUALIFIER FUNNEL */}
            {activeTab === 'intake' && (
              <ProposalForm
                isDarkMode={isDarkMode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* CONTACT TAB & SUBCATEGORY LANDING PAGES */}
            {['contact', 'case-study-house', 'grow-with-us', 'partner-with-us', 'contact-info'].includes(activeTab) && (
              <ContactPage
                isDarkMode={isDarkMode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* CAREER TAB */}
            {activeTab === 'career' && (
              <CareerPage
                isDarkMode={isDarkMode}
              />
            )}

            {/* SUPPLIER TAB */}
            {(activeTab === 'supplier' || activeTab === 'suppliers') && (
              <SupplierPage
                isDarkMode={isDarkMode}
              />
            )}

            {/* BUILDER TAB */}
            {(activeTab === 'builder' || activeTab === 'builders') && (
              <BuilderPage
                isDarkMode={isDarkMode}
              />
            )}

            {/* CONSULTANT TAB */}
            {(activeTab === 'consultant' || activeTab === 'consultants') && (
              <ConsultantPage
                isDarkMode={isDarkMode}
              />
            )}

            {/* STUDIO SUBPAGES */}
            {[
              'comprehensive-services',
              'piecework-services',
              'designing-with-values',
              'managing-with-integrity',
              'building-with-culture',
            ].includes(activeTab) && (
              <StudioPlaceholderPage
                subpageId={activeTab}
                isDarkMode={isDarkMode}
                setActiveTab={setActiveTab}
              />
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>

      {/* FOOTER CO-FOUNDATION DETAILS */}
      {!isHomeLanding && (
        <Footer
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          isProtectionEnabled={isProtectionEnabled}
          onToggleProtection={handleToggleProtection}
        />
      )}

      {/* Netflix-style DRM Anti-Screenshot Shield Overlay */}
      {isShielded && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[999999] flex flex-col items-center justify-center text-white select-none pointer-events-none p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-60">
            <span className="text-xl font-mono">🔒</span>
          </div>
          <p className="text-caption sm:text-body font-bold tracking-widest uppercase opacity-90">
            Protected Content
          </p>
          <p className="text-mini font-light opacity-60 max-w-sm">
            ATBP Collaborative digital content protection enabled
          </p>
        </div>
      )}

    </div>
  );
}
