/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Briefcase, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { ServiceOffering, ServicePillar } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { ImageManagerField } from '@/components/admin/ImageManagerField';
import { useTheme } from '@/context/ThemeContext';

interface CmsServicesTabProps {
  services: ServiceOffering[];
  selectedServiceId: string;
  onSelectServiceId: (id: string) => void;
  onSaveService: (service: ServiceOffering) => void;
}

export const CmsServicesTab: React.FC<CmsServicesTabProps> = ({
  services,
  selectedServiceId,
  onSelectServiceId,
  onSaveService,
}) => {
  const { isDarkMode } = useTheme();

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null);

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const handleStartEdit = () => {
    if (currentService) {
      setEditingService({ ...currentService });
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    onSaveService(editingService);
    setEditingService(null);
  };

  const updatePillar = (index: number, field: keyof ServicePillar, value: string) => {
    if (!editingService) return;
    const updatedPillars = [...(editingService.pillars || [])];
    updatedPillars[index] = { ...updatedPillars[index], [field]: value };
    setEditingService({ ...editingService, pillars: updatedPillars });
  };

  const addPillar = () => {
    if (!editingService) return;
    const updatedPillars = [...(editingService.pillars || []), { title: '', desc: '' }];
    setEditingService({ ...editingService, pillars: updatedPillars });
  };

  const removePillar = (index: number) => {
    if (!editingService) return;
    const updatedPillars = (editingService.pillars || []).filter((_, i) => i !== index);
    setEditingService({ ...editingService, pillars: updatedPillars });
  };

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
            <p className="text-micro opacity-60">Manage descriptions, 4 pillars, and scope deliverables</p>
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

      {/* 2. ACTIVE SERVICE PREVIEW */}
      {currentService && (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-xl border space-y-5 ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-4 border-black/10 dark:border-white/10">
              <div className="space-y-1">
                <span className="text-micro font-mono uppercase text-space-sparkle font-semibold">
                  {currentService.sectionTag || 'Service Offering'}
                </span>
                <h3 className="text-body sm:text-h2 font-major font-bold lowercase">
                  {currentService.title}
                </h3>
                <p className="text-mini font-medium italic text-space-sparkle">
                  {currentService.tagline}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <PublicationToggle
                  isDraft={Boolean(currentService.isDraft)}
                  onToggle={() =>
                    onSaveService({ ...currentService, isDraft: !currentService.isDraft })
                  }
                />
                <Button
                  type="filled"
                  onClick={handleStartEdit}
                  className="!py-2 !px-4 text-mini font-semibold"
                >
                  <Edit2 size={13} className="mr-1.5 inline" /> Edit Service
                </Button>
              </div>
            </div>

            {/* Media & Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentService.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                  <Image
                    src={currentService.imageUrl}
                    alt={currentService.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className={`space-y-3 ${currentService.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                <p className="text-caption leading-relaxed opacity-90">{currentService.description}</p>
                {currentService.extraDescription && (
                  <p className="text-mini opacity-70 leading-relaxed">{currentService.extraDescription}</p>
                )}
                {currentService.subtext && (
                  <p className="text-micro font-mono opacity-50">{currentService.subtext}</p>
                )}
              </div>
            </div>

            {/* Core Pillars */}
            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
              <h4 className="text-caption font-semibold uppercase tracking-wider">
                Core Pillars ({currentService.pillars?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(currentService.pillars || []).map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border space-y-1.5 ${
                      isDarkMode ? 'bg-white/3 border-white/10' : 'bg-black/2 border-black/10'
                    }`}
                  >
                    <span className="text-micro font-mono opacity-40">0{idx + 1}</span>
                    <h5 className="font-bold text-caption line-clamp-1">{pillar.title}</h5>
                    <p className="text-micro opacity-70 leading-relaxed line-clamp-3">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-3xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold lowercase">edit service: {editingService.title}</h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Service Tagline
                  </label>
                  <input
                    type="text"
                    value={editingService.tagline}
                    onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Section Tag
                  </label>
                  <input
                    type="text"
                    value={editingService.sectionTag}
                    onChange={(e) => setEditingService({ ...editingService, sectionTag: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Primary Description
                </label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Secondary / Extra Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.extraDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, extraDescription: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <ImageManagerField
                  single={true}
                  label="Service Hero Photo"
                  helperText="Showcase photograph for this service tier."
                  images={editingService.imageUrl ? [editingService.imageUrl] : []}
                  onChange={(imgs) => setEditingService({ ...editingService, imageUrl: imgs[0] || '' })}
                />
              </div>

              {/* Pillars Editor */}
              <div className="space-y-3 pt-3 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-caption font-semibold uppercase tracking-wider">
                    Core Pillars ({editingService.pillars?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={addPillar}
                    className="text-mini font-semibold text-space-sparkle hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Pillar
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingService.pillars || []).map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-black/10 dark:border-white/10 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-micro font-mono opacity-50">Pillar #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removePillar(idx)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                        placeholder="Pillar Title (e.g. Turnkey Architecture)"
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        value={pillar.desc}
                        onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
                        placeholder="Pillar brief description..."
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingService(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
                  <Save size={14} className="mr-1.5 inline" /> Save Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
