/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import {
  getRbacPermissionsAction,
  setRbacPermissionsAction,
} from '@/app/actions/super-panel-actions';
import {
  type RbacMatrixSettings,
  type AdminTypePermissions,
  DEFAULT_RBAC_PERMISSIONS,
} from '@/lib/admin/rbac-constants';
import { toast } from 'sonner';

type EntityKey = 'people' | 'roles' | 'projects' | 'content' | 'generalInfo';

interface SectionConfig {
  key: EntityKey;
  label: string;
  description: string;
}

const SECTIONS: SectionConfig[] = [
  { key: 'people', label: 'Manage People', description: 'Directory, bios, credentials, and affiliations' },
  { key: 'roles', label: 'Manage Roles', description: 'Organizational roles, career tracks, and assignments' },
  { key: 'projects', label: 'Manage Projects', description: 'Works portfolio, media, and case studies' },
  { key: 'content', label: 'Manage Content', description: 'Pages, services, stage groups, and homepage CMS' },
  { key: 'generalInfo', label: 'Manage General Info', description: 'Legal policies, contact details, and slogans' },
];

export const RbacPermissionsTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [permissions, setPermissions] = useState<RbacMatrixSettings>(DEFAULT_RBAC_PERMISSIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTier, setActiveTier] = useState<'admin' | 'editor'>('admin');

  const loadPermissions = async () => {
    setIsLoading(true);
    const data = await getRbacPermissionsAction();
    setPermissions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleToggle = (
    tier: 'admin' | 'editor',
    entity: EntityKey,
    action: 'create' | 'read' | 'update' | 'delete'
  ) => {
    setPermissions((prev) => {
      const tierObj = { ...prev[tier] };
      const entityObj = { ...tierObj[entity] };
      entityObj[action] = !entityObj[action];
      tierObj[entity] = entityObj;
      return {
        ...prev,
        [tier]: tierObj,
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await setRbacPermissionsAction(permissions);
    setIsSaving(false);

    if (res.success) {
      toast.success('RBAC permission policies saved successfully.');
    } else {
      toast.error(res.error || 'Failed to save RBAC policies.');
    }
  };

  const handleResetDefaults = () => {
    setPermissions(DEFAULT_RBAC_PERMISSIONS);
    toast.info('Permissions reset to standard defaults. Click Save to persist.');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
            Role-Based Access Control
          </span>
          <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
            rbac permissions matrix
          </h2>
          <p className="text-caption font-light opacity-70">
            Define granular CRUD capabilities (Create, Read, Update, Delete) across administration sections for Admin and Editor tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="ghost"
            onClick={handleResetDefaults}
            className="text-mini px-3 py-2 cursor-pointer"
            title="Reset to recommended studio defaults"
          >
            <RotateCcw size={14} className="mr-1.5 inline" /> Reset Defaults
          </Button>

          <Button
            type="filled"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="text-mini px-4 py-2 font-semibold cursor-pointer"
          >
            <Save size={14} className="mr-1.5 inline" />
            <span>{isSaving ? 'Saving...' : 'Save Policies'}</span>
          </Button>
        </div>
      </div>

      {/* Tier Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 w-fit">
        <button
          type="button"
          onClick={() => setActiveTier('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-caption font-semibold transition-all cursor-pointer ${
            activeTier === 'admin'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          <Shield size={15} />
          <span>Studio Admin Tier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTier('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-caption font-semibold transition-all cursor-pointer ${
            activeTier === 'editor'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          <Shield size={15} />
          <span>Project Editor Tier</span>
        </button>
      </div>

      {/* Matrix Table */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs transition-colors ${
          isDarkMode ? 'bg-vintage-charcoal/80 border-white/10' : 'bg-white border-black/10'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-mini">
            <thead>
              <tr
                className={`border-b text-micro uppercase tracking-wider font-mono ${
                  isDarkMode
                    ? 'border-white/10 bg-white/5 text-bright-gray/70'
                    : 'border-black/10 bg-black/5 text-vintage-charcoal/70'
                }`}
              >
                <th className="py-3.5 px-5">Console Section</th>
                <th className="py-3.5 px-4 text-center">Create (C)</th>
                <th className="py-3.5 px-4 text-center">Read (R)</th>
                <th className="py-3.5 px-4 text-center">Update (U)</th>
                <th className="py-3.5 px-4 text-center">Delete (D)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center opacity-60">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-space-sparkle" />
                    Loading permission policies...
                  </td>
                </tr>
              ) : (
                SECTIONS.map((sec) => {
                  const currentSec = permissions[activeTier][sec.key];

                  return (
                    <tr
                      key={sec.key}
                      className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <span className="font-semibold block text-caption">{sec.label}</span>
                        <span className="text-micro opacity-60 block">{sec.description}</span>
                      </td>

                      {/* Create */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(activeTier, sec.key, 'create')}
                          className={`w-8 h-8 rounded-lg font-mono text-micro font-bold border inline-flex items-center justify-center transition-all cursor-pointer ${
                            currentSec.create
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-black/10 dark:bg-white/5 opacity-30 border-transparent hover:opacity-70'
                          }`}
                        >
                          C
                        </button>
                      </td>

                      {/* Read */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(activeTier, sec.key, 'read')}
                          className={`w-8 h-8 rounded-lg font-mono text-micro font-bold border inline-flex items-center justify-center transition-all cursor-pointer ${
                            currentSec.read
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                              : 'bg-black/10 dark:bg-white/5 opacity-30 border-transparent hover:opacity-70'
                          }`}
                        >
                          R
                        </button>
                      </td>

                      {/* Update */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(activeTier, sec.key, 'update')}
                          className={`w-8 h-8 rounded-lg font-mono text-micro font-bold border inline-flex items-center justify-center transition-all cursor-pointer ${
                            currentSec.update
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-black/10 dark:bg-white/5 opacity-30 border-transparent hover:opacity-70'
                          }`}
                        >
                          U
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(activeTier, sec.key, 'delete')}
                          className={`w-8 h-8 rounded-lg font-mono text-micro font-bold border inline-flex items-center justify-center transition-all cursor-pointer ${
                            currentSec.delete
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : 'bg-black/10 dark:bg-white/5 opacity-30 border-transparent hover:opacity-70'
                          }`}
                        >
                          D
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Superadmin Authority Notice */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-micro font-mono">
          <div className="flex items-center gap-2">
            <Lock size={13} className="text-space-sparkle" />
            <span>Superadmin tier permanently retains unrestricted Full CRUD across all routes.</span>
          </div>
          <span className="opacity-60 hidden sm:inline">Protected by Studio Directorate Protocol</span>
        </div>
      </div>
    </div>
  );
};
