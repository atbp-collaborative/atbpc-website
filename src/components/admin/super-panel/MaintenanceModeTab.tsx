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
  Rocket,
  Globe,
  Lock,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import {
  getMaintenanceModeAction,
  setMaintenanceModeAction,
  getLaunchModeAction,
  setLaunchModeAction,
} from '@/app/actions/super-panel-actions';
import { toast } from 'sonner';

export const MaintenanceModeTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  // --- Maintenance Mode State ---
  const [isMaintenanceEnabled, setIsMaintenanceEnabled] = useState(false);
  const [maintenanceUpdatedAt, setMaintenanceUpdatedAt] = useState<string | null>(null);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(true);
  const [isUpdatingMaintenance, setIsUpdatingMaintenance] = useState(false);
  const [isMaintenanceConfirmOpen, setIsMaintenanceConfirmOpen] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState<boolean>(false);

  // --- Launch Mode State ---
  const [isLaunchEnabled, setIsLaunchEnabled] = useState(false);
  const [launchUpdatedAt, setLaunchUpdatedAt] = useState<string | null>(null);
  const [isLoadingLaunch, setIsLoadingLaunch] = useState(true);
  const [isUpdatingLaunch, setIsUpdatingLaunch] = useState(false);
  const [isLaunchConfirmOpen, setIsLaunchConfirmOpen] = useState(false);
  const [pendingLaunchState, setPendingLaunchState] = useState<boolean>(false);

  const loadStates = async () => {
    setIsLoadingMaintenance(true);
    setIsLoadingLaunch(true);

    try {
      const [mRes, lRes] = await Promise.all([
        getMaintenanceModeAction(),
        getLaunchModeAction(),
      ]);

      setIsMaintenanceEnabled(mRes.enabled);
      setMaintenanceUpdatedAt(mRes.updatedAt || null);

      setIsLaunchEnabled(lRes.enabled);
      setLaunchUpdatedAt(lRes.updatedAt || null);
    } catch (err) {
      console.error('Failed to load system states:', err);
    } finally {
      setIsLoadingMaintenance(false);
      setIsLoadingLaunch(false);
    }
  };

  useEffect(() => {
    loadStates();
  }, []);

  // --- Launch Handlers ---
  const handleLaunchClick = () => {
    setPendingLaunchState(!isLaunchEnabled);
    setIsLaunchConfirmOpen(true);
  };

  const handleConfirmLaunchToggle = async () => {
    setIsLaunchConfirmOpen(false);
    setIsUpdatingLaunch(true);

    const res = await setLaunchModeAction(pendingLaunchState);
    setIsUpdatingLaunch(false);

    if (res.success) {
      setIsLaunchEnabled(pendingLaunchState);
      setLaunchUpdatedAt(new Date().toISOString());
      if (pendingLaunchState) {
        toast.success(
          'Website successfully launched! Launching soon blocker removed on production domains and Vercel staging traffic is now rerouted.'
        );
      } else {
        toast.warning(
          'Website reverted to pre-launch mode. Production visitors will now see the Launching Soon screen.'
        );
      }
    } else {
      toast.error(res.error || 'Failed to update website launch state.');
    }
  };

  // --- Maintenance Handlers ---
  const handleMaintenanceClick = () => {
    setPendingMaintenanceState(!isMaintenanceEnabled);
    setIsMaintenanceConfirmOpen(true);
  };

  const handleConfirmMaintenanceToggle = async () => {
    setIsMaintenanceConfirmOpen(false);
    setIsUpdatingMaintenance(true);

    const res = await setMaintenanceModeAction(pendingMaintenanceState);
    setIsUpdatingMaintenance(false);

    if (res.success) {
      setIsMaintenanceEnabled(pendingMaintenanceState);
      setMaintenanceUpdatedAt(new Date().toISOString());
      if (pendingMaintenanceState) {
        toast.warning('Maintenance mode activated. Public pages now route to Under Maintenance.');
      } else {
        toast.success('Maintenance mode disabled. Public website is live.');
      }
    } else {
      toast.error(res.error || 'Failed to update maintenance mode.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
          Studio System Controls
        </span>
        <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
          site lifecycle & maintenance
        </h2>
        <p className="text-caption font-light opacity-70">
          Manage production launch rollout, domain routing, and site-wide maintenance gates.
        </p>
      </div>

      {/* 1. Launch Button / Production Launch Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isLaunchEnabled
            ? 'border-emerald-500/40 bg-emerald-500/5'
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
                  isLaunchEnabled
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-amber-500/20 text-amber-500'
                }`}
              >
                {isLaunchEnabled ? <Rocket size={22} /> : <Clock size={22} />}
              </div>

              <div>
                <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                  Production Launch Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-h3 font-bold">
                    {isLaunchEnabled
                      ? 'Website is Launched (Live)'
                      : 'Pre-Launch Mode (Launching Soon Active)'}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isLaunchEnabled ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`}
                  />
                </div>
              </div>
            </div>

            <p className="text-caption font-light opacity-80 max-w-xl leading-relaxed">
              {isLaunchEnabled
                ? 'The launching-soon blocker is removed on https://www.atbpcollaborative.com and https://atbpcollaborative.com. All incoming traffic on atbpc-website.vercel.app is automatically rerouted to the official domain.'
                : 'The launching-soon gate is active on production domains (https://atbpcollaborative.com and https://www.atbpcollaborative.com). Staging review on atbpc-website.vercel.app remains open.'}
            </p>

            {launchUpdatedAt && (
              <p className="text-[11px] font-mono opacity-50">
                Last modified: {new Date(launchUpdatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <Button
              type="filled"
              onClick={handleLaunchClick}
              disabled={isLoadingLaunch || isUpdatingLaunch}
              className={`!py-3 !px-6 text-mini font-semibold cursor-pointer shadow-md transition-all ${
                isLaunchEnabled
                  ? isDarkMode
                    ? '!bg-vintage-charcoal hover:!bg-white/10 !text-white border border-white/20'
                    : '!bg-neutral-200 hover:!bg-neutral-300 !text-vintage-charcoal'
                  : '!bg-emerald-600 hover:!bg-emerald-700 !text-white'
              }`}
            >
              <Rocket size={16} className="mr-2 inline" />
              <span>
                {isUpdatingLaunch
                  ? 'Updating Launch State...'
                  : isLaunchEnabled
                  ? 'Revert to Pre-Launch'
                  : 'Launch Website'}
              </span>
            </Button>
          </div>
        </div>

        {/* Informational Guidance for Launch */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-mini">
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <Globe size={16} className="text-space-sparkle" />
              <span>Public Production Access</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              Removes the `/launching-soon` gate on `atbpcollaborative.com` and `www.atbpcollaborative.com` so all external visitors can explore the full site.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <ExternalLink size={16} className="text-space-sparkle" />
              <span>Staging Domain Rerouting</span>
            </div>
            <p className="opacity-70 text-micro leading-relaxed">
              All routes and query parameters hitting `atbpc-website.vercel.app` will be automatically redirected to `https://www.atbpcollaborative.com`.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Maintenance Mode Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isMaintenanceEnabled
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
                  isMaintenanceEnabled
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'bg-emerald-500/20 text-emerald-500'
                }`}
              >
                {isMaintenanceEnabled ? <HardHat size={22} /> : <CheckCircle2 size={22} />}
              </div>

              <div>
                <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                  Maintenance Gate Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-h3 font-bold">
                    {isMaintenanceEnabled ? 'Under Maintenance Active' : 'Maintenance Mode Disabled'}
                  </span>
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isMaintenanceEnabled ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <p className="text-caption font-light opacity-80 max-w-xl leading-relaxed">
              {isMaintenanceEnabled
                ? 'All external visitors are currently rewritten to the Under Maintenance screen. Authenticated administrators can continue using the dashboard normally.'
                : 'Public routes remain accessible based on the Production Launch Status above.'}
            </p>

            {maintenanceUpdatedAt && (
              <p className="text-[11px] font-mono opacity-50">
                Last modified: {new Date(maintenanceUpdatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <Button
              type="filled"
              onClick={handleMaintenanceClick}
              disabled={isLoadingMaintenance || isUpdatingMaintenance}
              className={`!py-3 !px-6 text-mini font-semibold cursor-pointer shadow-md transition-all ${
                isMaintenanceEnabled
                  ? '!bg-emerald-600 hover:!bg-emerald-700 !text-white'
                  : '!bg-amber-600 hover:!bg-amber-700 !text-white'
              }`}
            >
              <Power size={16} className="mr-2 inline" />
              <span>
                {isUpdatingMaintenance
                  ? 'Updating Status...'
                  : isMaintenanceEnabled
                  ? 'Disable Maintenance (Go Live)'
                  : 'Enable Maintenance Mode'}
              </span>
            </Button>
          </div>
        </div>

        {/* Informational Guidance for Maintenance */}
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
              Takes precedence over launch status. If maintenance is enabled, public visitors always see Under Maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Launch Toggle */}
      <ConfirmModal
        isOpen={isLaunchConfirmOpen}
        title={pendingLaunchState ? 'Launch Website to Production?' : 'Revert Website to Pre-Launch?'}
        description={
          pendingLaunchState
            ? 'Are you sure you want to launch the website to production? This will immediately remove the Launching Soon blocker on https://www.atbpcollaborative.com and https://atbpcollaborative.com, making all portfolio and studio pages publicly accessible. All routes on atbpc-website.vercel.app will also automatically be rerouted to the official domain.'
            : 'Are you sure you want to revert to Pre-Launch mode? Production visitors on https://www.atbpcollaborative.com and https://atbpcollaborative.com will immediately see the Launching Soon screen again, and direct staging access to atbpc-website.vercel.app will be restored.'
        }
        confirmLabel={pendingLaunchState ? 'Yes, Launch Website' : 'Yes, Revert to Pre-Launch'}
        isDestructive={!pendingLaunchState}
        onConfirm={handleConfirmLaunchToggle}
        onCancel={() => setIsLaunchConfirmOpen(false)}
      />

      {/* Confirmation Modal for Maintenance Toggle */}
      <ConfirmModal
        isOpen={isMaintenanceConfirmOpen}
        title={pendingMaintenanceState ? 'Activate Maintenance Mode?' : 'Deactivate Maintenance Mode?'}
        description={
          pendingMaintenanceState
            ? 'Are you sure you want to activate Maintenance Mode? All public visitors will immediately be shown the Under Maintenance screen. Only logged-in administrators will be able to access the console.'
            : 'Are you sure you want to deactivate Maintenance Mode? The public website will immediately be restored and accessible to all visitors according to your launch status.'
        }
        confirmLabel={pendingMaintenanceState ? 'Yes, Enable Maintenance' : 'Yes, Restore Public Website'}
        isDestructive={pendingMaintenanceState}
        onConfirm={handleConfirmMaintenanceToggle}
        onCancel={() => setIsMaintenanceConfirmOpen(false)}
      />
    </div>
  );
};
