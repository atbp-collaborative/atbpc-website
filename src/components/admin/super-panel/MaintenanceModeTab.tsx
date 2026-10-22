/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Power,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import {
  getMaintenanceModeAction,
  setMaintenanceModeAction,
} from '@/app/actions/super-panel-actions';
import { toast } from 'sonner';

export const MaintenanceModeTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [isEnabled, setIsEnabled] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingState, setPendingState] = useState<boolean>(false);

  const loadState = async () => {
    setIsLoading(true);
    const res = await getMaintenanceModeAction();
    setIsEnabled(res.enabled);
    setUpdatedAt(res.updatedAt || null);
    setIsLoading(false);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleToggleClick = () => {
    setPendingState(!isEnabled);
    setIsConfirmOpen(true);
  };

  const handleConfirmToggle = async () => {
    setIsConfirmOpen(false);
    setIsUpdating(true);

    const res = await setMaintenanceModeAction(pendingState);
    setIsUpdating(false);

    if (res.success) {
      setIsEnabled(pendingState);
      setUpdatedAt(new Date().toISOString());
      if (pendingState) {
        toast.warning('Maintenance mode activated. Public pages now route to Under Construction.');
      } else {
        toast.success('Maintenance mode disabled. Public website is live.');
      }
    } else {
      toast.error(res.error || 'Failed to update maintenance mode.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
          Studio System Controls
        </span>
        <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
          public website maintenance mode
        </h2>
        <p className="text-caption font-light opacity-70">
          Place the entire public website under construction while retaining administrative dashboard access.
        </p>
      </div>

      {/* Main Switch Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isEnabled
            ? 'border-amber-500/40 bg-amber-500/5'
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
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'bg-emerald-500/20 text-emerald-500'
                }`}
              >
                {isEnabled ? <HardHat size={22} /> : <CheckCircle2 size={22} />}
              </div>

              <div>
                <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                  Current Public Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-h3 font-bold">
                    {isEnabled ? 'Under Construction Active' : 'Website is Live & Public'}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isEnabled ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <p className="text-caption font-light opacity-80 max-w-xl leading-relaxed">
              {isEnabled
                ? 'All external visitors are currently rewritten to the Under Construction screen. Authenticated administrators can continue using the dashboard normally.'
                : 'All public routes (Works portfolio, Our People, Services, and CMS content) are actively accessible to all visitors.'}
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
              onClick={handleToggleClick}
              disabled={isLoading || isUpdating}
              className={`!py-3 !px-6 text-mini font-semibold cursor-pointer shadow-md transition-all ${
                isEnabled
                  ? '!bg-emerald-600 hover:!bg-emerald-700 !text-white'
                  : '!bg-amber-600 hover:!bg-amber-700 !text-white'
              }`}
            >
              <Power size={16} className="mr-2 inline" />
              <span>
                {isUpdating
                  ? 'Updating Status...'
                  : isEnabled
                  ? 'Disable Maintenance (Go Live)'
                  : 'Enable Maintenance Mode'}
              </span>
            </Button>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-mini">
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck size={16} className="text-space-sparkle" />
              <span>Administrator Exemption</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              The maintenance gate applies strictly to public-facing pages. All admin routes (`/admin/*`) and authenticated CMS APIs remain available.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles size={16} className="text-space-sparkle" />
              <span>Instant Edge Activation</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              Changes take effect immediately without requiring a code rebuild or redeployment on the hosting server.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={pendingState ? 'Activate Maintenance Mode?' : 'Deactivate Maintenance Mode?'}
        description={
          pendingState
            ? 'Are you sure you want to activate Maintenance Mode? All public visitors will immediately be shown the Under Construction screen. Only logged-in administrators will be able to access the console.'
            : 'Are you sure you want to deactivate Maintenance Mode? The full public website (portfolio, team, and services) will immediately be restored and accessible to all visitors.'
        }
        confirmLabel={pendingState ? 'Yes, Enable Maintenance' : 'Yes, Restore Public Website'}
        isDestructive={pendingState}
        onConfirm={handleConfirmToggle}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
