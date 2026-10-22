/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  UserCheck,
  User,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/primitives/buttons/Button';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import {
  getFounderDesignationAction,
  setFounderDesignationAction,
  fetchAllPeopleForFounderSelectionAction,
  FounderDesignationResult,
} from '@/app/actions/super-panel-actions';
import { toast } from 'sonner';

export const FounderAssignmentTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [founder, setFounder] = useState<FounderDesignationResult | null>(null);
  const [people, setPeople] = useState<{ id: string; name: string; role: string; image?: string }[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [founderData, peopleList] = await Promise.all([
      getFounderDesignationAction(),
      fetchAllPeopleForFounderSelectionAction(),
    ]);

    setFounder(founderData);
    setPeople(peopleList);
    if (founderData.personId) {
      setSelectedPersonId(founderData.personId);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenConfirm = () => {
    if (!selectedPersonId) {
      toast.error('Please select a person from the studio personnel list.');
      return;
    }
    if (selectedPersonId === founder?.personId) {
      toast.info('This person is already designated as the Principal Architect & Founder.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmAssignment = async () => {
    setIsConfirmOpen(false);
    setIsAssigning(true);

    const res = await setFounderDesignationAction(selectedPersonId);
    setIsAssigning(false);

    if (res.success) {
      toast.success('Principal Architect & Founder role designated successfully.');
      await loadData();
    } else {
      toast.error(res.error || 'Failed to designate Founder role.');
    }
  };

  const selectedPerson = people.find((p) => p.id === selectedPersonId);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-micro font-mono uppercase tracking-widest text-space-sparkle font-semibold block">
          Founding Leadership Governance
        </span>
        <h2 className="text-h2 font-major font-bold tracking-tight lowercase">
          principal architect &amp; founder designation
        </h2>
        <p className="text-caption font-light opacity-70">
          Designate the founding leadership entity. The person holding this role receives full immunity against modification or deletion by standard studio administrators.
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center opacity-60">
          <Loader2 size={24} className="animate-spin mx-auto mb-2 text-space-sparkle" />
          Loading founder designation data...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Founder Spotlight Card */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-vintage-charcoal/80 border-space-sparkle/30'
                : 'bg-white border-space-sparkle/20 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-space-sparkle/20 border-2 border-space-sparkle/40 shrink-0 shadow-md">
                {founder?.image ? (
                  <Image
                    src={founder.image}
                    alt={founder.personName || 'Founder'}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-h2 font-bold text-space-sparkle">
                    {founder?.personName?.charAt(0) || 'A'}
                  </div>
                )}
              </div>

              {/* Bio & Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider font-mono bg-space-sparkle/20 text-space-sparkle border border-space-sparkle/30">
                    <Award size={12} />
                    Principal Architect &amp; Founder
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    <Lock size={10} />
                    Protected Profile (Admin Read-Only)
                  </span>
                </div>

                <h3 className="text-h2 font-major font-bold tracking-tight">
                  {founder?.personName || 'Unassigned Founder'}
                </h3>

                {founder?.license && (
                  <p className="text-micro font-mono opacity-70">
                    PRC License No.: <span className="text-space-sparkle font-semibold">{founder.license}</span>
                  </p>
                )}

                <p className="text-caption font-light opacity-80 leading-relaxed max-w-xl">
                  {founder?.bio ||
                    'Registered Filipino Architect, studio founding lead, and principal director.'}
                </p>
              </div>
            </div>
          </div>

          {/* Reassignment Control Card */}
          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-vintage-charcoal/40 border-white/10' : 'bg-black/[0.02] border-black/10'
            } space-y-4`}
          >
            <div>
              <span className="text-micro font-mono uppercase tracking-wider text-space-sparkle font-semibold block">
                Assign / Reassign Role
              </span>
              <h4 className="text-body font-bold mt-0.5">
                Designate Founder Entity
              </h4>
              <p className="text-micro opacity-70 leading-relaxed mt-1">
                Select any registered personnel member from the studio database to assign the Principal Architect &amp; Founder designation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none"
                />
                <select
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className={`w-full text-caption pl-9 pr-4 py-2.5 rounded-lg border outline-none transition-all ${
                    isDarkMode
                      ? 'border-white/10 bg-vintage-charcoal/80 text-white'
                      : 'border-black/10 bg-white text-vintage-charcoal'
                  }`}
                >
                  <option value="" disabled>
                    [ Select studio team member ]
                  </option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.role}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="filled"
                onClick={handleOpenConfirm}
                disabled={isAssigning || !selectedPersonId || selectedPersonId === founder?.personId}
                className="text-mini px-5 py-2.5 font-semibold shrink-0 cursor-pointer"
              >
                <span>{isAssigning ? 'Designating...' : 'Designate as Founder'}</span>
                <ArrowRight size={14} className="ml-1 inline" />
              </Button>
            </div>

            <div className="p-3.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-mini flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-space-sparkle shrink-0 mt-0.5" />
              <div className="text-micro leading-relaxed opacity-75">
                <strong>Administrative Safeguard Policy:</strong> Once assigned, standard studio Admins will be blocked from modifying or deleting this person&apos;s details in Manage People. Only the Super Admin retains authority to update this entity.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Founder Designation"
        description={`Are you sure you want to designate "${selectedPerson?.name}" as the studio Principal Architect & Founder? Their primary role will be updated and protected from modification by standard administrators.`}
        confirmLabel="Confirm Designation"
        isDestructive={false}
        onConfirm={handleConfirmAssignment}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
