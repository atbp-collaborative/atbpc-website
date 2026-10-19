/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Lock, Edit2, Globe, Save, X } from 'lucide-react';
import { SitePage } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { ImageManagerField } from '@/components/admin/ImageManagerField';

interface CmsPagesTabProps {
  pages: SitePage[];
  onSavePage: (page: SitePage) => void;
}

const SUBPAGE_TEMPLATES: SitePage[] = [
  // 1. studio/our-services subpages
  {
    id: 'studio/our-services/comprehensive-services',
    title: 'comprehensive services',
    subtitle: 'full-lifecycle architectural design, technical engineering, & turnkey delivery',
    heroImageUrl: '/images/hero_modern_villa_1783495183350.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-services/piecework-services',
    title: 'piecework services',
    subtitle: 'targeted architectural, engineering, or modular consulting scopes',
    heroImageUrl: '/images/studio_services_img_1785469964556.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-services/consultation-retainer-services',
    title: 'consultation & retainer services',
    subtitle: 'on-call technical advisory, peer reviews, and ongoing design management',
    heroImageUrl: '/images/production_drawings_1783495233053.jpg',
    isDraft: false,
  },

  // 2. studio/our-process subpages
  {
    id: 'studio/our-process/designing-with-values',
    title: 'designing with values',
    subtitle: 'purpose-driven spatial concepts anchored in environmental & social context',
    heroImageUrl: '/images/contact_case_study_house_img_1785469986420.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-process/managing-with-integrity',
    title: 'managing with integrity',
    subtitle: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
    heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
    isDraft: false,
  },
  {
    id: 'studio/our-process/building-with-culture',
    title: 'building with culture',
    subtitle: 'synthesizing regional craftsmanship with modern architectural technology',
    heroImageUrl: '/images/studio_process_img_1785469980353.jpg',
    isDraft: false,
  },

  // 3. contact/case-study-house subpages
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

  // 4. contact/grow-with-us subpages
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

  // 5. contact/partner-with-us subpages
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
  { id: 'our-services', label: 'Our Services' },
  { id: 'our-process', label: 'Our Process' },
  { id: 'case-study-house', label: 'Case Study House' },
  { id: 'grow-with-us', label: 'Grow With Us' },
  { id: 'partner-with-us', label: 'Partner With Us' },
];

function getSubpageCategory(id: string): { label: string; id: string } {
  const norm = id.toLowerCase();
  if (norm.includes('our-services')) return { label: 'Our Services', id: 'our-services' };
  if (norm.includes('our-process')) return { label: 'Our Process', id: 'our-process' };
  if (norm.includes('case-study-house')) return { label: 'Case Study House', id: 'case-study-house' };
  if (norm.includes('grow-with-us')) return { label: 'Grow With Us', id: 'grow-with-us' };
  if (norm.includes('partner-with-us')) return { label: 'Partner With Us', id: 'partner-with-us' };
  return { label: 'Subpage', id: 'all' };
}

export const CmsPagesTab: React.FC<CmsPagesTabProps> = ({
  pages,
  onSavePage,
}) => {
  const { isDarkMode } = useTheme();

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Page editing modal state
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);

  // Merge incoming pages from DB with SUBPAGE_TEMPLATES; parent hubs are excluded
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

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const handleSavePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    onSavePage(editingPage);
    setEditingPage(null);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: CONTENT PAGES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-body font-bold flex items-center gap-2">
              <Globe size={18} className="text-space-sparkle" /> Content Pages &amp; Metadata ({filteredSubpages.length})
            </h3>
            <p className="text-mini opacity-60">
              Only subpages under the 5 sections can be published or unpublished. Parent hubs and navigation menus are permanent and always displayed.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubpages.map((page) => {
            const category = getSubpageCategory(page.id);
            const displaySlug = page.id.startsWith('/') ? page.id : `/${page.id}`;

            return (
              <div
                key={page.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isDarkMode
                    ? 'bg-vintage-charcoal/60 border-white/10 hover:border-space-sparkle/40'
                    : 'bg-white border-black/10 hover:border-space-sparkle/40 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Hero preview or placeholder */}
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/10 border border-black/10 dark:border-white/10">
                    {page.heroImageUrl ? (
                      <Image
                        src={page.heroImageUrl}
                        alt={page.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40 text-micro font-mono">
                        No Hero Media
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-micro font-mono uppercase bg-black/70 text-white backdrop-blur-xs">
                      {category.label}
                    </div>

                    {/* Status chip */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded text-micro font-mono uppercase font-semibold ${
                          page.isDraft
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-emerald-600/90 text-white'
                        }`}
                      >
                        {page.isDraft ? 'Draft (Under Construction)' : 'Published'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-micro font-mono opacity-50 uppercase truncate">
                      <span title={displaySlug}>{displaySlug}</span>
                    </div>
                    <h4 className="font-bold text-caption sm:text-body line-clamp-1 lowercase">
                      {page.title}
                    </h4>
                    <p className="text-mini opacity-70 line-clamp-2 mt-1">
                      {page.subtitle || 'No subtitle provided.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 mt-4">
                  <PublicationToggle
                    isDraft={Boolean(page.isDraft)}
                    onToggle={() => onSavePage({ ...page, isDraft: !page.isDraft })}
                  />
                  <Button
                    type="ghost"
                    onClick={() => setEditingPage({ ...page })}
                    className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                  >
                    <Edit2 size={13} className="mr-1 inline" /> Edit Page
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* EDIT SITE PAGE MODAL */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <div>
                <h3 className="text-body font-bold lowercase">edit page: {editingPage.title}</h3>
                <span className="text-micro font-mono opacity-50">
                  Slug: {editingPage.id.startsWith('/') ? editingPage.id : `/${editingPage.id}`} (SEO Locked)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePageSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80 flex items-center gap-1.5">
                  <Lock size={12} className="text-amber-500" /> Canonical Title (SEO Locked)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingPage.title}
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
                <p className="text-micro opacity-40">Page titles and URL slugs are locked to preserve search indexing.</p>
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Page Subtitle / Tagline <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingPage.subtitle}
                  onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                  placeholder="Enter page subtitle or introductory philosophy..."
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <ImageManagerField
                  single={true}
                  label="Hero Banner Image"
                  helperText="High-resolution banner photo for the top of this page."
                  images={editingPage.heroImageUrl ? [editingPage.heroImageUrl] : []}
                  onChange={(imgs) => setEditingPage({ ...editingPage, heroImageUrl: imgs[0] || '' })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Meta Title (Browser Tab &amp; Google)
                  </label>
                  <input
                    type="text"
                    value={editingPage.metaTitle || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                    placeholder="e.g. Services — ATBP Collaborative"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={editingPage.metaDescription || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                    placeholder="Brief description for search engines..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 mt-4">
                <div>
                  <span className="text-mini font-semibold block">Page Publication Status</span>
                  <span className="text-micro opacity-60">Control public visibility and visitor access</span>
                </div>
                <PublicationToggle
                  isDraft={Boolean(editingPage.isDraft)}
                  onToggle={() => setEditingPage({ ...editingPage, isDraft: !editingPage.isDraft })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingPage(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
                  <Save size={14} className="mr-1.5 inline" /> Save Page
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};
