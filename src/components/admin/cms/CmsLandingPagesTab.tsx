/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { LayoutTemplate, Edit2, Save, X, Plus } from 'lucide-react';
import { NavigationCardItem, HomeSlideItem } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { CmsHomeTab } from '@/components/admin/cms/CmsHomeTab';
import {
  getOurPeopleFooterFromSupabase,
  saveOurPeopleFooterToSupabase,
} from '@/services/supabase/settings.service';

interface CmsLandingPagesTabProps {
  cards: NavigationCardItem[];
  onSaveCard: (card: NavigationCardItem) => void;
  slides?: HomeSlideItem[];
  onSaveSlide?: (slide: HomeSlideItem) => Promise<HomeSlideItem> | void;
  onDeleteSlide?: (slideId: string) => Promise<void> | void;
  onReorderSlides?: (newSlides: HomeSlideItem[]) => Promise<void> | void;
}

interface HubCategory {
  id: string;
  label: string;
  isHub: boolean;
  dividerBefore?: boolean;
}

// Ordered strictly: Homepage → Studio Hub | Our Services, Our Process → Contact Hub | Case Study House, Grow With Us, Partner With Us
const HUB_CATEGORIES: HubCategory[] = [
  { id: 'home', label: 'Homepage', isHub: true },
  { id: 'studio', label: 'Studio Hub', isHub: true, dividerBefore: true },
  { id: 'services', label: 'Our Services', isHub: false },
  { id: 'process', label: 'Our Process', isHub: false },
  { id: 'contact', label: 'Contact Hub', isHub: true, dividerBefore: true },
  { id: 'case-study-house', label: 'Case Study House', isHub: false },
  { id: 'grow-with-us', label: 'Grow With Us', isHub: false },
  { id: 'partner-with-us', label: 'Partner With Us', isHub: false },
];

const DEFAULT_PAGE_SUBTITLES: Record<string, string> = {
  services:
    'discover our flexible contract types and comprehensive architectural capabilities tailored to your project scale and scope.',
  process: 'purpose-built responses for one-of-a-kind briefs',
  people: 'our multidisciplinary team of designers, managers, and builders',
  'contact-case-study-house':
    'explore case study house project types and collaborative offerings',
  'contact-grow-with-us':
    'career and mentorship opportunities at ATBP Collaborative',
  'contact-partner-with-us':
    'collaborate with us as a supplier, builder, or consultant',
};

