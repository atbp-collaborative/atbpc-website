/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { Globe, Compass, Briefcase, Sparkles, RefreshCw, LayoutTemplate } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/primitives/buttons/Button';
import { useAdminCms, CmsTab } from '@/hooks/admin/useAdminCms';
import { CmsPagesTab } from '@/components/admin/cms/CmsPagesTab';
import { CmsLandingPagesTab } from '@/components/admin/cms/CmsLandingPagesTab';
import { CmsProcessTab } from '@/components/admin/cms/CmsProcessTab';
import { CmsServicesTab } from '@/components/admin/cms/CmsServicesTab';
import { CmsHomeTab } from '@/components/admin/cms/CmsHomeTab';
import { useTheme } from '@/context/ThemeContext';

export default function AdminContentPage() {
  const { isDarkMode } = useTheme();
  const {
    activeTab,
    setActiveTab,
    isLoading,
    refresh,
    // Tab 1
    pages,
    cards,
    savePage,
    saveCard,
    // Tab 2
    philosophies,
    selectedProcessPageId,
    selectProcessPage,
    stageGroups,
    savePhilosophy,
    saveStageGroup,
    deleteStageGroup,
    saveProcessStage,
    deleteProcessStage,
    // Tab 3
    services,
    selectedServiceId,
    setSelectedServiceId,
    saveService,
    // Tab 4
    slides,
    saveSlide,
    deleteSlide,
    reorderSlides,
  } = useAdminCms();

  const tabs: { id: CmsTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Homepage', icon: Sparkles },
    { id: 'landing-pages', label: 'Landing Pages', icon: LayoutTemplate },
    { id: 'pages', label: 'Content Pages', icon: Globe },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'process', label: 'Processes', icon: Compass },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage content"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'CMS Content' }]}
        actions={
          <Button
            type="ghost"
            onClick={refresh}
            className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
          >
            <RefreshCw size={13} className={`mr-1 inline ${isLoading ? 'animate-spin' : ''}`} /> Sync Live
          </Button>
        }
      />

      <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* TOP TAB NAVIGATION BAR */}
        <div
          className={`p-1.5 rounded-xl border flex items-center gap-1.5 overflow-x-auto ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-caption font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-space-sparkle text-white shadow-xs'
                    : isDarkMode
                      ? 'text-bright-gray/70 hover:bg-white/5 hover:text-white'
                      : 'text-vintage-charcoal/70 hover:bg-black/5 hover:text-black'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        {isLoading ? (
          <div className="py-20 text-center opacity-50 text-mini font-mono">
            Loading studio content data...
          </div>
        ) : (
          <div>
            {activeTab === 'home' && (
              <CmsHomeTab
                slides={slides}
                onSaveSlide={saveSlide}
                onDeleteSlide={deleteSlide}
                onReorderSlides={reorderSlides}
              />
            )}

            {activeTab === 'landing-pages' && (
              <CmsLandingPagesTab
                cards={cards}
                onSaveCard={saveCard}
              />
            )}

            {activeTab === 'pages' && (
              <CmsPagesTab
                pages={pages}
                onSavePage={savePage}
              />
            )}

            {activeTab === 'services' && (
              <CmsServicesTab
                services={services}
                selectedServiceId={selectedServiceId}
                onSelectServiceId={setSelectedServiceId}
                onSaveService={saveService}
              />
            )}

            {activeTab === 'process' && (
              <CmsProcessTab
                philosophies={philosophies}
                selectedProcessPageId={selectedProcessPageId}
                onSelectProcessPage={selectProcessPage}
                stageGroups={stageGroups}
                onSavePhilosophy={savePhilosophy}
                onSaveStageGroup={saveStageGroup}
                onDeleteStageGroup={deleteStageGroup}
                onSaveProcessStage={saveProcessStage}
                onDeleteProcessStage={deleteProcessStage}
                cards={cards}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
