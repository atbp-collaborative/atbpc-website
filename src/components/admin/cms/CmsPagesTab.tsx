/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { SitePage, NavigationCardItem } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { useTheme } from '@/context/ThemeContext';

interface CmsPagesTabProps {
  pages: SitePage[];
  onSavePage: (page: SitePage) => void;
  cards?: NavigationCardItem[];
}

const SUBPAGE_TEMPLATES: SitePage[] = [
  // 1. contact/case-study-house subpages
  {
    id: 'contact/case-study-house/discovery-session',
    title: 'schedule a discovery session',
    subtitle: 'for project intake, site feasibility & spatial planning consultations',
    heroImageUrl: '/images/studio_services_img_1785469964556.jpg',
    isDraft: false,
  },
  {
    id: 'contact/case-study-house/request-a-proposal',
    title: 'request a proposal',
    subtitle: 'for official cost estimates and formal project proposals',
    heroImageUrl: '/images/production_drawings_1783495233053.jpg',
    isDraft: false,
  },
  {
    id: 'contact/case-study-house/contact-info',
    title: 'studio hours & location',
    subtitle: 'headquarters, physical visits, interactive map & contact coordinates',
    heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
    isDraft: false,
  },

  // 2. contact/grow-with-us subpages
  {
    id: 'contact/grow-with-us/apprenticeship-programs',
    title: 'apprenticeship programs',
    subtitle: 'for on-the-job training requirements & licensure mentorship',
    heroImageUrl: '/images/studio_people_img_1785469993286.jpg',
    isDraft: false,
  },
  {
    id: 'contact/grow-with-us/regular-programs',
    title: 'regular programs',
    subtitle: 'for licensed architects, project directors & design practitioners',
    heroImageUrl: '/images/production_drawings_1783495233053.jpg',
    isDraft: false,
  },

  // 3. contact/partner-with-us subpages
  {
    id: 'contact/partner-with-us/supplier',
    title: 'suppliers',
    subtitle: 'for material suppliers & trade product specifications',
    heroImageUrl: '/images/kiosk_coffee_bar_1783495252161.jpg',
    isDraft: false,
  },
  {
    id: 'contact/partner-with-us/consultant',
    title: 'consultants',
    subtitle: 'for engineering & specialty technical consultants',
    heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
    isDraft: false,
  },
  {
    id: 'contact/partner-with-us/builder',
    title: 'builders',
    subtitle: 'for trade contractors & specialty builders',
    heroImageUrl: '/images/studio_process_img_1785469980353.jpg',
    isDraft: false,
  },
];

const SUBPAGE_CATEGORIES = [
  { id: 'all', label: 'All Subpages' },
  { id: 'case-study-house', label: 'Case Study House' },
  { id: 'grow-with-us', label: 'Grow With Us' },
  { id: 'partner-with-us', label: 'Partner With Us' },
];

function getSubpageCategory(id: string): { label: string; id: string } {
  const norm = id.toLowerCase();
  if (norm.includes('case-study-house')) return { label: 'Case Study House', id: 'case-study-house' };
  if (norm.includes('grow-with-us')) return { label: 'Grow With Us', id: 'grow-with-us' };
  if (norm.includes('partner-with-us')) return { label: 'Partner With Us', id: 'partner-with-us' };
  return { label: 'Subpage', id: 'all' };
}

function getThumbnailForPage(page: SitePage, cards: NavigationCardItem[] = []): string {
  const normPageId = page.id.toLowerCase().replace(/^\/+|\/+$/g, '');
  const lastSegment = normPageId.split('/').pop() || '';

  const matched = cards.find((c) => {
    const normTarget = (c.targetHref || '').toLowerCase().replace(/^\/+|\/+$/g, '');
    if (normTarget && (normTarget === normPageId || normTarget.endsWith(normPageId) || normPageId.endsWith(normTarget))) {
      return true;
    }
    const normKey = (c.cardKey || '').toLowerCase();
    if (normKey && normKey === lastSegment) {
      return true;
    }
    return false;
  });

  return matched?.imageUrl || page.heroImageUrl || '';
}

export const CmsPagesTab: React.FC<CmsPagesTabProps> = ({
  pages,
  onSavePage,
  cards = [],
}) => {
  const { isDarkMode } = useTheme();

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Merge incoming pages from DB with SUBPAGE_TEMPLATES
  const activeSubpages = useMemo(() => {
    return SUBPAGE_TEMPLATES.map((tmpl) => {
      const match = pages.find((p) => {
        const pId = p.id.toLowerCase().replace(/^\/+|\/+$/g, '');
        const tmplId = tmpl.id.toLowerCase().replace(/^\/+|\/+$/g, '');
        if (pId === tmplId) return true;
        const pLast = pId.split('/').pop();
        const tmplLast = tmplId.split('/').pop();
        return Boolean(pLast && pLast === tmplLast);
      });
      return match ? { ...tmpl, ...match, id: tmpl.id } : tmpl;
    });
  }, [pages]);

  const filteredSubpages = useMemo(() => {
    if (activeCategory === 'all') return activeSubpages;
    return activeSubpages.filter((p) => getSubpageCategory(p.id).id === activeCategory);
  }, [activeSubpages, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-body font-bold flex items-center gap-2">
              <Globe size={18} className="text-space-sparkle" /> Content Pages ({filteredSubpages.length})
            </h3>
            <p className="text-mini opacity-60">
              Manage publication visibility for contact and outreach subpages.
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SUBPAGE_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? activeSubpages.length
                : activeSubpages.filter((p) => getSubpageCategory(p.id).id === cat.id).length;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-micro font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-space-sparkle text-white shadow-xs font-semibold'
                    : isDarkMode
                      ? 'bg-vintage-charcoal/80 text-bright-gray/70 hover:bg-white/5 border border-white/10'
                      : 'bg-white text-vintage-charcoal/70 hover:bg-black/5 border border-black/10'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* LIST ONLY VIEW */}
        <div className="space-y-3">
          {filteredSubpages.map((page) => {
            const category = getSubpageCategory(page.id);
            const displaySlug = page.id.startsWith('/') ? page.id : `/${page.id}`;
            const thumbnail = getThumbnailForPage(page, cards);

            return (
              <div
                key={page.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isDarkMode
                    ? 'bg-vintage-charcoal/60 border-white/10 hover:border-space-sparkle/40'
                    : 'bg-white border-black/10 hover:border-space-sparkle/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-14 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-black/10 shrink-0 border border-black/10 dark:border-white/10">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={page.title}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40 text-micro font-mono">
                        No Media
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="font-bold text-caption sm:text-body line-clamp-1 lowercase">
                      {page.title}
                    </h4>
                    <p className="text-micro font-mono opacity-50 uppercase truncate" title={displaySlug}>
                      {displaySlug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <PublicationToggle
                    isDraft={Boolean(page.isDraft)}
                    onToggle={() => onSavePage({ ...page, isDraft: !page.isDraft })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
