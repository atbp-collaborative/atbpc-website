/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { HomeSlideItem, HomepageSlogans } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { useTheme } from '@/context/ThemeContext';
import { deleteStorageFileAction } from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

interface CmsHomeTabProps {
  slides: HomeSlideItem[];
  slogans?: HomepageSlogans;
  onSaveSlide: (slide: HomeSlideItem) => Promise<HomeSlideItem> | void;
  onDeleteSlide: (slideId: string) => void;
  onReorderSlides: (slides: HomeSlideItem[]) => Promise<void> | void;
  onSaveSlogans?: (slogans: HomepageSlogans) => void;
  createSlideTriggerRef?: React.MutableRefObject<(() => void) | null>;
  saveSlideOrderTriggerRef?: React.MutableRefObject<(() => Promise<void>) | null>;
  onOrderDirtyChange?: (isDirty: boolean) => void;
}

export const CmsHomeTab: React.FC<CmsHomeTabProps> = ({
  slides,
  onSaveSlide,
  onDeleteSlide,
  onReorderSlides,
  createSlideTriggerRef,
  saveSlideOrderTriggerRef,
  onOrderDirtyChange,
}) => {
  const { isDarkMode } = useTheme();

  // Sorted baseline from props
  const sortedPropSlides = useMemo(() => {
    return [...slides].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [slides]);

  // Local slide list for order reordering
  const [localSlides, setLocalSlides] = useState<HomeSlideItem[]>(sortedPropSlides);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Keep localSlides in sync with props when not dirty
  const isOrderDirty = useMemo(() => {
    if (localSlides.length !== sortedPropSlides.length) return false;
    const localIds = localSlides.map((s) => s.id).join(',');
    const propIds = sortedPropSlides.map((s) => s.id).join(',');
    return localIds !== propIds;
  }, [localSlides, sortedPropSlides]);

  useEffect(() => {
    if (!isOrderDirty) {
      setLocalSlides(sortedPropSlides);
    }
  }, [sortedPropSlides, isOrderDirty]);

  // Inform parent of dirty reorder state
  useEffect(() => {
    onOrderDirtyChange?.(isOrderDirty);
  }, [isOrderDirty, onOrderDirtyChange]);

  // Save order handler
  const handleSaveOrder = useCallback(async () => {
    if (!isOrderDirty) return;
    setIsSavingOrder(true);
    try {
      await onReorderSlides(localSlides);
      toast.success('Hero slide order saved successfully.');
    } catch (err: any) {
      console.error('Failed to save slide order:', err);
      toast.error(err?.message || 'Failed to save slide order.');
    } finally {
      setIsSavingOrder(false);
    }
  }, [isOrderDirty, localSlides, onReorderSlides]);

  const handleResetOrder = () => {
    setLocalSlides(sortedPropSlides);
  };

  // Expose save order to header ref
  useEffect(() => {
    if (saveSlideOrderTriggerRef) {
      saveSlideOrderTriggerRef.current = handleSaveOrder;
    }
  }, [saveSlideOrderTriggerRef, handleSaveOrder]);

  // Slide modal state & dirty tracking
  const [editingSlide, setEditingSlide] = useState<HomeSlideItem | null>(null);
  const initialSlideRef = useRef<HomeSlideItem | null>(null);

  // Track image URLs uploaded during this modal session
  const uploadedTempUrlsRef = useRef<string[]>([]);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const isSlideDirty = useMemo(() => {
    if (!editingSlide || !initialSlideRef.current) return false;
    return JSON.stringify(editingSlide) !== JSON.stringify(initialSlideRef.current);
  }, [editingSlide]);

  const handleStartCreateSlide = React.useCallback(() => {
    const newSlide: HomeSlideItem = {
      id: `slide-${Date.now()}`,
      title: '',
      imageUrl: '',
      sortOrder: (localSlides.length + 1) * 10,
      isDraft: false,
    };
    uploadedTempUrlsRef.current = [];
    setEditingSlide(newSlide);
    initialSlideRef.current = { ...newSlide };
  }, [localSlides.length]);

  React.useEffect(() => {
    if (createSlideTriggerRef) {
      createSlideTriggerRef.current = handleStartCreateSlide;
    }
  }, [createSlideTriggerRef, handleStartCreateSlide]);

  const handleStartEditSlide = (slide: HomeSlideItem) => {
    uploadedTempUrlsRef.current = [];
    setEditingSlide({ ...slide });
    initialSlideRef.current = { ...slide };
  };

  // When modal is cancelled/closed without saving:
  // Purge any newly uploaded images from Supabase Storage
  const handleCloseModal = async () => {
    const tempUrls = [...uploadedTempUrlsRef.current];
    uploadedTempUrlsRef.current = [];

    if (tempUrls.length > 0) {
      await Promise.all(tempUrls.map((url) => deleteStorageFileAction(url)));
    }

    setEditingSlide(null);
    initialSlideRef.current = null;
  };

  const handleSaveSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    // Strict validation: Require Hero Photograph
    if (!editingSlide.imageUrl || !editingSlide.imageUrl.trim()) {
      toast.error('Hero photograph is required. Please upload an image before saving.');
      return;
    }

    if (!isSlideDirty) return;

    try {
      const saved = await onSaveSlide(editingSlide);
      const selected = saved?.imageUrl || editingSlide.imageUrl;
      const unused = uploadedTempUrlsRef.current.filter((url) => url !== selected);
      await Promise.all(unused.map((url) => deleteStorageFileAction(url)));
      uploadedTempUrlsRef.current = [];
      setEditingSlide(null);
      initialSlideRef.current = null;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save slide');
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localSlides.length) return;

    const newSlides = [...localSlides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const reordered = newSlides.map((slide, idx) => ({
      ...slide,
      sortOrder: (idx + 1) * 10,
    }));

    setLocalSlides(reordered);
  };

  return (
    <div className="space-y-6">
      {/* Dirty Reorder Alert Bar */}
      {isOrderDirty && (
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
            isDarkMode
              ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="text-caption font-medium">
              You have unsaved changes to the slide sequence. Click <strong>Save Order</strong> to persist changes.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="ghost"
              onClick={handleResetOrder}
              disabled={isSavingOrder}
              className="!py-1.5 !px-3 text-mini border border-amber-500/30 hover:border-amber-500"
            >
              <RotateCcw size={12} className="mr-1 inline" /> Reset
            </Button>
            <Button
              type="filled"
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="!py-1.5 !px-3 text-mini font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Save size={12} className={`mr-1 inline ${isSavingOrder ? 'animate-spin' : ''}`} />
              {isSavingOrder ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        </div>
      )}

      {/* 1. HERO CAROUSEL SLIDES GRID */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {localSlides.map((slide, index) => (
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
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-micro font-mono font-bold bg-black/80 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    <span>#{index + 1}</span>
                    <span className="text-[10px] opacity-60 font-normal">of {localSlides.length}</span>
                  </div>
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
                  <div className="flex items-center border border-black/15 dark:border-white/15 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, 'up')}
                      disabled={index === 0}
                      className="px-2.5 py-1.5 hover:bg-space-sparkle hover:text-white text-vintage-charcoal dark:text-bright-gray disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono text-micro font-semibold cursor-pointer"
                      title={index === 0 ? 'First slide' : `Move slide earlier (${index + 1} → ${index})`}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <div className="w-[1px] h-4 bg-black/15 dark:bg-white/15" />
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, 'down')}
                      disabled={index === localSlides.length - 1}
                      className="px-2.5 py-1.5 hover:bg-space-sparkle hover:text-white text-vintage-charcoal dark:text-bright-gray disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono text-micro font-semibold cursor-pointer"
                      title={index === localSlides.length - 1 ? 'Last slide' : `Move slide later (${index + 1} → ${index + 2})`}
                    >
                      <ArrowDown size={14} />
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

      {/* EDIT / CREATE SLIDE MODAL */}
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
                  folder="cms"
                  onUploaded={(urls) => {
                    urls.forEach((url) => {
                      if (!uploadedTempUrlsRef.current.includes(url)) uploadedTempUrlsRef.current.push(url);
                    });
                  }}
                  label="Hero Photograph"
                  helperText="Required full-screen high-resolution architectural photo for the hero carousel."
                  images={editingSlide.imageUrl ? [editingSlide.imageUrl] : []}
                  onChange={(imgs) => {
                    const newUrl = imgs[0] || '';
                    if (newUrl && newUrl !== initialSlideRef.current?.imageUrl) {
                      if (!uploadedTempUrlsRef.current.includes(newUrl)) {
                        uploadedTempUrlsRef.current.push(newUrl);
                      }
                    }
                    setEditingSlide({ ...editingSlide, imageUrl: newUrl });
                  }}
                />
                {!editingSlide.imageUrl && (
                  <p className="text-micro text-red-500 font-medium mt-1">
                    * A hero photograph is required to save this slide.
                  </p>
                )}
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
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete slide "${editingSlide.title || 'Untitled'}"?`)) {
                        try {
                          await onDeleteSlide(editingSlide.id);
                          await handleCloseModal();
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : 'Could not delete slide');
                        }
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
                  <Button
                    type="filled"
                    htmlType="submit"
                    disabled={!isSlideDirty || !editingSlide.imageUrl?.trim()}
                  >
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
