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

interface CmsLandingPagesTabProps {
  cards: NavigationCardItem[];
  onSaveCard: (card: NavigationCardItem) => void;
  slides?: HomeSlideItem[];
  onSaveSlide?: (slide: HomeSlideItem) => Promise<HomeSlideItem>;
  onDeleteSlide?: (slideId: string) => Promise<void>;
  onReorderSlides?: (newSlides: HomeSlideItem[]) => Promise<void>;
}

const HUB_CATEGORIES = [
  { id: 'home', label: 'Homepage' },
  { id: 'services', label: 'Our Services' },
  { id: 'process', label: 'Our Process' },
  { id: 'studio', label: 'Studio Hub' },
  { id: 'case-study-house', label: 'Case Study House' },
  { id: 'grow-with-us', label: 'Grow With Us' },
  { id: 'partner-with-us', label: 'Partner With Us' },
];

export const CmsLandingPagesTab: React.FC<CmsLandingPagesTabProps> = ({
  cards,
  onSaveCard,
  slides = [],
  onSaveSlide = async () => ({} as any),
  onDeleteSlide = async () => {},
  onReorderSlides = async () => {},
}) => {
  const { isDarkMode } = useTheme();

  // Category filter state: 'home' is the first tab by default
  const [activeCategory, setActiveCategory] = useState<string>('home');

  // Trigger ref for Home slide creation from header
  const createSlideTriggerRef = useRef<(() => void) | null>(null);

  // Card editing modal state
  const [editingCard, setEditingCard] = useState<NavigationCardItem | null>(null);
  const initialCardRef = useRef<NavigationCardItem | null>(null);

  const handleStartEditCard = (card: NavigationCardItem) => {
    setEditingCard({ ...card, isDraft: false });
    initialCardRef.current = { ...card, isDraft: false };
  };

  const isDirty = useMemo(() => {
    if (!editingCard || !initialCardRef.current) return false;
    return JSON.stringify(editingCard) !== JSON.stringify(initialCardRef.current);
  }, [editingCard]);

  const filteredCards = useMemo(() => {
    return cards.filter((c) => c.hubId.toLowerCase() === activeCategory.toLowerCase());
  }, [cards, activeCategory]);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const handleSaveCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !isDirty) return;
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
              : `Navigation Cards (${filteredCards.length})`}
          </h3>
          <p className="text-mini opacity-60">
            {activeCategory === 'home'
              ? 'Manage fullscreen hero carousel imagery and sequence on the public frontpage.'
              : 'Control the teaser cards displayed across hubs (titles, taglines, and imagery). All cards are permanently live.'}
          </p>
        </div>

        {activeCategory === 'home' && (
          <Button
            type="filled"
            onClick={() => createSlideTriggerRef.current?.()}
            className="!py-2 !px-4 text-mini font-semibold shrink-0"
          >
            <Plus size={14} className="mr-1 inline" /> Add Hero Slide
          </Button>
        )}
      </div>

      {/* Hub Filter Chips (Homepage first, no "All Cards") */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {HUB_CATEGORIES.map((cat) => {
          const count =
            cat.id === 'home'
              ? slides.length
              : cards.filter((c) => c.hubId.toLowerCase() === cat.id.toLowerCase()).length;
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

      {/* Active Tab Content */}
      {activeCategory === 'home' ? (
        <CmsHomeTab
          slides={slides}
          onSaveSlide={onSaveSlide}
          onDeleteSlide={onDeleteSlide}
          onReorderSlides={onReorderSlides}
          createSlideTriggerRef={createSlideTriggerRef}
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

                  <div>
                    <h4 className="font-bold text-caption sm:text-body line-clamp-1 lowercase">
                      {card.title}
                    </h4>
                    <p className="text-mini font-medium text-space-sparkle line-clamp-1">
                      {card.tagline}
                    </p>
                    <span className="text-micro font-mono opacity-50 truncate block mt-1" title={card.targetHref}>
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
              <h3 className="text-body font-bold lowercase">edit card: {editingCard.title}</h3>
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
                  Tagline (e.g. "for the way you live")
                </label>
                <input
                  type="text"
                  value={editingCard.tagline}
                  onChange={(e) => setEditingCard({ ...editingCard, tagline: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <ImageManagerField
                  single={true}
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
