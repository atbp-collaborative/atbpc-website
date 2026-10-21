/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Globe, Save, RotateCcw } from 'lucide-react';
import { SitePage, NavigationCardItem } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

interface CmsPagesTabProps {
  pages: SitePage[];
  onSavePage: (page: SitePage) => Promise<any> | void;
  cards?: NavigationCardItem[];
}

// Complete list of 14 content subpages organized by parent page
const SUBPAGE_TEMPLATES: SitePage[] = [
  // 1. Studio / Services
  {
    id: 'studio/our-services/comprehensive-services',
    title: 'comprehensive services',
    subtitle: 'end-to-end design, statutory compliance & complete architecture sets',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-services-card.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-services/piecework-services',
    title: 'piecework services',
    subtitle: 'targeted drafting, 3D visualizations, bill of quantities & permits',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_services_img_1785469964556.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-services/consultation-retainer-services',
    title: 'consultation & retainer services',
    subtitle: 'site feasibility, project stewardship, peer reviews & retainers',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg',
    isDraft: false,
  },

  // 2. Studio / Process
  {
    id: 'studio/our-process/designing-with-values',
    title: 'designing with values',
    subtitle: 'purpose-driven spatial concepts anchored in environmental & social context',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_case_study_house_img_1785469986420.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-process/managing-with-integrity',
    title: 'managing with integrity',
    subtitle: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-process/building-with-culture',
    title: 'building with culture',
    subtitle: 'synthesizing regional craftsmanship with modern architectural technology',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_process_img_1785469980353.jpg',
    isDraft: false,
  },

  // 3. Work / The Case Study House
  {
    id: 'contact/case-study-house/discovery-session',
    title: 'schedule a discovery session',
    subtitle: 'for project intake, site feasibility & spatial planning consultations',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_services_img_1785469964556.jpg',
    isDraft: false,
  },
  {
    id: 'contact/case-study-house/request-a-proposal',
    title: 'request a proposal',
    subtitle: 'for official cost estimates and formal project proposals',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg',
    isDraft: false,
  },
  {
    id: 'contact/case-study-house/contact-info',
    title: 'studio hours & location',
    subtitle: 'headquarters, physical visits, interactive map & contact coordinates',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg',
    isDraft: false,
  },

  // 4. Work / Grow With Us
  {
    id: 'contact/grow-with-us/apprenticeship-programs',
    title: 'apprenticeship programs',
    subtitle: 'for on-the-job training requirements & licensure mentorship',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_people_img_1785469993286.jpg',
    isDraft: false,
  },
  {
    id: 'contact/grow-with-us/regular-programs',
    title: 'regular programs',
    subtitle: 'for licensed architects, project directors & design practitioners',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/production_drawings_1783495233053.jpg',
    isDraft: false,
  },

  // 5. Work / Partner With Us
  {
    id: 'contact/partner-with-us/supplier',
    title: 'suppliers',
    subtitle: 'for material suppliers & trade product specifications',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_partners_img_1785470031164.jpg',
    isDraft: false,
  },
  {
    id: 'contact/partner-with-us/consultant',
    title: 'consultants',
    subtitle: 'for engineering & specialty technical consultants',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_headquarters_img_1785470005846.jpg',
    isDraft: false,
  },
  {
    id: 'contact/partner-with-us/builder',
    title: 'builders',
    subtitle: 'for trade contractors & specialty builders',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio_process_img_1785469980353.jpg',
    isDraft: false,
  },
];

interface PageCategory {
  id: string;
  label: string;
  dividerBefore?: boolean;
}

const SUBPAGE_CATEGORIES: PageCategory[] = [
  { id: 'all', label: 'All Pages' },
  { id: 'studio-services', label: 'Studio / Services', dividerBefore: true },
  { id: 'studio-process', label: 'Studio / Process' },
  { id: 'case-study-house', label: 'Work / The Case Study House', dividerBefore: true },
  { id: 'grow-with-us', label: 'Work / Grow With Us' },
  { id: 'partner-with-us', label: 'Work / Partner With Us' },
];

function getSubpageCategory(id: string): { label: string; id: string } {
  const norm = id.toLowerCase();
  if (norm.includes('services')) return { label: 'Studio / Services', id: 'studio-services' };
  if (norm.includes('process')) return { label: 'Studio / Process', id: 'studio-process' };
  if (norm.includes('case-study-house')) return { label: 'Work / The Case Study House', id: 'case-study-house' };
  if (norm.includes('grow-with-us')) return { label: 'Work / Grow With Us', id: 'grow-with-us' };
  if (norm.includes('partner-with-us')) return { label: 'Work / Partner With Us', id: 'partner-with-us' };
  return { label: 'Subpage', id: 'all' };
}

