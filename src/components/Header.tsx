'use client';

import React from 'react';
import { Menu, X, Calendar, FileText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '../lib/theme-context';
import { ROUTES, TAB_TO_ROUTE } from '../lib/routes';
import { WORKS_NAV_STRUCTURE, STUDIO_NAV_STRUCTURE, CONTACT_NAV_STRUCTURE } from '../lib/navData';
import { AtbpLogo } from './AtbpLogo';
import { NavItem } from './NavItem';
import { CtaButton } from './CtaButton';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const worksSlug = pathname.startsWith('/works/') ? pathname.split('/')[2] : null;
  const currentCategoryFilter = worksSlug ? decodeURIComponent(worksSlug) : 'All';

  const isWorksLanding = pathname === '/works';
  const isStudioLanding = pathname === '/' || pathname === '/studio';
  const isContactLanding = pathname === '/contact';

  const activeTab = Object.keys(TAB_TO_ROUTE).find((key) => TAB_TO_ROUTE[key] === pathname) || null;

  const isHeaderTransparent = isStudioLanding || isWorksLanding || isContactLanding;

  const isWorksActive = pathname.startsWith('/works');
  const isStudioActive =
    pathname.startsWith('/our-services') ||
    pathname.startsWith('/our-people') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/studio/');
  const isContactActive =
    pathname.startsWith('/contact') ||
    pathname === '/career' ||
    pathname === '/supplier' ||
    pathname === '/builder' ||
    pathname === '/consultant';

  const handleLogoClick = () => {
    router.push(ROUTES.home);
  };

  const handleNavClick = (tab: string) => {
    router.push(TAB_TO_ROUTE[tab] ?? ROUTES.home);
  };

  return (
    <header
      id="main-header"
      className={`${
        isHeaderTransparent
          ? 'absolute top-0 left-0 w-full z-40 bg-transparent border-b border-transparent text-white'
          : `sticky top-0 z-40 backdrop-blur-md transition-colors border-b duration-300 ${
              isDarkMode
                ? 'bg-vintage-charcoal/90 border-space-sparkle/20 text-bright-gray'
                : 'bg-bright-gray/90 border-space-sparkle/10 text-vintage-charcoal'
            }`
      }`}
    >
      <div 
        className={`mx-auto py-2 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full ${
          isHeaderTransparent ? 'max-w-7xl px-4 sm:px-6' : 'max-w-[100vw] px-4 sm:px-8'
        }`}
      >
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
            <NavItem
              label="Works"
              translation="Gawâ"
              isActive={isWorksActive}
              isHeaderTransparent={isHeaderTransparent}
              isDarkMode={isDarkMode}
              navGroups={WORKS_NAV_STRUCTURE}
              activeId={currentCategoryFilter}
              minWidthClass="min-w-[70px]"
              onClick={() => router.push(ROUTES.works)}
              onDropdownItemClick={(id) => router.push(`${ROUTES.works}/${encodeURIComponent(id)}`)}
            />
            <NavItem
              label="Studio"
              translation="Kamí"
              isActive={isStudioActive}
              isHeaderTransparent={isHeaderTransparent}
              isDarkMode={isDarkMode}
              navGroups={STUDIO_NAV_STRUCTURE}
              activeId={activeTab}
              onClick={() => handleNavClick('studio')}
              onDropdownItemClick={(id) => handleNavClick(id)}
            />
            <NavItem
              label="Contact"
              translation="Kumustá"
              isActive={isContactActive}
              isHeaderTransparent={isHeaderTransparent}
              isDarkMode={isDarkMode}
              navGroups={CONTACT_NAV_STRUCTURE}
              activeId={activeTab}
              minWidthClass="min-w-[80px]"
              onClick={() => handleNavClick('contact')}
              onDropdownItemClick={(id) => handleNavClick(id)}
            />
          </nav>
        </div>

        {/* Action Area */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 mr-0 pr-0">
          <CtaButton
            title="Schedule a Discovery Meeting"
            lines={['Schedule a', 'Discovery Meeting']}
            icon={<Calendar size={18} className="shrink-0" />}
            onClick={() => router.push(ROUTES.discoveryMeeting)}
            isHeaderTransparent={isHeaderTransparent}
            isDarkMode={isDarkMode}
            variant="solid"
            expandedMaxWidthClass="group-hover:max-w-[140px]"
          />

          <CtaButton
            title="Request a Proposal"
            lines={['Request a', 'Proposal']}
            icon={<FileText size={18} className="shrink-0" />}
            onClick={() => router.push(ROUTES.discoveryMeeting)}
            isHeaderTransparent={isHeaderTransparent}
            isDarkMode={isDarkMode}
            variant="outline"
            expandedMaxWidthClass="group-hover:max-w-[120px]"
          />

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