export const CmsLandingPagesTab: React.FC<CmsLandingPagesTabProps> = ({
  cards,
  onSaveCard,
  slides = [],
  onSaveSlide = () => {},
  onDeleteSlide = () => {},
  onReorderSlides = () => {},
}) => {
  const { isDarkMode } = useTheme();

  // Category filter state: 'home' is the first tab by default
  const [activeCategory, setActiveCategory] = useState<string>('home');

  // Trigger refs for Home slide management from header
  const createSlideTriggerRef = useRef<(() => void) | null>(null);
  const saveSlideOrderTriggerRef = useRef<(() => Promise<void>) | null>(null);
  const [isSlideOrderDirty, setIsSlideOrderDirty] = useState(false);

  // Card editing modal state
  const [editingCard, setEditingCard] = useState<NavigationCardItem | null>(null);
  const initialCardRef = useRef<NavigationCardItem | null>(null);

  const handleStartEditCard = (card: NavigationCardItem) => {
    const isLanding = ['studio', 'contact'].includes(card.hubId.toLowerCase());
    const initialSubtitle =
      card.pageSubtitle || (isLanding ? DEFAULT_PAGE_SUBTITLES[card.cardKey] || '' : '');
    const initialFooter = card.footerText || '';

    const preparedCard: NavigationCardItem = {
      ...card,
      isDraft: false,
      pageSubtitle: initialSubtitle,
      footerText: initialFooter,
    };

    const isPeople =
      card.cardKey?.toLowerCase() === 'people' ||
      card.id?.toLowerCase().includes('people') ||
      card.title?.toLowerCase().includes('people');

    if (isPeople) {
      getOurPeopleFooterFromSupabase().then((data) => {
        if (data?.footerText) {
          setEditingCard((prev) => (prev ? { ...prev, footerText: data.footerText } : null));
          if (initialCardRef.current) {
            initialCardRef.current.footerText = data.footerText;
          }
        }
      });
    }

    setEditingCard(preparedCard);
    initialCardRef.current = JSON.parse(JSON.stringify(preparedCard));
  };

  const isDirty = useMemo(() => {
    if (!editingCard || !initialCardRef.current) return false;
    return JSON.stringify(editingCard) !== JSON.stringify(initialCardRef.current);
  }, [editingCard]);

  const isPeopleCard = useMemo(() => {
    if (!editingCard) return false;
    return (
      editingCard.cardKey?.toLowerCase() === 'people' ||
      editingCard.id?.toLowerCase().includes('people') ||
      editingCard.title?.toLowerCase().includes('people')
    );
  }, [editingCard]);

  const filteredCards = useMemo(() => {
    return cards.filter((c) => c.hubId.toLowerCase() === activeCategory.toLowerCase());
  }, [cards, activeCategory]);

  const isLandingCategory = useMemo(() => {
    return ['studio', 'contact'].includes(activeCategory.toLowerCase());
  }, [activeCategory]);

  const isSubLandingCategory = useMemo(() => {
    return [
      'services',
      'process',
      'case-study-house',
      'grow-with-us',
      'partner-with-us',
    ].includes(activeCategory.toLowerCase());
  }, [activeCategory]);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const handleSaveCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !isDirty) return;
    if (isPeopleCard && editingCard.footerText !== undefined) {
      try {
        await saveOurPeopleFooterToSupabase(editingCard.footerText);
      } catch (err) {
        console.error('Failed to sync our_people_footer to Supabase:', err);
      }
    }
    onSaveCard({ ...editingCard, isDraft: false });
    setEditingCard(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-black/10 dark:border-white/10">
        <div>
          <h3 className="text-body font-bold flex items-center gap-2">
            <LayoutTemplate size={18} className="text-space-sparkle" />{' '}
            {activeCategory === 'home'
              ? `Homepage Hero Slides (${slides.length})`
              : `${isLandingCategory ? 'Landing Hub Cards' : 'Sub-Landing Cards'} (${filteredCards.length})`}
          </h3>
          <p className="text-mini opacity-60">
            {activeCategory === 'home'
              ? 'Manage fullscreen hero carousel imagery and sequence on the public frontpage.'
              : isLandingCategory
                ? 'Primary teaser cards with destination page subtitles. Changes automatically synchronize.'
                : 'Sub-landing teaser cards with customizable subpage footer texts.'}
          </p>
        </div>

        {activeCategory === 'home' && (
          <div className="flex items-center gap-2.5 shrink-0">
            {isSlideOrderDirty && (
              <Button
                type="filled"
                onClick={() => saveSlideOrderTriggerRef.current?.()}
                className="!py-2 !px-4 text-mini font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                <Save size={14} className="mr-1 inline" /> Save Order
              </Button>
            )}
            <Button
              type="filled"
              onClick={() => createSlideTriggerRef.current?.()}
              className="!py-2 !px-4 text-mini font-semibold shrink-0"
            >
              <Plus size={14} className="mr-1 inline" /> Add Hero Slide
            </Button>
          </div>
        )}
      </div>

      {/* Hub Filter Chips (Grouped & Differentiated) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {HUB_CATEGORIES.map((cat) => {
          const count =
            cat.id === 'home'
              ? slides.length
              : cards.filter((c) => c.hubId.toLowerCase() === cat.id.toLowerCase()).length;
          const isSelected = activeCategory === cat.id;

          return (
            <React.Fragment key={cat.id}>
              {cat.dividerBefore && (
                <div className="h-5 w-[1px] bg-black/20 dark:bg-white/20 mx-1 shrink-0" />
              )}
              <button
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-micro whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  cat.isHub ? 'font-bold tracking-tight' : 'font-normal opacity-90'
                } ${
                  isSelected
                    ? cat.isHub
                      ? 'bg-space-sparkle text-white shadow-xs font-semibold ring-1 ring-space-sparkle/30'
                      : 'bg-space-sparkle/90 text-white shadow-xs font-medium'
                    : cat.isHub
                      ? isDarkMode
                        ? 'bg-vintage-charcoal text-white hover:bg-white/10 border border-white/20'
                        : 'bg-neutral-100 text-vintage-charcoal hover:bg-neutral-200 border border-black/15'
                      : isDarkMode
                        ? 'bg-vintage-charcoal/50 text-bright-gray/70 hover:bg-white/5 border border-white/5'
                        : 'bg-white text-vintage-charcoal/70 hover:bg-black/5 border border-black/10'
                }`}
              >
                <span>{cat.label}</span>
                {cat.isHub && (
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1 py-0.2 rounded font-mono font-semibold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDarkMode
                          ? 'bg-white/10 text-bright-gray'
                          : 'bg-black/10 text-vintage-charcoal'
                    }`}
                  >
                    Hub
                  </span>
                )}
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {activeCategory === 'home' ? (
        <CmsHomeTab
          slides={slides}
          onSaveSlide={onSaveSlide}
          onDeleteSlide={onDeleteSlide}
          onReorderSlides={onReorderSlides}
          createSlideTriggerRef={createSlideTriggerRef}
          saveSlideOrderTriggerRef={saveSlideOrderTriggerRef}
          onOrderDirtyChange={setIsSlideOrderDirty}
        />
      ) : (
        /* Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.length === 0 ? (
            <div className="col-span-full py-12 text-center opacity-50 text-mini font-mono">
              No navigation cards found in this category.
            </div>
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isDarkMode
                    ? 'bg-vintage-charcoal/60 border-white/10 hover:border-space-sparkle/40'
                    : 'bg-white border-black/10 hover:border-space-sparkle/40 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/10 border border-black/10 dark:border-white/10">
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40 text-micro font-mono">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-micro font-mono uppercase bg-black/70 text-white backdrop-blur-xs">
                      {card.hubId}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-caption sm:text-body line-clamp-1 lowercase">
                      {card.title}
                    </h4>
                    <p className="text-mini font-medium text-space-sparkle line-clamp-1">
                      {card.tagline}
                    </p>

                    {/* Page Subtitle Preview for Landing Hub Cards */}
                    {isLandingCategory && (card.pageSubtitle || DEFAULT_PAGE_SUBTITLES[card.cardKey]) && (
                      <div className="pt-1.5 border-t border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider block opacity-50">
                          Destination Subtitle:
                        </span>
                        <p className="text-micro opacity-75 line-clamp-2 italic">
                          "{card.pageSubtitle || DEFAULT_PAGE_SUBTITLES[card.cardKey]}"
                        </p>
                      </div>
                    )}

                    {/* Footer Text Preview for Sub-Landing Cards */}
                    {isSubLandingCategory && card.footerText && (
                      <div className="pt-1.5 border-t border-black/5 dark:border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider block opacity-50">
                          Footer Subtext:
                        </span>
                        <p className="text-micro opacity-75 line-clamp-2 italic">
                          "{card.footerText}"
                        </p>
                      </div>
                    )}

                    <span
                      className="text-micro font-mono opacity-40 truncate block pt-1"
                      title={card.targetHref}
                    >
                      {card.targetHref}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-end gap-2 mt-4">
                  <Button
                    type="ghost"
                    onClick={() => handleStartEditCard(card)}
                    className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                  >
                    <Edit2 size={13} className="mr-1 inline" /> Edit Card
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EDIT NAVIGATION CARD MODAL */}
      {editingCard && (
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
                <h3 className="text-body font-bold lowercase">
                  edit card: {editingCard.title}
                </h3>
                <span className="text-micro opacity-60 font-mono uppercase">
                  {isLandingCategory ? 'Landing Hub Card' : 'Sub-Landing Card'} • {editingCard.hubId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCardSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Card Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Tagline (e.g. "comprehensive works & piecework services")
                </label>
                <input
                  type="text"
                  value={editingCard.tagline}
                  onChange={(e) => setEditingCard({ ...editingCard, tagline: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Landing Cards (Studio, Contact): Page Subtitle field */}
              {isLandingCategory && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Page Subtitle
                    </label>
                    <span className="text-[10px] opacity-50 font-mono">
                      Synced with destination public page
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingCard.pageSubtitle || ''}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, pageSubtitle: e.target.value })
                    }
                    placeholder="e.g. discover our flexible contract types and comprehensive architectural capabilities tailored to your project scale and scope."
                    className={inputClass}
                  />
                  <p className="text-micro opacity-50">
                    The subtitle displayed on the actual page this card takes you to.
                  </p>
                </div>
              )}

              {/* People Card Only: Page Footer Text field */}
              {isPeopleCard && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Page Footer Text
                    </label>
                    <span className="text-[10px] opacity-50 font-mono">
                      Synced with /studio/our-people footer
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingCard.footerText || ''}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, footerText: e.target.value })
                    }
                    placeholder="we are a licensed, registered collaborative trained and experienced to provide you services ... architecture, engineering, building construction industry, nationwide."
                    className={inputClass}
                  />
                  <p className="text-micro opacity-50">
                    Dynamic footer statement displayed at the bottom of the public /studio/our-people page.
                  </p>
                </div>
              )}

              {/* Sub-Landing Cards: Footer Text field */}
              {isSubLandingCategory && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                      Footer Text (Above Site Footer)
                    </label>
                    <span className="text-[10px] opacity-50 font-mono">
                      Sub-landing subtext
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingCard.footerText || ''}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, footerText: e.target.value })
                    }
                    placeholder="e.g. we provide tailored architectural specifications, project intakes, and engineering oversight nationwide."
                    className={inputClass}
                  />
                  <p className="text-micro opacity-50">
                    The text displayed directly above the footer on this subpage.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <ImageManagerField
                  single={true}
                  folder="cms"
                  label="Card Background Image"
                  helperText="Visual cover preview photograph for this card."
                  images={editingCard.imageUrl ? [editingCard.imageUrl] : []}
                  onChange={(imgs) => setEditingCard({ ...editingCard, imageUrl: imgs[0] || '' })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingCard(null)} label="Cancel" />
                <Button type="filled" htmlType="submit" disabled={!isDirty}>
                  <Save size={14} className="mr-1.5 inline" /> Save Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
