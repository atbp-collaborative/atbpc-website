/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { useTheme } from '@/context/ThemeContext';
import { isFormDirty } from '@/lib/admin/editor-utils';

export interface PolicyDocumentData {
  title: string;
  subtitle: string;
  effectiveDate?: string;
  bodyHtml?: string;
  badge?: string;
}

export interface PolicyDocumentEditorProps {
  heading: string;
  description: string;
  data: PolicyDocumentData;
  initialData: PolicyDocumentData | null;
  onChange: (updated: PolicyDocumentData) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
  saveButtonLabel?: string;
  showBadgeField?: boolean;
}

export function PolicyDocumentEditor({
  heading,
  description,
  data,
  initialData,
  onChange,
  onSave,
  onReset,
  isSaving = false,
  saveButtonLabel = 'Save Changes',
  showBadgeField = false,
}: PolicyDocumentEditorProps) {
  const { isDarkMode } = useTheme();

  const isDirty = useMemo(() => {
    return isFormDirty(data, initialData);
  }, [data, initialData]);

  const inputClass = `w-full text-caption px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  return (
    <div
      className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
        isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
      }`}
    >
      {/* Header Info */}
      <div className="border-b pb-4 border-black/5 dark:border-white/5">
        <h3 className="text-body font-major font-bold tracking-tight lowercase">
          {heading}
        </h3>
        <p className="text-caption opacity-70">
          {description}
        </p>
      </div>

      {/* Main Metadata Inputs */}
      <div className="space-y-4">
        <div className={`grid grid-cols-1 ${showBadgeField ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
          <div className="space-y-1">
            <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
              Document Title
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Privacy Policy"
            />
          </div>

          <div className="space-y-1">
            <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
              Document Subtitle / Scope
            </label>
            <input
              type="text"
              value={data.subtitle || ''}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              className={inputClass}
              placeholder="e.g. ATBP Collaborative • Data Privacy"
            />
          </div>

          {showBadgeField && (
            <div className="space-y-1">
              <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
                Regulatory Badge
              </label>
              <input
                type="text"
                value={data.badge || ''}
                onChange={(e) => onChange({ ...data, badge: e.target.value })}
                className={inputClass}
                placeholder="e.g. Republic Act No. 10173"
              />
            </div>
          )}
        </div>

        {/* Effective Date Label Field */}
        <div className="space-y-1">
          <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
            Effective Date Label
          </label>
          <input
            type="text"
            value={data.effectiveDate || ''}
            onChange={(e) => onChange({ ...data, effectiveDate: e.target.value })}
            className={inputClass}
            placeholder="e.g. Effective Date: October 2026"
          />
        </div>

        {/* Rich Text Editor for Body */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
              Document Body (Rich Text)
            </label>
            <span className="text-micro font-mono opacity-50">WYSIWYG &amp; HTML Mode</span>
          </div>
          <RichTextEditor
            value={data.bodyHtml || ''}
            onChange={(html) => onChange({ ...data, bodyHtml: html })}
            placeholder="Enter policy sections, regulatory notices, covenants, and clauses..."
            minHeight="320px"
          />
        </div>
      </div>

      {/* Dedicated Actions & Unsaved Changes Alert Bar */}
      {isDirty && (
        <div
          className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
            isDarkMode
              ? 'bg-vintage-charcoal/80 border-space-sparkle/40 ring-1 ring-space-sparkle/20'
              : 'bg-white border-space-sparkle/40 shadow-sm ring-1 ring-space-sparkle/20'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold uppercase tracking-wider block text-space-sparkle">
                Unsaved Changes
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-micro opacity-70">
              You have modified this document. Save to apply to public views or reset to discard changes.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="ghost"
              onClick={onReset}
              className="!py-2 !px-3 sm:!px-4 text-mini"
            >
              <RotateCcw size={13} className="mr-1.5 inline" /> Reset Changes
            </Button>
            <Button
              type="filled"
              onClick={onSave}
              disabled={isSaving}
              className="!py-2 !px-4 sm:!px-5 text-mini font-semibold"
            >
              <Save size={14} className="mr-1.5 inline" /> {isSaving ? 'Saving...' : saveButtonLabel}
            </Button>
          </div>
        </div>
      )}

      {/* Default footer save if not dirty */}
      {!isDirty && (
        <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/5">
          <Button
            type="filled"
            onClick={onSave}
            disabled={true}
            className="!py-2 !px-6 text-mini opacity-50 cursor-not-allowed"
          >
            <Save size={14} className="mr-1.5 inline" /> Saved
          </Button>
        </div>
      )}
    </div>
  );
}
