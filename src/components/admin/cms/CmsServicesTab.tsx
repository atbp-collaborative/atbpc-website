/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Briefcase,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { ServiceOffering, ServiceAccordionItem, NavigationCardItem } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { getFallbackServiceAccordions } from '@/services/supabase/cms.service';
import { toast } from 'sonner';

interface CmsServicesTabProps {
  services: ServiceOffering[];
  selectedServiceId: string;
  onSelectServiceId: (id: string) => void;
  onSaveService: (service: ServiceOffering) => void;
  onSaveServiceAccordion?: (item: ServiceAccordionItem) => void;
  onDeleteServiceAccordion?: (itemId: string, serviceId: string) => void;
  onReorderServiceAccordions?: (items: ServiceAccordionItem[]) => Promise<void> | void;
  cards?: NavigationCardItem[];
  onSaveCard?: (card: NavigationCardItem) => void;
}

export const CmsServicesTab: React.FC<CmsServicesTabProps> = ({
  services,
  selectedServiceId,
  onSelectServiceId,
  onSaveService,
  onSaveServiceAccordion,
  onDeleteServiceAccordion,
  onReorderServiceAccordions,
  cards = [],
  onSaveCard,
}) => {
  const { isDarkMode } = useTheme();

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Match tagline with the corresponding card in Landing Pages
  const matchingLandingCard = useMemo(() => {
    return cards.find(
      (c) =>
        c.hubId === 'services' &&
        (c.id === selectedServiceId || c.cardKey === selectedServiceId)
    );
  }, [cards, selectedServiceId]);

  const displayedTagline = matchingLandingCard?.tagline || currentService?.tagline || '';

  // Page Header Details Edit State
  const [editingHeader, setEditingHeader] = useState<ServiceOffering | null>(null);
  const initialHeaderRef = useRef<ServiceOffering | null>(null);

  const handleStartEditHeader = () => {
    if (currentService) {
      const initialWithSyncedTagline = { ...currentService, tagline: displayedTagline };
      setEditingHeader(initialWithSyncedTagline);
      initialHeaderRef.current = { ...initialWithSyncedTagline };
    }
  };

  const isHeaderDirty = useMemo(() => {
    if (!editingHeader || !initialHeaderRef.current) return false;
    return JSON.stringify(editingHeader) !== JSON.stringify(initialHeaderRef.current);
  }, [editingHeader]);

  // Accordion Item Edit State
  const [editingAccordion, setEditingAccordion] = useState<ServiceAccordionItem | null>(null);
  const initialAccordionRef = useRef<ServiceAccordionItem | null>(null);

  // Derive active accordions for current service (with fallback if empty)
  const currentAccordions: ServiceAccordionItem[] = useMemo(() => {
    if (!currentService) return [];
    if (currentService.accordions && currentService.accordions.length > 0) {
      return [...currentService.accordions].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return getFallbackServiceAccordions(currentService.id);
  }, [currentService]);

  // Determine number of columns for this service type
  const numColumns = useMemo(() => {
    if (currentService?.id === 'consultation-retainer-services') return 2;
    return 3; // 3 columns for comprehensive and piecework
  }, [currentService?.id]);

  // Local state for tracking accordion order & reordering
  const [localAccordions, setLocalAccordions] = useState<ServiceAccordionItem[]>(currentAccordions);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const prevServiceIdRef = useRef<string>(selectedServiceId);

  // Compute if order of accordions is dirty compared to currentAccordions
  const isOrderDirty = useMemo(() => {
    if (localAccordions.length !== currentAccordions.length) return false;
    for (let i = 0; i < localAccordions.length; i++) {
      const local = localAccordions[i];
      const orig = currentAccordions.find((a) => a.id === local.id);
      if (!orig) return false;
      if (local.sortOrder !== orig.sortOrder || local.columnIndex !== orig.columnIndex) {
        return true;
      }
    }
    for (let col = 0; col < numColumns; col++) {
      const localIds = localAccordions
        .filter((a) => a.columnIndex === col)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((a) => a.id)
        .join(',');
      const origIds = currentAccordions
        .filter((a) => a.columnIndex === col)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((a) => a.id)
        .join(',');
      if (localIds !== origIds) return true;
    }
    return false;
  }, [localAccordions, currentAccordions, numColumns]);

  // Sync localAccordions when currentAccordions changes and not dirty, or when service tab switches
  useEffect(() => {
    if (prevServiceIdRef.current !== selectedServiceId) {
      prevServiceIdRef.current = selectedServiceId;
      setLocalAccordions(currentAccordions);
    } else if (!isOrderDirty) {
      setLocalAccordions(currentAccordions);
    }
  }, [selectedServiceId, currentAccordions, isOrderDirty]);

  const handleStartCreateAccordion = (columnIndex = 0) => {
    if (!currentService) return;
    const newItem: ServiceAccordionItem = {
      id: `acc-${Date.now()}`,
      serviceId: currentService.id,
      columnIndex,
      title: '',
      content: '',
      linkText: '',
      linkHref: '',
      sortOrder: (localAccordions.filter((a) => a.columnIndex === columnIndex).length + 1) * 10,
      isDraft: false,
    };
    setEditingAccordion(newItem);
    initialAccordionRef.current = { ...newItem };
  };

  const handleStartEditAccordion = (item: ServiceAccordionItem) => {
    setEditingAccordion({ ...item });
    initialAccordionRef.current = { ...item };
  };

  const isAccordionDirty = useMemo(() => {
    if (!editingAccordion || !initialAccordionRef.current) return false;
    return JSON.stringify(editingAccordion) !== JSON.stringify(initialAccordionRef.current);
  }, [editingAccordion]);

  const handleSaveHeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeader || !isHeaderDirty) return;

    // Save service offering
    onSaveService(editingHeader);

    // Sync tagline with matching Landing Page card
    if (matchingLandingCard && onSaveCard && editingHeader.tagline !== matchingLandingCard.tagline) {
      onSaveCard({
        ...matchingLandingCard,
        tagline: editingHeader.tagline,
      });
    }

    setEditingHeader(null);
  };

  const handleSaveAccordionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccordion || !isAccordionDirty) return;
    if (onSaveServiceAccordion) {
      onSaveServiceAccordion(editingAccordion);
    }
    setLocalAccordions((prev) => {
      const idx = prev.findIndex((a) => a.id === editingAccordion.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = editingAccordion;
        return copy;
      }
      return [...prev, editingAccordion];
    });
    setEditingAccordion(null);
  };

  const handleDeleteAccordion = (item: ServiceAccordionItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title || 'this accordion'}"?`)) return;
    if (onDeleteServiceAccordion) {
      onDeleteServiceAccordion(item.id, item.serviceId);
    }
    setLocalAccordions((prev) => prev.filter((a) => a.id !== item.id));
    setEditingAccordion(null);
  };

  // Reorder accordions within column locally (Move Up / Move Down)
  const handleMoveAccordion = (item: ServiceAccordionItem, direction: 'up' | 'down') => {
    const colItems = localAccordions
      .filter((a) => a.columnIndex === item.columnIndex)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const currentIndex = colItems.findIndex((a) => a.id === item.id);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= colItems.length) return;

    const reorderedColItems = [...colItems];
    const [movedItem] = reorderedColItems.splice(currentIndex, 1);
    reorderedColItems.splice(targetIndex, 0, movedItem);

    // Assign normalized sortOrder (10, 20, 30...)
    const updatedWithOrder = reorderedColItems.map((acc, idx) => ({
      ...acc,
      sortOrder: (idx + 1) * 10,
    }));

    const updatedMap = new Map(updatedWithOrder.map((a) => [a.id, a]));
    setLocalAccordions((prev) => prev.map((a) => updatedMap.get(a.id) || a));
  };

  // Save order handler
  const handleSaveOrder = async () => {
    if (!isOrderDirty) return;
    setIsSavingOrder(true);
    try {
      if (onReorderServiceAccordions) {
        await onReorderServiceAccordions(localAccordions);
      } else if (onSaveServiceAccordion) {
        const dirtyItems = localAccordions.filter((local) => {
          const orig = currentAccordions.find((a) => a.id === local.id);
          return !orig || orig.sortOrder !== local.sortOrder || orig.columnIndex !== local.columnIndex;
        });
        for (const itm of dirtyItems) {
          await onSaveServiceAccordion(itm);
        }
        toast.success('Accordion order saved successfully.');
      }
    } catch (err: any) {
      console.error('Failed to save accordion order:', err);
      toast.error(err?.message || 'Failed to save accordion order.');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleResetOrder = () => {
    setLocalAccordions(currentAccordions);
  };

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  return (
    <div className="space-y-8">
      {/* 1. SERVICE TABS BAR */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <Briefcase size={20} className="text-space-sparkle shrink-0" />
          <div>
            <h3 className="font-bold text-caption uppercase tracking-wider">Select Service Offering</h3>
            <p className="text-micro opacity-60">Manage page titles, synced taglines, descriptions, and column accordions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {services.map((srv) => (
            <button
              key={srv.id}
              onClick={() => onSelectServiceId(srv.id)}
              className={`px-3 py-1.5 rounded-lg text-mini font-semibold transition-colors cursor-pointer border ${
                selectedServiceId === srv.id
                  ? 'bg-space-sparkle text-white border-space-sparkle shadow-xs'
                  : isDarkMode
                    ? 'border-gray-700 hover:bg-white/5 text-bright-gray/70'
                    : 'border-gray-300 hover:bg-black/5 text-vintage-charcoal/70'
              }`}
            >
              {srv.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE SERVICE HEADER & WRITEUPS */}
      {currentService && (
        <div
          className={`p-6 rounded-xl border space-y-6 ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-4 border-black/10 dark:border-white/10">
            <div className="space-y-1">
              <span className="text-micro font-mono uppercase text-space-sparkle font-semibold">
                {currentService.sectionTag || 'services | kaya'}
              </span>
              <h3 className="text-body sm:text-h2 font-major font-bold lowercase">
                {currentService.title}
              </h3>
              <p className="text-mini font-medium italic text-space-sparkle">
                {displayedTagline}
              </p>
              {matchingLandingCard && (
                <p className="text-micro opacity-50 font-mono">
                  Synced with Landing Card: &ldquo;{matchingLandingCard.title}&rdquo; (Our Services)
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <PublicationToggle
                isDraft={Boolean(currentService.isDraft)}
                disabled={false}
                onToggle={() => {
                  onSaveService({
                    ...currentService,
                    isDraft: !currentService.isDraft,
                  });
                }}
              />
              <Button
                type="filled"
                onClick={handleStartEditHeader}
                className="!py-2 !px-4 text-mini font-semibold"
              >
                <Edit2 size={13} className="mr-1.5 inline" /> Edit Page Details
              </Button>
            </div>
          </div>

          {/* Primary Description & Bottom Subtext */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                Public Header Description
              </label>
              <p className="text-caption leading-relaxed opacity-90">{currentService.description}</p>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-1">
              <label className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                Bottom Subtext (Footer Row)
              </label>
              <p className="text-mini italic opacity-80 text-space-sparkle">
                &ldquo;{currentService.subtext}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC COLUMN ACCORDIONS MANAGER */}
      {currentService && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
            <div>
              <h4 className="text-body font-bold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-space-sparkle" />
                Service Accordions &amp; Deliverables ({currentAccordions.length})
              </h4>
              <p className="text-mini opacity-60">
                Manage the expandable sections and deliverables displayed on the public page across {numColumns} columns.
              </p>
            </div>

            <Button
              type="filled"
              onClick={() => handleStartCreateAccordion(0)}
              className="!py-1.5 !px-3.5 text-mini font-semibold"
            >
              <Plus size={13} className="mr-1 inline" /> Add Accordion
            </Button>
          </div>

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
                  You have unsaved changes to the accordion sequence. Click <strong>Save Order</strong> to persist changes.
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

          {/* Multi-Column Grid */}
          <div className={`grid grid-cols-1 ${numColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
            {Array.from({ length: numColumns }).map((_, colIdx) => {
              const colItems = localAccordions
                .filter((a) => a.columnIndex === colIdx)
                .sort((a, b) => a.sortOrder - b.sortOrder);

              return (
                <div
                  key={colIdx}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                    isDarkMode ? 'bg-vintage-charcoal/40 border-white/10' : 'bg-black/2 border-black/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                      <span className="text-caption font-bold tracking-wider uppercase text-space-sparkle">
                        Column {colIdx + 1} ({colItems.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartCreateAccordion(colIdx)}
                        className="text-micro font-semibold text-space-sparkle hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    {colItems.length === 0 ? (
                      <div className="py-8 text-center text-micro opacity-40 italic">
                        No accordion items in this column
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {colItems.map((item, itemIdx) => (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-lg border space-y-2 transition-all ${
                              isDarkMode
                                ? 'bg-vintage-charcoal/80 border-white/10 hover:border-space-sparkle/40'
                                : 'bg-white border-black/10 hover:border-space-sparkle/40 shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-caption line-clamp-1">
                                {item.title}
                              </h5>
                              <div className="flex items-center gap-1 shrink-0">
                                {/* Up / Down Reorder buttons */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveAccordion(item, 'up')}
                                  disabled={itemIdx === 0}
                                  className="p-1 opacity-70 hover:opacity-100 hover:text-space-sparkle disabled:opacity-20 disabled:hover:text-inherit cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Up"
                                >
                                  <ArrowUp size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveAccordion(item, 'down')}
                                  disabled={itemIdx === colItems.length - 1}
                                  className="p-1 opacity-70 hover:opacity-100 hover:text-space-sparkle disabled:opacity-20 disabled:hover:text-inherit cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Down"
                                >
                                  <ArrowDown size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditAccordion(item)}
                                  className="p-1 opacity-70 hover:opacity-100 hover:text-space-sparkle cursor-pointer"
                                  title="Edit Accordion"
                                >
                                  <Edit2 size={13} />
                                </button>
                              </div>
                            </div>

                            <p className="text-micro opacity-75 line-clamp-3 leading-relaxed">
                              {item.content}
                            </p>

                            {item.linkText && (
                              <div className="pt-1.5 flex items-center gap-1 text-micro text-space-sparkle font-medium truncate">
                                <ExternalLink size={11} className="shrink-0" />
                                <span className="truncate">{item.linkText}</span>
                              </div>
                            )}

                            <div className="pt-1 flex items-center justify-between text-micro font-mono opacity-50">
                              <span>Order: {item.sortOrder}</span>
                              {item.isDraft && (
                                <span className="text-amber-500 font-semibold">Draft</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT PAGE DETAILS MODAL */}
      {editingHeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold lowercase">
                edit service details: {editingHeader.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingHeader(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHeaderSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editingHeader.title}
                  onChange={(e) => setEditingHeader({ ...editingHeader, title: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Tagline (Sub-heading, synced with Landing Card)
                </label>
                <input
                  type="text"
                  value={editingHeader.tagline}
                  onChange={(e) => setEditingHeader({ ...editingHeader, tagline: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Primary Description
                </label>
                <textarea
                  rows={4}
                  value={editingHeader.description}
                  onChange={(e) => setEditingHeader({ ...editingHeader, description: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Bottom Subtext (Footer Row)
                </label>
                <textarea
                  rows={2}
                  value={editingHeader.subtext}
                  onChange={(e) => setEditingHeader({ ...editingHeader, subtext: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                <PublicationToggle
                  isDraft={Boolean(editingHeader.isDraft)}
                  onToggle={() =>
                    setEditingHeader({ ...editingHeader, isDraft: !editingHeader.isDraft })
                  }
                />

                <div className="flex items-center gap-2">
                  <Button type="ghost" onClick={() => setEditingHeader(null)} label="Cancel" />
                  <Button type="filled" htmlType="submit" disabled={!isHeaderDirty}>
                    <Save size={14} className="mr-1.5 inline" /> Save Details
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT ACCORDION MODAL */}
      {editingAccordion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold lowercase">
                {editingAccordion.id.startsWith('acc-') ? 'add new accordion' : 'edit accordion'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingAccordion(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAccordionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Accordion Title
                  </label>
                  <input
                    type="text"
                    value={editingAccordion.title}
                    onChange={(e) => setEditingAccordion({ ...editingAccordion, title: e.target.value })}
                    placeholder="e.g. Architectural Interiors"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Target Column
                  </label>
                  <select
                    value={editingAccordion.columnIndex}
                    onChange={(e) =>
                      setEditingAccordion({ ...editingAccordion, columnIndex: parseInt(e.target.value, 10) })
                    }
                    className={inputClass}
                  >
                    {Array.from({ length: numColumns }).map((_, idx) => (
                      <option key={idx} value={idx}>
                        Column {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Accordion Content
                </label>
                <textarea
                  rows={6}
                  value={editingAccordion.content}
                  onChange={(e) => setEditingAccordion({ ...editingAccordion, content: e.target.value })}
                  placeholder="Detailed description. (Tip: for multi-paragraph content, separate paragraphs with a blank line)"
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/10 dark:border-white/10">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    CTA Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingAccordion.linkText || ''}
                    onChange={(e) => setEditingAccordion({ ...editingAccordion, linkText: e.target.value })}
                    placeholder="e.g. Learn more about our process in designing"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    CTA Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingAccordion.linkHref || ''}
                    onChange={(e) => setEditingAccordion({ ...editingAccordion, linkHref: e.target.value })}
                    placeholder="e.g. /studio/our-process/designing-with-values"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                {!editingAccordion.id.startsWith('acc-') && onDeleteServiceAccordion ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteAccordion(editingAccordion)}
                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-mini flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Trash2 size={14} /> Delete Accordion
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Button type="ghost" onClick={() => setEditingAccordion(null)} label="Cancel" />
                  <Button type="filled" htmlType="submit" disabled={!isAccordionDirty}>
                    <Save size={14} className="mr-1.5 inline" /> Save Accordion
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
