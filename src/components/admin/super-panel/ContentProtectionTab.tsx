/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Power,
  CopyX,
  MousePointerClick,
  FileImage,
  Keyboard,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import {
  getContentProtectionAction,
  setContentProtectionAction,
} from '@/app/actions/super-panel-actions';
import { toast } from 'sonner';

export const ContentProtectionTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [isEnabled, setIsEnabled] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadState = async () => {
    setIsLoading(true);
    const res = await getContentProtectionAction();
    setIsEnabled(res.enabled);
    setUpdatedAt(res.updatedAt || null);
    setIsLoading(false);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleToggle = async () => {
    const nextState = !isEnabled;
    setIsUpdating(true);

    const res = await setContentProtectionAction(nextState);
    setIsUpdating(false);

    if (res.success) {
      setIsEnabled(nextState);
      setUpdatedAt(new Date().toISOString());
      if (nextState) {
        toast.success('Public content protection enabled. Portfolio media and assets are protected.');
      } else {
        toast.info('Public content protection disabled.');
      }
    } else {
      toast.error(res.error || 'Failed to update content protection.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
          Intellectual Property &amp; Media Security
        </span>
        <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
          public portfolio content protection
        </h2>
        <p className="text-caption font-light opacity-70">
          Guard architectural photography, blueprints, project case studies, and studio writeups against unauthorized saving, scraping, and inspection.
        </p>
      </div>

      {/* Main Switch Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isEnabled
            ? 'border-space-sparkle/40 bg-space-sparkle/5'
            : isDarkMode
            ? 'border-white/10 bg-vintage-charcoal/80'
            : 'border-black/10 bg-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isEnabled
                    ? 'bg-space-sparkle/20 text-space-sparkle'
                    : 'bg-black/10 dark:bg-white/10 opacity-60'
                }`}
              >
                {isEnabled ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
              </div>

              <div>
                <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                  Protection Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-h3 font-bold">
                    {isEnabled ? 'Protection Active & Guarding' : 'Protection Disabled'}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isEnabled ? 'bg-space-sparkle animate-pulse' : 'bg-gray-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            <p className="text-caption font-light opacity-80 max-w-xl leading-relaxed">
              {isEnabled
                ? 'Right-click context menu, image dragging, text selection, and keyboard inspection hotkeys are shielded on all public pages. Studio administration dashboards and CMS editors remain 100% unrestricted.'
                : 'Public visitors have standard browser interaction enabled without restrictions.'}
            </p>

            {updatedAt && (
              <p className="text-[11px] font-mono opacity-50">
                Last modified: {new Date(updatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <Button
              type="filled"
              onClick={handleToggle}
              disabled={isLoading || isUpdating}
              className={`!py-3 !px-6 text-mini font-semibold cursor-pointer shadow-md transition-all ${
                isEnabled
                  ? '!bg-vintage-charcoal border border-white/20 hover:!bg-black text-white'
                  : '!bg-space-sparkle hover:opacity-90 text-white'
              }`}
            >
              <Power size={16} className="mr-2 inline" />
              <span>
                {isUpdating
                  ? 'Updating...'
                  : isEnabled
                  ? 'Disable Protection'
                  : 'Enable Protection Shield'}
              </span>
            </Button>
          </div>
        </div>

        {/* Protection Capabilities Grid */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-mini">
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <MousePointerClick size={16} className="text-space-sparkle" />
              <span>Right-Click Menu Shield</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              Disables the browser context menu on portfolio imagery, rendering and project photography.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <FileImage size={16} className="text-space-sparkle" />
              <span>Asset Drag &amp; Drop Lock</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              Prevents users from dragging images, design renders, or interactive gallery cards onto their desktop or file explorer.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <CopyX size={16} className="text-space-sparkle" />
              <span>Text Scraping &amp; Copy Block</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              Intercepts copy and cut clipboard operations, safeguarding architectural narratives and specifications from casual scraping.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <Keyboard size={16} className="text-space-sparkle" />
              <span>Inspection Shortcut Shield</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              Intercepts Ctrl+S (Save Page), Ctrl+P (Print), DevTools shortcuts, and clears clipboard on screenshot attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