function getThumbnailForPage(page: SitePage, cards: NavigationCardItem[] = []): string {
  const normPageId = page.id.toLowerCase().replace(/^\/+|\/+$/g, '');
  const lastSegment = normPageId.split('/').pop() || '';

  const matched = cards.find((c) => {
    const normTarget = (c.targetHref || '').toLowerCase().replace(/^\/+|\/+$/g, '');
    if (
      normTarget &&
      (normTarget === normPageId || normTarget.endsWith(normPageId) || normPageId.endsWith(normTarget))
    ) {
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

  // Staged pending draft states: pageId -> boolean (isDraft)
  const [pendingDrafts, setPendingDrafts] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync pendingDrafts baseline whenever activeSubpages changes and no changes pending
  const dirtyPageIds = useMemo(() => {
    return Object.keys(pendingDrafts).filter((pageId) => {
      const original = activeSubpages.find((p) => p.id === pageId);
      return original && pendingDrafts[pageId] !== Boolean(original.isDraft);
    });
  }, [pendingDrafts, activeSubpages]);

  const isDirty = dirtyPageIds.length > 0;

  const handleToggleDraft = (pageId: string, currentDraft: boolean) => {
    setPendingDrafts((prev) => {
      const nextValue = !currentDraft;
      const original = activeSubpages.find((p) => p.id === pageId);
      if (original && Boolean(original.isDraft) === nextValue) {
        // Returned to baseline, clear from pending
        const copy = { ...prev };
        delete copy[pageId];
        return copy;
      }
      return { ...prev, [pageId]: nextValue };
    });
  };

  const handleDiscardChanges = () => {
    setPendingDrafts({});
    toast.info('Draft/Publication changes reverted.');
  };

  const handleSaveChanges = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      const savePromises = dirtyPageIds.map(async (pageId) => {
        const page = activeSubpages.find((p) => p.id === pageId);
        if (!page) return;
        const updatedPage: SitePage = {
          ...page,
          isDraft: pendingDrafts[pageId],
        };
        await onSavePage(updatedPage);
      });

      await Promise.all(savePromises);
      setPendingDrafts({});
      toast.success(
        `Successfully saved publication status for ${dirtyPageIds.length} page(s).`
      );
    } catch (err: any) {
      console.error('Failed to save page changes:', err);
      toast.error(err?.message || 'Failed to save page changes.');
    } finally {
      setIsSaving(false);
    }
  };

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
              Manage publication visibility for Studio and Work subpages. All changes require confirmation.
            </p>
          </div>

          {/* Action buttons (Save Changes & Discard) */}
          {isDirty && (
            <div className="flex items-center gap-2.5 shrink-0 animate-fadeIn">
              <Button
                type="ghost"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10"
              >
                <RotateCcw size={13} className="mr-1 inline" /> Discard
              </Button>
              <Button
                type="filled"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="!py-1.5 !px-4 text-mini font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                <Save size={13} className={`mr-1.5 inline ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? 'Saving...' : `Save Changes (${dirtyPageIds.length})`}
              </Button>
            </div>
          )}
        </div>

        {/* Dirty State Warning Banner */}
        {isDirty && (
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDarkMode
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p className="text-caption font-medium">
                You have <strong>{dirtyPageIds.length}</strong> uncommitted publication change(s). Click <strong>Save Changes</strong> to update live public access.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="filled"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="!py-1.5 !px-3 text-mini font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save size={12} className="mr-1 inline" /> Save Now
              </Button>
            </div>
          </div>
        )}

        {/* Category Filter Chips (Sorted by parent page) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {SUBPAGE_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? activeSubpages.length
                : activeSubpages.filter((p) => getSubpageCategory(p.id).id === cat.id).length;
            const isSelected = activeCategory === cat.id;

            return (
              <React.Fragment key={cat.id}>
                {cat.dividerBefore && (
                  <div className="h-5 w-[1px] bg-black/20 dark:bg-white/20 mx-1 shrink-0" />
                )}
                <button
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
              </React.Fragment>
            );
          })}
        </div>

        {/* LIST VIEW */}
        <div className="space-y-3">
          {filteredSubpages.map((page) => {
            const displaySlug = page.id.startsWith('/') ? page.id : `/${page.id}`;
            const thumbnail = getThumbnailForPage(page, cards);
            const isDraftCurrent =
              pendingDrafts[page.id] !== undefined
                ? pendingDrafts[page.id]
                : Boolean(page.isDraft);
            const isPageDirty =
              pendingDrafts[page.id] !== undefined &&
              pendingDrafts[page.id] !== Boolean(page.isDraft);

            return (
              <div
                key={page.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isPageDirty
                    ? isDarkMode
                      ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30'
                      : 'bg-amber-50/50 border-amber-400 ring-1 ring-amber-400/30 shadow-xs'
                    : isDarkMode
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-caption sm:text-body line-clamp-1 lowercase">
                        {page.title}
                      </h4>
                      {isPageDirty && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase">
                          Unsaved
                        </span>
                      )}
                    </div>
                    {page.subtitle && (
                      <p className="text-micro opacity-70 line-clamp-1 italic">
                        {page.subtitle}
                      </p>
                    )}
                    <p className="text-micro font-mono opacity-40 uppercase truncate" title={displaySlug}>
                      {displaySlug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <PublicationToggle
                    isDraft={isDraftCurrent}
                    onToggle={() => handleToggleDraft(page.id, isDraftCurrent)}
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
