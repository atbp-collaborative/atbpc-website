/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { HomeSlideItem, HomepageSlogans } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { useTheme } from '@/context/ThemeContext';

interface CmsHomeTabProps {
  slides: HomeSlideItem[];
  slogans?: HomepageSlogans;
  onSaveSlide: (slide: HomeSlideItem) => void;
  onDeleteSlide: (slideId: string) => void;
  onReorderSlides: (slides: HomeSlideItem[]) => void;
  onSaveSlogans?: (slogans: HomepageSlogans) => void;
}

export const CmsHomeTab: React.FC<CmsHomeTabProps> = ({
  slides,
  onSaveSlide,
  onDeleteSlide,
  onReorderSlides,
}) => {
  const { isDarkMode } = useTheme();

  // Slide modal state & dirty tracking
  const [editingSlide, setEditingSlide] = useState<HomeSlideItem | null>(null);
  const initialSlideRef = useRef<HomeSlideItem | null>(null);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const sortedSlides = useMemo(() => {
    return [...slides].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [slides]);

  const isSlideDirty = useMemo(() => {
    if (!editingSlide || !initialSlideRef.current) return false;
    return JSON.stringify(editingSlide) !== JSON.stringify(initialSlideRef.current);
  }, [editingSlide]);

  const handleStartCreateSlide = () => {
    const newSlide: HomeSlideItem = {
      id: `slide-${Date.now()}`,
      title: '',
      imageUrl: '',
      sortOrder: (slides.length + 1) * 10,
      isDraft: false,
    };
    setEditingSlide(newSlide);
    initialSlideRef.current = { ...newSlide };
  };

  const handleStartEditSlide = (slide: HomeSlideItem) => {
    setEditingSlide({ ...slide });
    initialSlideRef.current = { ...slide };
  };

  const handleCloseModal = () => {
    setEditingSlide(null);
    initialSlideRef.current = null;
  };

  const handleSaveSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !isSlideDirty) return;
    onSaveSlide(editingSlide);
    handleCloseModal();
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSlides.length) return;

    const newSlides = [...sortedSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const reordered = newSlides.map((slide, idx) => ({
      ...slide,
      sortOrder: (idx + 1) * 10,
    }));

    onReorderSlides(reordered);
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO CAROUSEL SLIDES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-body font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-space-sparkle" /> Hero Carousel Slides ({sortedSlides.length})
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
          {sortedSlides.map((slide, index) => (
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
                </div>

                <div>
                  <h4 className="font-bold text-caption sm:text-body line-clamp-1">
                    {slide.title || 'Untitled Slide'}
                  </h4>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <PublicationToggle
                    isDraft={Boolean(slide.isDraft)}
                    disabled={true}
                    onToggle={() => {}}
                  />
                  <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 text-vintage-charcoal dark:text-bright-gray disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Move slide up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <div className="w-[1px] h-3 bg-black/10 dark:bg-white/10" />
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, 'down')}
                      disabled={index === sortedSlides.length - 1}
                      className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 text-vintage-charcoal dark:text-bright-gray disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Move slide down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>

                <Button
                  type="ghost"
                  onClick={() => handleStartEditSlide(slide)}
                  className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                >
                  <Edit2 size={13} className="mr-1 inline" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
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
                {slides.some((s) => s.id === editingSlide.id)
                  ? `Edit Slide: ${editingSlide.title || 'Untitled'}`
                  : 'Add Hero Slide'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
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

              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                {slides.some((s) => s.id === editingSlide.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete slide "${editingSlide.title || 'Untitled'}"?`)) {
                        onDeleteSlide(editingSlide.id);
                        handleCloseModal();
                      }
                    }}
                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-mini flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Trash2 size={14} /> Delete Slide
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <Button type="ghost" onClick={handleCloseModal} label="Cancel" />
                  <Button type="filled" htmlType="submit" disabled={!isSlideDirty}>
                    <Save size={14} className="mr-1.5 inline" /> Save Slide
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
