/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { HomeSlideItem, HomepageSlogans } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { DynamicListField } from '@/components/admin/DynamicListField';
import { useTheme } from '@/context/ThemeContext';

interface CmsHomeTabProps {
  slides: HomeSlideItem[];
  slogans: HomepageSlogans;
  onSaveSlide: (slide: HomeSlideItem) => void;
  onDeleteSlide: (slideId: string) => void;
  onSaveSlogans: (slogans: HomepageSlogans) => void;
}

export const CmsHomeTab: React.FC<CmsHomeTabProps> = ({
  slides,
  slogans,
  onSaveSlide,
  onDeleteSlide,
  onSaveSlogans,
}) => {
  const { isDarkMode } = useTheme();

  // Slide modal state
  const [editingSlide, setEditingSlide] = useState<HomeSlideItem | null>(null);

  // Slogans edit state
  const [localSlogans, setLocalSlogans] = useState<HomepageSlogans>(slogans);
  const [slogansDirty, setSlogansDirty] = useState(false);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const handleStartCreateSlide = () => {
    const newSlide: HomeSlideItem = {
      id: `slide-${Date.now()}`,
      title: '',
      imageUrl: '',
      sortOrder: (slides.length + 1) * 10,
      isDraft: false,
    };
    setEditingSlide(newSlide);
  };

  const handleSaveSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    onSaveSlide(editingSlide);
    setEditingSlide(null);
  };

  const handleSaveSlogansSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSlogans(localSlogans);
    setSlogansDirty(false);
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO CAROUSEL SLIDES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-body font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-space-sparkle" /> Hero Carousel Slides ({slides.length})
            </h3>
            <p className="text-mini opacity-60">
              Manage the full-screen hero imagery rotating on the website homepage splash section.
            </p>
          </div>
          <Button
            type="filled"
            onClick={handleStartCreateSlide}
            className="!py-2 !px-4 text-mini font-semibold"
          >
            <Plus size={14} className="mr-1 inline" /> Add Hero Slide
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isDarkMode
                  ? 'bg-vintage-charcoal/60 border-white/10 hover:border-space-sparkle/40'
                  : 'bg-white border-black/10 hover:border-space-sparkle/40 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/10 border border-black/10 dark:border-white/10">
                  {slide.imageUrl ? (
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title || 'Slide'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-40 text-micro font-mono">
                      No Image Set
                    </div>
                  )}

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-micro font-mono uppercase bg-black/70 text-white backdrop-blur-xs">
                    Order: {slide.sortOrder}
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded text-micro font-mono uppercase font-semibold ${
                        slide.isDraft ? 'bg-amber-500/90 text-white' : 'bg-emerald-600/90 text-white'
                      }`}
                    >
                      {slide.isDraft ? 'Draft' : 'Live'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-caption sm:text-body line-clamp-1">
                    {slide.title || 'Untitled Slide'}
                  </h4>
                  <p className="text-micro font-mono opacity-50 truncate mt-0.5">{slide.imageUrl}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 mt-4">
                <PublicationToggle
                  isDraft={Boolean(slide.isDraft)}
                  onToggle={() => onSaveSlide({ ...slide, isDraft: !slide.isDraft })}
                />
                <div className="flex items-center gap-1.5">
                  <Button
                    type="ghost"
                    onClick={() => setEditingSlide({ ...slide })}
                    className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                  >
                    <Edit2 size={13} className="mr-1 inline" /> Edit
                  </Button>
                  <button
                    type="button"
                    onClick={() => onDeleteSlide(slide.id)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                    title="Delete slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HOMEPAGE ROTATING SLOGANS & HERO SUBTEXT */}
      <div className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-space-sparkle" /> Rotating Slogans &amp; Hero Subtext
            </h3>
            <p className="text-mini opacity-60">
              Customize the large headline phrases that cycle on the homepage hero and the two-line descriptive subtext.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSaveSlogansSubmit}
          className={`p-6 rounded-xl border space-y-6 ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {/* Slogans List */}
          <div className="space-y-2">
            <DynamicListField
              mode="strings"
              label="Rotating Hero Slogans"
              placeholder="e.g. Your Home, Our Advocacy"
              helperText="Add phrases that smoothly fade in sequence above the main fold."
              items={localSlogans.slogans || []}
              onChange={(slogans) => {
                setLocalSlogans((prev) => ({ ...prev, slogans }));
                setSlogansDirty(true);
              }}
            />
          </div>

          {/* Hero Subtext List */}
          <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
            <DynamicListField
              mode="strings"
              label="Hero Subtext Paragraphs (2 Lines)"
              placeholder="e.g. A Philippine architectural practice..."
              helperText="The descriptive narrative lines positioned right under the rotating title."
              items={localSlogans.heroSubtext || []}
              onChange={(heroSubtext) => {
                setLocalSlogans((prev) => ({ ...prev, heroSubtext }));
                setSlogansDirty(true);
              }}
            />
          </div>

          {slogansDirty && (
            <div className="flex justify-end pt-2">
              <Button type="filled" htmlType="submit" className="!py-2 !px-5 text-mini font-semibold">
                <Save size={14} className="mr-1.5 inline" /> Save Homepage Slogans
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* EDIT SLIDE MODAL */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold">
                {editingSlide.title ? `Edit Slide: ${editingSlide.title}` : 'Add Hero Slide'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSlideSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Slide Title / Caption <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Modern Tropical Residence"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <ImageManagerField
                  single={true}
                  label="Hero Photograph"
                  helperText="Full-screen high-resolution architectural photo for the hero carousel."
                  images={editingSlide.imageUrl ? [editingSlide.imageUrl] : []}
                  onChange={(imgs) => setEditingSlide({ ...editingSlide, imageUrl: imgs[0] || '' })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Carousel Sort Order
                </label>
                <input
                  type="number"
                  value={editingSlide.sortOrder}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, sortOrder: parseInt(e.target.value, 10) || 0 })
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10 mt-4">
                <div>
                  <span className="text-mini font-semibold block">Slide Visibility</span>
                  <span className="text-micro opacity-60">Control active display in the homepage loop</span>
                </div>
                <PublicationToggle
                  isDraft={Boolean(editingSlide.isDraft)}
                  onToggle={() => setEditingSlide({ ...editingSlide, isDraft: !editingSlide.isDraft })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingSlide(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
                  <Save size={14} className="mr-1.5 inline" /> Save Slide
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
