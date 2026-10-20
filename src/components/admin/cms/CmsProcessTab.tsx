/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Layers,
  ListPlus,
  Clock,
} from 'lucide-react';
import { ProcessPhilosophy, StageGroup, ProcessStageItem, NavigationCardItem } from '@/types';
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
  cards?: NavigationCardItem[];
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
  cards = [],
}) => {
  const { isDarkMode } = useTheme();

  // Active Philosophy object
  const currentPhilosophy = philosophies.find((p) => p.id === selectedProcessPageId);

  // Match tagline with the corresponding card in Landing Pages
  const matchingLandingCard = useMemo(() => {
    return cards.find(
      (c) =>
        (c.hubId === 'process' || c.hubId === 'our-process') &&
        (c.id === selectedProcessPageId || c.cardKey === selectedProcessPageId)
    );
  }, [cards, selectedProcessPageId]);

  const displayedTagline = matchingLandingCard?.tagline || currentPhilosophy?.tagline || '';

  // Philosophy edit modal
  const [editingPhilosophy, setEditingPhilosophy] = useState<ProcessPhilosophy | null>(null);
  const initialPhilosophyRef = useRef<ProcessPhilosophy | null>(null);

  const handleStartEditPhilosophy = (phil: ProcessPhilosophy) => {
    const philWithSyncedTagline = { ...phil, tagline: displayedTagline };
    setEditingPhilosophy(philWithSyncedTagline);
    initialPhilosophyRef.current = { ...philWithSyncedTagline };
  };

  const isPhilosophyDirty = useMemo(() => {
    if (!editingPhilosophy || !initialPhilosophyRef.current) return false;
    return JSON.stringify(editingPhilosophy) !== JSON.stringify(initialPhilosophyRef.current);
  }, [editingPhilosophy]);

  // Stage Group modal state
  const [editingGroup, setEditingGroup] = useState<StageGroup | null>(null);
  const initialGroupRef = useRef<StageGroup | null>(null);

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
    initialGroupRef.current = { ...newGroup };
  };

  const handleStartEditGroup = (group: StageGroup) => {
    setEditingGroup({ ...group });
    initialGroupRef.current = { ...group };
  };

  const isGroupDirty = useMemo(() => {
    if (!editingGroup || !initialGroupRef.current) return false;
    return JSON.stringify(editingGroup) !== JSON.stringify(initialGroupRef.current);
  }, [editingGroup]);

  // Process Stage modal state
  const [editingStage, setEditingStage] = useState<ProcessStageItem | null>(null);
  const [stageTargetGroupId, setStageTargetGroupId] = useState<string>('');
  const initialStageRef = useRef<ProcessStageItem | null>(null);

  const isStageDirty = useMemo(() => {
    if (!editingStage || !initialStageRef.current) return false;
    return JSON.stringify(editingStage) !== JSON.stringify(initialStageRef.current);
  }, [editingStage]);

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
    initialStageRef.current = { ...newStage };
  };

  const handleStartEditStage = (stage: ProcessStageItem, groupId: string) => {
    setStageTargetGroupId(groupId);
    setEditingStage({ ...stage });
    initialStageRef.current = { ...stage };
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
              {/* Tagline synced with the landing page card */}
              <p className="text-mini font-medium italic opacity-80 mt-0.5">{displayedTagline}</p>
            </div>
            <Button
              type="ghost"
              onClick={() => handleStartEditPhilosophy(currentPhilosophy)}
              className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle shrink-0"
            >
              <Edit2 size={13} className="mr-1 inline" /> Edit Philosophy
            </Button>
          </div>

          <div className="space-y-2 text-caption opacity-80 leading-relaxed">
            <p>{currentPhilosophy.description}</p>
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
              Each stage group defines the workflow phases and houses specific stages with deliverables.
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
                {/* Group Header: column span and main trash icon removed */}
                <div
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                    isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-space-sparkle/15 text-space-sparkle flex items-center justify-center font-bold">
                      <Layers size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-caption sm:text-body uppercase tracking-wider">
                        {group.name || 'Unnamed Stage Group'}
                      </h4>
                      <span className="text-micro font-mono opacity-50">
                        Order: {group.sortOrder} | Stages: {group.stages?.length || 0}
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
                      onClick={() => handleStartEditGroup(group)}
                      className="!py-1.5 !px-3 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                    >
                      <Edit2 size={13} className="mr-1 inline" /> Edit Group
                    </Button>
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
                            <p className="text-micro opacity-70 line-clamp-3 leading-relaxed">
                              {stage.description}
                            </p>

                            {/* Deliverables preview */}
                            {stage.deliverables && stage.deliverables.length > 0 && (
                              <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                                <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                                  Deliverables ({stage.deliverables.length}):
                                </span>
                                <div className="space-y-1">
                                  {stage.deliverables.map((deliv, idx) => (
                                    <div
                                      key={idx}
                                      className="text-micro px-2 py-1 rounded bg-black/5 dark:bg-white/5 opacity-80 flex items-center gap-1.5"
                                    >
                                      <span className="text-space-sparkle">✓</span>
                                      <span>{deliv}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Stage Card Footer: publication chip and trash button removed */}
                          <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-end gap-2">
                            <Button
                              type="ghost"
                              onClick={() => handleStartEditStage(stage, group.id)}
                              className="!py-1 !px-2.5 text-mini border border-black/10 dark:border-white/10 hover:border-space-sparkle"
                            >
                              <Edit2 size={12} className="mr-1 inline" /> Edit Stage
                            </Button>
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
                if (!isPhilosophyDirty) return;
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
                  disabled
                  value={displayedTagline}
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
                <p className="text-micro opacity-40">Tagline is synced with the corresponding Landing Pages card.</p>
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <Button type="ghost" onClick={() => setEditingPhilosophy(null)} label="Cancel" />
                <Button type="filled" htmlType="submit" disabled={!isPhilosophyDirty}>
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
                if (!isGroupDirty) return;
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

              {/* Grid Column Span removed, Sort order rendered directly */}
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

              {/* Trash icon moved inside the modal window */}
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                {stageGroups.some((g) => g.id === editingGroup.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete stage group "${editingGroup.name}"?`)) {
                        onDeleteStageGroup(editingGroup.id);
                        setEditingGroup(null);
                      }
                    }}
                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-mini flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Trash2 size={14} /> Delete Group
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <Button type="ghost" onClick={() => setEditingGroup(null)} label="Cancel" />
                  <Button type="filled" htmlType="submit" disabled={!isGroupDirty}>
                    <Save size={14} className="mr-1.5 inline" /> Save Stage Group
                  </Button>
                </div>
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
                if (!isStageDirty) return;
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

              {/* Subtitle / Action Tag field removed */}
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

              {/* Key Deliverables listed one item per row via layout="rows" */}
              <div className="pt-2">
                <DynamicListField
                  mode="strings"
                  layout="rows"
                  label="Key Deliverables"
                  placeholder="e.g. Solar Path Diagrams, 3D Schematics, Permit Set"
                  helperText="List formal outputs received by the client upon completing this stage."
                  items={editingStage.deliverables || []}
                  onChange={(deliverables) => setEditingStage({ ...editingStage, deliverables })}
                />
              </div>

              {/* Trash icon inside modal and save enabled only in dirty state */}
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                {stageGroups.some((g) => g.stages?.some((s) => s.id === editingStage.id)) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete stage "${editingStage.title}"?`)) {
                        onDeleteProcessStage(editingStage.id);
                        setEditingStage(null);
                      }
                    }}
                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-mini flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Trash2 size={14} /> Delete Stage
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <Button type="ghost" onClick={() => setEditingStage(null)} label="Cancel" />
                  <Button type="filled" htmlType="submit" disabled={!isStageDirty}>
                    <Save size={14} className="mr-1.5 inline" /> Save Process Stage
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
