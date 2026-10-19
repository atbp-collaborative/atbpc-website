/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { LayoutTemplate, Edit2, Save, X } from 'lucide-react';
import { NavigationCardItem } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { ImageManagerField } from '@/components/admin/ImageManagerField';

interface CmsLandingPagesTabProps {
  cards: NavigationCardItem[];
  onSaveCard: (card: NavigationCardItem) => void;
}

const HUB_CATEGORIES = [
  { id: 'all', label: 'All Cards' },
  { id: 'case-study-house', label: 'Case Study House' },
  { id: 'grow-with-us', label: 'Grow With Us' },
  { id: 'partner-with-us', label: 'Partner With Us' },
  { id: 'process', label: 'Our Process' },
  { id: 'studio', label: 'Studio Hub' },
];

export const CmsLandingPagesTab: React.FC<CmsLandingPagesTabProps> = ({
  cards,
  onSaveCard,
}) => {
  const { isDarkMode } = useTheme();

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Card editing modal state
  const [editingCard, setEditingCard] = useState<NavigationCardItem | null>(null);

  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') return cards;
    return cards.filter((c) => c.hubId.toLowerCase() === activeCategory.toLowerCase());
  }, [cards, activeCategory]);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const handleSaveCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    onSaveCard(editingCard);
    setEditingCard(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-black/10 dark:border-white/10">
        <div>
          <h3 className="text-body font-bold flex items-center gap-2">
            <LayoutTemplate size={18} className="text-space-sparkle" /> Landing Pages &amp; Navigation Cards ({filteredCards.length})
          </h3>
          <p className="text-mini opacity-60">
            Control the teaser cards displayed across hubs (titles, taglines, subtexts, and imagery).
          </p>
        </div>
      </div>

      {/* Hub Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {HUB_CATEGORIES.map((cat) => {
          const count =
            cat.id === 'all'
              ? cards.length
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card) => (
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
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 rounded text-micro font-mono uppercase font-semibold ${
                      card.isDraft ? 'bg-amber-500/90 text-white' : 'bg-emerald-600/90 text-white'
                    }`}
                  >
                    {card.isDraft ? 'Draft' : 'Live'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-caption sm:text-body line-clamp-1 lowercase">
                  {card.title}
                </h4>
                <p className="text-mini font-medium text-space-sparkle line-clamp-1">
                  {card.tagline}
                </p>
                <p className="text-micro opacity-60 line-clamp-2 mt-1">
                  {card.subtext}
                </p>
                <div className="flex items-center gap-1 flex-wrap pt-2">
                  {card.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-micro font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 mt-4">
              <PublicationToggle
                isDraft={Boolean(card.isDraft)}
                onToggle={() => onSaveCard({ ...card, isDraft: !card.isDraft })}
              />
              <Button
                type="ghost"
                onClick={() => setEditingCard({ ...card })}
                className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
              >
                <Edit2 size={13} className="mr-1 inline" /> Edit Card
              </Button>
            </div>
          </div>
        ))}
      </div>

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
                <h3 className="text-body font-bold lowercase">edit card: {editingCard.title}</h3>
                <span className="text-micro font-mono opacity-50">Hub: {editingCard.hubId} | Key: {editingCard.cardKey}</span>
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
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Subtext (Description paragraph)
                </label>
                <textarea
                  rows={2}
                  value={editingCard.subtext}
                  onChange={(e) => setEditingCard({ ...editingCard, subtext: e.target.value })}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Destination URL (Href)
                  </label>
                  <input
                    type="text"
                    value={editingCard.targetHref}
                    onChange={(e) => setEditingCard({ ...editingCard, targetHref: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingCard.sortOrder}
                    onChange={(e) => setEditingCard({ ...editingCard, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 mt-4">
                <div>
                  <span className="text-mini font-semibold block">Card Visibility</span>
                  <span className="text-micro opacity-60">Control visibility on public hub pages</span>
                </div>
                <PublicationToggle
                  isDraft={Boolean(editingCard.isDraft)}
                  onToggle={() => setEditingCard({ ...editingCard, isDraft: !editingCard.isDraft })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingCard(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
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
