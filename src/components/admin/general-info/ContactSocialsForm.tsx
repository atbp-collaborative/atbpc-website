/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { useTheme } from '@/context/ThemeContext';
import { isFormDirty } from '@/lib/admin/editor-utils';

export interface ContactSocialsFormProps {
  data: ContactInfo;
  initialData: ContactInfo | null;
  onChange: (updated: ContactInfo) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export function ContactSocialsForm({
  data,
  initialData,
  onChange,
  onSave,
  onReset,
  isSaving = false,
}: ContactSocialsFormProps) {
  const { isDarkMode } = useTheme();

  const isDirty = useMemo(() => {
    return isFormDirty(data, initialData);
  }, [data, initialData]);

  const inputClass = `w-full text-caption px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  const updateSocial = (
    platform: 'facebook' | 'instagram' | 'threads' | 'youtube',
    field: 'label' | 'url',
    value: string
  ) => {
    onChange({
      ...data,
      socials: {
        ...data.socials,
        [platform]: {
          ...data.socials?.[platform],
          [field]: value,
        },
      },
    });
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-xl border space-y-6 ${
        isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10 shadow-xs'
      }`}
    >
      <div className="border-b pb-4 border-black/5 dark:border-white/5">
        <h3 className="text-body font-major font-bold tracking-tight lowercase">
          studio contact coordinates
        </h3>
        <p className="text-caption opacity-70">
          Official physical addresses, telephone, mobile hotline, and social profiles displayed across public contact pages and footers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
            Studio Name
          </label>
          <input
            type="text"
            value={data.studioName || ''}
            onChange={(e) => onChange({ ...data, studioName: e.target.value })}
            placeholder="e.g. ATBP Collaborative"
            className={inputClass}
          />
          <p className="text-micro opacity-50">
            Official trade and practice name for the studio across communications and directory listings.
          </p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
            Full Studio Physical Address
          </label>
          <textarea
            rows={3}
            value={data.address || ''}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            placeholder="P4, B2, L1, N402 Lovebird Lane corner Eagle Drive..."
            className={inputClass}
          />
          <p className="text-micro opacity-50">
            Edits here are automatically reflected on the Case Study House contact page.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
            Landline Telephone
          </label>
          <input
            type="text"
            value={data.landline || ''}
            onChange={(e) => onChange({ ...data, landline: e.target.value })}
            placeholder="+632 8257-0968"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
            Mobile Hotline
          </label>
          <input
            type="text"
            value={data.mobile || ''}
            onChange={(e) => onChange({ ...data, mobile: e.target.value })}
            placeholder="+63 917 165 4827"
            className={inputClass}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-micro font-semibold uppercase tracking-wider block opacity-80">
            Official Inquiries Email
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="enquire@atbpcollaborative.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Social Accounts with Display Text and URL */}
      <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
        <div>
          <h4 className="text-caption font-semibold uppercase tracking-wider opacity-80">
            Official Social Media Channels
          </h4>
          <p className="text-micro opacity-60">
            Configure both the public display link text and the destination URL for each channel.
          </p>
        </div>

        <div className="space-y-4">
          {/* Facebook */}
          <div className="p-3.5 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <span className="text-micro font-semibold uppercase tracking-wider block text-space-sparkle">
              Facebook
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Display Text
                </label>
                <input
                  type="text"
                  value={data.socials?.facebook?.label || ''}
                  onChange={(e) => updateSocial('facebook', 'label', e.target.value)}
                  placeholder="e.g. ATBP Collaborative"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Page URL
                </label>
                <input
                  type="url"
                  value={data.socials?.facebook?.url || ''}
                  onChange={(e) => updateSocial('facebook', 'url', e.target.value)}
                  placeholder="https://www.facebook.com/atbp.collaborative/"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="p-3.5 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <span className="text-micro font-semibold uppercase tracking-wider block text-space-sparkle">
              Instagram
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Display Text
                </label>
                <input
                  type="text"
                  value={data.socials?.instagram?.label || ''}
                  onChange={(e) => updateSocial('instagram', 'label', e.target.value)}
                  placeholder="e.g. @atbp.collaborative"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Profile URL
                </label>
                <input
                  type="url"
                  value={data.socials?.instagram?.url || ''}
                  onChange={(e) => updateSocial('instagram', 'url', e.target.value)}
                  placeholder="https://www.instagram.com/atbp.collaborative"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Threads */}
          <div className="p-3.5 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <span className="text-micro font-semibold uppercase tracking-wider block text-space-sparkle">
              Threads
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Display Text
                </label>
                <input
                  type="text"
                  value={data.socials?.threads?.label || ''}
                  onChange={(e) => updateSocial('threads', 'label', e.target.value)}
                  placeholder="e.g. @atbp.collaborative"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Profile URL
                </label>
                <input
                  type="url"
                  value={data.socials?.threads?.url || ''}
                  onChange={(e) => updateSocial('threads', 'url', e.target.value)}
                  placeholder="https://www.threads.net/@atbp.collaborative"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* YouTube */}
          <div className="p-3.5 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <span className="text-micro font-semibold uppercase tracking-wider block text-space-sparkle">
              YouTube
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Display Text
                </label>
                <input
                  type="text"
                  value={data.socials?.youtube?.label || ''}
                  onChange={(e) => updateSocial('youtube', 'label', e.target.value)}
                  placeholder="e.g. @atbpcollaborative9514"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-micro uppercase tracking-wider block opacity-70">
                  Channel URL
                </label>
                <input
                  type="url"
                  value={data.socials?.youtube?.url || ''}
                  onChange={(e) => updateSocial('youtube', 'url', e.target.value)}
                  placeholder="https://www.youtube.com/@atbpcollaborative9514"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
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
              You have modified studio coordinates. Save to apply to public views or reset to discard changes.
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
              <Save size={14} className="mr-1.5 inline" /> {isSaving ? 'Saving...' : 'Save Contact Information'}
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
