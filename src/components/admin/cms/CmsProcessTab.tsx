/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Layers,
  ChevronRight,
  ListPlus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ProcessPhilosophy, StageGroup, ProcessStageItem } from '@/types';
import { PublicationToggle } from '@/components/admin/PublicationToggle';
import { Button } from '@/components/primitives/buttons/Button';
import { DynamicListField } from '@/components/admin/DynamicListField';
import { useTheme } from '@/context/ThemeContext';

interface CmsProcessTabProps {
  philosophies: ProcessPhilosophy[];
  selectedProcessPageId: string;
  onSelectProcessPage: (pageId: string) => void;
  stageGroups: StageGroup[];
  onSavePhilosophy: (item: ProcessPhilosophy) => void;
  onSaveStageGroup: (group: StageGroup) => void;
  onDeleteStageGroup: (groupId: string) => void;
  onSaveProcessStage: (stage: ProcessStageItem) => void;
  onDeleteProcessStage: (stageId: string) => void;
}

export const CmsProcessTab: React.FC<CmsProcessTabProps> = ({
  philosophies,
  selectedProcessPageId,
  onSelectProcessPage,
  stageGroups,
  onSavePhilosophy,
  onSaveStageGroup,
  onDeleteStageGroup,
  onSaveProcessStage,
  onDeleteProcessStage,
}) => {
  const { isDarkMode } = useTheme();

  // Active Philosophy object
  const currentPhilosophy = philosophies.find((p) => p.id === selectedProcessPageId);

  // Philosophy edit modal
  const [editingPhilosophy, setEditingPhilosophy] = useState<ProcessPhilosophy | null>(null);

  // Stage Group modal state
  const [editingGroup, setEditingGroup] = useState<StageGroup | null>(null);

  // Process Stage modal state
  const [editingStage, setEditingStage] = useState<ProcessStageItem | null>(null);
  const [stageTargetGroupId, setStageTargetGroupId] = useState<string>('');

  const inputClass = `w-full text-caption px-3.5 py-2 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const processPages = [
    { id: 'designing-with-values', label: 'Designing with Values' },
    { id: 'managing-with-integrity', label: 'Managing with Integrity' },
    { id: 'building-with-culture', label: 'Building with Culture' },
  ];

  const handleStartCreateGroup = () => {
    const newGroup: StageGroup = {
      id: `group-${Date.now()}`,
      processPageId: selectedProcessPageId,
      name: '',
      colSpan: 1,
      sortOrder: (stageGroups.length + 1) * 10,
      isDraft: false,
      stages: [],
    };
    setEditingGroup(newGroup);
  };

  const handleStartCreateStage = (groupId: string) => {
    setStageTargetGroupId(groupId);
    const existingStagesCount = stageGroups
      .flatMap((g) => g.stages || [])
      .length;
    const nextStepNum = (existingStagesCount + 1).toString().padStart(2, '0');

    const newStage: ProcessStageItem = {
      id: `stage-${Date.now()}`,
      processPageId: selectedProcessPageId,
      stageGroupId: groupId,
      stepNumber: nextStepNum,
      title: '',
      subtitle: '',
      description: '',
      deliverables: [],
      duration: '2-4 Weeks',
      sortOrder: (existingStagesCount + 1) * 10,
      isDraft: false,
    };
    setEditingStage(newStage);
  };

  return (
    <div className="space-y-8">
      {/* 1. PROCESS PAGE SELECTOR BAR */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <Compass size={20} className="text-space-sparkle shrink-0" />
          <div>
            <h3 className="font-bold text-caption uppercase tracking-wider">Select Process Route</h3>
            <p className="text-micro opacity-60">Manage dynamic stage groups and phases per process route</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {processPages.map((pp) => (
            <button
              key={pp.id}
              onClick={() => onSelectProcessPage(pp.id)}
              className={`px-3 py-1.5 rounded-lg text-mini font-semibold transition-colors cursor-pointer border ${
                selectedProcessPageId === pp.id
                  ? 'bg-space-sparkle text-white border-space-sparkle shadow-xs'
                  : isDarkMode
                    ? 'border-gray-700 hover:bg-white/5 text-bright-gray/70'
                    : 'border-gray-300 hover:bg-black/5 text-vintage-charcoal/70'
              }`}
            >
              {pp.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. PHILOSOPHY NARRATIVE CARD */}
      {currentPhilosophy && (
        <div
          className={`p-6 rounded-xl border space-y-4 ${
            isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between gap-4 border-b pb-3 border-black/10 dark:border-white/10">
            <div>
              <span className="text-micro font-mono uppercase text-space-sparkle font-semibold">
                {currentPhilosophy.sectionTag || 'Philosophy Brief'}
              </span>
              <h3 className="text-body font-bold lowercase">{currentPhilosophy.title}</h3>
              <p className="text-mini font-medium italic opacity-80 mt-0.5">{currentPhilosophy.tagline}</p>
            </div>
            <Button
              type="ghost"
              onClick={() => setEditingPhilosophy({ ...currentPhilosophy })}
              className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle shrink-0"
            >
              <Edit2 size={13} className="mr-1 inline" /> Edit Philosophy
            </Button>
          </div>

          <div className="space-y-2 text-caption opacity-80 leading-relaxed">
            <p>{currentPhilosophy.description}</p>
            {currentPhilosophy.extraDescription && (
              <p className="opacity-70 text-mini">{currentPhilosophy.extraDescription}</p>
            )}
          </div>
        </div>
      )}

      {/* 3. DYNAMIC STAGE GROUPS & PROCESS STAGES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body font-bold flex items-center gap-2">
              <Layers size={18} className="text-space-sparkle" /> Stage Groups &amp; Deliverables
            </h3>
            <p className="text-mini opacity-60">
              Each stage group defines timeline columns and houses specific stages with deliverables.
            </p>
          </div>
          <Button
            type="filled"
            onClick={handleStartCreateGroup}
            className="!py-2 !px-4 text-mini font-semibold"
          >
            <Plus size={14} className="mr-1 inline" /> Add Stage Group
          </Button>
        </div>

        {stageGroups.length === 0 ? (
          <div
            className={`p-8 rounded-xl border text-center space-y-3 ${
              isDarkMode ? 'border-white/10 bg-vintage-charcoal/30' : 'border-black/10 bg-black/2'
            }`}
          >
            <p className="text-mini opacity-60">No stage groups configured for this process page yet.</p>
            <Button type="ghost" onClick={handleStartCreateGroup} className="!py-2 !px-4 text-mini">
              <Plus size={14} className="mr-1.5 inline" /> Create First Stage Group
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {stageGroups.map((group) => (
              <div
                key={group.id}
                className={`rounded-xl border overflow-hidden ${
                  isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
                }`}
              >
                {/* Group Header */}
                <div
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                    isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-space-sparkle/15 text-space-sparkle flex items-center justify-center font-bold font-mono text-mini">
                      {group.colSpan}c
                    </span>
                    <div>
                      <h4 className="font-bold text-caption sm:text-body uppercase tracking-wider">
                        {group.name || 'Unnamed Stage Group'}
                      </h4>
                      <span className="text-micro font-mono opacity-50">
                        Span: {group.colSpan} Column(s) | Order: {group.sortOrder} | Stages: {group.stages?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      type="ghost"
                      onClick={() => handleStartCreateStage(group.id)}
                      className="!py-1.5 !px-3 text-mini bg-space-sparkle/15 text-space-sparkle hover:bg-space-sparkle/25 font-semibold"
                    >
                      <ListPlus size={13} className="mr-1 inline" /> Add Stage
                    </Button>
                    <Button
                      type="ghost"
                      onClick={() => setEditingGroup({ ...group })}
                      className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                    >
                      <Edit2 size={13} className="mr-1 inline" /> Edit Group
                    </Button>
                    <button
                      type="button"
                      onClick={() => onDeleteStageGroup(group.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                      title="Delete group"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Stages List inside Group */}
                <div className="p-4 sm:p-5">
                  {!group.stages || group.stages.length === 0 ? (
                    <div className="py-6 text-center opacity-50 text-mini font-mono">
                      No stages under this group. Click "+ Add Stage" above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.stages.map((stage) => (
                        <div
                          key={stage.id}
                          className={`p-4 rounded-lg border flex flex-col justify-between gap-3 ${
                            isDarkMode ? 'bg-white/3 border-white/10' : 'bg-black/2 border-black/10'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded font-mono font-bold text-micro bg-space-sparkle/15 text-space-sparkle">
                                Stage {stage.stepNumber}
                              </span>
                              <div className="flex items-center gap-1.5 text-micro opacity-60">
                                <Clock size={12} />
                                <span>{stage.duration}</span>
                              </div>
                            </div>

                            <h5 className="font-bold text-caption">{stage.title}</h5>
                            {stage.subtitle && (
                              <p className="text-micro font-medium opacity-70 italic">{stage.subtitle}</p>
                            )}
                            <p className="text-micro opacity-70 line-clamp-3 leading-relaxed">
                              {stage.description}
                            </p>

                            {/* Deliverables preview */}
                            {stage.deliverables && stage.deliverables.length > 0 && (
                              <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                                <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                                  Deliverables ({stage.deliverables.length}):
                                </span>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {stage.deliverables.map((deliv, idx) => (
                                    <span
                                      key={idx}
                                      className="text-micro px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-80"
                                    >
                                      ✓ {deliv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                            <PublicationToggle
                              isDraft={Boolean(stage.isDraft)}
                              onToggle={() =>
                                onSaveProcessStage({ ...stage, isDraft: !stage.isDraft })
                              }
                            />
                            <div className="flex items-center gap-1.5">
                              <Button
                                type="ghost"
                                onClick={() => {
                                  setStageTargetGroupId(group.id);
                                  setEditingStage({ ...stage });
                                }}
                                className="!py-1 !px-2.5 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                              >
                                <Edit2 size={12} className="mr-1 inline" /> Edit
                              </Button>
                              <button
                                type="button"
                                onClick={() => onDeleteProcessStage(stage.id)}
                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                                title="Remove stage"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: EDIT PHILOSOPHY */}
      {editingPhilosophy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold lowercase">edit philosophy: {editingPhilosophy.title}</h3>
              <button
                type="button"
                onClick={() => setEditingPhilosophy(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSavePhilosophy(editingPhilosophy);
                setEditingPhilosophy(null);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Tagline / Lead Philosophy
                </label>
                <input
                  type="text"
                  required
                  value={editingPhilosophy.tagline}
                  onChange={(e) => setEditingPhilosophy({ ...editingPhilosophy, tagline: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Primary Description Narrative
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingPhilosophy.description}
                  onChange={(e) => setEditingPhilosophy({ ...editingPhilosophy, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Secondary Description / Context
                </label>
                <textarea
                  rows={3}
                  value={editingPhilosophy.extraDescription || ''}
                  onChange={(e) => setEditingPhilosophy({ ...editingPhilosophy, extraDescription: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingPhilosophy(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
                  <Save size={14} className="mr-1.5 inline" /> Save Philosophy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE STAGE GROUP */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold">
                {editingGroup.name ? `Edit Group: ${editingGroup.name}` : 'New Stage Group'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingGroup(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSaveStageGroup(editingGroup);
                setEditingGroup(null);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Stage Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingGroup.name}
                  onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                  placeholder="e.g. Guidance, Experiential, Presence"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Grid Column Span
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={editingGroup.colSpan}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, colSpan: parseInt(e.target.value, 10) || 1 })
                    }
                    className={inputClass}
                  />
                  <p className="text-micro opacity-40">Width in timeline columns.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingGroup.sortOrder}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingGroup(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
                  <Save size={14} className="mr-1.5 inline" /> Save Stage Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE PROCESS STAGE */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <h3 className="text-body font-bold">
                {editingStage.title ? `Edit Stage: ${editingStage.title}` : 'Add Process Stage'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingStage(null)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSaveProcessStage({ ...editingStage, stageGroupId: stageTargetGroupId });
                setEditingStage(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Step Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStage.stepNumber}
                    onChange={(e) => setEditingStage({ ...editingStage, stepNumber: e.target.value })}
                    placeholder="e.g. 01"
                    className={`${inputClass} font-mono font-bold`}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Stage Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStage.title}
                    onChange={(e) => setEditingStage({ ...editingStage, title: e.target.value })}
                    placeholder="e.g. Site Discovery & Solar Orientation"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Subtitle / Action Tag
                  </label>
                  <input
                    type="text"
                    value={editingStage.subtitle}
                    onChange={(e) => setEditingStage({ ...editingStage, subtitle: e.target.value })}
                    placeholder="e.g. Feasibility & Solar Mapping"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={editingStage.duration}
                    onChange={(e) => setEditingStage({ ...editingStage, duration: e.target.value })}
                    placeholder="e.g. 2-4 Weeks"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                  Stage Description Narrative
                </label>
                <textarea
                  rows={3}
                  value={editingStage.description}
                  onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                  placeholder="Describe key activities, tests, or collaborative workshops in this stage..."
                  className={inputClass}
                />
              </div>

              <div className="pt-2">
                <DynamicListField
                  mode="strings"
                  label="Key Deliverables"
                  placeholder="e.g. Solar Path Diagrams, 3D Schematics, Permit Set"
                  helperText="List formal outputs received by the client upon completing this stage."
                  items={editingStage.deliverables || []}
                  onChange={(deliverables) => setEditingStage({ ...editingStage, deliverables })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingStage(null)} label="Cancel" />
                <Button type="filled" htmlType="submit">
                  <Save size={14} className="mr-1.5 inline" /> Save Process Stage
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
